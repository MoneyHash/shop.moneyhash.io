import { XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MoneyHashLogo } from '../moneyHashLogo';
import { cn } from '@/utils/cn';

export function FloatingButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? t('chatBot.header.close') : t('chatBot.open')}
      className={cn(
        'relative size-14 rounded-full bg-background border-2 shadow-lg outline-none transition-[transform,background-color] duration-150 ease-out hover:scale-[1.07] active:scale-[0.94] pointer-events-auto',
        open && 'max-sm:hidden',
        'max-sm:mb-6 max-sm:me-6',
      )}
    >
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          open
            ? 'scale-0 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100',
        )}
      >
        <MoneyHashLogo className="size-7" />
      </span>

      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          open
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0',
        )}
      >
        <XIcon className="size-7" strokeWidth={2.5} />
      </span>
    </button>
  );
}
