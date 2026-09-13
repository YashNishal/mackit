"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { MacKitApp } from "@/components/mackit/mackit-app";
import { useMode } from "@/components/mode-provider";
import type { ResolvedBundle, ResolvedCategory } from "@/data/categories";
import type { InstallerMeta } from "@/lib/installer/command";

const RetroAppLoader = dynamic(
  () => import("@/components/retro/retro-app").then((mod) => ({ default: mod.RetroApp })),
  {
    ssr: false,
    loading: () => (
      <div className="retro-window mx-auto mt-6 w-full max-w-6xl p-4 font-mono text-[13px]">
        Loading retro mode…
      </div>
    ),
  },
);

export interface CatalogShellProps {
  featured: ResolvedCategory[];
  bundles: ResolvedBundle[];
  generatedAt: string;
  installer: InstallerMeta;
  runnerSource: string;
}

function subscribe() {
  return () => {};
}

function clientTrue() {
  return true;
}

function serverFalse() {
  return false;
}

export function CatalogShell(props: CatalogShellProps) {
  const { mode } = useMode();
  const mounted = useSyncExternalStore(subscribe, clientTrue, serverFalse);

  if (!mounted || mode === "modern") {
    return <MacKitApp {...props} />;
  }

  return <RetroAppLoader {...props} />;
}
