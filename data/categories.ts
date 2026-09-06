import { packageId } from "@/lib/catalog/ids";
import type { CatalogPackage, PackageId, PackageKind } from "@/lib/catalog/types";

export interface CuratedApp {
  kind: PackageKind;
  token: string;
  aliases?: string[];
}

export interface CategoryDefinition {
  id: string;
  label: string;
  description: string;
  apps: CuratedApp[];
}

export const EXTRA_ALIASES: Record<PackageId, string[]> = {
  "cask:visual-studio-code": ["vscode", "vs code", "code"],
  "cask:google-chrome": ["chrome"],
  "cask:microsoft-edge": ["edge"],
  "cask:brave-browser": ["brave"],
  "cask:zen": ["zen browser", "zen-browser"],
  "cask:iterm2": ["iterm"],
  "cask:github": ["github desktop"],
  "cask:1password": ["1password", "onepassword"],
  "cask:the-unarchiver": ["unarchiver"],
  "cask:todoist-app": ["todoist"],
  "cask:handbrake-app": ["handbrake"],
  "formula:ripgrep": ["rg", "rip grep"],
  "formula:neovim": ["nvim", "vim"],
  "formula:gh": ["github cli"],
};

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: "browsers",
    label: "Browsers",
    description: "Browse the web with a familiar app.",
    apps: [
      { kind: "cask", token: "google-chrome" },
      { kind: "cask", token: "firefox" },
      { kind: "cask", token: "brave-browser" },
      { kind: "cask", token: "microsoft-edge" },
      { kind: "cask", token: "arc" },
      { kind: "cask", token: "zen" },
    ],
  },
  {
    id: "communication",
    label: "Communication",
    description: "Chat, calls, and collaboration.",
    apps: [
      { kind: "cask", token: "slack" },
      { kind: "cask", token: "discord" },
      { kind: "cask", token: "zoom" },
      { kind: "cask", token: "telegram" },
      { kind: "cask", token: "whatsapp" },
      { kind: "cask", token: "signal" },
    ],
  },
  {
    id: "development",
    label: "Development",
    description: "Editors, terminals, and developer tools.",
    apps: [
      { kind: "cask", token: "visual-studio-code" },
      { kind: "cask", token: "cursor" },
      { kind: "cask", token: "zed" },
      { kind: "cask", token: "iterm2" },
      { kind: "cask", token: "ghostty" },
      { kind: "cask", token: "docker-desktop" },
      { kind: "cask", token: "github" },
      { kind: "formula", token: "git" },
      { kind: "formula", token: "gh" },
      { kind: "formula", token: "node" },
    ],
  },
  {
    id: "design",
    label: "Design",
    description: "Drawing, 3D, and visual work.",
    apps: [
      { kind: "cask", token: "figma" },
      { kind: "cask", token: "blender" },
      { kind: "cask", token: "inkscape" },
      { kind: "cask", token: "gimp" },
      { kind: "cask", token: "krita" },
    ],
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Notes, launchers, and window tools.",
    apps: [
      { kind: "cask", token: "notion" },
      { kind: "cask", token: "obsidian" },
      { kind: "cask", token: "raycast" },
      { kind: "cask", token: "rectangle" },
      { kind: "cask", token: "1password" },
      { kind: "cask", token: "todoist-app" },
    ],
  },
  {
    id: "media",
    label: "Media",
    description: "Music, video, and playback.",
    apps: [
      { kind: "cask", token: "spotify" },
      { kind: "cask", token: "vlc" },
      { kind: "cask", token: "iina" },
      { kind: "cask", token: "handbrake-app" },
      { kind: "cask", token: "obs" },
    ],
  },
  {
    id: "utilities",
    label: "Utilities",
    description: "Everyday Mac helpers.",
    apps: [
      { kind: "cask", token: "the-unarchiver" },
      { kind: "cask", token: "appcleaner" },
      { kind: "cask", token: "stats" },
      { kind: "cask", token: "hiddenbar" },
      { kind: "cask", token: "keka" },
      { kind: "formula", token: "wget" },
      { kind: "formula", token: "jq" },
      { kind: "formula", token: "ripgrep" },
      { kind: "formula", token: "ffmpeg" },
    ],
  },
];

export function curatedIds(): PackageId[] {
  const ids = new Set<PackageId>();

  for (const category of CATEGORIES) {
    for (const app of category.apps) {
      ids.add(packageId(app.kind, app.token));
    }
  }

  return [...ids];
}

export interface ResolvedCategory {
  id: string;
  label: string;
  description: string;
  packages: CatalogPackage[];
}

export function resolveCategories(
  packagesById: Map<string, CatalogPackage>,
): ResolvedCategory[] {
  return CATEGORIES.map((category) => {
    const seen = new Set<string>();
    const packages: CatalogPackage[] = [];

    for (const app of category.apps) {
      const id = packageId(app.kind, app.token);
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);

      const pkg = packagesById.get(id);
      if (pkg) {
        packages.push(pkg);
      }
    }

    return {
      id: category.id,
      label: category.label,
      description: category.description,
      packages,
    };
  }).filter((category) => category.packages.length > 0);
}

export function applyExtraAliases(pkg: CatalogPackage): CatalogPackage {
  const extras = EXTRA_ALIASES[pkg.id] ?? [];
  if (extras.length === 0) {
    return pkg;
  }

  const seen = new Set(pkg.aliases.map((alias) => alias.toLowerCase()));
  const aliases = [...pkg.aliases];

  for (const extra of extras) {
    const key = extra.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      aliases.push(extra);
    }
  }

  return { ...pkg, aliases };
}
