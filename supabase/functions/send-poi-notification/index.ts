
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { submission, type, decision, admin_notes } = await req.json()

    let emailData;
    
    if (type === 'new_submission') {
      // Email al team per nuova submission
      emailData = {
        from: 'Mia Romagna <noreply@miaromagna.it>',
        to: ['luca.litti@miaromagna.it'],
        subject: `🏛️ Nuova POI da Promotore del Territorio: ${submission.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">🏛️ Nuova Proposta POI</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #334155; margin-top: 0;">${submission.name}</h2>
              <p><strong>Categoria:</strong> ${submission.category}</p>
              <p><strong>Tipo:</strong> ${submission.poi_type}</p>
              <p><strong>Promotore:</strong> ${submission.submitter_email}</p>
              <p><strong>Indirizzo:</strong> ${submission.address || 'Non specificato'}</p>
              <p><strong>Descrizione:</strong></p>
              <p style="color: #64748b;">${submission.description || 'Nessuna descrizione'}</p>
            </div>

            <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #047857; margin-top: 0;">Dettagli Aggiuntivi</h3>
              ${submission.price_info ? `<p><strong>Prezzo:</strong> ${submission.price_info}</p>` : ''}
              ${submission.duration_info ? `<p><strong>Durata:</strong> ${submission.duration_info}</p>` : ''}
              ${submission.website_url ? `<p><strong>Sito:</strong> <a href="${submission.website_url}">${submission.website_url}</a></p>` : ''}
              ${submission.phone ? `<p><strong>Telefono:</strong> ${submission.phone}</p>` : ''}
              ${submission.email ? `<p><strong>Email:</strong> ${submission.email}</p>` : ''}
              ${submission.video_url ? `<p><strong>Video:</strong> <a href="${submission.video_url}">${submission.video_url}</a></p>` : ''}
            </div>

            <div style="margin: 30px 0; text-align: center;">
              <p style="color: #64748b;">
                Accedi alla <a href="https://supabase.com/dashboard/project/jxkelzoxxsixqfblnjwj/editor" style="color: #2563eb;">Dashboard Supabase</a> 
                per moderare questa proposta.
              </p>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
              <p>Inviato automaticamente dal sistema Mia Romagna</p>
              <p>ID Submission: ${submission.id}</p>
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
        from: 'Mia Romagna <noreply@miaromagna.it>',
        to: [submission.submitter_email],
        subject: `${status.subject}: ${submission.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: ${status.color};">${status.subject}</h1>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #334155; margin-top: 0;">${submission.name}</h2>
              <p style="font-size: 16px; color: #334155;"><strong>${status.message}</strong></p>
              
              ${admin_notes ? `
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f59e0b;">
                  <h4 style="color: #92400e; margin-top: 0;">Note del Team:</h4>
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
                Visualizza le tue Proposte
              </a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
              <p>Grazie per il tuo contributo a Mia Romagna!</p>
              <p>Team Mia Romagna</p>
            </div>
          </div>
        `
      }
    }

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Resend API error:', error)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const result = await res.json()
    console.log('Email sent successfully:', result)

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in send-poi-notification function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
