// Edge function to handle place search and filtering
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, category, location, withChildren } = await req.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    let query = supabase
      .from('points_of_interest')
      .select('*')

    // Apply filters
    if (type) {
      query = query.eq('poi_type', type)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (location) {
      query = query.or(`address.ilike.%${location}%,location_name.ilike.%${location}%`)
    }
    if (withChildren === 'sì') {
      query = query.or('target_audience.eq.families,target_audience.eq.everyone')
    }

    const { data, error } = await query

    if (error) throw error

    return new Response(
      JSON.stringify(data),
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