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
  "cask:orion": ["orion browser"],
  "cask:safari-technology-preview": ["safari", "technology preview"],
  "cask:iterm2": ["iterm"],
  "cask:github": ["github desktop"],
  "cask:1password": ["1password", "onepassword"],
  "cask:the-unarchiver": ["unarchiver"],
  "cask:todoist-app": ["todoist"],
  "cask:handbrake-app": ["handbrake"],
  "cask:microsoft-teams": ["teams"],
  "cask:chatgpt": ["chat gpt", "openai"],
  "cask:claude": ["claude ai", "anthropic"],
  "cask:ollama-app": ["ollama"],
  "cask:sublime-text": ["sublime"],
  "cask:tableplus": ["table plus", "sql client", "database gui"],
  "cask:dbeaver-community": ["dbeaver", "database tool"],
  "cask:proxyman": ["proxy debugger", "http debugger"],
  "cask:orbstack": ["orb stack"],
  "cask:typora": ["markdown editor"],
  "cask:ticktick": ["tick tick"],
  "cask:linear": ["linear app"],
  "cask:alfred": ["launcher"],
  "cask:maccy": ["clipboard manager", "clipboard"],
  "cask:microsoft-office": ["office", "word", "excel", "powerpoint"],
  "cask:libreoffice": ["libre office"],
  "cask:skim": ["pdf reader"],
  "cask:calibre": ["ebooks", "ebook manager"],
  "cask:anki": ["flashcards"],
  "cask:google-drive": ["drive"],
  "cask:onedrive": ["one drive"],
  "cask:transmission": ["torrent"],
  "cask:jdownloader": ["download manager"],
  "cask:audacity": ["audio editor"],
  "cask:capcut": ["cap cut", "video editor"],
  "cask:blackhole-2ch": ["blackhole", "black hole", "audio loopback"],
  "cask:background-music": ["volume control"],
  "cask:sketch": ["sketch app"],
  "cask:imageoptim": ["image optimizer", "compress images"],
  "cask:shottr": ["screenshot", "screen capture"],
  "cask:bitwarden": ["bit warden"],
  "cask:keepassxc": ["keepass"],
  "cask:protonvpn": ["proton vpn"],
  "cask:mullvad-vpn": ["mullvad"],
  "cask:warp": ["warp terminal"],
  "cask:parallels": ["parallels desktop", "windows on mac"],
  "cask:utm": ["virtual machine", "vm"],
  "cask:onyx": ["system maintenance"],
  "cask:aldente": ["al dente", "battery limiter", "battery"],
  "cask:monitorcontrol": ["monitor control", "brightness"],
  "cask:flux-app": ["f.lux", "flux", "night shift", "blue light"],
  "cask:linearmouse": ["linear mouse", "mouse acceleration"],
  "cask:hammerspoon": ["automation"],
  "cask:bettertouchtool": ["btt", "trackpad gestures"],
  "cask:flycut": ["clipboard history"],
  "cask:numi": ["calculator"],
  "formula:ripgrep": ["rg", "rip grep"],
  "formula:neovim": ["nvim", "vim"],
  "formula:gh": ["github cli"],
  "formula:tmux": ["terminal multiplexer"],
  "formula:starship": ["shell prompt"],
  "formula:fzf": ["fuzzy finder"],
  "formula:bat": ["cat clone"],
  "formula:eza": ["ls replacement", "exa"],
  "formula:uv": ["python package manager", "pip replacement"],
  "formula:jq": ["json processor"],
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
      { kind: "cask", token: "orion" },
      { kind: "cask", token: "safari-technology-preview" },
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
      { kind: "cask", token: "microsoft-teams" },
      { kind: "cask", token: "telegram" },
      { kind: "cask", token: "whatsapp" },
      { kind: "cask", token: "signal" },
      { kind: "cask", token: "thunderbird" },
    ],
  },
  {
    id: "ai",
    label: "AI Assistants",
    description: "Chat with AI models on your Mac.",
    apps: [
      { kind: "cask", token: "chatgpt" },
      { kind: "cask", token: "claude" },
      { kind: "cask", token: "ollama-app" },
    ],
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Notes, tasks, launchers, and window tools.",
    apps: [
      { kind: "cask", token: "notion" },
      { kind: "cask", token: "obsidian" },
      { kind: "cask", token: "typora" },
      { kind: "cask", token: "ticktick" },
      { kind: "cask", token: "todoist-app" },
      { kind: "cask", token: "linear" },
      { kind: "cask", token: "raycast" },
      { kind: "cask", token: "alfred" },
      { kind: "cask", token: "rectangle" },
      { kind: "cask", token: "maccy" },
    ],
  },
  {
    id: "office",
    label: "Office & Study",
    description: "Documents, reading, and flashcards.",
    apps: [
      { kind: "cask", token: "microsoft-office" },
      { kind: "cask", token: "libreoffice" },
      { kind: "cask", token: "skim" },
      { kind: "cask", token: "calibre" },
      { kind: "cask", token: "anki" },
    ],
  },
  {
    id: "files",
    label: "Files & Cloud",
    description: "Sync files and download large ones.",
    apps: [
      { kind: "cask", token: "google-drive" },
      { kind: "cask", token: "dropbox" },
      { kind: "cask", token: "onedrive" },
      { kind: "cask", token: "transmission" },
      { kind: "cask", token: "jdownloader" },
    ],
  },
  {
    id: "media",
    label: "Media",
    description: "Music, video, recording, and playback.",
    apps: [
      { kind: "cask", token: "spotify" },
      { kind: "cask", token: "vlc" },
      { kind: "cask", token: "iina" },
      { kind: "cask", token: "audacity" },
      { kind: "cask", token: "handbrake-app" },
      { kind: "cask", token: "capcut" },
      { kind: "cask", token: "obs" },
      { kind: "cask", token: "blackhole-2ch" },
      { kind: "cask", token: "background-music" },
    ],
  },
  {
    id: "design",
    label: "Design",
    description: "Drawing, 3D, and visual work.",
    apps: [
      { kind: "cask", token: "figma" },
      { kind: "cask", token: "sketch" },
      { kind: "cask", token: "imageoptim" },
      { kind: "cask", token: "blender" },
      { kind: "cask", token: "inkscape" },
      { kind: "cask", token: "gimp" },
      { kind: "cask", token: "krita" },
    ],
  },
  {
    id: "security",
    label: "Security & Privacy",
    description: "Passwords and VPNs.",
    apps: [
      { kind: "cask", token: "1password" },
      { kind: "cask", token: "bitwarden" },
      { kind: "cask", token: "keepassxc" },
      { kind: "cask", token: "protonvpn" },
      { kind: "cask", token: "mullvad-vpn" },
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
      { kind: "cask", token: "sublime-text" },
      { kind: "cask", token: "iterm2" },
      { kind: "cask", token: "ghostty" },
      { kind: "cask", token: "warp" },
      { kind: "cask", token: "docker-desktop" },
      { kind: "cask", token: "orbstack" },
      { kind: "cask", token: "github" },
      { kind: "cask", token: "postman" },
      { kind: "cask", token: "tableplus" },
      { kind: "cask", token: "dbeaver-community" },
      { kind: "cask", token: "proxyman" },
    ],
  },
  {
    id: "cli",
    label: "Command Line",
    description: "Terminal tools for developers and tinkerers.",
    apps: [
      { kind: "formula", token: "git" },
      { kind: "formula", token: "gh" },
      { kind: "formula", token: "node" },
      { kind: "formula", token: "uv" },
      { kind: "formula", token: "neovim" },
      { kind: "formula", token: "tmux" },
      { kind: "formula", token: "starship" },
      { kind: "formula", token: "fzf" },
      { kind: "formula", token: "bat" },
      { kind: "formula", token: "eza" },
      { kind: "formula", token: "jq" },
      { kind: "formula", token: "ripgrep" },
      { kind: "formula", token: "wget" },
      { kind: "formula", token: "ffmpeg" },
      { kind: "formula", token: "ollama" },
    ],
  },
  {
    id: "utilities",
    label: "Utilities",
    description: "System tools, tweaks, and everyday helpers.",
    apps: [
      { kind: "cask", token: "the-unarchiver" },
      { kind: "cask", token: "keka" },
      { kind: "cask", token: "shottr" },
      { kind: "cask", token: "appcleaner" },
      { kind: "cask", token: "onyx" },
      { kind: "cask", token: "aldente" },
      { kind: "cask", token: "monitorcontrol" },
      { kind: "cask", token: "flux-app" },
      { kind: "cask", token: "linearmouse" },
      { kind: "cask", token: "hammerspoon" },
      { kind: "cask", token: "bettertouchtool" },
      { kind: "cask", token: "stats" },
      { kind: "cask", token: "hiddenbar" },
      { kind: "cask", token: "flycut" },
      { kind: "cask", token: "numi" },
      { kind: "cask", token: "parallels" },
      { kind: "cask", token: "utm" },
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
