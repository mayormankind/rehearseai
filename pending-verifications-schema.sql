-- Run this in your Supabase SQL Editor
-- Stores temporary OTP state until the user verifies their email

CREATE TABLE IF NOT EXISTS public.pending_verifications (
  email       TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  otp_hash    TEXT NOT NULL,         -- SHA-256 hash of the 6-digit code
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Only the service role (server) can access this table
ALTER TABLE public.pending_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct client access"
  ON public.pending_verifications
  FOR ALL
  USING (false);
