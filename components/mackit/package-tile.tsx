"use client";

import { Check } from "lucide-react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { PackageInfoButton } from "@/components/mackit/package-info-button";
import { PackageTooltip } from "@/components/mackit/package-tooltip";
import type { CatalogPackage } from "@/lib/catalog/types";

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
    <div className="group/pkg relative">
      <PackageTooltip pkg={pkg}>
        <button
          type="button"
          aria-pressed={selected}
          aria-label={selected ? `Remove ${pkg.name}` : `Add ${pkg.name}`}
          onClick={() => onToggle(pkg)}
          className="flex w-full flex-col items-center gap-2 rounded-xl px-1 pt-2 pb-1.5 text-center transition-colors duration-150 hover:bg-foreground/[0.04] active:bg-foreground/[0.07]"
        >
          <span className="relative">
            <PackageIcon pkg={pkg} size="lg" selected={selected} />
            {selected ? (
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background">
                <Check className="size-3 stroke-3" />
              </span>
            ) : null}
          </span>
          <span className="line-clamp-2 w-full text-[12px] leading-[1.25] text-foreground">
            {pkg.name}
          </span>
        </button>
      </PackageTooltip>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-2">
        <div className="relative size-14">
          <PackageInfoButton
            pkg={pkg}
            onDetails={onDetails}
            reveal="hover"
            className="absolute -right-1.5 -bottom-1.5 z-10"
          />
        </div>
      </div>
    </div>
  );
}
