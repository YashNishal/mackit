"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { brewInstallSnippet } from "@/components/mackit/package-details-dialog";
import { PackageIcon } from "@/components/mackit/package-icon";
import { TechnicalDetails } from "@/components/mackit/technical-details";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CatalogPackage } from "@/lib/catalog/types";
import { buildInstallCommand } from "@/lib/installer/command";
import { encodeManifest } from "@/lib/installer/manifest";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="grid min-w-0 grid-cols-[1.5rem_1fr] gap-x-3">
      <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background tabular-nums">
        {n}
      </span>
      <div className="min-w-0">
        <p className="pt-0.5 font-medium">{title}</p>
        <div className="mt-1 text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

export function CheckoutDialog({
  open,
  onOpenChange,
  items,
  sha256,
  runnerSource,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CatalogPackage[];
  sha256: string;
  runnerSource: string;
}) {
  const [copied, setCopied] = useState(false);
  const command = useMemo(() => {
    if (!open || typeof window === "undefined") {
      return "";
    }

    return buildInstallCommand({
      origin: window.location.origin,
      ids: items.map((item) => item.id),
      sha256,
    });
  }, [open, items, sha256]);
  const manifest = useMemo(
    () => encodeManifest(items.map((item) => item.id)),
    [items],
  );

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast.success("Command copied. Paste it in Terminal.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard is blocked. Select the command and copy it manually.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-0 overflow-x-hidden overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-lg font-semibold">Install {items.length === 1 ? "1 app" : `${items.length} apps`}</DialogTitle>
          <DialogDescription>
            Browsers can’t install apps, so the last step happens in
            Terminal.
          </DialogDescription>
        </DialogHeader>

        <ol className="grid min-w-0 gap-5 text-sm">
          <Step n={1} title="Open Terminal">
            Press{" "}
            <kbd className="rounded-[5px] border bg-card px-1.5 py-px font-mono text-xs shadow-2xs">⌘ Command</kbd>
            {" + "}
            <kbd className="rounded-[5px] border bg-card px-1.5 py-px font-mono text-xs shadow-2xs">Space</kbd>
            , type Terminal, then press Return.
          </Step>
          <Step n={2} title="Copy this command">
            <div className="terminal-preview mt-2 min-w-0 overflow-hidden rounded-[12px] ring-1 ring-black/10">
              <div className="flex items-center gap-3 border-b border-white/10 px-3 py-2">
                <span aria-hidden="true" className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                </span>
                <span className="flex-1 text-center text-[11px] text-white/50">Terminal</span>
                <Button size="sm" onClick={copyCommand} className="h-7 rounded-[7px] px-2.5">
                  {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
                  {copied ? "Copied" : "Copy command"}
                </Button>
              </div>
              <pre className="max-h-40 max-w-full overflow-auto p-3 font-mono text-[11px] leading-5 wrap-anywhere whitespace-pre-wrap">
                <span className="text-white/40 select-none">% </span>
                {command}
              </pre>
            </div>
          </Step>
          <Step n={3} title="Paste, press Return, and confirm">
            If your Mac needs a helper tool first, the installer explains
            what it is and asks before adding it. It may ask for your Mac password. If an app
            fails, the rest still install. When it finishes you’ll see a
            summary like this:
            <pre className="mt-2 max-w-full overflow-x-auto rounded-[10px] border bg-muted/50 p-3 font-mono text-[11px] leading-5 text-foreground wrap-anywhere whitespace-pre-wrap">
{`MacKit summary
  Installed: 1
  Skipped:   1   (already installed)
  Failed:    1`}
            </pre>
          </Step>
        </ol>

        <div className="min-w-0 border-t pt-4">
          <p className="text-sm font-medium">
            {items.length === 1 ? "1 app" : `${items.length} apps`} will install
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {items.map((item) => (
              <li
                key={item.id}
                className="inline-flex min-w-0 items-center gap-2 rounded-[10px] bg-muted/70 py-1 pr-2.5 pl-1 text-[13px]"
              >
                <PackageIcon pkg={item} size="sm" />
                <span className="max-w-40 truncate">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <TechnicalDetails>
          <Tabs defaultValue="details" className="min-w-0">
            <TabsList>
              <TabsTrigger value="details">What runs</TabsTrigger>
              <TabsTrigger value="packages">Package IDs</TabsTrigger>
              <TabsTrigger value="script">Installer script</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-2 text-sm text-muted-foreground">
              <p>
                MacKit installs apps with Homebrew, the open-source package
                manager for macOS. The command downloads MacKit’s versioned
                installer, checks its SHA-256 checksum, then runs{" "}
                <code className="font-mono text-[12px] text-foreground">brew install</code>{" "}
                for each package in your list.
              </p>
              <p>
                If Homebrew isn’t on this Mac yet, the installer asks before
                running the{" "}
                <a
                  className="text-foreground underline underline-offset-4"
                  href="https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh"
                  target="_blank"
                  rel="noreferrer"
                >
                  official Homebrew installer
                </a>
                .
              </p>
              <p>
                MacKit does not receive your app list, machine details, or
                install results.
              </p>
            </TabsContent>
            <TabsContent value="packages" className="rounded-[12px] border bg-card p-3">
              <ul className="space-y-1 text-sm">
                {items.map((item) => (
                  <li key={item.id} className="flex min-w-0 justify-between gap-3">
                    <span className="min-w-0 truncate">{item.name}</span>
                    <code className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {brewInstallSnippet(item)}
                    </code>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="script" className="min-w-0">
              <p className="mb-2 text-sm text-muted-foreground">
                Installer SHA-256:{" "}
                <code className="font-mono text-[11px] wrap-anywhere">{sha256}</code>
              </p>
              <ScrollArea className="h-56 min-w-0 rounded-[12px] border bg-card">
                <pre className="max-w-full p-3 font-mono text-[11px] leading-5 wrap-anywhere whitespace-pre-wrap">
                  {runnerSource}
                </pre>
              </ScrollArea>
              <p className="mt-2 max-w-full font-mono text-[11px] text-muted-foreground wrap-anywhere whitespace-pre-wrap">
                {manifest}
              </p>
            </TabsContent>
          </Tabs>
        </TechnicalDetails>
      </DialogContent>
    </Dialog>
  );
}
