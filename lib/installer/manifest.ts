import { decodeCartIds, uniqueSortedIds } from "@/lib/cart/codec";
import { MAX_CART_SIZE, type PackageId } from "@/lib/catalog/types";

export const MANIFEST_VERSION = 1;
export const MANIFEST_HEADER = `MACKIT/${MANIFEST_VERSION}`;

export function encodeManifest(ids: PackageId[]): string {
  const lines = [MANIFEST_HEADER];

  for (const id of uniqueSortedIds(ids).slice(0, MAX_CART_SIZE)) {
    const [kind, token] = splitId(id);
    const prefix = kind === "formula" ? "f" : "c";
    lines.push(`${prefix} ${token}`);
  }

  return lines.join("\n");
}

export function decodeManifest(text: string): PackageId[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines[0] !== MANIFEST_HEADER) {
    throw new Error("Unsupported or missing MacKit manifest header.");
  }

  const compact: string[] = [];

  for (const line of lines.slice(1)) {
    const match = /^(f|c) ([a-z0-9][a-z0-9+\-._@]*)$/.exec(line);
    if (!match) {
      throw new Error(`Invalid manifest line: ${line}`);
    }

    compact.push(`${match[1]}:${match[2]}`);
  }

  const decoded = decodeCartIds(compact.join(","));
  if (decoded.invalid.length > 0) {
    throw new Error(`Invalid manifest tokens: ${decoded.invalid.join(", ")}`);
  }

  return decoded.ids;
}

export function encodeUtf8Base64(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64");
  }

  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export function decodeUtf8Base64(value: string): string {
  const normalized = value.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(normalized)) {
    throw new Error("Manifest is not valid Base64.");
  }

  if (typeof Buffer !== "undefined") {
    return Buffer.from(normalized, "base64").toString("utf8");
  }

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeManifestBase64(ids: PackageId[]): string {
  return encodeUtf8Base64(encodeManifest(ids));
}

export function decodeManifestBase64(value: string): PackageId[] {
  return decodeManifest(decodeUtf8Base64(value));
}

function splitId(id: PackageId): ["formula" | "cask", string] {
  if (id.startsWith("formula:")) {
    return ["formula", id.slice("formula:".length)];
  }

  return ["cask", id.slice("cask:".length)];
}
