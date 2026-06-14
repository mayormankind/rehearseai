# Supabase Setup Guide

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details
4. Wait for project to be ready

### 2. Run Database Schema

1. Open Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy contents of `supabase-schema.sql`
4. Paste and run the SQL script

This creates:
- ✅ `profiles` table (user profiles)
- ✅ `sessions` table (recording sessions)
- ✅ `analysis` table (AI analysis results)
- ✅ `feedback` table (detailed feedback items)
- ✅ Row Level Security policies
- ✅ Triggers for timestamps and user creation

### 3. Configure Storage

1. Navigate to **Storage** in Supabase Dashboard
2. Click "Create Bucket"
3. Create bucket named: `recordings`
4. Set to **Public** or configure policies

#### Storage Policies (if private bucket)

```sql
-- Policy to allow authenticated users to upload their own recordings
CREATE POLICY "Users can upload own recordings"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to view their own recordings
CREATE POLICY "Users can view own recordings"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow users to delete their own recordings
CREATE POLICY "Users can delete own recordings"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'recordings' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Get API Keys

1. Navigate to **Settings** → **API**
2. Copy:
   - **Project URL** (starts with https://...)
   - **anon public** key

### 5. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Enable Authentication

1. Navigate to **Authentication** → **Providers**
2. Enable **Email** authentication
3. Optional: Enable OAuth providers (Google, GitHub, etc.)

#### Email Templates (Optional)

Customize email templates in **Authentication** → **Email Templates**:
- Confirmation email
- Magic link email
- Password reset email

## 📊 Database Schema Overview

### Tables

**profiles**
- User profile information
- Subscription tier tracking
- Session statistics

**sessions**
- Recording session metadata
- Audio file URLs
- Processing status

**analysis**
- AI analysis scores
- Performance metrics
- Word count & timing

**feedback**
- Detailed feedback items
- Categories & severity levels
- Timestamped suggestions

### Relationships

```
profiles (1) ──< sessions (1) ──< analysis (1) ──< feedback
```

## 🔒 Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Policies enforce authentication
- Cascade deletes maintain data integrity

## 📝 Testing Database

You can test with sample data:

```sql
-- Insert test session (after creating a user account)
INSERT INTO public.sessions (user_id, title, audio_url, duration, status)
VALUES (
  auth.uid(), 
  'Test Presentation',
  'https://example.com/audio.mp3',
  300,
  'completed'
);

-- Insert test analysis
INSERT INTO public.analysis (session_id, overall_score, pace_score, clarity_score, confidence_score)
VALUES (
  'session-uuid-here',
  75,
  70,
  80,
  75
);
```

## 🔄 Migrations

For future schema changes, use Supabase Migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to project
supabase link --project-ref your-project-ref

# Create migration
supabase migration new add_new_feature

# Push migrations
supabase db push
```

## 🛠️ Useful Queries

### Get user stats
```sql
SELECT 
  p.email,
  p.total_sessions,
  p.total_minutes,
  COUNT(s.id) as actual_sessions
FROM profiles p
LEFT JOIN sessions s ON s.user_id = p.id
WHERE p.id = auth.uid()
GROUP BY p.id;
```

### Get session with analysis
```sql
SELECT 
  s.*,
  a.overall_score,
  a.pace_score,
  a.clarity_score,
  a.confidence_score
FROM sessions s
LEFT JOIN analysis a ON a.session_id = s.id
WHERE s.user_id = auth.uid()
ORDER BY s.created_at DESC;
```

## ✅ Verification

After setup, verify:
- ✅ Can create user account
- ✅ Profile created automatically
- ✅ Can upload to storage bucket
- ✅ Can create session record
- ✅ RLS policies working correctly

## 🆘 Troubleshooting

**Issue:** Can't access data
- Check RLS policies are created
- Verify user is authenticated
- Check auth.uid() matches user_id

**Issue:** Storage upload fails
- Verify bucket exists
- Check storage policies
- Ensure bucket name matches code

**Issue:** Trigger not working
- Check function exists
- Verify trigger is created
- Look at Supabase logs

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Auth Guide](https://supabase.com/docs/guides/auth)
