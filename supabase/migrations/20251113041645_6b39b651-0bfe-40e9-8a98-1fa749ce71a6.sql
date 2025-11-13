-- Fix 1: Make predictions.user_id NOT NULL to prevent orphaned records
-- First clean up any existing NULL user_ids
DELETE FROM predictions WHERE user_id IS NULL;

-- Then alter the column
ALTER TABLE predictions 
ALTER COLUMN user_id SET NOT NULL;

-- Add database-level default for extra safety
ALTER TABLE predictions 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Fix 2: Create admin role system for secure access control
-- Create role enum
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add SELECT policy for admins to view contact messages
CREATE POLICY "Admins can view all contact messages"
ON contact_messages FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Add UPDATE policy for admins on contact messages
CREATE POLICY "Admins can update contact messages"
ON contact_messages FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Add DELETE policy for admins on contact messages
CREATE POLICY "Admins can delete contact messages"
ON contact_messages FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Fix 3: Require authentication for contact messages to prevent spam
-- Drop the existing unrestricted policy
DROP POLICY IF EXISTS "Users can create contact messages" ON contact_messages;

-- Create new policy requiring authentication
CREATE POLICY "Authenticated users can create contact messages"
ON contact_messages FOR INSERT
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

-- Make user_id NOT NULL in contact_messages
ALTER TABLE contact_messages 
ALTER COLUMN user_id SET NOT NULL;

-- Add length constraints to prevent database bloat
ALTER TABLE contact_messages
ADD CONSTRAINT name_length_check CHECK (char_length(name) <= 100);

ALTER TABLE contact_messages
ADD CONSTRAINT message_length_check CHECK (char_length(message) <= 2000);

-- Add length constraints to profiles table
ALTER TABLE profiles
ADD CONSTRAINT username_length_check CHECK (char_length(username) <= 50);

ALTER TABLE profiles
ADD CONSTRAINT phone_length_check CHECK (char_length(phone) <= 20);

ALTER TABLE profiles
ADD CONSTRAINT address_length_check CHECK (char_length(address) <= 200);

ALTER TABLE profiles
ADD CONSTRAINT city_length_check CHECK (char_length(city) <= 100);

ALTER TABLE profiles
ADD CONSTRAINT postal_code_length_check CHECK (char_length(postal_code) <= 20);

ALTER TABLE profiles
ADD CONSTRAINT country_length_check CHECK (char_length(country) <= 100);