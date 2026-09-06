export const THEME_CHOICES = ["system", "light", "dark"] as const;

export type ThemeChoice = (typeof THEME_CHOICES)[number];

export const THEME_STORAGE_KEY = "theme";

export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export function isThemeChoice(value: string): value is ThemeChoice {
  return THEME_CHOICES.some((theme) => theme === value);
}

export function resolveTheme(
  theme: ThemeChoice,
  prefersDark: boolean,
): "light" | "dark" {
  switch (theme) {
    case "light":
      return "light";
    case "dark":
      return "dark";
    case "system":
      return prefersDark ? "dark" : "light";
    default: {
      const exhaustive: never = theme;
      return exhaustive;
    }
  }
}

export function readStoredTheme(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && isThemeChoice(stored)) {
      return stored;
    }
  } catch {
    // localStorage can be unavailable
  }

  return "system";
}

export function applyThemeClass(theme: ThemeChoice): void {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved = resolveTheme(theme, prefersDark);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}
