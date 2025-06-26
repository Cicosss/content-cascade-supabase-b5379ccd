
-- Rimuovi tutte le politiche esistenti per user_profiles
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- Crea nuove politiche ottimizzate usando (select auth.uid()) per evitare il ricalcolo per ogni riga
CREATE POLICY "Users can read own profile" 
  ON user_profiles 
  FOR SELECT 
  TO authenticated 
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile" 
  ON user_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile" 
  ON user_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (id = (select auth.uid())) 
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can delete own profile" 
  ON user_profiles 
  FOR DELETE 
  TO authenticated 
  USING (id = (select auth.uid()));

-- Aggiungi anche una politica per permettere l'inserimento quando l'utente crea il profilo per la prima volta
CREATE POLICY "Users can create profile on signup" 
  ON user_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
