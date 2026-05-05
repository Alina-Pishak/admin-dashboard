/** localStorage + клас `dark` на `<html>` */
export const THEME_STORAGE_KEY = "e-pharmacy-theme";

export type ThemePreference = "light" | "dark";

export function applyTheme(theme: ThemePreference): void {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore quota / private mode */
  }
}

export function getStoredTheme(): ThemePreference | null {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "dark" || v === "light") return v;
  } catch {
    /* ignore */
  }
  return null;
}
