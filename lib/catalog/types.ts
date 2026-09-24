export const PACKAGE_KINDS = ["formula", "cask"] as const;

export type PackageKind = (typeof PACKAGE_KINDS)[number];

export type PackageId = `${PackageKind}:${string}`;

export interface CatalogPackage {
  id: PackageId;
  kind: PackageKind;
  token: string;
  name: string;
  desc: string;
  homepage: string;
  version: string;
  popularity: number;
  aliases: string[];
}

export interface CompactPackage {
  k: "f" | "c";
  t: string;
  n: string;
  d: string;
  h: string;
  v: string;
  p: number;
  a?: string[];
}

export interface CompactCatalog {
  version: 1;
  generatedAt: string;
  packages: CompactPackage[];
}

export interface CatalogFile {
  version: 1;
  generatedAt: string;
  packages: CatalogPackage[];
}

export interface CatalogMeta {
  version: 1;
  generatedAt: string;
  formulaCount: number;
  caskCount: number;
  packageCount: number;
  /** Content-hashed, immutable file holding the full catalog. */
  packagesFile: string;
  source: {
    formula: string;
    cask: string;
  };
}

export interface SearchHit {
  pkg: CatalogPackage;
  score: number;
}

export const HOMEBREW_TOKEN_PATTERN = /^[a-z0-9][a-z0-9+\-._@]*$/;

export const MAX_DESCRIPTION_LENGTH = 140;
export const MAX_CART_SIZE = 50;
export const CATALOG_VERSION = 1 as const;
