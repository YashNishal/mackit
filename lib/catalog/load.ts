import { readFile } from "node:fs/promises";
import path from "node:path";
import { fromCompactCatalog } from "@/lib/catalog/compact";
import {
  CATALOG_FEATURED_PUBLIC_PATH,
  CATALOG_META_PUBLIC_PATH,
  catalogBaseUrl,
} from "@/lib/catalog/paths";
import type { CatalogFile, CatalogMeta, CompactCatalog } from "@/lib/catalog/types";
import type { InstallerMeta } from "@/lib/installer/command";

// Safety net only: the weekly cron revalidates the "catalog" tag on publish.
// Matches the page's `revalidate`.
const CATALOG_REVALIDATE_SECONDS = 86400;

async function readCatalogJson<T>(file: string): Promise<T> {
  const base = catalogBaseUrl();
  if (base) {
    const url = `${base}/${file}`;
    const response = await fetch(url, {
      next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["catalog"] },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return (await response.json()) as T;
  }

  const filePath = path.join(process.cwd(), "public", file);
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch (error) {
    throw new Error(
      `Could not read ${filePath}. Run \`bun run catalog\` or set NEXT_PUBLIC_CATALOG_BASE_URL.`,
      { cause: error },
    );
  }
}

/** Curated packages only; the full catalog is loaded by the browser. */
export async function loadFeaturedCatalog(): Promise<CatalogFile> {
  return fromCompactCatalog(
    await readCatalogJson<CompactCatalog>(CATALOG_FEATURED_PUBLIC_PATH),
  );
}

export async function loadCatalogMeta(): Promise<CatalogMeta> {
  const meta = await readCatalogJson<CatalogMeta>(CATALOG_META_PUBLIC_PATH);
  if (!meta.packagesFile) {
    throw new Error(
      `${CATALOG_META_PUBLIC_PATH} has no packagesFile. Republish the catalog.`,
    );
  }
  return meta;
}

export async function loadInstallerMetaFromDisk(
  cwd = process.cwd(),
): Promise<InstallerMeta> {
  const filePath = path.join(cwd, "public/install/v1/mackit-install.meta.json");
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as InstallerMeta;
}
