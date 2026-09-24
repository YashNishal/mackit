import { del, list, put } from "@vercel/blob";
import { buildCatalog, serializeCatalog } from "@/lib/catalog/build";
import { CATALOG_PACKAGES_PREFIX } from "@/lib/catalog/paths";
import type { CatalogMeta } from "@/lib/catalog/types";

const IMMUTABLE_MAX_AGE_SECONDS = 31_536_000;
// meta.json and featured.json are only read by the server during revalidation.
const MUTABLE_MAX_AGE_SECONDS = 300;
// Pages rendered before a publish may still point at the previous version.
const PACKAGE_VERSIONS_TO_KEEP = 2;

/**
 * Builds the catalog from Homebrew and uploads it to Vercel Blob. Credentials
 * come from the connected store (OIDC + BLOB_STORE_ID, or BLOB_READ_WRITE_TOKEN).
 */
export async function publishCatalog(): Promise<CatalogMeta> {
  // buildCatalog validates the Homebrew data and throws before anything is
  // uploaded, so a bad fetch leaves the last good catalog in place.
  const built = await buildCatalog();
  const { files, meta } = serializeCatalog(built.catalog, built.meta);

  for (const file of files) {
    await put(file.path, file.contents, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: file.immutable
        ? IMMUTABLE_MAX_AGE_SECONDS
        : MUTABLE_MAX_AGE_SECONDS,
    });
  }

  await pruneOldPackageFiles(meta.packagesFile);
  return meta;
}

async function pruneOldPackageFiles(current: string) {
  const { blobs } = await list({ prefix: CATALOG_PACKAGES_PREFIX });
  const stale = blobs
    .filter((blob) => blob.pathname !== current)
    .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    .slice(PACKAGE_VERSIONS_TO_KEEP - 1);

  if (stale.length > 0) {
    await del(stale.map((blob) => blob.url));
    console.log(
      `[catalog] Pruned ${stale.map((blob) => blob.pathname).join(", ")}`,
    );
  }
}
