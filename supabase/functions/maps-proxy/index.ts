import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Circuit breaker per Google Maps
let failureCount = 0;
let lastFailureTime = 0;
const FAILURE_THRESHOLD = 3;
const RECOVERY_TIMEOUT = 60000; // 1 minuto

function isCircuitOpen(): boolean {
  if (failureCount < FAILURE_THRESHOLD) return false;
  return Date.now() - lastFailureTime < RECOVERY_TIMEOUT;
}

function recordFailure() {
  failureCount++;
  lastFailureTime = Date.now();
}

function recordSuccess() {
  failureCount = 0;
}

// Retry con backoff esponenziale
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    // Verifica circuit breaker
    if (isCircuitOpen()) {
      console.log('Circuit breaker is open, rejecting request');
      throw new Error('Google Maps service temporarily unavailable');
    }

    let result;
    
    switch (action) {
      case 'loadScript':
        result = await retryWithBackoff(async () => {
          const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${params.libraries || 'places'}&v=${params.version || 'weekly'}`;
          
          // Verifica che l'API key sia valida
          const testResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${GOOGLE_MAPS_API_KEY}`);
          
          if (!testResponse.ok) {
            throw new Error(`Google Maps API validation failed: ${testResponse.status}`);
          }
          
          const testData = await testResponse.json();
          if (testData.status === 'REQUEST_DENIED') {
            throw new Error(`Google Maps API key invalid: ${testData.error_message}`);
          }
          
          return { scriptUrl, status: 'success' };
        });
        break;
        
      case 'geocode':
        result = await retryWithBackoff(async () => {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(params.address)}&key=${GOOGLE_MAPS_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.status}`);
          }
          
          return await response.json();
        });
        break;
        
      case 'placesSearch':
        result = await retryWithBackoff(async () => {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(params.query)}&key=${GOOGLE_MAPS_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error(`Places search failed: ${response.status}`);
          }
          
          return await response.json();
        });
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    recordSuccess();
    
    return new Response(JSON.stringify({
      success: true,
      data: result,
      timestamp: Date.now(),
      source: 'google-maps'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Maps proxy error:', error);
    recordFailure();
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: Date.now(),
      circuitOpen: isCircuitOpen(),
      failureCount
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});