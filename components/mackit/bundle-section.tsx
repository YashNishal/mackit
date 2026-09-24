"use client";

import { Check, Plus } from "lucide-react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { PackageInfoButton } from "@/components/mackit/package-info-button";
import { PackageTooltip } from "@/components/mackit/package-tooltip";
import { Button } from "@/components/ui/button";
import type { ResolvedBundle } from "@/data/categories";
import type { CatalogPackage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export function BundleSection({
  bundles,
  selectedIds,
  onAddBundle,
  onToggle,
  onDetails,
}: {
  bundles: ResolvedBundle[];
  selectedIds: Set<string>;
  onAddBundle: (packages: CatalogPackage[]) => void;
  onToggle: (pkg: CatalogPackage) => void;
  onDetails: (pkg: CatalogPackage) => void;
}) {
  if (bundles.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="bundles"
      className="grid gap-4 border-t py-8 md:grid-cols-[13rem_1fr] md:gap-8"
    >
      <div className="md:pt-4">
        <h2 id="bundles" className="text-[17px] font-semibold tracking-[-0.01em]">
          Bundles
        </h2>
        <p className="mt-1 max-w-[34ch] text-sm leading-5 text-muted-foreground">
          Common setups in one click. Remove anything you don’t need.
        </p>
      </div>
      <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
        {bundles.map((bundle) => {
          const missing = bundle.packages.filter(
            (pkg) => !selectedIds.has(pkg.id),
          );
          const complete =
            bundle.packages.length > 0 && missing.length === 0;

          return (
            <li
              key={bundle.id}
              className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-x-6"
            >
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold">{bundle.label}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {bundle.description}
                </p>
              </div>
              <Button
                variant={complete ? "ghost" : "outline"}
                disabled={complete}
                onClick={() => onAddBundle(missing)}
                className="order-last h-8 w-fit rounded-[9px] bg-card px-3 sm:order-none sm:row-span-2 sm:justify-self-end"
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
                    : `Add ${missing.length} more`}
              </Button>
              <ul className="flex flex-wrap gap-1.5">
                {bundle.packages.map((pkg) => {
                  const selected = selectedIds.has(pkg.id);
                  return (
                    <li key={pkg.id} className="min-w-0">
                      <div className="group/pkg relative inline-flex max-w-full">
                        <PackageTooltip pkg={pkg}>
                          <button
                            type="button"
                            aria-pressed={selected}
                            aria-label={
                              selected
                                ? `Remove ${pkg.name}`
                                : `Add ${pkg.name}`
                            }
                            onClick={() => onToggle(pkg)}
                            className={cn(
                              "inline-flex min-w-0 items-center gap-2 rounded-[11px] py-1 pr-2.5 pl-1 text-left transition-colors duration-150",
                              selected
                                ? "bg-primary/20 hover:bg-primary/30 dark:bg-primary/15 dark:hover:bg-primary/25"
                                : "bg-muted/70 hover:bg-muted",
                            )}
                          >
                            <PackageIcon pkg={pkg} size="sm" />
                            <span className="max-w-32 truncate text-[13px]">
                              {pkg.name}
                            </span>
                            {selected ? (
                              <Check className="size-3.5 shrink-0 stroke-3" />
                            ) : null}
                          </button>
                        </PackageTooltip>
                        <PackageInfoButton
                          pkg={pkg}
                          onDetails={onDetails}
                          reveal="hover"
                          className="absolute -top-1.5 -right-1.5 z-10"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
