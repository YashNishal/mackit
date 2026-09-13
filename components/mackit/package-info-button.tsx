"use client";

import { Info } from "lucide-react";
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
        "flex size-4 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm ring-1 ring-foreground/12",
        "hover:text-foreground",
        "focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        reveal === "hover" &&
          "opacity-100 transition-opacity duration-150 motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/pkg:pointer-events-auto [@media(hover:hover)_and_(pointer:fine)]:group-hover/pkg:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-focus-within/pkg:pointer-events-auto [@media(hover:hover)_and_(pointer:fine)]:group-focus-within/pkg:opacity-100",
        className,
      )}
    >
      <Info aria-hidden="true" className="size-2.5" strokeWidth={2.5} />
    </button>
  );
}
