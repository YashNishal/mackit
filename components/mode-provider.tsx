"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyModeClass,
  readStoredMode,
  UI_MODE_STORAGE_KEY,
  type UIMode,
} from "@/lib/ui-mode";

interface ModeContextValue {
  mode: UIMode;
  setMode: (mode: UIMode) => void;
  /** Toggles the mode; returns true when retro is now active. */
  toggleMode: () => boolean;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  // Lazy initializer so the first client render already matches storage;
  // shells still gate on mount, so SSR HTML (modern) never mismatches.
  const [mode, setModeState] = useState<UIMode>(() =>
    typeof window === "undefined" ? "modern" : readStoredMode(),
  );

  // Reconcile the <html> class on mount and every change. The bootstrap
  // script normally does this pre-hydration, but a stale cached document
  // may not contain it — state is the source of truth either way.
  useEffect(() => {
    applyModeClass(mode);
  }, [mode]);

  const setMode = useCallback((next: UIMode) => {
    try {
      localStorage.setItem(UI_MODE_STORAGE_KEY, next);
    } catch {
      // localStorage can be unavailable
    }
    applyModeClass(next);
    setModeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    const next: UIMode = mode === "retro" ? "modern" : "retro";
    setMode(next);
    return next === "retro";
  }, [mode, setMode]);

  const value = useMemo<ModeContextValue>(
    () => ({ mode, setMode, toggleMode }),
    [mode, setMode, toggleMode],
  );

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const value = useContext(ModeContext);
  if (!value) {
    throw new Error("useMode must be used within ModeProvider.");
  }
  return value;
}
