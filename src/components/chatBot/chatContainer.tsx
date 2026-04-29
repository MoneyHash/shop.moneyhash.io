import { cn } from '@/utils/cn';

export function ChatContainer({
  isOpen,
  isExpanded,
  children,
}: {
  isOpen: boolean;
  isExpanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-border bg-background overflow-hidden overscroll-contain max-sm:rounded-none',
        'shadow-[rgba(9,14,21,0.9)_0px_5px_40px_0px]',
        'transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] ltr:origin-bottom-right rtl:origin-bottom-left',
        // width: caps to viewport width with 1.5rem margin on small screens
        isExpanded
          ? 'sm:w-[min(40rem,calc(100vw-1.5rem))]'
          : 'sm:w-[min(28rem,calc(100vw-1.5rem))]',
        'max-sm:w-full',
        // height: caps to viewport height, leaving room for the FAB + bottom offset
        isExpanded
          ? 'sm:h-[min(1020px,calc(100vh-96px))]'
          : 'sm:h-[min(690px,calc(100vh-96px))]',
        'max-sm:h-full',
        isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-95 translate-y-3 pointer-events-none',
      )}
      role="dialog"
      aria-label="Shopping Assistant chat"
    >
      {children}
    </div>
  );
}
