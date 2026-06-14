# RehearseAI Quick Reference

## 🗂️ File Organization

### Pages & Routes

| Path | File | Description |
|------|------|-------------|
| `/` | `src/app/page.tsx` | Landing page |
| `/login` | `src/app/(auth)/login/page.tsx` | Login form |
| `/register` | `src/app/(auth)/register/page.tsx` | Registration form |
| `/dashboard` | `src/app/dashboard/page.tsx` | Dashboard home |
| `/dashboard/record` | `src/app/dashboard/record/page.tsx` | Recording interface |
| `/dashboard/history` | `src/app/dashboard/history/page.tsx` | Session list |
| `/dashboard/session/[id]` | `src/app/dashboard/session/[id]/page.tsx` | Session details |

### API Endpoints

| Endpoint | File | Purpose |
|----------|------|---------|
| `POST /api/upload` | `src/app/api/upload/route.ts` | Upload audio files |
| `POST /api/analyze` | `src/app/api/analyze/route.ts` | Analyze recordings |
| `POST /api/webhook` | `src/app/api/webhook/route.ts` | Handle webhooks |

### Components

**UI Components** (`src/components/ui/`)
- `Button.tsx` - Reusable button with variants
- `Input.tsx` - Form input with labels
- `Card.tsx` - Content container
- `Modal.tsx` - Overlay modal

**Audio Components** (`src/components/audio/`)
- `AudioRecorder.tsx` - Recording interface
- `Waveform.tsx` - Visualization placeholder

**Other Components**
- `charts/AnalyticsChart.tsx` - Chart visualization
- `feedback/FeedbackDisplay.tsx` - AI feedback display

### Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useRecorder` | `src/hooks/useRecorder.ts` | Audio recording state |
| `useTheme` | `src/hooks/useTheme.ts` | Theme management |
| `useSpeechAnalysis` | `src/hooks/useSpeechAnalysis.ts` | AI analysis |

### State Management

**Zustand Store** (`src/store/ui-store.ts`)
- Theme state (light/dark/system)
- Recording state
- Modal management
- Sidebar toggle

### Utilities

**Library Functions** (`src/lib/`)
- `supabaseClient.ts` - Supabase client
- `openai.ts` - OpenAI integration
- `analysis.ts` - Analysis pipeline
- `upload.ts` - File upload helpers
- `utils.ts` - Common utilities

### Type Definitions

**TypeScript Types** (`src/types/`)
- `user.ts` - User & auth types
- `session.ts` - Session types
- `analysis.ts` - Analysis types

## 🎨 Using Components

### Button
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">Click me</Button>
```

### Input
```tsx
import { Input } from '@/components/ui/Input';

<Input label="Email" type="email" error="Invalid email" />
```

### Card
```tsx
import { Card } from '@/components/ui/Card';

<Card title="My Card">Content here</Card>
```

### Modal
```tsx
import { Modal } from '@/components/ui/Modal';

<Modal isOpen={true} onClose={() => {}} title="Title">
  Modal content
</Modal>
```

## 🎯 Using Hooks

### Recording Audio
```tsx
import { useRecorder } from '@/hooks/useRecorder';

const { 
  isRecording, 
  duration, 
  audioBlob,
  startRecording, 
  stopRecording 
} = useRecorder();
```

### Theme Management
```tsx
import { useTheme } from '@/hooks/useTheme';

const { theme, resolvedTheme, toggleTheme } = useTheme();
```

### Speech Analysis
```tsx
import { useSpeechAnalysis } from '@/hooks/useSpeechAnalysis';

const { isAnalyzing, analysis, analyzeAudio } = useSpeechAnalysis();
```

## 🏪 Using Zustand Store

```tsx
import { useUIStore } from '@/store/ui-store';

function MyComponent() {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const isRecording = useUIStore((state) => state.recording.isRecording);
  
  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

## 🔌 API Integration

### Upload File
```tsx
import { uploadFile } from '@/lib/upload';

const url = await uploadFile(audioFile, 'recordings');
```

### Analyze Audio
```tsx
import { analyzePresentation } from '@/lib/analysis';

const result = await analyzePresentation(audioFile);
```

### OpenAI Functions
```tsx
import { transcribeAudio, generateFeedback } from '@/lib/openai';

const text = await transcribeAudio(audioFile);
const feedback = await generateFeedback(text);
```

## 🎨 Tailwind Color Variables

```css
/* Use in your components */
bg-background
text-foreground
bg-primary
text-primary-foreground
bg-secondary
border-border
bg-muted
text-muted-foreground
```

## 📝 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
OPENAI_API_KEY=your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 📦 Key Dependencies

- **next** - React framework
- **react** - UI library
- **typescript** - Type safety
- **tailwindcss** - Styling
- **@supabase/supabase-js** - Database & auth
- **openai** - AI integration
- **zustand** - State management
- **react-hook-form** - Form handling
- **zod** - Validation
- **recharts** - Charts
- **sonner** - Notifications
- **clsx** - Class utilities

## 🎯 Next Implementation Steps

1. **Database Setup**
   - Create Supabase tables
   - Set up storage buckets
   - Configure RLS policies

2. **Authentication**
   - Implement login/register logic
   - Add auth context/provider
   - Protect dashboard routes

3. **Recording Feature**
   - Enhance audio recorder
   - Add waveform visualization
   - Implement upload flow

4. **AI Analysis**
   - Configure OpenAI API
   - Build analysis pipeline
   - Display feedback

5. **UI Polish**
   - Add loading states
   - Error handling
   - Animations
