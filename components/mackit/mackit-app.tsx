"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BundleSection } from "@/components/mackit/bundle-section";
import { CartContents, MobileCartBar } from "@/components/mackit/cart-panel";
import { CategorySection } from "@/components/mackit/category-section";
import { CheckoutDialog } from "@/components/mackit/checkout-dialog";
import { PackageDetailsDialog } from "@/components/mackit/package-details-dialog";
import { ForMacEgg } from "@/components/for-mac-egg";
import { SearchBox } from "@/components/mackit/search-box";
import { SiteFooter } from "@/components/mackit/site-footer";
import { SiteHeader } from "@/components/mackit/site-header";
import { Skeleton } from "@/components/ui/skeleton";
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

export function MacKitApp({
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
    setIds((current) => {
      if (current.includes(pkg.id)) {
        return current.filter((id) => id !== pkg.id);
      }
      if (current.length >= MAX_CART_SIZE) {
        toast.error(`The cart holds at most ${MAX_CART_SIZE} packages.`);
        return current;
      }
      return uniqueSortedIds([...current, pkg.id]);
    });
  }, []);

  const showDetails = useCallback((pkg: CatalogPackage) => {
    setDetailsPkg(pkg);
  }, []);

  const addBundle = useCallback((bundlesToAdd: CatalogPackage[]) => {
    if (bundlesToAdd.length === 0) {
      return;
    }
    setIds((current) => {
      if (current.length >= MAX_CART_SIZE) {
        toast.error(`The cart holds at most ${MAX_CART_SIZE} packages.`);
        return current;
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
        return current;
      }
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
      return uniqueSortedIds([...next]);
    });
  }, []);

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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }
      event.preventDefault();
      document.querySelector<HTMLInputElement>("[role=combobox]")?.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 pt-10 pb-28 sm:px-6 lg:pb-16">
        <div className="min-w-0 flex-1 space-y-12">
          <section className="max-w-3xl space-y-5">
            <ForMacEgg />
            <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Set up your Mac in one go.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Browse popular apps or search for more. Add them to a cart, then
              install everything with one Terminal command. No account.
            </p>
            <p className="font-mono text-[11px] tracking-wide text-muted-foreground">
              Nothing is uploaded · Share your list with a link
            </p>
            {catalogError ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {catalogError}
              </p>
            ) : null}
            {unavailable.length > 0 ? (
              <p className="rounded-lg border bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                Some shared apps are no longer available: {unavailable.join(", ")}.
              </p>
            ) : null}
            {packages.length === 0 && !catalogError ? (
              <Skeleton className="h-14 w-full rounded-xl" />
            ) : (
              <SearchBox
                packages={packages}
                selectedIds={selectedIds}
                onToggle={toggle}
                onDetails={showDetails}
                disabled={Boolean(catalogError)}
              />
            )}
          </section>

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
          <div className="sticky top-20 rounded-2xl border bg-card/90 p-4 shadow-lg">
            <CartContents
              items={items}
              onRemove={toggle}
              onClear={() => setIds([])}
              onInstall={() => setCheckoutOpen(true)}
              onShare={() => void share()}
            />
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
          onClear={() => setIds([])}
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
