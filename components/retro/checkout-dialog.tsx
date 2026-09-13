"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CatalogPackage } from "@/lib/catalog/types";
import { buildInstallCommand } from "@/lib/installer/command";
import { encodeManifest } from "@/lib/installer/manifest";

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
      <DialogContent showCloseButton={false} className="max-h-[90vh] overflow-y-auto border-2 border-foreground bg-background p-0 shadow-[6px_6px_0_0_var(--foreground)] sm:max-w-2xl">
        <div className="flex items-center gap-2 border-b-2 border-foreground px-2 py-1">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="flex size-4 shrink-0 items-center justify-center border-2 border-foreground bg-background text-[11px] leading-none hover:bg-foreground hover:text-background"
          >
            <span aria-hidden="true">×</span>
          </button>
          <span aria-hidden="true" className="retro-stripes h-3 flex-1" />
          <span className="bg-background px-2 text-[13px] font-bold">Install on this Mac</span>
          <span aria-hidden="true" className="retro-stripes h-3 flex-1" />
        </div>

        <div className="space-y-3 p-4">
          <DialogHeader>
            <DialogTitle className="text-left text-[15px] font-bold">Install on this Mac</DialogTitle>
            <DialogDescription className="text-left text-[13px]">
              MacKit cannot install apps from the browser. Copy one command, paste
              it in Terminal, and confirm when asked.
            </DialogDescription>
          </DialogHeader>

          <ol className="grid gap-3 text-[13px]">
            <li className="border-2 border-foreground p-3">
              <p className="font-bold">1. Open Terminal</p>
              <p className="mt-1">
                Press <kbd className="border border-foreground px-1 font-mono text-xs">Command</kbd>
                {" + "}
                <kbd className="border border-foreground px-1 font-mono text-xs">Space</kbd>
                , type Terminal, then press Return.
              </p>
            </li>
            <li className="border-2 border-foreground p-3">
              <p className="font-bold">2. Copy this command</p>
              <div className="mt-2 overflow-hidden border-2 border-foreground">
                <pre className="terminal-preview max-h-40 overflow-auto p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap">
                  {command}
                </pre>
              </div>
              <Button className="retro-btn-default mt-2" onClick={copyCommand}>
                {copied ? "Copied" : "Copy command"}
              </Button>
            </li>
            <li className="border-2 border-foreground p-3">
              <p className="font-bold">3. Paste, press Return, and confirm</p>
              <p className="mt-1">
                If extra tools are needed first, the script explains and asks
                before continuing. It may request your Mac password. Failed apps
                are skipped so the rest can still install.
              </p>
            </li>
          </ol>

          <div className="overflow-hidden border-2 border-foreground">
            <div className="terminal-preview flex items-center gap-2 border-b border-background/30 px-3 py-2 font-mono text-[11px]">
              <span>Expected installer stages</span>
            </div>
            <pre className="terminal-preview border-t border-white/10 p-3 font-mono text-[11px] leading-5">
{`MacKit: Using /opt/homebrew/bin/brew on arm64 macOS 15.x
MacKit: Installed visual-studio-code
MacKit: Skipped wget (already installed)
MacKit: Failed some-app
MacKit summary
  Installed: 1
  Skipped:   1
  Failed:    1`}
            </pre>
          </div>

          <Tabs defaultValue="packages">
            <TabsList className="border-2 border-foreground">
              <TabsTrigger value="packages">Packages</TabsTrigger>
              <TabsTrigger value="script">Installer script</TabsTrigger>
              <TabsTrigger value="details">What will happen</TabsTrigger>
            </TabsList>
            <TabsContent value="packages" className="border-2 border-foreground p-3">
              <ul className="space-y-1 text-[13px]">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-3 border-b border-foreground/20 pb-1 last:border-0">
                    <span className="font-bold">{item.name}</span>
                    <code className="font-mono text-[11px]">
                      {item.id}
                    </code>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="script">
              <p className="mb-2 text-[13px]">
                Runner SHA-256: <code className="font-mono text-[11px] break-all">{sha256}</code>
              </p>
              <ScrollArea className="h-56 border-2 border-foreground">
                <pre className="p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap">
                  {runnerSource}
                </pre>
              </ScrollArea>
              <p className="mt-2 font-mono text-[11px] whitespace-pre-wrap break-all">
                {manifest}
              </p>
            </TabsContent>
            <TabsContent value="details" className="space-y-2 border-2 border-foreground p-3 text-[13px]">
              <p>
                The command downloads MacKit’s versioned runner, checks its checksum,
                then installs only the Homebrew tokens in this cart.
              </p>
              <p>
                Official Homebrew installer:{" "}
                <a
                  className="underline underline-offset-4"
                  href="https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh"
                  target="_blank"
                  rel="noreferrer"
                >
                  Homebrew install.sh
                </a>
              </p>
              <p>
                MacKit does not receive your cart, machine details, or install results.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
