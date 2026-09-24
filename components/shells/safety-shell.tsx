"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SiteFooter } from "@/components/mackit/site-footer";
import { SiteHeader } from "@/components/mackit/site-header";
import { useMode } from "@/components/mode-provider";

const RetroSafetyLoader = dynamic(
  () => import("@/components/retro/safety").then((mod) => ({ default: mod.RetroSafety })),
  {
    ssr: false,
    loading: () => (
      <div className="retro-window mx-auto mt-6 w-full max-w-2xl p-4 font-mono text-[13px]">
        Loading retro mode…
      </div>
    ),
  },
);

const GUARANTEES = [
  {
    title: "Your list stays with you",
    body: "The apps you pick never leave this browser. There are no accounts and no analytics.",
  },
  {
    title: "The installer is checked",
    body: "The command downloads a versioned installer and verifies its SHA-256 checksum before running it.",
  },
  {
    title: "Only app names go in",
    body: "The installer accepts a list of known app IDs and nothing else. It rejects flags, file paths, and extra commands.",
  },
  {
    title: "No sudo",
    body: "MacKit never runs commands as administrator. Your Mac may ask for your password while some apps install.",
  },
  {
    title: "You see it all first",
    body: "Checkout shows the installer’s source, its checksum, and every app before you copy anything.",
  },
] as const;

function ModernSafety() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
        <h1 className="font-display max-w-[16ch] text-[2.5rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
          Inspect before you paste.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[17px] leading-7 text-pretty text-muted-foreground">
          Installing software always takes some trust. MacKit is built so you
          can see exactly what will run before you run it.
        </p>
        <dl className="mt-12 grid max-w-3xl divide-y border-y">
          {GUARANTEES.map((item) => (
            <div key={item.title} className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
              <dt className="font-semibold">{item.title}</dt>
              <dd className="max-w-[60ch] leading-7 text-muted-foreground">{item.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-[60ch] leading-7 text-muted-foreground">
          Apps are installed with Homebrew, the open-source package manager
          for macOS, so you’re trusting this website and Homebrew. Read the
          command before you run it. If anything looks unexpected, don’t run
          it.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/85"
        >
          Browse apps
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
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

export function SafetyShell() {
  const { mode } = useMode();
  const mounted = useSyncExternalStore(subscribe, clientTrue, serverFalse);

  if (!mounted || mode === "modern") {
    return <ModernSafety />;
  }

  return <RetroSafetyLoader />;
}
