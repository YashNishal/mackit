"use client";

import { Link2, Trash2 } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { ForMacEgg } from "@/components/for-mac-egg";
import { PackageIcon } from "@/components/mackit/package-icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CatalogPackage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

function DockItem({
  pkg,
  onRemove,
}: {
  pkg: CatalogPackage;
  onRemove: (pkg: CatalogPackage) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  return (
    <li ref={ref} className="dock-land shrink-0">
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={`Remove ${pkg.name}`}
              onClick={() => onRemove(pkg)}
              className="block rounded-[12px] transition-transform duration-150 hover:-translate-y-1"
            />
          }
        >
          <PackageIcon pkg={pkg} size="md" />
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>Remove {pkg.name}</TooltipContent>
      </Tooltip>
    </li>
  );
}

function DockDivider() {
  return <span aria-hidden="true" className="mx-0.5 h-9 w-px shrink-0 bg-foreground/15" />;
}

function DockAction({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className={cn(
              "size-11 shrink-0 rounded-[12px] text-muted-foreground hover:bg-foreground/[0.06] [&_svg:not([class*='size-'])]:size-5",
              disabled && "max-sm:hidden",
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent sideOffset={10}>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Dock({
  items,
  onRemove,
  onClear,
  onInstall,
  onShare,
}: {
  items: CatalogPackage[];
  onRemove: (pkg: CatalogPackage) => void;
  onClear: () => void;
  onInstall: () => void;
  onShare: () => void;
}) {
  const empty = items.length === 0;

  return (
    <nav
      aria-label="Your apps"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-30 flex justify-center px-3 sm:bottom-5"
    >
      <div className="dock pointer-events-auto flex max-w-full items-center gap-1.5 rounded-[22px] p-2 sm:max-w-4xl">
        <ForMacEgg />
        <DockDivider />
        {empty ? (
          <p className="min-w-0 shrink truncate px-2 text-sm whitespace-nowrap text-muted-foreground">
            <span className="sm:hidden">No apps yet</span>
            <span className="hidden sm:inline">Apps you pick appear here.</span>
          </p>
        ) : (
          <ul
            aria-label={`${items.length} selected`}
            className="flex min-w-0 shrink items-center gap-1.5 overflow-x-auto px-0.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((pkg) => (
              <DockItem key={pkg.id} pkg={pkg} onRemove={onRemove} />
            ))}
          </ul>
        )}
        <span className={cn("contents", empty && "max-sm:hidden")}>
          <DockDivider />
        </span>
        <DockAction label="Copy share link" disabled={empty} onClick={onShare}>
          <Link2 />
        </DockAction>
        <DockAction label="Remove all apps" disabled={empty} onClick={onClear}>
          <Trash2 />
        </DockAction>
        <Button
          disabled={empty}
          onClick={onInstall}
          className="h-11 shrink-0 rounded-[12px] px-4 text-[15px] font-semibold hover:bg-primary/85 disabled:opacity-40"
        >
          <span className="tabular-nums">
            Install
            {empty ? null : ` ${items.length}`}
            {empty ? null : (
              <span className="hidden sm:inline">
                {items.length === 1 ? " app" : " apps"}
              </span>
            )}
          </span>
        </Button>
      </div>
    </nav>
  );
}
