"use client";

import { PackageIcon } from "@/components/retro/package-icon";
import { PackageInfoButton } from "@/components/retro/package-info-button";
import { PackageTooltip } from "@/components/retro/package-tooltip";
import { RetroWindow } from "@/components/retro/retro-window";
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
    <RetroWindow title="Start from a bundle" meta={`${bundles.length} bundles`} id="bundles">
      <p className="mb-3 max-w-xl text-[13px]">
        One click adds a curated setup. Click an app to add or remove it.
      </p>
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
              className="flex flex-col gap-3 border-2 border-foreground bg-background p-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[13px] font-bold">{bundle.label}</h3>
                  <span className="font-mono text-[11px]">
                    {bundle.packages.length} apps
                  </span>
                </div>
                <p className="mt-0.5 text-[13px]">{bundle.description}</p>
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {bundle.packages.map((pkg) => {
                  const selected = selectedIds.has(pkg.id);
                  return (
                    <li key={pkg.id} className="min-w-0">
                      <div
                        className={cn(
                          "group/pkg relative inline-flex max-w-full items-center border-2",
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : "border-foreground bg-background hover:bg-muted",
                        )}
                      >
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
                            className="inline-flex min-w-0 items-center gap-1.5 py-1 pr-2 pl-1 text-left"
                          >
                            <PackageIcon
                              pkg={pkg}
                              size="sm"
                              selected={selected}
                            />
                            <span className="max-w-28 truncate text-xs font-bold">
                              {pkg.name}
                            </span>
                            {selected ? (
                              <span aria-hidden="true" className="font-mono text-xs">×</span>
                            ) : null}
                          </button>
                        </PackageTooltip>
                        <PackageInfoButton
                          pkg={pkg}
                          onDetails={onDetails}
                          reveal="hover"
                          className="absolute -top-2 -right-2 z-10"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Button
                variant={complete ? "secondary" : "default"}
                disabled={complete}
                onClick={() => onAddBundle(missing)}
                className="mt-auto w-full"
              >
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
    </RetroWindow>
  );
}
