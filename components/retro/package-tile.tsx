"use client";

import { PackageIcon } from "@/components/retro/package-icon";
import { PackageInfoButton } from "@/components/retro/package-info-button";
import { PackageTooltip } from "@/components/retro/package-tooltip";
import type { CatalogPackage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export function PackageTile({
  pkg,
  selected,
  onToggle,
  onDetails,
}: {
  pkg: CatalogPackage;
  selected: boolean;
  onToggle: (pkg: CatalogPackage) => void;
  onDetails: (pkg: CatalogPackage) => void;
}) {
  return (
    <div className="group/pkg relative w-20">
      <PackageTooltip pkg={pkg}>
        <button
          type="button"
          aria-pressed={selected}
          aria-label={selected ? `Remove ${pkg.name}` : `Add ${pkg.name}`}
          onClick={() => onToggle(pkg)}
          className={cn(
            "flex w-full flex-col items-center gap-1 border-2 border-transparent p-1.5 text-center",
            "hover:border-foreground hover:bg-background",
            "focus-visible:border-foreground",
            selected && "border-foreground",
          )}
        >
          <PackageIcon pkg={pkg} size="lg" selected={selected} />
          <span
            className={cn(
              "line-clamp-2 w-full px-0.5 text-[12px] leading-tight",
              selected ? "bg-foreground text-background" : "text-foreground",
            )}
          >
            {pkg.name}
          </span>
        </button>
      </PackageTooltip>
      <PackageInfoButton
        pkg={pkg}
        onDetails={onDetails}
        reveal="hover"
        className="absolute top-0 right-0 z-10"
      />
    </div>
  );
}
