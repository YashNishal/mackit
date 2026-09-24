export const CATALOG_DIR = "catalog";
export const CATALOG_PACKAGES_PREFIX = `${CATALOG_DIR}/packages-`;
export const CATALOG_META_PUBLIC_PATH = `${CATALOG_DIR}/meta.json`;
export const CATALOG_FEATURED_PUBLIC_PATH = `${CATALOG_DIR}/featured.json`;

/**
 * Origin of the published catalog (a Vercel Blob store), e.g.
 * `https://<store>.public.blob.vercel-storage.com`. When unset, the catalog is
 * read from `public/` after running `bun run catalog` locally.
 */
export function catalogBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_CATALOG_BASE_URL ?? "").replace(/\/+$/, "");
}

export function catalogUrl(file: string): string {
  return `${catalogBaseUrl()}/${file}`;
}
