
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logEnvironmentDifference } from '@/utils/environmentDebug';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const createProfile = async (profileData: any) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      logEnvironmentDifference('Profile Creation Error', { error, profileData });
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error creating profile:', error);
    logEnvironmentDifference('Profile Creation Exception', { error, profileData });
    return null;
  }
};

const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  if (!file) return null;

  try {
    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true // This will replace existing file
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      logEnvironmentDifference('Avatar Upload Error', { uploadError, fileName });
      return null;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    logEnvironmentDifference('Avatar Upload Exception', { error, userId });
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log environment info at startup
    logEnvironmentDifference('Auth Context Initialization', {
      hostname: window.location.hostname,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent.substring(0, 50) + '...'
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email || 'No user');
        
        logEnvironmentDifference('Auth State Change', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          emailConfirmed: session?.user?.email_confirmed_at
        });

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle email confirmation
        if (event === 'SIGNED_IN' && session?.user && session.user.email_confirmed_at) {
          // User just confirmed their email, create profile if needed
          setTimeout(async () => {
            try {
              const pendingData = (window as any).pendingAvatarData;
              if (pendingData) {
                let avatarUrl = pendingData.url;
                
                // Upload file if there's one
                if (pendingData.file) {
                  const uploadedUrl = await uploadAvatar(pendingData.file, session.user.id);
                  if (uploadedUrl) {
                    avatarUrl = uploadedUrl;
                  }
                }
                
                // Create profile
                await createProfile({
                  id: session.user.id,
                  email: session.user.email,
                  first_name: pendingData.firstName,
                  last_name: pendingData.lastName,
                  avatar_url: avatarUrl,
                });
                
                // Clean up
                (window as any).pendingAvatarData = null;
                (window as any).pendingAvatarFile = null;
                
                toast.success('Profilo creato con successo!');
              }
            } catch (error) {
              console.error('Error creating profile after email confirmation:', error);
              logEnvironmentDifference('Profile Creation After Email Confirmation', { error });
              toast.error('Errore nella creazione del profilo');
            }
          }, 0);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting initial session:', error);
        logEnvironmentDifference('Initial Session Error', { error });
        toast.error('Errore nel caricamento della sessione');
      }
      
      console.log('🔐 Initial session:', session?.user?.email || 'No user');
      logEnvironmentDifference('Initial Session', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
    // Standardized redirect URL for both environments
    const baseUrl = window.location.origin;
    const redirectUrl = `${baseUrl}/`;
    
    logEnvironmentDifference('Sign Up Attempt', {
      email,
      redirectUrl,
      userData,
      hostname: window.location.hostname
    });
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    if (error) {
      logEnvironmentDifference('Sign Up Error', { error, email });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    logEnvironmentDifference('Sign In Attempt', {
      email,
      hostname: window.location.hostname
    });
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      logEnvironmentDifference('Sign In Error', { error, email });
    }
    
    return { error };
  };

  const signOut = async () => {
    logEnvironmentDifference('Sign Out Attempt', {
      userEmail: user?.email,
      hostname: window.location.hostname
    });
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      logEnvironmentDifference('Sign Out Error', { error });
      toast.error('Errore durante il logout');
    } else {
      toast.success('Logout effettuato con successo');
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
