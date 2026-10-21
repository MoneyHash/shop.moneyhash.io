// The agent decides "now" vs "later" when it opens the checkout, so the
// customer sees (and approves) exactly when the card will be charged.
// Mirrors the backend default for when='later' with no delay.
const DEFAULT_LATER_DELAY_SECONDS = 3600;

export function resolveChargeDelaySeconds(input: {
  when?: 'now' | 'later';
  delaySeconds?: number;
}): number {
  if (input.when !== 'later') return 0;
  return input.delaySeconds ?? DEFAULT_LATER_DELAY_SECONDS;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Clock time of the charge, with the weekday when it isn't today.
export function formatChargeTime(at: Date, locale: string): string {
  return new Intl.DateTimeFormat(
    locale,
    isSameDay(at, new Date())
      ? { hour: 'numeric', minute: '2-digit' }
      : { weekday: 'short', hour: 'numeric', minute: '2-digit' },
  ).format(at);
}

// "In 2 hours (~3:45 PM)" for a deferred charge.
export function formatChargeDelay(
  delaySeconds: number,
  locale: string,
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const relative =
    delaySeconds < 3600
      ? rtf.format(Math.max(1, Math.round(delaySeconds / 60)), 'minute')
      : delaySeconds < 86400
      ? rtf.format(Math.round(delaySeconds / 3600), 'hour')
      : rtf.format(Math.round(delaySeconds / 86400), 'day');
  const at = new Date(Date.now() + delaySeconds * 1000);
  const text = `${relative} (~${formatChargeTime(at, locale)})`;
  return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
}
