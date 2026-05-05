"use client";

const TOKEN_KEY = "admin-dashboard-token";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/** HTTP-only cookie для proxy; викликати після успішного логіну / refresh. */
export async function syncAuthSessionCookie(token: string): Promise<void> {
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
    credentials: "same-origin",
  });
}

/** Скидає cookie сесії на сервері (разом із clearStoredToken при виході / 401). */
export async function clearAuthSessionCookie(): Promise<void> {
  await fetch("/api/auth/session", {
    method: "DELETE",
    credentials: "same-origin",
  });
}
