import { readFile } from "node:fs/promises";
import path from "node:path";
import { CatalogShell } from "@/components/shells/catalog-shell";
import { resolveBundles, resolveCategories } from "@/data/categories";
import { indexById } from "@/lib/catalog/compact";
import {
  loadCatalogMeta,
  loadFeaturedCatalog,
  loadInstallerMetaFromDisk,
} from "@/lib/catalog/load";
import { catalogUrl } from "@/lib/catalog/paths";

// Safety net only: the weekly cron revalidates the "catalog" tag on publish.
export const revalidate = 86400;

export default async function HomePage() {
  const [catalog, meta, installer] = await Promise.all([
    loadFeaturedCatalog(),
    loadCatalogMeta(),
    loadInstallerMetaFromDisk(),
  ]);
  const featured = resolveCategories(indexById(catalog.packages));
  const bundles = resolveBundles(indexById(catalog.packages));
  const runnerSource = await readFile(
    path.join(process.cwd(), "public/install/v1/mackit-install.sh"),
    "utf8",
  );

  return (
    <CatalogShell
      featured={featured}
      bundles={bundles}
      generatedAt={meta.generatedAt}
      catalogUrl={catalogUrl(meta.packagesFile)}
      installer={installer}
      runnerSource={runnerSource}
    />
  );
}
