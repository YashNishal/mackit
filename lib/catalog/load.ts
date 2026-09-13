import { readFile } from "node:fs/promises";
import path from "node:path";
import { fromCompactCatalog } from "@/lib/catalog/compact";
import {
  CATALOG_META_PUBLIC_PATH,
  CATALOG_PUBLIC_PATH,
} from "@/lib/catalog/paths";
import type { CatalogFile, CatalogMeta, CompactCatalog } from "@/lib/catalog/types";
import type { InstallerMeta } from "@/lib/installer/command";

export async function loadCatalogFromDisk(
  cwd = process.cwd(),
): Promise<CatalogFile> {
  const filePath = path.join(cwd, "public", CATALOG_PUBLIC_PATH);
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as CompactCatalog;
  return fromCompactCatalog(parsed);
}

export async function loadCatalogMetaFromDisk(
  cwd = process.cwd(),
): Promise<CatalogMeta> {
  const filePath = path.join(cwd, "public", CATALOG_META_PUBLIC_PATH);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as CatalogMeta;
}

export async function loadInstallerMetaFromDisk(
  cwd = process.cwd(),
): Promise<InstallerMeta> {
  const filePath = path.join(cwd, "public/install/v1/mackit-install.meta.json");
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as InstallerMeta;
}
