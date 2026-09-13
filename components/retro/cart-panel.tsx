"use client";

import type { ReactNode } from "react";
import { PackageIcon } from "@/components/retro/package-icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { kindLabel } from "@/lib/catalog/ids";
import type { CatalogPackage } from "@/lib/catalog/types";

function CartList({
  apps,
  tools,
  onRemove,
}: {
  apps: CatalogPackage[];
  tools: CatalogPackage[];
  onRemove: (pkg: CatalogPackage) => void;
}) {
  if (apps.length === 0 && tools.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-2 py-10 text-center">
        <span aria-hidden="true" className="flex size-11 items-center justify-center border-2 border-foreground">
          <svg viewBox="0 0 16 16" className="size-6" fill="currentColor" shapeRendering="crispEdges">
            <path d="M3 3h10v1H3zM4 4h8v8H4zM5 5h1v6H5zM7 5h1v6H7zM9 5h1v6H9zM11 5h0v6H11zM3 12h10v2H3z" />
          </svg>
        </span>
        <div className="space-y-1">
          <p className="text-[13px] font-bold">Trash is empty</p>
          <p className="max-w-44 text-xs leading-5">
            Add apps from search or the windows below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apps.length > 0 ? (
        <CartGroup title="Apps" packages={apps} onRemove={onRemove} />
      ) : null}
      {tools.length > 0 ? (
        <CartGroup title="CLI tools" packages={tools} onRemove={onRemove} />
      ) : null}
    </div>
  );
}

function CartGroup({
  title,
  packages,
  onRemove,
}: {
  title: string;
  packages: CatalogPackage[];
  onRemove: (pkg: CatalogPackage) => void;
}) {
  return (
    <section>
      <h3 className="mb-2 border-b border-foreground pb-1 text-[13px] font-bold">
        {title}
      </h3>
      <ul className="space-y-1">
        {packages.map((pkg) => (
          <li
            key={pkg.id}
            className="flex items-center gap-2 px-1 py-1 hover:bg-muted"
          >
            <PackageIcon pkg={pkg} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-bold">{pkg.name}</span>
              <span className="font-mono text-[11px]">
                {kindLabel(pkg.kind)} · {pkg.token}
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${pkg.name}`}
              onClick={() => onRemove(pkg)}
              className="border border-transparent hover:border-foreground"
            >
              ×
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CartContents({
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
  const apps = items.filter((pkg) => pkg.kind === "cask");
  const tools = items.filter((pkg) => pkg.kind === "formula");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="border border-foreground px-1.5 font-mono text-[11px]">
            {items.length} selected
          </span>
        </div>
        {items.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Empty trash
          </Button>
        ) : null}
      </div>
      <div aria-hidden="true" className="retro-stripes my-2 h-2 w-full opacity-60" />
      <div className="min-h-0 flex-1 overflow-auto pr-1">
        <CartList apps={apps} tools={tools} onRemove={onRemove} />
      </div>
      <div className="mt-4 grid gap-2">
        <Button size="lg" disabled={items.length === 0} onClick={onInstall} className="retro-btn-default">
          Install selected
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={items.length === 0}
          onClick={onShare}
        >
          Copy share link
        </Button>
      </div>
    </div>
  );
}

export function MobileCartBar({
  count,
  open,
  onOpenChange,
  children,
}: {
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-foreground bg-background p-2 lg:hidden">
        <Button className="h-11 w-full" onClick={() => onOpenChange(true)}>
          View cart disk [{count}]
        </Button>
      </div>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" showCloseButton={false} className="h-[85vh] border-t-2 border-foreground p-0">
          <div className="flex items-center gap-2 border-b-2 border-foreground px-2 py-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
              className="flex size-4 shrink-0 items-center justify-center border-2 border-foreground bg-background text-[11px] leading-none hover:bg-foreground hover:text-background"
            >
              <span aria-hidden="true">×</span>
            </button>
            <span aria-hidden="true" className="retro-stripes h-3 flex-1" />
            <span className="bg-background px-2 text-[13px] font-bold">Cart disk</span>
            <span aria-hidden="true" className="retro-stripes h-3 flex-1" />
          </div>
          <SheetHeader>
            <SheetTitle className="sr-only">Cart disk</SheetTitle>
            <SheetDescription>
              Review your apps before installing.
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4">{children}</div>
          <SheetFooter />
        </SheetContent>
      </Sheet>
    </>
  );
}
