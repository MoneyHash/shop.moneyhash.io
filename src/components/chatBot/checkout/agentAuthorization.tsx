import { useEffect, useRef, useState } from 'react';
import {
  ArrowRightIcon,
  FingerprintIcon,
  Loader2Icon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/config';

const STORAGE_KEY_PREFIX = 'mh_agent_authorization';

const getStorageKey = (customerId: string) =>
  `${STORAGE_KEY_PREFIX}:${customerId}`;

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

function readStored(customerId: string): StoredAuthorization | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(getStorageKey(customerId));
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

function writeStored(customerId: string, value: StoredAuthorization) {
  try {
    window.localStorage.setItem(
      getStorageKey(customerId),
      JSON.stringify(value),
    );
  } catch {
    /* ignore quota / private mode */
  }
}

function clearStored(customerId: string) {
  try {
    window.localStorage.removeItem(getStorageKey(customerId));
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

function base64UrlToBuffer(base64Url: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const binary = window.atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return buffer;
}

function isWebAuthnAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.PublicKeyCredential !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    !!navigator.credentials?.create
  );
}

export function readAgentAuthorization(
  customerId: string,
): AgentAuthorizationResult | null {
  const stored = readStored(customerId);
  if (!stored) return null;
  return {
    status: 'authorized',
    authorizedAt: stored.authorizedAt,
    credentialId: stored.credentialId,
  };
}

export async function verifyAgentAuthorization(
  customerId: string,
): Promise<AgentAuthorizationResult> {
  if (!isWebAuthnAvailable() || !navigator.credentials?.get) {
    return { status: 'unsupported' };
  }
  const stored = readStored(customerId);
  if (!stored) {
    return {
      status: 'declined',
      reason: i18n.t('chatBot.checkout.errors.noStoredAuthorization'),
    };
  }
  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [
          {
            type: 'public-key',
            id: base64UrlToBuffer(stored.credentialId),
            transports: ['internal'],
          },
        ],
        userVerification: 'required',
        timeout: 60_000,
      },
    })) as PublicKeyCredential | null;

    if (!assertion) {
      return {
        status: 'declined',
        reason: i18n.t('chatBot.checkout.errors.noAssertionReturned'),
      };
    }

    return {
      status: 'authorized',
      authorizedAt: Date.now(),
      credentialId: stored.credentialId,
    };
  } catch (err) {
    const reason =
      err instanceof Error
        ? err.name === 'NotAllowedError'
          ? i18n.t('chatBot.checkout.errors.cancelledOrTimedOut')
          : err.name || err.message
        : i18n.t('chatBot.checkout.errors.unknownError');
    return { status: 'declined', reason };
  }
}

export function AgentAuthorization({
  customerId,
  onResult,
}: {
  customerId: string;
  onResult?: (result: AgentAuthorizationResult) => void;
}) {
  const { t } = useTranslation();
  const supported = useRef(isWebAuthnAvailable());
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const [view, setView] = useState<ViewState>(() => {
    if (!supported.current) return { kind: 'idle' };
    const stored = readStored(customerId);
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
          {t('chatBot.checkout.errors.biometricUnavailable')}
        </p>
      </div>
    );
  }

  const authorize = async () => {
    setView({ kind: 'verifying' });
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userId = new TextEncoder().encode(customerId);

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: 'MoneyHash Shop',
            id: window.location.hostname,
          },
          user: {
            id: userId,
            name: `shop-user:${customerId}`,
            displayName: `Shop user ${customerId}`,
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
        throw new Error(
          i18n.t('chatBot.checkout.errors.noCredentialReturned'),
        );
      }

      const credentialId = bufferToBase64Url(credential.rawId);
      const authorizedAt = Date.now();
      writeStored(customerId, { authorizedAt, credentialId });
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
            ? i18n.t('chatBot.checkout.errors.cancelledOrTimedOut')
            : err.name || err.message
          : i18n.t('chatBot.checkout.errors.unknownError');
      setView({ kind: 'error', reason });
      onResultRef.current?.({ status: 'declined', reason });
    }
  };

  const revoke = () => {
    clearStored(customerId);
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
            {t('chatBot.checkout.agentAuth.authorized')}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {t('chatBot.checkout.agentAuth.oneTapEnabled')}
          </p>
        </div>
        <button
          type="button"
          onClick={revoke}
          className="shrink-0 text-[10px] font-medium text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          {t('chatBot.checkout.agentAuth.revoke')}
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
            {verifying
              ? t('chatBot.checkout.agentAuth.verifying')
              : t('chatBot.checkout.agentAuth.speedUp')}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {verifying
              ? t('chatBot.checkout.agentAuth.confirmTouchId')
              : t('chatBot.checkout.agentAuth.biometricsHint')}
          </p>
        </div>
        <ArrowRightIcon
          className="size-3.5 shrink-0 text-muted-foreground transition-transform ltr:group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 group-hover:text-foreground"
          strokeWidth={2.5}
        />
      </button>
      {view.kind === 'error' && (
        <p className="px-3 pb-2 text-[10px] text-destructive/80">
          {t('chatBot.checkout.errors.verifyFailed', { reason: view.reason })}
        </p>
      )}
    </div>
  );
}
