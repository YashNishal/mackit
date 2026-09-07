"use client";

import { Check } from "lucide-react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { PackageTooltip } from "@/components/mackit/package-tooltip";
import type { CatalogPackage } from "@/lib/catalog/types";

export function PackageTile({
  pkg,
  selected,
  onDetails,
}: {
  pkg: CatalogPackage;
  selected: boolean;
  onDetails: (pkg: CatalogPackage) => void;
}) {
  return (
    <PackageTooltip pkg={pkg}>
      <button
        type="button"
        aria-label={`${pkg.name} — view details`}
        onClick={() => onDetails(pkg)}
        className="flex w-21 flex-col items-center gap-2 rounded-2xl p-1.5 text-center hover:bg-muted/60"
      >
        <span className="relative">
          <PackageIcon pkg={pkg} size="lg" selected={selected} />
          {selected ? (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-2.5 stroke-3" />
            </span>
          ) : null}
        </span>
        <span className="line-clamp-2 w-full text-[12px] leading-tight text-foreground">
          {pkg.name}
        </span>
      </button>
    </PackageTooltip>
  );
}
