"use client";

import { ShoppingBag, X } from "lucide-react";
import type { ReactNode } from "react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
        <span className="flex size-11 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
          <ShoppingBag className="size-5" />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium">Your cart is empty</p>
          <p className="max-w-44 text-xs leading-5 text-muted-foreground">
            Add apps from search or the categories below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
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
      <h3 className="mb-2 text-sm text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-1.5">
        {packages.map((pkg) => (
          <li
            key={pkg.id}
            className="flex items-center gap-2 rounded-lg px-1 py-1"
          >
            <PackageIcon pkg={pkg} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{pkg.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {kindLabel(pkg.kind)} · {pkg.token}
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove ${pkg.name}`}
              onClick={() => onRemove(pkg)}
            >
              <X />
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
          <ShoppingBag className="size-4" />
          <h2 className="text-sm font-semibold">Cart</h2>
          <Badge variant="secondary">{items.length}</Badge>
        </div>
        {items.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>
      <Separator className="my-3" />
      <ScrollArea className="min-h-0 flex-1 pr-2">
        <CartList apps={apps} tools={tools} onRemove={onRemove} />
      </ScrollArea>
      <div className="mt-4 grid gap-2">
        <Button size="lg" disabled={items.length === 0} onClick={onInstall}>
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
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 p-3 backdrop-blur-xl lg:hidden">
        <Button className="h-11 w-full" onClick={() => onOpenChange(true)}>
          View cart
          <Badge variant="secondary">{count}</Badge>
        </Button>
      </div>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Your cart</SheetTitle>
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
