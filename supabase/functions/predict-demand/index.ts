import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, input } = await req.json();
    
    // Simple prediction algorithm (placeholder for actual ML model)
    // In production, you would load the pickle models and use them here
    let prediction = 0;
    
    if (type === 'hourly') {
      // Hourly prediction formula
      const baseValue = 100;
      const hourFactor = input.hour >= 7 && input.hour <= 19 ? 1.5 : 0.8;
      const weatherFactor = input.weather === 1 ? 1.2 : (input.weather === 4 ? 0.5 : 0.9);
      const tempFactor = 1 + (input.temperature - 0.5) * 0.3;
      const workdayFactor = input.isWorkingDay ? 1.1 : 0.9;
      
      prediction = baseValue * hourFactor * weatherFactor * tempFactor * workdayFactor;
    } else {
      // Daily prediction formula
      const baseValue = 3000;
      const seasonFactor = input.season === 2 ? 1.3 : (input.season === 4 ? 0.7 : 1.0);
      const weatherFactor = input.weather === 1 ? 1.2 : (input.weather === 4 ? 0.6 : 0.9);
      const tempFactor = 1 + (input.temperature - 0.5) * 0.4;
      
      prediction = baseValue * seasonFactor * weatherFactor * tempFactor;
    }
    
    // Add some randomness
    prediction = prediction * (0.9 + Math.random() * 0.2);
    
    return new Response(
      JSON.stringify({ prediction: Math.round(prediction) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Prediction error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});