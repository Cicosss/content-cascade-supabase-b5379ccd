import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    console.log('🔥 Edge Function triggered - send-poi-notification')
    
    const { submission, type, decision, admin_notes } = await req.json()
    console.log('📨 Request data:', { type, submission_id: submission?.id, decision })

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Crea client Supabase per recuperare info utente
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let emailData;
    
    if (type === 'new_submission') {
      console.log('🔄 Processing new submission notification')
      
      // Cerca informazioni dell'utente dal profilo
      let userInfo = null
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', submission.submitter_email)
          .single()
        
        if (profile) {
          userInfo = profile
          console.log('👤 Found user profile:', profile.id)
        } else {
          console.log('⚠️ No profile found for email:', submission.submitter_email)
        }
      } catch (error) {
        console.log('⚠️ Error fetching user profile:', error)
      }

      // Email al team per nuova submission - TEMPORANEAMENTE uso luca.litti@gmail.com
      emailData = {
        from: 'Mia Romagna <onboarding@resend.dev>',
        to: ['luca.litti@gmail.com'], // Cambiato temporaneamente per testing
        subject: `🏛️ Nuova POI da Promotore del Territorio: ${submission.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">🏛️ Nuova Proposta POI</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <h2 style="color: #334155; margin-top: 0;">${submission.name}</h2>
              <p><strong>Categoria:</strong> ${submission.category}</p>
              <p><strong>Tipo:</strong> ${submission.poi_type}</p>
              <p><strong>Indirizzo:</strong> ${submission.address || 'Non specificato'}</p>
              <p><strong>Target Audience:</strong> ${submission.target_audience}</p>
              <p><strong>Descrizione:</strong></p>
              <p style="color: #64748b; font-style: italic;">${submission.description || 'Nessuna descrizione'}</p>
            </div>

            ${userInfo ? `
              <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #047857; margin-top: 0;">👤 Informazioni Promotore</h3>
                <p><strong>ID Utente:</strong> ${userInfo.id}</p>
                <p><strong>Nome:</strong> ${userInfo.first_name || ''} ${userInfo.last_name || ''}</p>
                <p><strong>Email:</strong> ${submission.submitter_email}</p>
                <p><strong>Località di arrivo:</strong> ${userInfo.arrival_location || 'Non specificata'}</p>
                <p><strong>Tipo vacanza:</strong> ${userInfo.vacation_type || 'Non specificato'}</p>
                <p><strong>Numero persone:</strong> ${userInfo.number_of_people || 'Non specificato'}</p>
                ${userInfo.children_ages && userInfo.children_ages.length > 0 ? `<p><strong>Età bambini:</strong> ${userInfo.children_ages.join(', ')}</p>` : ''}
              </div>
            ` : `
              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0;"><strong>⚠️ Promotore:</strong> ${submission.submitter_email} (Profilo non trovato nel sistema)</p>
              </div>
            `}

            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #047857; margin-top: 0;">📋 Dettagli Aggiuntivi</h3>
              ${submission.price_info ? `<p><strong>💰 Prezzo:</strong> ${submission.price_info}</p>` : ''}
              ${submission.duration_info ? `<p><strong>⏱️ Durata:</strong> ${submission.duration_info}</p>` : ''}
              ${submission.website_url ? `<p><strong>🌐 Sito:</strong> <a href="${submission.website_url}" style="color: #2563eb;">${submission.website_url}</a></p>` : ''}
              ${submission.phone ? `<p><strong>📞 Telefono:</strong> ${submission.phone}</p>` : ''}
              ${submission.email ? `<p><strong>✉️ Email Struttura:</strong> ${submission.email}</p>` : ''}
              ${submission.video_url ? `<p><strong>🎥 Video:</strong> <a href="${submission.video_url}" style="color: #2563eb;">${submission.video_url}</a></p>` : ''}
              ${submission.location_name ? `<p><strong>📍 Nome Località:</strong> ${submission.location_name}</p>` : ''}
              ${submission.organizer_info ? `<p><strong>👨‍💼 Organizzatore:</strong> ${submission.organizer_info}</p>` : ''}
              ${submission.start_datetime ? `<p><strong>📅 Inizio:</strong> ${new Date(submission.start_datetime).toLocaleString('it-IT')}</p>` : ''}
              ${submission.end_datetime ? `<p><strong>📅 Fine:</strong> ${new Date(submission.end_datetime).toLocaleString('it-IT')}</p>` : ''}
            </div>

            <div style="margin: 30px 0; text-align: center; padding: 20px; background: #f1f5f9; border-radius: 8px;">
              <h3 style="color: #334155; margin-top: 0;">🔧 Azioni di Moderazione</h3>
              <p style="color: #64748b; margin-bottom: 20px;">
                <strong>ID Submission:</strong> ${submission.id}
              </p>
              <div style="margin: 15px 0;">
                <a href="https://supabase.com/dashboard/project/jxkelzoxxsixqfblnjwj/editor?schema=public&table=poi_submissions" 
                   style="background: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                  📋 Modera in Supabase
                </a>
              </div>
              <p style="color: #64748b; font-size: 14px; margin-top: 15px;">
                Cerca il record con ID: <strong>${submission.id}</strong><br/>
                Per approvare: modifica il campo <strong>status</strong> da "pending" a "approved", "rejected" o "edited"<br/>
                Aggiungi eventuali note nel campo <strong>admin_notes</strong>
              </p>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
              <p>📧 Email inviata automaticamente dal sistema Mia Romagna</p>
              <p>🕒 ${new Date().toLocaleString('it-IT')}</p>
              <p style="color: #f59e0b; font-weight: bold;">⚠️ NOTA: Email temporaneamente inviata a luca.litti@gmail.com per testing</p>
            </div>
          </div>
        `
      }
    } else if (type === 'moderation_result') {
      // Email al promotore con l'esito della moderazione
      const statusMessages = {
        'approved': {
          subject: '✅ POI Approvata',
          message: 'La tua proposta è stata approvata e pubblicata su Mia Romagna!',
          color: '#10b981'
        },
        'rejected': {
          subject: '❌ POI Non Approvata',
          message: 'La tua proposta non è stata approvata.',
          color: '#ef4444'
        },
        'edited': {
          subject: '✏️ POI Modificata e Approvata',
          message: 'La tua proposta è stata modificata e pubblicata su Mia Romagna.',
          color: '#3b82f6'
        }
      };

      const status = statusMessages[decision] || statusMessages['rejected'];

      emailData = {
        from: 'Mia Romagna <onboarding@resend.dev>',
        to: [submission.submitter_email],
        subject: `${status.subject}: ${submission.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: ${status.color}; border-bottom: 2px solid ${status.color}; padding-bottom: 10px;">${status.subject}</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #334155; margin-top: 0;">${submission.name}</h2>
              <p style="font-size: 16px; color: #334155;"><strong>${status.message}</strong></p>
              
              ${admin_notes ? `
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
                  <h4 style="color: #92400e; margin-top: 0;">📝 Note del Team:</h4>
                  <p style="color: #92400e; margin-bottom: 0;">${admin_notes}</p>
                </div>
              ` : ''}
            </div>

            ${decision === 'approved' || decision === 'edited' ? `
              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="color: #047857; margin: 0;">
                  🎉 La tua POI è ora visibile su Mia Romagna! I visitatori potranno trovarla nella mappa interattiva e nei caroselli di contenuti.
                </p>
              </div>
            ` : ''}

            <div style="margin: 30px 0; text-align: center;">
              <a href="https://miaromagna.lovable.app/promotore-territorio" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                🏛️ Visualizza le tue Proposte
              </a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
              <p>Grazie per il tuo contributo a Mia Romagna! 🙏</p>
              <p>Team Mia Romagna</p>
            </div>
          </div>
        `
      }
    }

    console.log('📤 Sending email to:', emailData.to)
    console.log('📧 Email subject:', emailData.subject)

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    })

    const responseText = await res.text()
    console.log('📬 Resend API response status:', res.status)
    console.log('📬 Resend API response:', responseText)

    if (!res.ok) {
      console.error('❌ Resend API error:', responseText)
      return new Response(JSON.stringify({ 
        error: 'Failed to send email', 
        details: responseText,
        status: res.status 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    const result = JSON.parse(responseText)
    console.log('✅ Email sent successfully:', result)

    return new Response(JSON.stringify({ 
      success: true, 
      id: result.id,
      message: 'Email sent successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error) {
    console.error('💥 Error in send-poi-notification function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
})
