import { createElement } from "react";
import { cn } from "@/lib/utils";
import {
  iconColorForPackage,
  iconForPackage,
} from "@/lib/catalog/icons";
import type { CatalogPackage } from "@/lib/catalog/types";

const SIZES = {
  sm: { wrap: "size-8 rounded-[10px]", icon: 16 },
  md: { wrap: "size-10 rounded-[12px]", icon: 22 },
  lg: { wrap: "size-14 rounded-[18px]", icon: 32 },
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
  const color = iconColorForPackage(pkg);
  const dims = SIZES[size];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center border text-foreground",
        selected
          ? "border-primary bg-primary/20"
          : "border-border/80 bg-secondary",
        dims.wrap,
      )}
    >
      {createElement(iconForPackage(pkg), { size: dims.icon, color })}
    </span>
  );
}
