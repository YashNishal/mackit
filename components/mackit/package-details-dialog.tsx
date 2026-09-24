"use client";

import type { ReactNode } from "react";
import { ExternalLink, Minus, Plus } from "lucide-react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { TechnicalDetails } from "@/components/mackit/technical-details";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CatalogPackage } from "@/lib/catalog/types";

export function brewInstallSnippet(pkg: CatalogPackage): string {
  return pkg.kind === "cask"
    ? `brew install --cask ${pkg.token}`
    : `brew install ${pkg.token}`;
}

function SpecField({
  label,
  mono = false,
  children,
}: {
  label: string;
  mono?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "mt-0.5 font-mono text-xs wrap-anywhere" : "mt-0.5 wrap-anywhere"}>
        {children}
      </dd>
    </div>
  );
}

export function PackageDetailsDialog({
  pkg,
  selected,
  onToggle,
  onOpenChange,
}: {
  pkg: CatalogPackage | null;
  selected: boolean;
  onToggle: (pkg: CatalogPackage) => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={pkg !== null} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] min-w-0 overflow-hidden sm:max-w-88">
        {pkg ? (
          <>
            <DialogHeader className="pr-8">
              <div className="flex items-start gap-3">
                <PackageIcon pkg={pkg} size="md" selected={selected} />
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-left leading-snug text-balance">
                    {pkg.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-left">
                    {pkg.desc || "No description available."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <dl className="grid min-w-0 grid-cols-2 gap-3 rounded-[12px] border bg-card p-3 text-sm">
              <SpecField label="Type">
                {pkg.kind === "cask" ? "App" : "Command-line tool"}
              </SpecField>
              {pkg.version ? (
                <SpecField label="Version">{pkg.version}</SpecField>
              ) : null}
            </dl>

            <TechnicalDetails>
              <dl className="grid min-w-0 gap-3 rounded-[12px] border bg-muted/40 p-3 text-sm">
                <SpecField label="Homebrew ID" mono>{pkg.id}</SpecField>
                <SpecField label="Install manually" mono>{brewInstallSnippet(pkg)}</SpecField>
                {pkg.aliases.length > 0 ? (
                  <SpecField label="Also matches">
                    {pkg.aliases.slice(0, 4).join(", ")}
                  </SpecField>
                ) : null}
              </dl>
            </TechnicalDetails>

            <div className="grid gap-2">
              <Button
                size="lg"
                variant={selected ? "secondary" : "default"}
                onClick={() => onToggle(pkg)}
              >
                {selected ? (
                  <Minus data-icon="inline-start" />
                ) : (
                  <Plus data-icon="inline-start" />
                )}
                {selected ? "Remove from Dock" : "Add to Dock"}
              </Button>
              {pkg.homepage ? (
                <Button
                  variant="outline"
                  size="lg"
                  nativeButton={false}
                  render={
                    <a
                      href={pkg.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center"
                    />
                  }
                >
                  Visit website
                  <ExternalLink data-icon="inline-end" />
                </Button>
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
