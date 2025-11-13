-- Fix: Add RLS policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Only authenticated users can view their role assignments
-- Admins will handle role assignments through the backend