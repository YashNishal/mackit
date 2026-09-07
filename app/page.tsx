import { readFile } from "node:fs/promises";
import path from "node:path";
import { MacKitApp } from "@/components/mackit/mackit-app";
import { resolveBundles, resolveCategories } from "@/data/categories";
import { indexById } from "@/lib/catalog/compact";
import {
  loadCatalogFromDisk,
  loadCatalogMetaFromDisk,
  loadInstallerMetaFromDisk,
} from "@/lib/catalog/load";

export default async function HomePage() {
  const [catalog, meta, installer] = await Promise.all([
    loadCatalogFromDisk(),
    loadCatalogMetaFromDisk(),
    loadInstallerMetaFromDisk(),
  ]);
  const featured = resolveCategories(indexById(catalog.packages));
  const bundles = resolveBundles(indexById(catalog.packages));
  const runnerSource = await readFile(
    path.join(process.cwd(), "public/install/v1/mackit-install.sh"),
    "utf8",
  );

  return (
    <MacKitApp
      featured={featured}
      bundles={bundles}
      generatedAt={meta.generatedAt}
      installer={installer}
      runnerSource={runnerSource}
    />
  );
}
