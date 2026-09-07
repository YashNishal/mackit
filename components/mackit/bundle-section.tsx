"use client";

import { Check, Plus } from "lucide-react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { PackageTooltip } from "@/components/mackit/package-tooltip";
import { Button } from "@/components/ui/button";
import type { ResolvedBundle } from "@/data/categories";
import type { CatalogPackage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export function BundleSection({
  bundles,
  selectedIds,
  onAddBundle,
  onDetails,
}: {
  bundles: ResolvedBundle[];
  selectedIds: Set<string>;
  onAddBundle: (packages: CatalogPackage[]) => void;
  onDetails: (pkg: CatalogPackage) => void;
}) {
  if (bundles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="bundles"
      className="space-y-4 border-t border-border/70 pt-8"
    >
      <div className="max-w-xl">
        <h2
          id="bundles"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Start from a bundle
        </h2>
        <p className="text-sm text-muted-foreground">
          One click adds a curated setup. Hover an app for details, click it to
          open more, or remove anything you don&apos;t want.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {bundles.map((bundle) => {
          const missing = bundle.packages.filter(
            (pkg) => !selectedIds.has(pkg.id),
          );
          const complete =
            bundle.packages.length > 0 && missing.length === 0;

          return (
            <div
              key={bundle.id}
              className="flex flex-col gap-3 rounded-2xl border bg-card/80 p-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{bundle.label}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {bundle.packages.length} apps
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {bundle.description}
                </p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {bundle.packages.map((pkg) => {
                  const selected = selectedIds.has(pkg.id);
                  return (
                    <li key={pkg.id} className="min-w-0">
                      <PackageTooltip pkg={pkg}>
                        <button
                          type="button"
                          aria-label={`${pkg.name} — view details`}
                          onClick={() => onDetails(pkg)}
                          className={cn(
                            "inline-flex max-w-full items-center gap-1.5 rounded-lg border bg-background py-1 pr-2 pl-1 text-left transition-colors hover:border-primary/50 hover:bg-muted",
                            selected &&
                              "border-primary/60 bg-primary/10 hover:bg-primary/15",
                          )}
                        >
                          <PackageIcon
                            pkg={pkg}
                            size="sm"
                            selected={selected}
                          />
                          <span className="max-w-28 truncate text-xs font-medium">
                            {pkg.name}
                          </span>
                          {selected ? (
                            <Check className="size-3.5 shrink-0 text-primary" />
                          ) : null}
                        </button>
                      </PackageTooltip>
                    </li>
                  );
                })}
              </ul>
              <Button
                variant={complete ? "secondary" : "outline"}
                disabled={complete}
                onClick={() => onAddBundle(missing)}
                className="mt-auto w-full"
              >
                {complete ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Plus data-icon="inline-start" />
                )}
                {complete
                  ? "All added"
                  : missing.length === bundle.packages.length
                    ? `Add all ${bundle.packages.length}`
                    : `Add ${missing.length} remaining`}
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
