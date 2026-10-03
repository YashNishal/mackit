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
  "cask:microsoft-office": ["office", "office suite"],
  "cask:microsoft-word": ["word", "docx"],
  "cask:microsoft-excel": ["excel", "spreadsheet"],
  "cask:microsoft-powerpoint": ["powerpoint", "ppt", "slides"],
  "cask:adobe-acrobat-reader": ["acrobat", "adobe reader", "pdf reader", "pdf"],
  "cask:onlyoffice": ["only office"],
  "cask:zotero": ["citations", "bibliography"],
  "cask:notion-calendar": ["calendar", "cron"],
  "cask:grammarly-desktop": ["grammarly", "spell check"],
  "cask:loom": ["screen recorder", "video message"],
  "cask:perplexity": ["perplexity ai"],
  "cask:lm-studio": ["lmstudio", "local ai", "local llm"],
  "cask:plex": ["media server"],
  "cask:canva": ["graphic design"],
  "cask:affinity": ["affinity photo", "affinity designer", "photoshop alternative"],
  "cask:steam": ["games", "valve"],
  "cask:epic-games": ["epic", "fortnite", "epic games launcher"],
  "cask:battle-net": ["battlenet", "blizzard", "warcraft"],
  "cask:gog-galaxy": ["gog"],
  "cask:crossover": ["windows games", "wine"],
  "cask:proton-drive": ["proton"],
  "cask:proton-pass": ["proton", "password manager"],
  "cask:localsend": ["local send", "airdrop", "share files"],
  "cask:nordvpn": ["nord vpn", "nord"],
  "cask:malwarebytes": ["antivirus", "malware"],
  "cask:alt-tab": ["alttab", "window switcher"],
  "cask:jordanbaird-ice": ["ice", "menu bar", "hide menu bar icons"],
  "cask:mos": ["smooth scrolling", "scroll direction"],
  "cask:logi-options+": ["logitech", "logi options", "mouse settings"],
  "cask:keepingyouawake": ["caffeine", "amphetamine", "stay awake"],
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
  "cask:appcleaner": ["uninstaller", "uninstall apps"],
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
    description: "Pick a web browser, or a few.",
    apps: [
      { kind: "cask", token: "google-chrome" },
      { kind: "cask", token: "firefox" },
      { kind: "cask", token: "brave-browser" },
      { kind: "cask", token: "microsoft-edge" },
      { kind: "cask", token: "arc" },
      { kind: "cask", token: "zen" },
      { kind: "cask", token: "opera" },
      { kind: "cask", token: "vivaldi" },
    ],
  },
  {
    id: "communication",
    label: "Messaging & Calls",
    description: "Chat, video calls, and email.",
    apps: [
      { kind: "cask", token: "whatsapp" },
      { kind: "cask", token: "zoom" },
      { kind: "cask", token: "slack" },
      { kind: "cask", token: "discord" },
      { kind: "cask", token: "microsoft-teams" },
      { kind: "cask", token: "telegram" },
      { kind: "cask", token: "signal" },
      { kind: "cask", token: "thunderbird" },
    ],
  },
  {
    id: "productivity",
    label: "Productivity",
    description: "Notes, to-dos, calendars, and writing help.",
    apps: [
      { kind: "cask", token: "notion" },
      { kind: "cask", token: "obsidian" },
      { kind: "cask", token: "todoist-app" },
      { kind: "cask", token: "ticktick" },
      { kind: "cask", token: "notion-calendar" },
      { kind: "cask", token: "grammarly-desktop" },
      { kind: "cask", token: "raycast" },
      { kind: "cask", token: "loom" },
    ],
  },
  {
    id: "office",
    label: "Office & School",
    description: "Documents, PDFs, research, and studying.",
    apps: [
      { kind: "cask", token: "microsoft-word" },
      { kind: "cask", token: "microsoft-excel" },
      { kind: "cask", token: "microsoft-powerpoint" },
      { kind: "cask", token: "libreoffice" },
      { kind: "cask", token: "onlyoffice" },
      { kind: "cask", token: "adobe-acrobat-reader" },
      { kind: "cask", token: "zotero" },
      { kind: "cask", token: "anki" },
      { kind: "cask", token: "calibre" },
    ],
  },
  {
    id: "ai",
    label: "AI Assistants",
    description: "Chat with AI on your Mac.",
    apps: [
      { kind: "cask", token: "chatgpt" },
      { kind: "cask", token: "claude" },
      { kind: "cask", token: "perplexity" },
      { kind: "cask", token: "lm-studio" },
    ],
  },
  {
    id: "media",
    label: "Music & Video",
    description: "Listen, watch, record, and edit.",
    apps: [
      { kind: "cask", token: "spotify" },
      { kind: "cask", token: "vlc" },
      { kind: "cask", token: "iina" },
      { kind: "cask", token: "plex" },
      { kind: "cask", token: "obs" },
      { kind: "cask", token: "capcut" },
      { kind: "cask", token: "handbrake-app" },
      { kind: "cask", token: "audacity" },
    ],
  },
  {
    id: "design",
    label: "Photo & Design",
    description: "Edit photos, make graphics, and design.",
    apps: [
      { kind: "cask", token: "canva" },
      { kind: "cask", token: "figma" },
      { kind: "cask", token: "affinity" },
      { kind: "cask", token: "gimp" },
      { kind: "cask", token: "krita" },
      { kind: "cask", token: "inkscape" },
      { kind: "cask", token: "blender" },
      { kind: "cask", token: "imageoptim" },
    ],
  },
  {
    id: "gaming",
    label: "Gaming",
    description: "Game stores, launchers, and Windows games.",
    apps: [
      { kind: "cask", token: "steam" },
      { kind: "cask", token: "epic-games" },
      { kind: "cask", token: "minecraft" },
      { kind: "cask", token: "roblox" },
      { kind: "cask", token: "battle-net" },
      { kind: "cask", token: "gog-galaxy" },
      { kind: "cask", token: "crossover" },
    ],
  },
  {
    id: "files",
    label: "Files & Sharing",
    description: "Cloud storage and sending files between devices.",
    apps: [
      { kind: "cask", token: "google-drive" },
      { kind: "cask", token: "dropbox" },
      { kind: "cask", token: "onedrive" },
      { kind: "cask", token: "proton-drive" },
      { kind: "cask", token: "localsend" },
      { kind: "cask", token: "transmission" },
    ],
  },
  {
    id: "security",
    label: "Passwords & Privacy",
    description: "Password managers, VPNs, and malware scans.",
    apps: [
      { kind: "cask", token: "1password" },
      { kind: "cask", token: "bitwarden" },
      { kind: "cask", token: "proton-pass" },
      { kind: "cask", token: "protonvpn" },
      { kind: "cask", token: "nordvpn" },
      { kind: "cask", token: "mullvad-vpn" },
      { kind: "cask", token: "malwarebytes" },
    ],
  },
  {
    id: "utilities",
    label: "Mac Helpers",
    description: "Small apps that make a Mac nicer to use.",
    apps: [
      { kind: "cask", token: "the-unarchiver" },
      { kind: "cask", token: "keka" },
      { kind: "cask", token: "appcleaner" },
      { kind: "cask", token: "rectangle" },
      { kind: "cask", token: "maccy" },
      { kind: "cask", token: "shottr" },
      { kind: "cask", token: "alt-tab" },
      { kind: "cask", token: "jordanbaird-ice" },
      { kind: "cask", token: "stats" },
      { kind: "cask", token: "aldente" },
      { kind: "cask", token: "monitorcontrol" },
      { kind: "cask", token: "mos" },
      { kind: "cask", token: "logi-options+" },
      { kind: "cask", token: "keepingyouawake" },
      { kind: "cask", token: "parallels" },
    ],
  },
  {
    id: "development",
    label: "For Developers",
    description: "Code editors, terminals, and the basics for coding.",
    apps: [
      { kind: "cask", token: "visual-studio-code" },
      { kind: "cask", token: "cursor" },
      { kind: "cask", token: "zed" },
      { kind: "cask", token: "ghostty" },
      { kind: "cask", token: "iterm2" },
      { kind: "cask", token: "warp" },
      { kind: "cask", token: "docker-desktop" },
      { kind: "cask", token: "github" },
      { kind: "cask", token: "postman" },
      { kind: "formula", token: "git" },
      { kind: "formula", token: "node" },
      { kind: "formula", token: "gh" },
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

  for (const bundle of BUNDLES) {
    for (const app of bundle.apps) {
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

export interface BundleDefinition {
  id: string;
  label: string;
  description: string;
  apps: CuratedApp[];
}

export const BUNDLES: BundleDefinition[] = [
  {
    id: "everyday",
    label: "Everyday Essentials",
    description: "A browser, calls, music, and handy Mac helpers.",
    apps: [
      { kind: "cask", token: "google-chrome" },
      { kind: "cask", token: "whatsapp" },
      { kind: "cask", token: "zoom" },
      { kind: "cask", token: "spotify" },
      { kind: "cask", token: "vlc" },
      { kind: "cask", token: "bitwarden" },
      { kind: "cask", token: "the-unarchiver" },
      { kind: "cask", token: "appcleaner" },
      { kind: "cask", token: "rectangle" },
    ],
  },
  {
    id: "student",
    label: "Student",
    description: "Classes, essays, slides, research, and flashcards.",
    apps: [
      { kind: "cask", token: "google-chrome" },
      { kind: "cask", token: "zoom" },
      { kind: "cask", token: "notion" },
      { kind: "cask", token: "microsoft-word" },
      { kind: "cask", token: "microsoft-powerpoint" },
      { kind: "cask", token: "adobe-acrobat-reader" },
      { kind: "cask", token: "zotero" },
      { kind: "cask", token: "anki" },
      { kind: "cask", token: "chatgpt" },
    ],
  },
  {
    id: "remote-work",
    label: "Work From Home",
    description: "Meetings, team chat, notes, and screen recording.",
    apps: [
      { kind: "cask", token: "google-chrome" },
      { kind: "cask", token: "slack" },
      { kind: "cask", token: "zoom" },
      { kind: "cask", token: "microsoft-teams" },
      { kind: "cask", token: "notion" },
      { kind: "cask", token: "notion-calendar" },
      { kind: "cask", token: "1password" },
      { kind: "cask", token: "loom" },
      { kind: "cask", token: "shottr" },
    ],
  },
  {
    id: "creator",
    label: "Content Creator",
    description: "Record, edit, and make thumbnails.",
    apps: [
      { kind: "cask", token: "obs" },
      { kind: "cask", token: "capcut" },
      { kind: "cask", token: "audacity" },
      { kind: "cask", token: "handbrake-app" },
      { kind: "cask", token: "canva" },
      { kind: "cask", token: "imageoptim" },
      { kind: "cask", token: "iina" },
    ],
  },
  {
    id: "design",
    label: "Designer",
    description: "Design, illustration, and 3D tools.",
    apps: [
      { kind: "cask", token: "figma" },
      { kind: "cask", token: "canva" },
      { kind: "cask", token: "affinity" },
      { kind: "cask", token: "inkscape" },
      { kind: "cask", token: "krita" },
      { kind: "cask", token: "blender" },
      { kind: "cask", token: "imageoptim" },
    ],
  },
  {
    id: "gamer",
    label: "Gamer",
    description: "Game stores, voice chat, and streaming.",
    apps: [
      { kind: "cask", token: "steam" },
      { kind: "cask", token: "epic-games" },
      { kind: "cask", token: "battle-net" },
      { kind: "cask", token: "minecraft" },
      { kind: "cask", token: "discord" },
      { kind: "cask", token: "obs" },
    ],
  },
  {
    id: "ai-starter",
    label: "AI Starter",
    description: "The popular AI chat apps, plus LM Studio for offline models.",
    apps: [
      { kind: "cask", token: "chatgpt" },
      { kind: "cask", token: "claude" },
      { kind: "cask", token: "perplexity" },
      { kind: "cask", token: "lm-studio" },
    ],
  },
  {
    id: "web-dev",
    label: "Developer",
    description: "Editor, terminal, containers, and Git tooling.",
    apps: [
      { kind: "cask", token: "visual-studio-code" },
      { kind: "cask", token: "ghostty" },
      { kind: "cask", token: "docker-desktop" },
      { kind: "cask", token: "github" },
      { kind: "cask", token: "postman" },
      { kind: "formula", token: "git" },
      { kind: "formula", token: "gh" },
      { kind: "formula", token: "node" },
    ],
  },
];

export type ResolvedBundle = ResolvedCategory;

function resolveGroups(
  groups: { id: string; label: string; description: string; apps: CuratedApp[] }[],
  packagesById: Map<string, CatalogPackage>,
): ResolvedCategory[] {
  return groups
    .map((group) => {
      const seen = new Set<string>();
      const packages: CatalogPackage[] = [];

      for (const app of group.apps) {
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
        id: group.id,
        label: group.label,
        description: group.description,
        packages,
      };
    })
    .filter((group) => group.packages.length > 0);
}

export function resolveCategories(
  packagesById: Map<string, CatalogPackage>,
): ResolvedCategory[] {
  return resolveGroups(CATEGORIES, packagesById);
}

export function resolveBundles(
  packagesById: Map<string, CatalogPackage>,
): ResolvedBundle[] {
  return resolveGroups(BUNDLES, packagesById);
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
