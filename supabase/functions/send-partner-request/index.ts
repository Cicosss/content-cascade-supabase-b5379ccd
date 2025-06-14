
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    console.log('🔥 Edge Function triggered - send-partner-request')
    
    const { businessName, contactName, email, phone, website } = await req.json()
    console.log('📨 Request data:', { businessName, contactName, email })

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found')
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }

    // Email a luca.litti@miaromagna.it con i dettagli della richiesta partner
    const emailData = {
      from: 'Mia Romagna <onboarding@resend.dev>',
      to: ['luca.litti@miaromagna.it'],
      subject: `🤝 Nuova Richiesta Partnership: ${businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">🤝 Nuova Richiesta Partnership</h1>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h2 style="color: #334155; margin-top: 0;">${businessName}</h2>
            <p><strong>Referente:</strong> ${contactName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            <p><strong>Telefono:</strong> <a href="tel:${phone}" style="color: #2563eb;">${phone}</a></p>
            ${website ? `<p><strong>Sito Web:</strong> <a href="${website}" style="color: #2563eb;" target="_blank">${website}</a></p>` : ''}
          </div>

          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #047857; margin-top: 0;">📋 Prossimi Passi</h3>
            <ul style="color: #047857; margin: 0; padding-left: 20px;">
              <li>Contattare l'attività entro 24-48 ore</li>
              <li>Valutare la compatibilità con il brand Mia Romagna</li>
              <li>Programmare una call di approfondimento</li>
              <li>Presentare l'offerta di partnership personalizzata</li>
            </ul>
          </div>

          <div style="margin: 30px 0; text-align: center; padding: 20px; background: #f1f5f9; border-radius: 8px;">
            <p style="color: #64748b; margin: 0;">
              <strong>Fonte:</strong> Pagina Partner Mia Romagna<br/>
              <strong>Data:</strong> ${new Date().toLocaleString('it-IT')}<br/>
              <strong>IP:</strong> Disponibile nei log del server
            </p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; color: #64748b; font-size: 14px;">
            <p>📧 Email inviata automaticamente dal sistema Mia Romagna</p>
            <p>🔗 Dashboard Partner: <a href="https://miaromagna.lovable.app/partner" style="color: #2563eb;">miaromagna.lovable.app/partner</a></p>
          </div>
        </div>
      `
    }

    console.log('📤 Sending email to:', emailData.to)

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
      message: 'Partnership request sent successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })

  } catch (error) {
    console.error('💥 Error in send-partner-request function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
  }
})
