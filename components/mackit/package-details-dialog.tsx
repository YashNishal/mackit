"use client";

import { Check, ExternalLink, Plus } from "lucide-react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { Badge } from "@/components/ui/badge";
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
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[380px]">
        {pkg ? (
          <>
            <DialogHeader>
              <div className="flex items-start gap-3">
                <PackageIcon pkg={pkg} size="md" selected={selected} />
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-left">{pkg.name}</DialogTitle>
                  <DialogDescription className="mt-1 text-left">
                    {pkg.desc || "No description provided by Homebrew."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{kindLabel(pkg.kind)}</Badge>
              {pkg.version ? (
                <Badge variant="outline">v{pkg.version}</Badge>
              ) : null}
            </div>

            <dl className="grid gap-2 rounded-xl border bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Homebrew ID</dt>
                <dd className="truncate font-mono text-xs">{pkg.id}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Install</dt>
                <dd className="truncate font-mono text-xs">
                  {brewInstallSnippet(pkg)}
                </dd>
              </div>
              {pkg.aliases.length > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Also matches</dt>
                  <dd className="truncate text-xs">
                    {pkg.aliases.slice(0, 4).join(", ")}
                  </dd>
                </div>
              ) : null}
            </dl>

            <div className="grid gap-2">
              <Button
                size="lg"
                variant={selected ? "secondary" : "default"}
                onClick={() => onToggle(pkg)}
              >
                {selected ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Plus data-icon="inline-start" />
                )}
                {selected ? "Added — remove" : "Add to cart"}
              </Button>
              {pkg.homepage ? (
                <Button
                  variant="outline"
                  size="lg"
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
