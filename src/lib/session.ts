// Simple session cookie helpers — store a user's email in a session cookie
const COOKIE_NAME = "session_email";

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  document.cookie = cookie;
}

function getCookie(name: string): string | null {
  const safeName = name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1");
  const pattern = "(?:^|; )" + safeName + "=([^;]*)";
  const matches = document.cookie.match(new RegExp(pattern));
  return matches ? decodeURIComponent(matches[1]) : null;
}

export function setSessionEmail(email: string) {
  setCookie(COOKIE_NAME, email, 7);
}

export function getSessionEmail(): string | null {
  return getCookie(COOKIE_NAME);
}

export function clearSession() {
  // expire the cookie
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
  clearBusinessName();
}

export function isAuthenticated(): boolean {
  return !!getSessionEmail();
}

// LocalStorage helpers for businessName (display only)
export function setBusinessName(businessName: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('businessName', businessName);
  }
}

export function getBusinessName(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('businessName');
  }
  return null;
}

export function clearBusinessName() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('businessName');
  }
}

// Attempt to validate session with backend. Returns user info object if available, otherwise null.
export async function validateWithServer(meUrl = "/api/auth/me") {
  try {
    const resp = await fetch(meUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!resp.ok) return null;

    const data = await resp.json();
    // return data (expected to include identifying info, like email)
    return data || null;
  } catch (err) {
    return null;
  }
}

export default {
  setSessionEmail,
  getSessionEmail,
  clearSession,
  isAuthenticated,
};
