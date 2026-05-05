"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";
import { applyTheme } from "@/lib/theme";
import { IconButton } from "@/components/ui/icon-button";

function subscribe(onStoreChange: () => void) {
  if (typeof document === "undefined") return () => {};
  const el = document.documentElement;
  const obs = new MutationObserver(() => onStoreChange());
  obs.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggle = useCallback(() => {
    applyTheme(dark ? "light" : "dark");
  }, [dark]);

  return (
    <span suppressHydrationWarning>
      <IconButton
        variant="ghost"
        type="button"
        aria-label={dark ? "Світла тема" : "Темна тема"}
        onClick={toggle}
      >
        {dark ? (
          <Sun className="size-5" strokeWidth={1.75} />
        ) : (
          <Moon className="size-5" strokeWidth={1.75} />
        )}
      </IconButton>
    </span>
  );
}
