import { compactKind, expandKind, packageId } from "@/lib/catalog/ids";
import type {
  CatalogFile,
  CatalogPackage,
  CompactCatalog,
  CompactPackage,
} from "@/lib/catalog/types";
import { CATALOG_VERSION } from "@/lib/catalog/types";

export function toCompactPackage(pkg: CatalogPackage): CompactPackage {
  const compact: CompactPackage = {
    k: compactKind(pkg.kind),
    t: pkg.token,
    n: pkg.name,
    d: pkg.desc,
    h: pkg.homepage,
    v: pkg.version,
    p: pkg.popularity,
  };

  if (pkg.aliases.length > 0) {
    compact.a = pkg.aliases;
  }

  return compact;
}

export function fromCompactPackage(pkg: CompactPackage): CatalogPackage {
  const kind = expandKind(pkg.k);
  return {
    id: packageId(kind, pkg.t),
    kind,
    token: pkg.t,
    name: pkg.n,
    desc: pkg.d,
    homepage: pkg.h,
    version: pkg.v,
    popularity: pkg.p,
    aliases: pkg.a ?? [],
  };
}

export function toCompactCatalog(catalog: CatalogFile): CompactCatalog {
  return {
    version: CATALOG_VERSION,
    generatedAt: catalog.generatedAt,
    packages: catalog.packages.map(toCompactPackage),
  };
}

export function fromCompactCatalog(catalog: CompactCatalog): CatalogFile {
  if (catalog.version !== CATALOG_VERSION) {
    throw new Error(`Unsupported catalog version: ${catalog.version}`);
  }

  return {
    version: CATALOG_VERSION,
    generatedAt: catalog.generatedAt,
    packages: catalog.packages.map(fromCompactPackage),
  };
}

export function indexById(
  packages: CatalogPackage[],
): Map<string, CatalogPackage> {
  return new Map(packages.map((pkg) => [pkg.id, pkg]));
}
