export const CATALOG_PUBLIC_PATH = "catalog/latest.json";
export const CATALOG_META_PUBLIC_PATH = "catalog/meta.json";

export function catalogUrl(): string {
  return `/${CATALOG_PUBLIC_PATH}`;
}
