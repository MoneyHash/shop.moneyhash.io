export function setCookie<T>(key: string, value: T) {
  const encodedKey = encodeURIComponent(key);
  const encodedValue = encodeURIComponent(JSON.stringify(value));

  const expires = new Date(
    Date.now() + 180 * 24 * 60 * 60 * 1000,
  ).toUTCString();

  const isHttps = window.location.protocol === 'https:';

  document.cookie =
    `${encodedKey}=${encodedValue}; ` +
    `expires=${expires}; ` +
    `path=/; ` +
    `SameSite=Lax; ${
      // ws on localhost + prod
      isHttps ? 'Secure;' : ''
    }`;
}

export function getCookie<T>(key: string): T | null {
  const encodedKey = encodeURIComponent(key);

  const cookie = document.cookie
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${encodedKey}=`));

  if (!cookie) return null;

  try {
    return JSON.parse(
      decodeURIComponent(cookie.slice(encodedKey.length + 1)),
    ) as T;
  } catch {
    return null;
  }
}

export function deleteCookie(key: string) {
  const isHttps = window.location.protocol === 'https:';

  document.cookie =
    `${encodeURIComponent(key)}=; ` +
    `expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
    `path=/; ` +
    `SameSite=Lax; ${isHttps ? 'Secure;' : ''}`;
}
