"use client";

import type { ReactNode } from "react";
import { PackageIcon } from "@/components/retro/package-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { kindLabel } from "@/lib/catalog/ids";
import type { CatalogPackage } from "@/lib/catalog/types";

export function brewInstallSnippet(pkg: CatalogPackage): string {
  return pkg.kind === "cask"
    ? `brew install --cask ${pkg.token}`
    : `brew install ${pkg.token}`;
}

function SpecField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt>{label}</dt>
      <dd className="mt-0.5 font-mono text-xs wrap-anywhere">{children}</dd>
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
      <DialogContent showCloseButton={false} className="w-[calc(100%-2rem)] min-w-0 overflow-hidden border-2 border-foreground bg-background p-0 shadow-[6px_6px_0_0_var(--foreground)] sm:max-w-88">
        {pkg ? (
          <>
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
              <span className="bg-background px-2 text-[13px] font-bold">Get info</span>
              <span aria-hidden="true" className="retro-stripes h-3 flex-1" />
            </div>
            <div className="space-y-3 p-4">
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <PackageIcon pkg={pkg} size="md" selected={selected} />
                  <div className="min-w-0 flex-1">
                    <DialogTitle className="text-left text-[15px] font-bold leading-snug">
                      {pkg.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-left text-[13px]">
                      {pkg.desc || "No description available."}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <p className="w-fit border border-foreground px-1.5 font-mono text-[11px]">
                {kindLabel(pkg.kind)}
              </p>

              <dl className="grid min-w-0 gap-3 border-2 border-foreground bg-background p-3 text-[13px]">
                {pkg.version ? (
                  <SpecField label="Version">{pkg.version}</SpecField>
                ) : null}
                <SpecField label="Homebrew ID">{pkg.id}</SpecField>
                <SpecField label="Install">{brewInstallSnippet(pkg)}</SpecField>
                {pkg.aliases.length > 0 ? (
                  <SpecField label="Also matches">
                    {pkg.aliases.slice(0, 4).join(", ")}
                  </SpecField>
                ) : null}
              </dl>

              <div className="grid gap-2">
                <Button
                  size="lg"
                  variant={selected ? "secondary" : "default"}
                  onClick={() => onToggle(pkg)}
                  className={selected ? undefined : "retro-btn-default"}
                >
                  {selected ? "Added — remove" : "Add to cart"}
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
                    Vendor homepage
                  </Button>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
