"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { BundleSection } from "@/components/retro/bundle-section";
import { CartContents, MobileCartBar } from "@/components/retro/cart-panel";
import { CategorySection } from "@/components/retro/category-section";
import { CheckoutDialog } from "@/components/retro/checkout-dialog";
import { PackageDetailsDialog } from "@/components/retro/package-details-dialog";
import { RetroWindow } from "@/components/retro/retro-window";
import { SearchBox } from "@/components/retro/search-box";
import { SiteFooter } from "@/components/retro/site-footer";
import { SiteHeader } from "@/components/retro/site-header";
import type { ResolvedBundle, ResolvedCategory } from "@/data/categories";
import {
  CART_QUERY_PARAM,
  CART_STORAGE_KEY,
  cartSharePath,
  decodeCartIds,
  encodeCartIds,
  uniqueSortedIds,
} from "@/lib/cart/codec";
import { fromCompactCatalog } from "@/lib/catalog/compact";
import { catalogUrl } from "@/lib/catalog/paths";
import type { CatalogPackage, CompactCatalog, PackageId } from "@/lib/catalog/types";
import { MAX_CART_SIZE } from "@/lib/catalog/types";
import type { InstallerMeta } from "@/lib/installer/command";
import {
  isMenuAction,
  MENU_EVENT,
  takePendingAction,
  type MenuAction,
} from "@/lib/menu-actions";

export function RetroApp({
  featured,
  bundles,
  generatedAt,
  installer,
  runnerSource,
}: {
  featured: ResolvedCategory[];
  bundles: ResolvedBundle[];
  generatedAt: string;
  installer: InstallerMeta;
  runnerSource: string;
}) {
  const [packages, setPackages] = useState<CatalogPackage[]>([]);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [ids, setIds] = useState<PackageId[]>([]);
  const [unavailable, setUnavailable] = useState<PackageId[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [detailsPkg, setDetailsPkg] = useState<CatalogPackage | null>(null);

  const undoRef = useRef<PackageId[][]>([]);
  const idsRef = useRef<PackageId[]>([]);
  const packagesRef = useRef<CatalogPackage[]>([]);

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  useEffect(() => {
    packagesRef.current = packages;
  }, [packages]);

  const pushHistory = useCallback(() => {
    undoRef.current.push(idsRef.current);
    if (undoRef.current.length > 50) {
      undoRef.current.shift();
    }
  }, []);

  const byId = useMemo(
    () => new Map(packages.map((pkg) => [pkg.id, pkg])),
    [packages],
  );
  const selectedIds = useMemo(() => new Set(ids), [ids]);
  const items = useMemo(
    () => ids.map((id) => byId.get(id)).filter((pkg): pkg is CatalogPackage => Boolean(pkg)),
    [byId, ids],
  );

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(catalogUrl());
        if (!response.ok) {
          throw new Error("Catalog request failed.");
        }
        const compact = (await response.json()) as CompactCatalog;
        const catalog = fromCompactCatalog(compact);
        if (cancelled) {
          return;
        }
        setPackages(catalog.packages);

        const params = new URLSearchParams(window.location.search);
        const fromUrl = decodeCartIds(params.get(CART_QUERY_PARAM)).ids;
        const stored = window.localStorage.getItem(CART_STORAGE_KEY);
        const fromStorage = stored ? decodeCartIds(stored).ids : [];
        const preferred = fromUrl.length > 0 ? fromUrl : fromStorage;
        const found: PackageId[] = [];
        const missing: PackageId[] = [];
        for (const id of preferred) {
          if (catalog.packages.some((pkg) => pkg.id === id)) {
            found.push(id);
          } else {
            missing.push(id);
          }
        }
        setIds(uniqueSortedIds(found));
        setUnavailable(missing);
      } catch {
        if (!cancelled) {
                setCatalogError("The app list could not be loaded. Check your connection and retry.");
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, encodeCartIds(ids));
  }, [hydrated, ids]);

  const toggle = useCallback((pkg: CatalogPackage) => {
    const current = idsRef.current;
    if (current.includes(pkg.id)) {
      pushHistory();
      setIds(current.filter((id) => id !== pkg.id));
      return;
    }
    if (current.length >= MAX_CART_SIZE) {
      toast.error(`The cart holds at most ${MAX_CART_SIZE} packages.`);
      return;
    }
    pushHistory();
    setIds(uniqueSortedIds([...current, pkg.id]));
  }, [pushHistory]);

  const showDetails = useCallback((pkg: CatalogPackage) => {
    setDetailsPkg(pkg);
  }, []);

  const addBundle = useCallback((bundlesToAdd: CatalogPackage[]) => {
    if (bundlesToAdd.length === 0) {
      return;
    }
    const current = idsRef.current;
    if (current.length >= MAX_CART_SIZE) {
      toast.error(`The cart holds at most ${MAX_CART_SIZE} packages.`);
      return;
    }
    const next = new Set(current);
    let added = 0;
    for (const pkg of bundlesToAdd) {
      if (next.size >= MAX_CART_SIZE) {
        break;
      }
      if (!next.has(pkg.id)) {
        next.add(pkg.id);
        added += 1;
      }
    }
    if (added === 0) {
      return;
    }
    pushHistory();
    const remaining = bundlesToAdd.length - added;
    if (remaining > 0) {
      toast.warning(
        `Added ${added} apps. The cart holds at most ${MAX_CART_SIZE} packages.`,
      );
    } else {
      toast.success(
        added === 1 ? "Added 1 app." : `Added ${added} apps.`,
      );
    }
    setIds(uniqueSortedIds([...next]));
  }, [pushHistory]);

  const clearCart = useCallback(() => {
    if (idsRef.current.length === 0) {
      return;
    }
    pushHistory();
    setIds([]);
  }, [pushHistory]);

  const doUndo = useCallback(() => {
    const previous = undoRef.current.pop();
    if (!previous) {
      toast.error("Nothing to undo.");
      return;
    }
    setIds(previous);
    toast.success("Undid last change.");
  }, []);

  const doFind = useCallback(() => {
    // Deferred: the File menu restores focus to its trigger as it closes,
    // which would otherwise yank focus straight back off the search box.
    window.setTimeout(() => {
      document.querySelector<HTMLInputElement>("[role=combobox]")?.focus();
    }, 50);
  }, []);

  const doInstall = useCallback(() => {
    if (idsRef.current.length === 0) {
      toast.error("Add apps to the cart first.");
      return;
    }
    setCheckoutOpen(true);
  }, []);

  const doPaste = useCallback(async () => {
    let text: string;
    try {
      text = await navigator.clipboard.readText();
    } catch {
      toast.error("Clipboard is blocked. Copy a cart link first, then try again.");
      return;
    }
    let candidate = text.trim();
    if (!candidate) {
      toast.error("No cart link found in the clipboard.");
      return;
    }
    try {
      const url = new URL(candidate);
      candidate = url.searchParams.get(CART_QUERY_PARAM) ?? candidate;
    } catch {
      // Not a URL; treat the text as a raw cart code.
    }
    const parsed = decodeCartIds(candidate).ids;
    const known = new Set(packagesRef.current.map((pkg) => pkg.id));
    const fresh = uniqueSortedIds(parsed.filter((id) => known.has(id)));
    if (fresh.length === 0) {
      toast.error("No matching apps found in that link.");
      return;
    }
    const current = new Set(idsRef.current);
    const merged = uniqueSortedIds([...current, ...fresh]);
    if (merged.length === current.size) {
      toast.success("Those apps are already in the cart.");
      return;
    }
    pushHistory();
    const capped = merged.slice(0, MAX_CART_SIZE);
    const addedCount = capped.filter((id) => !current.has(id)).length;
    setIds(capped);
    if (merged.length > MAX_CART_SIZE) {
      toast.warning(
        `Added ${addedCount} apps. The cart holds at most ${MAX_CART_SIZE} packages.`,
      );
    } else {
      toast.success(
        addedCount === 1 ? "Added 1 app from link." : `Added ${addedCount} apps from link.`,
      );
    }
  }, [pushHistory]);

  const share = useCallback(async () => {
    const path = cartSharePath(ids);
    const url = `${window.location.origin}${path}`;
    if (url.length > 1800) {
      toast.error("This cart is too large to share as a URL. Remove a few apps first.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", path);
      toast.success("Share link copied. Nothing was uploaded.");
    } catch {
      window.history.replaceState(null, "", path);
      toast.error("Clipboard is blocked. The address bar now contains the share link.");
    }
  }, [ids]);

  const runMenuAction = useCallback((action: MenuAction) => {
    switch (action) {
      case "find":
        doFind();
        break;
      case "install":
        doInstall();
        break;
      case "share":
        void share();
        break;
      case "clear":
        clearCart();
        break;
      case "undo":
        doUndo();
        break;
      case "paste":
        void doPaste();
        break;
    }
  }, [clearCart, doFind, doInstall, doPaste, doUndo, share]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const inField = target && ["INPUT", "TEXTAREA"].includes(target.tagName);
      if (
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey &&
        (event.key === "z" || event.key === "Z")
      ) {
        if (inField) {
          return;
        }
        event.preventDefault();
        doUndo();
        return;
      }
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (inField) {
        return;
      }
      event.preventDefault();
      document.querySelector<HTMLInputElement>("[role=combobox]")?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [doUndo]);

  useEffect(() => {
    function onMenu(event: Event) {
      const action = (event as CustomEvent).detail;
      if (isMenuAction(action)) {
        runMenuAction(action);
      }
    }

    window.addEventListener(MENU_EVENT, onMenu);
    return () => window.removeEventListener(MENU_EVENT, onMenu);
  }, [runMenuAction]);

  useEffect(() => {
    if (!hydrated || packages.length === 0) {
      return;
    }
    const pending = takePendingAction();
    if (pending) {
      runMenuAction(pending);
    }
  }, [hydrated, packages.length, runMenuAction]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-2 pt-6 pb-28 sm:px-3 lg:pb-16">
        <div className="min-w-0 flex-1 space-y-6">
          <RetroWindow
            title="MacKit Disk"
            meta={
              packages.length > 0
                ? `${packages.length} items in disk  ${ids.length} in cart`
                : "System Disk"
            }
          >
            <p className="font-mono text-[11px]">For Mac</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-normal text-balance sm:text-5xl">
              Set up your Mac in one go.
            </h1>
            <p className="mt-2 max-w-xl text-[13px] leading-6">
              Browse popular apps or search for more. Add them to a cart, then
              install everything with one Terminal command. No account.
            </p>
            <p className="mt-1 font-mono text-[11px]">
              Nothing is uploaded. Share your list with a link.
            </p>
            {catalogError ? (
              <p className="mt-3 border-2 border-foreground bg-background px-3 py-2 text-[13px] font-bold">
                {catalogError}
              </p>
            ) : null}
            {unavailable.length > 0 ? (
              <p className="mt-3 border border-foreground px-3 py-2 text-[13px]">
                Some shared apps are no longer available: {unavailable.join(", ")}.
              </p>
            ) : null}
            <div className="mt-4">
              {packages.length === 0 && !catalogError ? (
                <div aria-hidden="true" className="h-12 w-full border-2 border-foreground bg-muted" />
              ) : (
                <SearchBox
                  packages={packages}
                  selectedIds={selectedIds}
                  onToggle={toggle}
                  onDetails={showDetails}
                  disabled={Boolean(catalogError)}
                />
              )}
            </div>
          </RetroWindow>

          {featured.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              selectedIds={selectedIds}
              onToggle={toggle}
              onDetails={showDetails}
            />
          ))}

          <BundleSection
            bundles={bundles}
            selectedIds={selectedIds}
            onAddBundle={addBundle}
            onToggle={toggle}
            onDetails={showDetails}
          />
        </div>

        <aside className="hidden w-80 shrink-0 lg:block">
          <div className="retro-window sticky top-12 bg-background">
            <div className="flex items-center gap-2 border-b-2 border-foreground px-2 py-1">
              <span aria-hidden="true" className="size-3 border-2 border-foreground" />
              <span aria-hidden="true" className="retro-stripes h-3 flex-1" />
              <span className="bg-background px-2 text-[13px] font-bold">Cart Disk</span>
              <span aria-hidden="true" className="retro-stripes h-3 flex-1" />
            </div>
            <div className="border-b-2 border-foreground px-3 py-1 font-mono text-[11px]">
              {items.length} items in cart
            </div>
            <div className="p-3">
              <CartContents
                items={items}
                onRemove={toggle}
                onClear={clearCart}
                onInstall={() => setCheckoutOpen(true)}
                onShare={() => void share()}
              />
            </div>
          </div>
        </aside>
      </main>

      <MobileCartBar
        count={items.length}
        open={mobileCartOpen}
        onOpenChange={setMobileCartOpen}
      >
        <CartContents
          items={items}
          onRemove={toggle}
          onClear={clearCart}
          onInstall={() => {
            setMobileCartOpen(false);
            setCheckoutOpen(true);
          }}
          onShare={() => void share()}
        />
      </MobileCartBar>

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={items}
        sha256={installer.sha256}
        runnerSource={runnerSource}
      />
      <PackageDetailsDialog
        pkg={detailsPkg}
        selected={detailsPkg ? selectedIds.has(detailsPkg.id) : false}
        onToggle={toggle}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsPkg(null);
          }
        }}
      />
      <SiteFooter generatedAt={generatedAt} />
    </div>
  );
}
