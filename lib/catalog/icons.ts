import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Broom,
  ChartBar,
  CirclePlay,
  EyeOff,
  Globe,
  MessagesSquare,
  Search,
  Shrink,
  SquareStack,
  Terminal,
} from "lucide-react";
import type { IconType } from "react-icons";
import {
  Si1Password,
  SiArc,
  SiBlender,
  SiBrave,
  SiCursor,
  SiDiscord,
  SiDocker,
  SiFfmpeg,
  SiFigma,
  SiFirefoxbrowser,
  SiGhostty,
  SiGimp,
  SiGit,
  SiGithub,
  SiGooglechrome,
  SiHomebrew,
  SiInkscape,
  SiIterm2,
  SiKrita,
  SiNodedotjs,
  SiNotion,
  SiObsidian,
  SiObsstudio,
  SiRaycast,
  SiSignal,
  SiSpotify,
  SiTelegram,
  SiTodoist,
  SiVlcmediaplayer,
  SiWhatsapp,
  SiZedindustries,
  SiZenbrowser,
  SiZoom,
} from "react-icons/si";
import { TbBrandVscode } from "react-icons/tb";
import type { CatalogPackage } from "@/lib/catalog/types";

type PackageGlyph = LucideIcon | IconType;

const ICONS_BY_TOKEN: Record<string, PackageGlyph> = {
  "google-chrome": SiGooglechrome,
  firefox: SiFirefoxbrowser,
  "brave-browser": SiBrave,
  "microsoft-edge": Globe,
  arc: SiArc,
  zen: SiZenbrowser,
  slack: MessagesSquare,
  discord: SiDiscord,
  zoom: SiZoom,
  telegram: SiTelegram,
  whatsapp: SiWhatsapp,
  signal: SiSignal,
  "visual-studio-code": TbBrandVscode,
  cursor: SiCursor,
  zed: SiZedindustries,
  iterm2: SiIterm2,
  ghostty: SiGhostty,
  "docker-desktop": SiDocker,
  docker: SiDocker,
  github: SiGithub,
  git: SiGit,
  gh: SiGithub,
  node: SiNodedotjs,
  figma: SiFigma,
  blender: SiBlender,
  inkscape: SiInkscape,
  gimp: SiGimp,
  krita: SiKrita,
  notion: SiNotion,
  obsidian: SiObsidian,
  raycast: SiRaycast,
  rectangle: SquareStack,
  "1password": Si1Password,
  "todoist-app": SiTodoist,
  todoist: SiTodoist,
  spotify: SiSpotify,
  vlc: SiVlcmediaplayer,
  iina: CirclePlay,
  "handbrake-app": Shrink,
  obs: SiObsstudio,
  "the-unarchiver": Archive,
  appcleaner: Broom,
  stats: ChartBar,
  hiddenbar: EyeOff,
  keka: Archive,
  wget: Terminal,
  jq: Terminal,
  ripgrep: Search,
  ffmpeg: SiFfmpeg,
};

const BRAND_COLOR: Record<string, string> = {
  "google-chrome": "#4285F4",
  firefox: "#FF7139",
  "brave-browser": "#FB542B",
  "microsoft-edge": "#0078D7",
  slack: "#4A154B",
  discord: "#5865F2",
  zoom: "#2D8CFF",
  telegram: "#26A5E4",
  whatsapp: "#25D366",
  signal: "#3A76F0",
  "visual-studio-code": "#007ACC",
  figma: "#F24E1E",
  spotify: "#1DB954",
  "docker-desktop": "#2496ED",
  docker: "#2496ED",
  obsidian: "#7C3AED",
  blender: "#F5792A",
  "1password": "#1A56EC",
  raycast: "#FF6363",
};

export function iconForPackage(pkg: CatalogPackage): PackageGlyph {
  return (
    ICONS_BY_TOKEN[pkg.token] ??
    (pkg.kind === "formula" ? Terminal : SiHomebrew)
  );
}

export function iconColorForPackage(pkg: CatalogPackage): string | undefined {
  return BRAND_COLOR[pkg.token];
}
