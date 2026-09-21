// Tracks agentic "pay later" charges the chat is still waiting on a receipt for,
// persisted to localStorage. useChat keeps messages in memory only, so on reload
// we'd otherwise forget that a scheduled charge is still pending and never poll
// for its receipt. Immediate charges are NOT tracked here — their receipt comes
// back inline with the tool result, so they never need polling. Keyed by
// customerId.

export type PendingCharge = {
  consentId: string;
  // Client-clock ISO timestamp for when the charge is due. Derived from the
  // backend's relative `delaySeconds` at registration time — NOT the server's
  // absolute `executeAt` — so poll scheduling can't drift on server/client
  // clock skew (all comparisons below run against the client's Date.now()).
  dueAt: string;
};

const storageKey = (customerId: string) => `mh:pendingReceipts:${customerId}`;

export function loadPendingCharges(customerId: string): PendingCharge[] {
  try {
    const raw = localStorage.getItem(storageKey(customerId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingCharge[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePendingCharges(
  customerId: string,
  charges: PendingCharge[],
): void {
  try {
    if (charges.length === 0) localStorage.removeItem(storageKey(customerId));
    else localStorage.setItem(storageKey(customerId), JSON.stringify(charges));
  } catch {
    // Ignore storage failures (private mode, quota, SSR).
  }
}
