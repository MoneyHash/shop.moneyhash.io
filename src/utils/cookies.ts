export function setCookie(key: string, value: string) {
  const encodedKey = encodeURIComponent(key);
  const encodedValue = encodeURIComponent(value);

  // Set expiration to 180 days
  const expires = new Date(
    Date.now() + 180 * 24 * 60 * 60 * 1000,
  ).toUTCString();

  document.cookie =
    `${encodedKey}=${encodedValue}; ` +
    `expires=${expires}; ` +
    `path=/; ` +
    `SameSite=Strict; ` +
    `Secure`;
}

export function getCookie<T>(key: string): T | null {
  const encodedKey = `${encodeURIComponent(key)}=`;

  const raw = document.cookie
    .split('; ')
    .find(c => c.startsWith(encodedKey))
    ?.slice(encodedKey.length);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(raw)) as T;
  } catch {
    return null;
  }
}

export function deleteCookie(key: string) {
  document.cookie =
    `${encodeURIComponent(key)}=; ` +
    `expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
    `path=/; SameSite=Lax; Secure`;
}
