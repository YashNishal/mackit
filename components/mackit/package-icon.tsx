import { createElement } from "react";
import { cn } from "@/lib/utils";
import {
  iconColorForPackage,
  iconForPackage,
} from "@/lib/catalog/icons";
import type { CatalogPackage } from "@/lib/catalog/types";

const SIZES = {
  sm: { wrap: "size-8 rounded-[9px]", icon: 17 },
  md: { wrap: "size-11 rounded-[12px]", icon: 24 },
  lg: { wrap: "size-14 rounded-[15px]", icon: 30 },
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
        "icon-tile flex shrink-0 items-center justify-center text-foreground transition-shadow duration-150",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        dims.wrap,
      )}
    >
      {createElement(iconForPackage(pkg), { size: dims.icon, color })}
    </span>
  );
}
