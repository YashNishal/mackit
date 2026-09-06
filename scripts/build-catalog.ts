import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { curatedIds } from "@/data/categories";
import { indexById, toCompactCatalog } from "@/lib/catalog/compact";
import { CATALOG_META_PUBLIC_PATH, CATALOG_PUBLIC_PATH } from "@/lib/catalog/paths";
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
    console.warn(`Analytics unavailable from ${url}:`, error);
    return new Map();
  }
}

export async function buildCatalog(): Promise<{
  catalog: CatalogFile;
  meta: CatalogMeta;
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

  const meta: CatalogMeta = {
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

async function main() {
  const { catalog, meta } = await buildCatalog();
  const publicDir = path.join(process.cwd(), "public");
  await mkdir(path.join(publicDir, "catalog"), { recursive: true });
  await writeFile(
    path.join(publicDir, CATALOG_PUBLIC_PATH),
    JSON.stringify(toCompactCatalog(catalog)),
  );
  await writeFile(
    path.join(publicDir, CATALOG_META_PUBLIC_PATH),
    `${JSON.stringify(meta, null, 2)}\n`,
  );

  console.log(
    `Wrote ${catalog.packages.length} packages (${meta.caskCount} apps, ${meta.formulaCount} CLI tools)`,
  );
}

const isDirect =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirect) {
  await main();
}
