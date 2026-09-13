export type MenuAction = "find" | "install" | "share" | "clear" | "undo" | "paste";

const ACTIONS: readonly MenuAction[] = [
  "find",
  "install",
  "share",
  "clear",
  "undo",
  "paste",
];

export const MENU_EVENT = "mackit-menu";

const PENDING_KEY = "mackit-pending-action";

export function isMenuAction(value: unknown): value is MenuAction {
  return (
    typeof value === "string" &&
    (ACTIONS as readonly string[]).includes(value)
  );
}

export function dispatchMenuAction(action: MenuAction): void {
  window.dispatchEvent(new CustomEvent<MenuAction>(MENU_EVENT, { detail: action }));
}

export function stashPendingAction(action: MenuAction): void {
  try {
    sessionStorage.setItem(PENDING_KEY, action);
  } catch {
    // storage can be unavailable; the action is dropped
  }
}

export function takePendingAction(): MenuAction | null {
  try {
    const stored = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    return isMenuAction(stored) ? stored : null;
  } catch {
    return null;
  }
}
