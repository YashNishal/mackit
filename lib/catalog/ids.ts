import {
  HOMEBREW_TOKEN_PATTERN,
  PACKAGE_KINDS,
  type PackageId,
  type PackageKind,
} from "@/lib/catalog/types";

export function isPackageKind(value: string): value is PackageKind {
  return PACKAGE_KINDS.some((kind) => kind === value);
}

export function isHomebrewToken(token: string): boolean {
  return HOMEBREW_TOKEN_PATTERN.test(token) && !token.includes("/");
}

export function packageId(kind: PackageKind, token: string): PackageId {
  return `${kind}:${token}`;
}

export function parsePackageId(value: string): PackageId | null {
  const separator = value.indexOf(":");
  if (separator <= 0) {
    return null;
  }

  const kind = value.slice(0, separator);
  const token = value.slice(separator + 1);

  if (!isPackageKind(kind) || !isHomebrewToken(token)) {
    return null;
  }

  return packageId(kind, token);
}

export function compactKind(kind: PackageKind): "f" | "c" {
  switch (kind) {
    case "formula":
      return "f";
    case "cask":
      return "c";
    default: {
      const exhaustive: never = kind;
      throw new Error(`Unhandled package kind: ${exhaustive}`);
    }
  }
}

export function expandKind(kind: "f" | "c"): PackageKind {
  switch (kind) {
    case "f":
      return "formula";
    case "c":
      return "cask";
    default: {
      const exhaustive: never = kind;
      throw new Error(`Unhandled compact kind: ${exhaustive}`);
    }
  }
}

export function kindLabel(kind: PackageKind): string {
  switch (kind) {
    case "formula":
      return "CLI";
    case "cask":
      return "App";
    default: {
      const exhaustive: never = kind;
      throw new Error(`Unhandled package kind: ${exhaustive}`);
    }
  }
}
