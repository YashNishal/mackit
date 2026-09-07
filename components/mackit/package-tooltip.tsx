"use client";

import type { ReactElement } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CatalogPackage } from "@/lib/catalog/types";

export function PackageTooltip({
  pkg,
  children,
}: {
  pkg: Pick<CatalogPackage, "desc" | "token">;
  children: ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent>{pkg.desc || pkg.token}</TooltipContent>
    </Tooltip>
  );
}
