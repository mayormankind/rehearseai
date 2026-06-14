# 🎯 RehearseAI MVP - Setup Instructions

## ⚠️ Important: Project Structure

This project uses the **`src/`** directory structure. You may notice an old `app/` folder in the root - this is from the initial Next.js setup and should be **deleted or ignored**.

Next.js will automatically use `src/app/` when it exists, so the old `app/` folder won't interfere. However, for cleanliness:

```bash
# Optional: Remove the old app folder
rm -rf app
# On Windows
rmdir /s app
```

## 📋 Pre-Setup Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Supabase account created
- [ ] OpenAI API account created

## 🚀 Installation Steps

### 1. Install Dependencies

```bash
pnpm install
```

This installs:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase client
- OpenAI SDK
- Zustand
- Recharts
- Sonner
- And more...

### 2. Set Up Supabase

Follow the comprehensive guide in **`SUPABASE_SETUP.md`**

Quick steps:
1. Create Supabase project
2. Run `supabase-schema.sql` in SQL Editor
3. Create `recordings` storage bucket
4. Copy API credentials

### 3. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Never commit `.env.local` to version control!**

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Verify Setup

Check that these pages load:
- [ ] Home page: `/`
- [ ] Login page: `/login`
- [ ] Register page: `/register`
- [ ] Dashboard: `/dashboard` (will need auth later)

## 🏗️ Project Structure Overview

```
src/
├── app/              # Next.js 16 App Router pages
├── components/       # React components
├── hooks/            # Custom React hooks
├── lib/              # Utilities & integrations
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── styles/           # Global styles
```

See **`SCAFFOLD_COMPLETE.md`** for full file tree.

## 📚 Documentation Files

- **`README.md`** - Main project documentation
- **`QUICK_REFERENCE.md`** - Quick usage guide for components, hooks, and utilities
- **`SCAFFOLD_COMPLETE.md`** - Complete file structure tree
- **`SUPABASE_SETUP.md`** - Detailed Supabase setup instructions
- **`supabase-schema.sql`** - Database schema

## 🎨 Tailwind CSS v4

This project uses Tailwind v4 with CSS variables for theming:

```tsx
// Use color variables
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
```

Dark mode is supported via system preference or manual toggle.

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start dev server (http://localhost:3000)

# Build
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
```

## 🛠️ Next Development Steps

### Phase 1: Authentication
1. Implement login form with Supabase Auth
2. Implement registration form
3. Add auth context/provider
4. Protect dashboard routes with middleware
5. Add logout functionality

### Phase 2: Recording Feature
1. Enhance `AudioRecorder` component
2. Implement real-time waveform visualization
3. Connect to `useRecorder` hook
4. Upload to Supabase Storage
5. Save session metadata to database

### Phase 3: AI Analysis
1. Configure OpenAI API key
2. Implement Whisper transcription
3. Build GPT feedback prompt
4. Process and store analysis results
5. Display in `FeedbackDisplay` component

### Phase 4: Dashboard
1. Fetch user sessions from Supabase
2. Display session history
3. Show session details with analysis
4. Add analytics charts with Recharts
5. Implement session deletion

### Phase 5: Polish
1. Add loading states
2. Error handling & validation
3. Toast notifications (Sonner)
4. Animations & transitions
5. Responsive design improvements

## 🔍 Troubleshooting

### TypeScript Errors
If you see module not found errors:
```bash
# Restart TypeScript server in VS Code
# Command Palette (Ctrl+Shift+P) → "TypeScript: Restart TS Server"
```

### Tailwind Not Working
```bash
# Make sure dev server is running
pnpm dev

# Check that global.css is imported in src/app/layout.tsx
```

### Supabase Connection Issues
- Verify environment variables are set in `.env.local`
- Check Supabase project is active
- Verify API keys are correct

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

## 🆘 Getting Help

1. Check documentation files in this repo
2. Review [Next.js Docs](https://nextjs.org/docs)
3. Check [Supabase Docs](https://supabase.com/docs)
4. Check [OpenAI API Docs](https://platform.openai.com/docs)

## ✅ Setup Complete Checklist

- [ ] Dependencies installed (`pnpm install`)
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] Storage bucket created
- [ ] Environment variables configured
- [ ] Dev server runs successfully
- [ ] All pages load without errors
- [ ] TypeScript compilation successful

## 🎉 You're Ready to Build!

The scaffold is complete. Start implementing features following the Phase guidelines above.

Happy coding! 🚀
