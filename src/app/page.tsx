import Link from 'next/link';
import { Mic, Bot, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-6xl font-bold text-foreground mb-4">
          Rehearse<span className="text-primary">AI</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          AI-Powered Presentation Coach
        </p>

        <p className="text-lg text-foreground max-w-2xl mx-auto">
          Record your presentations and receive intelligent feedback to improve
          your delivery, clarity, and confidence.
        </p>

        <div className="flex gap-4 justify-center mt-12">
          <Link
            href="/login"
            className="px-8 py-4 bg-primary hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className="px-8 py-4 bg-secondary hover:bg-gray-300 dark:hover:bg-gray-800 text-foreground rounded-lg font-semibold transition-colors"
          >
            Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mic className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Record</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Capture your presentations with our intuitive audio recorder
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Analyze</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get AI-powered insights on pace, clarity, and confidence
            </p>
          </div>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Improve</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Track your progress and become a better presenter
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
