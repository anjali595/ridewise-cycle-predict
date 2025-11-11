-- Create prediction presets table
CREATE TABLE public.prediction_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  preset_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prediction_presets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own presets" 
ON public.prediction_presets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own presets" 
ON public.prediction_presets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presets" 
ON public.prediction_presets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presets" 
ON public.prediction_presets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_prediction_presets_updated_at
BEFORE UPDATE ON public.prediction_presets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();