import { parsePackageId } from "@/lib/catalog/ids";
import { MAX_CART_SIZE, type PackageId } from "@/lib/catalog/types";

export const CART_QUERY_PARAM = "k";
export const CART_STORAGE_KEY = "mackit-cart";

export interface CartCodecResult {
  ids: PackageId[];
  invalid: string[];
  truncated: boolean;
}

export function uniqueSortedIds(ids: PackageId[]): PackageId[] {
  return [...new Set(ids)].sort((left, right) => left.localeCompare(right));
}

export function encodeCartIds(ids: PackageId[]): string {
  return uniqueSortedIds(ids)
    .slice(0, MAX_CART_SIZE)
    .map((id) => id.replace("formula:", "f:").replace("cask:", "c:"))
    .join(",");
}

export function decodeCartIds(value: string | null | undefined): CartCodecResult {
  if (!value || !value.trim()) {
    return { ids: [], invalid: [], truncated: false };
  }

  const invalid: string[] = [];
  const parsed: PackageId[] = [];

  for (const raw of value.split(",")) {
    const piece = raw.trim();
    if (!piece) {
      continue;
    }

    const expanded = piece
      .replace(/^f:/, "formula:")
      .replace(/^c:/, "cask:");
    const id = parsePackageId(expanded);

    if (!id) {
      invalid.push(piece);
      continue;
    }

    parsed.push(id);
  }

  const unique = uniqueSortedIds(parsed);
  const truncated = unique.length > MAX_CART_SIZE;

  return {
    ids: unique.slice(0, MAX_CART_SIZE),
    invalid,
    truncated,
  };
}

export function cartSharePath(ids: PackageId[]): string {
  const encoded = encodeCartIds(ids);
  if (!encoded) {
    return "/";
  }

  return `/?${CART_QUERY_PARAM}=${encodeURIComponent(encoded)}`;
}
