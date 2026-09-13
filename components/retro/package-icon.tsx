import { createElement } from "react";
import { cn } from "@/lib/utils";
import { iconForPackage } from "@/lib/catalog/icons";
import type { CatalogPackage } from "@/lib/catalog/types";

const SIZES = {
  sm: { wrap: "size-8", icon: 16 },
  md: { wrap: "size-10", icon: 20 },
  lg: { wrap: "size-12", icon: 28 },
} as const;

export function PackageIcon({
  pkg,
  size = "md",
  selected = false,
}: {
  pkg: CatalogPackage;
  size?: keyof typeof SIZES;
  selected?: boolean;
}) {
  const dims = SIZES[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center border-2",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-foreground bg-background text-foreground",
        dims.wrap,
      )}
    >
      {createElement(iconForPackage(pkg), { size: dims.icon, color: "currentColor" })}
    </span>
  );
}
