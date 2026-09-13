"use client";

import { cn } from "@/lib/utils";
import type { CatalogPackage } from "@/lib/catalog/types";

export function PackageInfoButton({
  pkg,
  onDetails,
  className,
  tabIndex,
  reveal = "always",
}: {
  pkg: CatalogPackage;
  onDetails: (pkg: CatalogPackage) => void;
  className?: string;
  tabIndex?: number;
  reveal?: "always" | "hover";
}) {
  return (
    <button
      type="button"
      tabIndex={tabIndex}
      aria-label={`About ${pkg.name}`}
      onClick={() => onDetails(pkg)}
      className={cn(
        "flex size-4 items-center justify-center border border-foreground bg-background font-mono text-[10px] leading-none text-foreground",
        "hover:bg-foreground hover:text-background",
        reveal === "hover" &&
          "opacity-100 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/pkg:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-focus-within/pkg:opacity-100",
        className,
      )}
    >
      <span aria-hidden="true">?</span>
    </button>
  );
}
