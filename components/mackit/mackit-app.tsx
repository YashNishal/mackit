"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BundleSection } from "@/components/mackit/bundle-section";
import { CategorySection } from "@/components/mackit/category-section";
import { CheckoutDialog } from "@/components/mackit/checkout-dialog";
import { Dock } from "@/components/mackit/dock";
import { PackageDetailsDialog } from "@/components/mackit/package-details-dialog";
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

  const clear = useCallback(() => {
    const previous = ids;
    setIds([]);
    toast(
      previous.length === 1 ? "Removed 1 app." : `Removed ${previous.length} apps.`,
      {
        action: {
          label: "Undo",
          onClick: () =>
            setIds((current) =>
              uniqueSortedIds([...current, ...previous]).slice(0, MAX_CART_SIZE),
            ),
        },
      },
    );
  }, [ids]);

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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-8 sm:px-6">
        <section className="pt-10 pb-10 sm:pt-16 sm:pb-12">
          <h1 className="font-display max-w-[14ch] text-[2.625rem] leading-[1.02] font-bold tracking-[-0.035em] text-balance sm:text-[4.5rem]">
            Set up your Mac in one go.
          </h1>
          <p className="mt-5 max-w-[54ch] text-[17px] leading-7 text-pretty text-muted-foreground">
            Pick the apps you want and they collect in the Dock below. Paste
            one command into Terminal and they all install at once. No
            account needed.
          </p>
          <div className="mt-8 max-w-2xl space-y-3">
            {catalogError ? (
              <p className="rounded-[12px] border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {catalogError}
              </p>
            ) : null}
            {unavailable.length > 0 ? (
              <p className="rounded-[12px] border bg-card px-3 py-2 text-sm text-muted-foreground">
                Some apps in this link are no longer available and were left
                out: {unavailable.join(", ")}.
              </p>
            ) : null}
            {packages.length === 0 && !catalogError ? (
              <Skeleton className="h-13 w-full rounded-[14px]" />
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
        </section>

        <BundleSection
          bundles={bundles}
          selectedIds={selectedIds}
          onAddBundle={addBundle}
          onToggle={toggle}
          onDetails={showDetails}
        />

        {featured.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            selectedIds={selectedIds}
            onToggle={toggle}
            onDetails={showDetails}
          />
        ))}
      </main>

      <Dock
        items={items}
        onRemove={toggle}
        onClear={clear}
        onInstall={() => setCheckoutOpen(true)}
        onShare={() => void share()}
      />

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
      <SiteFooter generatedAt={generatedAt} className="pb-32" />
    </div>
  );
}
