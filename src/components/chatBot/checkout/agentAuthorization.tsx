import { useEffect, useRef, useState } from 'react';
import {
  ArrowRightIcon,
  FingerprintIcon,
  Loader2Icon,
  ShieldCheckIcon,
} from 'lucide-react';

const STORAGE_KEY = 'mh_agent_authorization';

type StoredAuthorization = {
  authorizedAt: number;
  credentialId: string;
};

export type AgentAuthorizationResult =
  | { status: 'authorized'; authorizedAt: number; credentialId: string }
  | { status: 'declined'; reason: string }
  | { status: 'unsupported' };

type ViewState =
  | { kind: 'idle' }
  | { kind: 'verifying' }
  | { kind: 'authorized'; authorizedAt: number; credentialId: string }
  | { kind: 'error'; reason: string };

function readStored(): StoredAuthorization | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAuthorization>;
    if (
      typeof parsed.authorizedAt === 'number' &&
      typeof parsed.credentialId === 'string'
    ) {
      return parsed as StoredAuthorization;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStored(value: StoredAuthorization) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode */
  }
}

function clearStored() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window
    .btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function isWebAuthnAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.credentials?.create
  );
}

export function readAgentAuthorization(): AgentAuthorizationResult | null {
  const stored = readStored();
  if (!stored) return null;
  return {
    status: 'authorized',
    authorizedAt: stored.authorizedAt,
    credentialId: stored.credentialId,
  };
}

export function AgentAuthorization({
  onResult,
}: {
  onResult?: (result: AgentAuthorizationResult) => void;
}) {
  const supported = useRef(isWebAuthnAvailable());
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const [view, setView] = useState<ViewState>(() => {
    if (!supported.current) return { kind: 'idle' };
    const stored = readStored();
    if (stored) {
      return {
        kind: 'authorized',
        authorizedAt: stored.authorizedAt,
        credentialId: stored.credentialId,
      };
    }
    return { kind: 'idle' };
  });

  useEffect(() => {
    if (!supported.current) {
      onResultRef.current?.({ status: 'unsupported' });
      return;
    }
    if (view.kind === 'authorized') {
      onResultRef.current?.({
        status: 'authorized',
        authorizedAt: view.authorizedAt,
        credentialId: view.credentialId,
      });
    }
    // Only fires on mount — subsequent state changes broadcast inline below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!supported.current) {
    return (
      <div className="border-t border-border/60 bg-muted/20 px-3 py-2">
        <p className="text-[10px] text-muted-foreground">
          Biometric authorization isn&apos;t available on this device.
        </p>
      </div>
    );
  }

  const authorize = async () => {
    setView({ kind: 'verifying' });
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new Uint8Array(16);
      window.crypto.getRandomValues(userId);

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'MoneyHash Shop',
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: 'shop-user',
            displayName: 'Shop user',
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 },
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
            residentKey: 'discouraged',
          },
          timeout: 60_000,
          attestation: 'none',
        },
      })) as PublicKeyCredential | null;

      if (!credential) {
        throw new Error('No credential returned');
      }

      const credentialId = bufferToBase64Url(credential.rawId);
      const authorizedAt = Date.now();
      writeStored({ authorizedAt, credentialId });
      setView({ kind: 'authorized', authorizedAt, credentialId });
      onResultRef.current?.({
        status: 'authorized',
        authorizedAt,
        credentialId,
      });
    } catch (err) {
      const reason =
        err instanceof Error
          ? err.name === 'NotAllowedError'
            ? 'Cancelled or timed out'
            : err.name || err.message
          : 'Unknown error';
      setView({ kind: 'error', reason });
      onResultRef.current?.({ status: 'declined', reason });
    }
  };

  const revoke = () => {
    clearStored();
    setView({ kind: 'idle' });
  };

  if (view.kind === 'authorized') {
    return (
      <div className="flex items-center gap-2.5 border-t border-emerald-500/30 bg-emerald-500/[0.06] px-3 py-2.5">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <ShieldCheckIcon
            className="size-3.5 text-emerald-700 dark:text-emerald-400"
            strokeWidth={2.5}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">
            Agent authorized
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            One-tap checkout enabled on this device
          </p>
        </div>
        <button
          type="button"
          onClick={revoke}
          className="shrink-0 text-[10px] font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Revoke
        </button>
      </div>
    );
  }

  const verifying = view.kind === 'verifying';

  return (
    <div className="border-t border-border/60">
      <button
        type="button"
        onClick={authorize}
        disabled={verifying}
        className="group relative flex w-full items-center gap-2.5 overflow-hidden bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 px-3 py-2.5 text-left transition-all hover:from-indigo-500/20 hover:via-violet-500/20 hover:to-fuchsia-500/20 disabled:cursor-not-allowed disabled:opacity-80"
      >
        <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-violet-500/15 ring-1 ring-violet-500/30 transition-transform group-hover:scale-[1.04]">
          {verifying ? (
            <Loader2Icon
              className="size-3.5 animate-spin text-violet-700 dark:text-violet-300"
              strokeWidth={2.5}
            />
          ) : (
            <FingerprintIcon
              className="size-3.5 text-violet-700 dark:text-violet-300"
              strokeWidth={2.5}
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground">
            {verifying ? 'Verifying…' : 'Speed up future checkouts'}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {verifying
              ? 'Confirm with Touch ID / Face ID'
              : 'Authorize the assistant with biometrics — stays on this device'}
          </p>
        </div>
        <ArrowRightIcon
          className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
          strokeWidth={2.5}
        />
      </button>
      {view.kind === 'error' && (
        <p className="px-3 pb-2 text-[10px] text-destructive/80">
          Couldn&apos;t verify ({view.reason}). Tap to try again.
        </p>
      )}
    </div>
  );
}
