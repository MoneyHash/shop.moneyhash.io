import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MoneyHashLogo } from '../moneyHashLogo';
import { Button } from '../ui/button';

const PROMPT_KEYS = ['shirts', 'bagsUnder200', 'helpWithOrder'] as const;

export function ChatEmptyMessages({
  onPromptClick,
}: {
  onPromptClick?: (prompt: string) => void;
}) {
  const { t } = useTranslation();

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
          {t('chatBot.empty.greeting')}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('chatBot.empty.speakingWith')}{' '}
          <span className="font-medium text-foreground">
            {t('chatBot.empty.assistantName')}
          </span>
          .
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('chatBot.empty.howCanIHelp')}
        </p>
      </div>

      <div className="w-full space-y-2.5">
        <div className="flex items-center gap-1.5 justify-center text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary/70" />
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {t('chatBot.empty.tryAsking')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {PROMPT_KEYS.map(key => {
            const prompt = t(`chatBot.empty.prompts.${key}`);
            return (
              <Button
                key={key}
                className="rounded-full px-4"
                onClick={() => onPromptClick?.(prompt)}
                size="sm"
                variant="outline"
              >
                {prompt}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
