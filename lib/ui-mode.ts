export const UI_MODES = ["modern", "retro"] as const;

export type UIMode = (typeof UI_MODES)[number];

export const UI_MODE_STORAGE_KEY = "mackit-ui";

export const UI_MODE_BOOTSTRAP_SCRIPT = `(function(){try{var m=localStorage.getItem("${UI_MODE_STORAGE_KEY}");document.documentElement.classList.toggle("retro",m==="retro")}catch(e){}})()`;

export function isUIMode(value: unknown): value is UIMode {
  return typeof value === "string" && (UI_MODES as readonly string[]).includes(value);
}

export function readStoredMode(): UIMode {
  try {
    const stored = localStorage.getItem(UI_MODE_STORAGE_KEY);
    if (isUIMode(stored)) {
      return stored;
    }
  } catch {
    // localStorage can be unavailable
  }

  return "modern";
}

export function applyModeClass(mode: UIMode): void {
  document.documentElement.classList.toggle("retro", mode === "retro");
}
