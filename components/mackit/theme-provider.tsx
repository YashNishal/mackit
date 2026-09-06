"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  applyThemeClass,
  readStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemeChoice,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: ThemeChoice;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemeChoice) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_CHANGE_EVENT = "mackit-theme";

interface ThemeSnapshot {
  theme: ThemeChoice;
  resolved: "light" | "dark";
}

let snapshot: ThemeSnapshot = { theme: "system", resolved: "light" };

function readSnapshot(): ThemeSnapshot {
  const theme = readStoredTheme();
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = resolveTheme(theme, prefersDark);

  if (snapshot.theme === theme && snapshot.resolved === resolved) {
    return snapshot;
  }

  snapshot = { theme, resolved };
  return snapshot;
}

const SERVER_SNAPSHOT: ThemeSnapshot = { theme: "system", resolved: "light" };

function subscribe(onStoreChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    applyThemeClass(readStoredTheme());
    onStoreChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) {
      return;
    }
    onChange();
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  media.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    media.removeEventListener("change", onChange);
  };
}

function getServerSnapshot(): ThemeSnapshot {
  return SERVER_SNAPSHOT;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

  useLayoutEffect(() => {
    applyThemeClass(readStoredTheme());
  }, []);

  const setTheme = useCallback((theme: ThemeChoice) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage can be unavailable
    }
    applyThemeClass(theme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: current.theme,
      resolvedTheme: current.resolved,
      setTheme,
    }),
    [current, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }
  return value;
}
