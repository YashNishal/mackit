"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SiteFooter } from "@/components/mackit/site-footer";
import { SiteHeader } from "@/components/mackit/site-header";
import { TechnicalDetails } from "@/components/mackit/technical-details";
import { useMode } from "@/components/mode-provider";

const RetroHowItWorksLoader = dynamic(
  () => import("@/components/retro/how-it-works").then((mod) => ({ default: mod.RetroHowItWorks })),
  {
    ssr: false,
    loading: () => (
      <div className="retro-window mx-auto mt-6 w-full max-w-2xl p-4 font-mono text-[13px]">
        Loading retro mode…
      </div>
    ),
  },
);

const STEPS = [
  {
    title: "Pick your apps",
    body: "Search thousands of apps or browse the categories. Everything you pick collects in the Dock, which is saved only in this browser.",
  },
  {
    title: "Copy one command",
    body: "It downloads MacKit’s installer, checks its checksum, and installs only the apps you picked.",
  },
  {
    title: "Paste it into Terminal",
    body: "Each app downloads and installs on its own, and you get a summary at the end. If your Mac needs a helper tool first, the installer explains what it is and asks before adding it.",
  },
] as const;

function ModernHowItWorks() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-12 pb-20 sm:px-6 sm:pt-16">
        <h1 className="font-display max-w-[16ch] text-[2.5rem] leading-[1.05] font-bold tracking-[-0.03em] text-balance sm:text-6xl">
          Three steps, then Terminal.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[17px] leading-7 text-pretty text-muted-foreground">
          MacKit is a shopping list for your Mac. You pick apps in the
          browser, and one command installs all of them.
        </p>
        <ol className="mt-12 grid max-w-3xl gap-8 border-t pt-10">
          {STEPS.map((step, index) => (
            <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-x-4">
              <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background tabular-nums">
                {index + 1}
              </span>
              <div>
                <h2 className="pt-1 text-[17px] font-semibold tracking-[-0.01em]">
                  {step.title}
                </h2>
                <p className="mt-1.5 max-w-[60ch] leading-7 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-12 max-w-3xl border-t pt-8 leading-7 text-muted-foreground">
          To share a setup, copy its link from the Dock. The link holds the
          app list itself, so nothing is saved on a server.
        </p>
        <TechnicalDetails label="Under the hood" className="mt-10 max-w-3xl border-t pt-8">
          <div className="max-w-[60ch] space-y-3 leading-7 text-muted-foreground">
            <p>
              MacKit is a front end for{" "}
              <a
                href="https://brew.sh"
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                Homebrew
              </a>
              , the open-source package manager for macOS. Apps are Homebrew
              casks and command-line tools are formulae.
            </p>
            <p>
              The installer runs{" "}
              <code className="font-mono text-[13px] text-foreground">brew install</code>{" "}
              for each package in your list. If Homebrew is missing, it asks
              before running Homebrew’s official installer. Everything MacKit
              installs is a normal Homebrew package, so{" "}
              <code className="font-mono text-[13px] text-foreground">brew upgrade</code>{" "}
              and{" "}
              <code className="font-mono text-[13px] text-foreground">brew uninstall</code>{" "}
              work as usual.
            </p>
            <p>
              Any app’s details show its Homebrew ID and the manual install
              command.
            </p>
          </div>
        </TechnicalDetails>
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

export function HowShell() {
  const { mode } = useMode();
  const mounted = useSyncExternalStore(subscribe, clientTrue, serverFalse);

  if (!mounted || mode === "modern") {
    return <ModernHowItWorks />;
  }

  return <RetroHowItWorksLoader />;
}
