import { Sparkles } from 'lucide-react';
import { MoneyHashLogo } from '../moneyHashLogo';
import { Button } from '../ui/button';

const SUGGESTED_PROMPTS = [
  'What shirts do you have?',
  'Show me bags under $200',
  'Help me with my order',
] as const;

export function ChatEmptyMessages({
  onPromptClick,
}: {
  onPromptClick?: (prompt: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-5 mt-8 animate-in fade-in duration-500">
      {/* Logo with concentric rings */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full bg-primary/6 ring-1 ring-primary/10" />
        <div className="absolute h-14 w-14 rounded-full bg-primary/10 ring-1 ring-primary/15" />
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary dark:from-transparent to-[hsl(259_85%_28%)] dark:to-transparent shadow-lg shadow-primary/30 ring-2 ring-primary/20">
          <MoneyHashLogo className="h-5 w-5 text-primary-foreground dark:text-foreground" />
        </div>
      </div>

      <div className="text-center space-y-1 mt-2">
        <p className="text-sm font-semibold text-foreground tracking-[-0.01em]">
          Hi there 👋
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You are now speaking with{' '}
          <span className="font-medium text-foreground">
            Shopping Assistant
          </span>
          .
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          How can I help?
        </p>
      </div>

      <div className="w-full space-y-2.5">
        <div className="flex items-center gap-1.5 justify-center text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary/70" />
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Try asking
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTED_PROMPTS.map(prompt => (
            <Button
              key={prompt}
              className="rounded-full px-4"
              onClick={() => onPromptClick?.(prompt)}
              size="sm"
              variant="outline"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
