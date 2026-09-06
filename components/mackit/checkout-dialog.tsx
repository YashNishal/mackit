"use client";

import { Check, Copy, Terminal } from "lucide-react";
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Install on this Mac</DialogTitle>
          <DialogDescription>
            MacKit cannot install apps from the browser. Copy one command, paste
            it in Terminal, and review Homebrew’s prompts.
          </DialogDescription>
        </DialogHeader>

        <ol className="grid gap-3 text-sm">
          <li className="rounded-xl border bg-muted/40 p-3">
            <p className="font-medium">1. Open Terminal</p>
            <p className="mt-1 text-muted-foreground">
              Press <kbd className="rounded border bg-background px-1 font-mono text-xs">Command</kbd>
              {" + "}
              <kbd className="rounded border bg-background px-1 font-mono text-xs">Space</kbd>
              , type Terminal, then press Return.
            </p>
          </li>
          <li className="rounded-xl border bg-muted/40 p-3">
            <p className="font-medium">2. Copy this command</p>
            <div className="mt-2 overflow-hidden rounded-xl">
              <pre className="terminal-preview max-h-40 overflow-auto p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap">
                {command}
              </pre>
            </div>
            <Button className="mt-2" onClick={copyCommand}>
              {copied ? <Check data-icon="inline-start" /> : <Copy data-icon="inline-start" />}
              {copied ? "Copied" : "Copy command"}
            </Button>
          </li>
          <li className="rounded-xl border bg-muted/40 p-3">
            <p className="font-medium">3. Paste, press Return, and confirm</p>
            <p className="mt-1 text-muted-foreground">
              If Homebrew is missing, the script explains what it will install
              and asks before continuing. It may request your Mac password.
              Failed apps are skipped so the rest can still install.
            </p>
          </li>
        </ol>

        <div className="overflow-hidden rounded-xl border">
          <div className="terminal-preview flex items-center gap-2 px-3 py-2 font-mono text-[11px]">
            <Terminal className="size-3.5" />
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
          <TabsList>
            <TabsTrigger value="packages">Packages</TabsTrigger>
            <TabsTrigger value="script">Installer script</TabsTrigger>
            <TabsTrigger value="details">What will happen</TabsTrigger>
          </TabsList>
          <TabsContent value="packages" className="rounded-xl border p-3">
            <ul className="space-y-1 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3">
                  <span>{item.name}</span>
                  <code className="font-mono text-[11px] text-muted-foreground">
                    {item.id}
                  </code>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="script">
            <p className="mb-2 text-sm text-muted-foreground">
              Runner SHA-256: <code className="font-mono text-[11px]">{sha256}</code>
            </p>
            <ScrollArea className="h-56 rounded-xl border">
              <pre className="p-3 font-mono text-[11px] leading-5 whitespace-pre-wrap">
                {runnerSource}
              </pre>
            </ScrollArea>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap">
              {manifest}
            </p>
          </TabsContent>
          <TabsContent value="details" className="space-y-2 text-sm text-muted-foreground">
            <p>
              The command downloads MacKit’s versioned runner, checks its checksum,
              then installs only the Homebrew tokens in this cart.
            </p>
            <p>
              Official Homebrew installer:{" "}
              <a
                className="text-foreground underline underline-offset-4"
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
      </DialogContent>
    </Dialog>
  );
}
