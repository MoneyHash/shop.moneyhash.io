import { Maximize2Icon, Minimize2Icon, XIcon } from 'lucide-react';
import { MoneyHashLogo } from '../moneyHashLogo';
import { Button } from '@/components/ui/button';

export function ChatBotHeader({
  onClose,
  isExpanded,
  onToggleExpand,
}: {
  onClose: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-border/60 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
          <MoneyHashLogo className="size-4 text-primary" />
          <span className="absolute right-0 bottom-0 flex h-2 w-2 items-center justify-center rounded-full bg-background">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-green-400" />
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground leading-tight">
            Shopping Assistant
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight">
            Powered by MoneyHash
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <Button
          onClick={onToggleExpand}
          variant="ghost"
          size="icon"
          className="size-8 max-sm:hidden"
          aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
        >
          {isExpanded ? (
            <Minimize2Icon className="size-4" />
          ) : (
            <Maximize2Icon className="size-4" />
          )}
        </Button>

        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Close chat"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
