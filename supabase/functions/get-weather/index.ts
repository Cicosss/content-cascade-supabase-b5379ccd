// Edge function to proxy weather API requests
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()
    
    // Mock weather data for Romagna area
    const mockWeatherData = {
      Rimini: { temp: 24, condition: 'Soleggiato', humidity: 68, wind: 12 },
      Riccione: { temp: 23, condition: 'Soleggiato', humidity: 70, wind: 10 },
      Cesenatico: { temp: 22, condition: 'Nuvoloso', humidity: 72, wind: 8 },
      Ravenna: { temp: 21, condition: 'Nuvoloso', humidity: 75, wind: 6 },
      Forlì: { temp: 25, condition: 'Soleggiato', humidity: 65, wind: 14 }
    }

    const weatherData = mockWeatherData[location] || mockWeatherData.Rimini

    return new Response(
      JSON.stringify(weatherData),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})