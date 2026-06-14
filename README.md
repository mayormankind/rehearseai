# RehearseAI MVP Scaffold

An AI-powered web application to record presentations and receive intelligent feedback.

## 🚀 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx        # Registration page
│   ├── dashboard/
│   │   ├── page.tsx                 # Dashboard home with navigation
│   │   ├── record/page.tsx          # Recording interface
│   │   ├── history/page.tsx         # Session history list
│   │   └── session/[id]/page.tsx    # Individual session details
│   ├── api/
│   │   ├── upload/route.ts          # File upload endpoint
│   │   ├── analyze/route.ts         # AI analysis endpoint
│   │   └── webhook/route.ts         # Webhook handler
│   └── layout.tsx                   # Root layout with Toaster
│
├── components/
│   ├── ui/                          # UI components (Button, Input, Card, Modal)
│   ├── audio/                       # Recording & waveform components
│   ├── charts/                      # Analytics chart components
│   └── feedback/                    # Feedback display components
│
├── lib/
│   ├── supabaseClient.ts            # Supabase client initialization
│   ├── openai.ts                    # OpenAI API integration
│   ├── analysis.ts                  # AI analysis pipeline
│   ├── upload.ts                    # File upload utilities
│   └── utils.ts                     # Common utility functions
│
├── hooks/
│   ├── useRecorder.ts               # Audio recording hook
│   ├── useTheme.ts                  # Theme management hook
│   └── useSpeechAnalysis.ts         # Speech analysis hook
│
├── store/
│   └── ui-store.ts                  # Zustand UI state store
│
├── types/
│   ├── user.ts                      # User type definitions
│   ├── session.ts                   # Session type definitions
│   └── analysis.ts                  # Analysis type definitions
│
└── styles/
    └── global.css                   # Global styles with Tailwind v4
```

## 📦 Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database & Auth:** Supabase
- **AI:** OpenAI (Whisper & GPT)
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Notifications:** Sonner

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Key Features (Scaffolded)

### Authentication
- Login page (`/login`)
- Registration page (`/register`)
- Ready for Supabase Auth integration

### Dashboard
- **Home:** Quick navigation to record and history
- **Record:** Audio recording interface with waveform visualization
- **History:** List of past recording sessions
- **Session Details:** View individual session with AI feedback

### Components
- **UI Components:** Button, Input, Card, Modal
- **Audio Components:** AudioRecorder, Waveform
- **Charts:** AnalyticsChart (Recharts placeholder)
- **Feedback:** FeedbackDisplay for AI analysis results

### State Management
- **Zustand Store:** Theme, recording state, modals, sidebar
- **Custom Hooks:** Recording, theme, and speech analysis

### API Routes
- `/api/upload` - Handle audio file uploads
- `/api/analyze` - Process AI transcription and feedback
- `/api/webhook` - External service notifications

## 🎨 Theming

The app supports dark/light mode using Tailwind v4 CSS variables:
- Automatically detects system preference
- Manual theme toggle available
- Persistent theme selection

## 📝 Type Definitions

TypeScript interfaces are defined for:
- **User:** Authentication and profile data
- **Session:** Recording sessions with metadata
- **Analysis:** AI feedback and metrics

## 🔌 Integrations

### Supabase
- Client initialized in `lib/supabaseClient.ts`
- Ready for auth, storage, and database operations

### OpenAI
- Transcription with Whisper API
- Feedback generation with GPT
- Analysis pipeline in `lib/analysis.ts`

## 🎬 Next Steps

1. **Set up Supabase:**
   - Create tables for users, sessions, and analysis
   - Configure storage buckets for audio files
   - Set up authentication policies

2. **Implement Authentication:**
   - Wire up login/register forms
   - Add auth state management
   - Implement protected routes

3. **Build Recording Flow:**
   - Enhance audio recorder with waveform
   - Implement upload to Supabase Storage
   - Connect to analysis API

4. **Add AI Analysis:**
   - Integrate OpenAI Whisper for transcription
   - Build GPT prompt for presentation feedback
   - Display results in FeedbackDisplay component

5. **Polish UI/UX:**
   - Add loading states
   - Implement error handling
   - Enhance animations and transitions

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)

## 🤝 Contributing

This is an MVP scaffold. Feel free to extend and customize based on your requirements.

## 📄 License

MIT
