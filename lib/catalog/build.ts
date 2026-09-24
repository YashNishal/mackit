import { createHash } from "node:crypto";
import { curatedIds } from "@/data/categories";
import { indexById, toCompactCatalog } from "@/lib/catalog/compact";
import {
  CATALOG_FEATURED_PUBLIC_PATH,
  CATALOG_META_PUBLIC_PATH,
  CATALOG_PACKAGES_PREFIX,
} from "@/lib/catalog/paths";
import { normalizeCask, normalizeFormula, sortPackages } from "@/lib/catalog/normalize";
import {
  assertCaskArray,
  assertFormulaArray,
  parseAnalyticsCounts,
} from "@/lib/catalog/schema";
import { CATALOG_VERSION, type CatalogFile, type CatalogMeta } from "@/lib/catalog/types";

const FORMULA_URL = "https://formulae.brew.sh/api/formula.json";
const CASK_URL = "https://formulae.brew.sh/api/cask.json";
const FORMULA_ANALYTICS_URL =
  "https://formulae.brew.sh/api/analytics/install/365d.json";
const CASK_ANALYTICS_URL =
  "https://formulae.brew.sh/api/analytics/cask-install/365d.json";

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.json();
}

async function fetchAnalytics(url: string): Promise<Map<string, number>> {
  try {
    return parseAnalyticsCounts(await fetchJson(url));
  } catch (error) {
    console.warn(`[catalog] Analytics unavailable from ${url}; popularity set to 0:`, error);
    return new Map();
  }
}

export async function buildCatalog(): Promise<{
  catalog: CatalogFile;
  meta: Omit<CatalogMeta, "packagesFile">;
}> {
  const [formulaJson, caskJson, formulaAnalytics, caskAnalytics] =
    await Promise.all([
      fetchJson(FORMULA_URL),
      fetchJson(CASK_URL),
      fetchAnalytics(FORMULA_ANALYTICS_URL),
      fetchAnalytics(CASK_ANALYTICS_URL),
    ]);

  const formulae = assertFormulaArray(formulaJson);
  const casks = assertCaskArray(caskJson);
  const generatedAt = new Date().toISOString();
  const packages = [];

  for (const formula of formulae) {
    const pkg = normalizeFormula(
      formula,
      formulaAnalytics.get(formula.name) ?? 0,
    );
    if (pkg) {
      packages.push(pkg);
    }
  }

  for (const cask of casks) {
    const pkg = normalizeCask(cask, caskAnalytics.get(cask.token) ?? 0);
    if (pkg) {
      packages.push(pkg);
    }
  }

  const catalog: CatalogFile = {
    version: CATALOG_VERSION,
    generatedAt,
    packages: sortPackages(packages),
  };

  const byId = indexById(catalog.packages);
  const missing = curatedIds().filter((id) => !byId.has(id));
  if (missing.length > 0) {
    throw new Error(
      `Curated packages missing from Homebrew catalog: ${missing.join(", ")}`,
    );
  }

  const formulaCount = catalog.packages.filter((pkg) => pkg.kind === "formula")
    .length;
  const caskCount = catalog.packages.length - formulaCount;

  const meta: Omit<CatalogMeta, "packagesFile"> = {
    version: CATALOG_VERSION,
    generatedAt,
    formulaCount,
    caskCount,
    packageCount: catalog.packages.length,
    source: {
      formula: FORMULA_URL,
      cask: CASK_URL,
    },
  };

  return { catalog, meta };
}

export interface CatalogOutputFile {
  path: string;
  contents: string;
  /** Content-hashed, so it can be cached forever. */
  immutable: boolean;
}

/**
 * Files published for the site, in upload order. The full catalog is stored
 * under a content hash so browsers cache it until it changes; `meta.json`
 * points at it and goes last. `featured.json` holds only curated packages so
 * server rendering stays under the 2MB Next.js data cache limit.
 */
export function serializeCatalog(
  catalog: CatalogFile,
  baseMeta: Omit<CatalogMeta, "packagesFile">,
): { files: CatalogOutputFile[]; meta: CatalogMeta } {
  const packagesJson = JSON.stringify(toCompactCatalog(catalog));
  const hash = createHash("sha256").update(packagesJson).digest("hex").slice(0, 16);
  const meta: CatalogMeta = {
    ...baseMeta,
    packagesFile: `${CATALOG_PACKAGES_PREFIX}${hash}.json`,
  };

  const curated = new Set<string>(curatedIds());
  const featured: CatalogFile = {
    ...catalog,
    packages: catalog.packages.filter((pkg) => curated.has(pkg.id)),
  };

  return {
    meta,
    files: [
      { path: meta.packagesFile, contents: packagesJson, immutable: true },
      {
        path: CATALOG_FEATURED_PUBLIC_PATH,
        contents: JSON.stringify(toCompactCatalog(featured)),
        immutable: false,
      },
      {
        path: CATALOG_META_PUBLIC_PATH,
        contents: `${JSON.stringify(meta, null, 2)}\n`,
        immutable: false,
      },
    ],
  };
}
