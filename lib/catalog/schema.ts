import { isHomebrewToken } from "@/lib/catalog/ids";
import { MAX_DESCRIPTION_LENGTH } from "@/lib/catalog/types";

export interface HomebrewFormulaRecord {
  name: string;
  full_name?: string;
  tap?: string;
  desc?: string | null;
  homepage?: string | null;
  aliases?: string[];
  oldnames?: string[];
  versions?: { stable?: string | null };
  version?: string;
  deprecated?: boolean | string | null;
  disabled?: boolean | string | null;
}

export interface HomebrewCaskRecord {
  token: string;
  full_token?: string;
  tap?: string;
  name?: string | string[];
  desc?: string | null;
  homepage?: string | null;
  version?: string | null;
  deprecated?: boolean | string | null;
  disabled?: boolean | string | null;
}

export interface HomebrewAnalyticsFile {
  items?: Record<string, { count?: string | number }>;
  formulae?: Record<string, { count?: string | number }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isUnavailable(value: unknown): boolean {
  return value === true || typeof value === "string";
}

export function assertFormulaArray(value: unknown): HomebrewFormulaRecord[] {
  if (!Array.isArray(value)) {
    throw new Error("Homebrew formula.json must be an array.");
  }

  if (value.length === 0) {
    throw new Error("Homebrew formula.json is empty.");
  }

  const sample = value[0];
  if (!isRecord(sample) || typeof sample.name !== "string") {
    throw new Error("Homebrew formula.json schema mismatch: missing name.");
  }

  return value as HomebrewFormulaRecord[];
}

export function assertCaskArray(value: unknown): HomebrewCaskRecord[] {
  if (!Array.isArray(value)) {
    throw new Error("Homebrew cask.json must be an array.");
  }

  if (value.length === 0) {
    throw new Error("Homebrew cask.json is empty.");
  }

  const sample = value[0];
  if (!isRecord(sample) || typeof sample.token !== "string") {
    throw new Error("Homebrew cask.json schema mismatch: missing token.");
  }

  return value as HomebrewCaskRecord[];
}

export function parseAnalyticsCounts(value: unknown): Map<string, number> {
  const counts = new Map<string, number>();
  if (!isRecord(value)) {
    return counts;
  }

  const items = isRecord(value.items)
    ? value.items
    : isRecord(value.formulae)
      ? value.formulae
      : value;

  for (const [key, entry] of Object.entries(items)) {
    if (!isRecord(entry)) {
      continue;
    }

    const raw = entry.count;
    const parsed =
      typeof raw === "number"
        ? raw
        : typeof raw === "string"
          ? Number(raw.replaceAll(",", ""))
          : Number.NaN;

    if (Number.isFinite(parsed)) {
      counts.set(key, parsed);
    }
  }

  return counts;
}

export function truncateDescription(value: string | null | undefined): string {
  const trimmed = (value ?? "").replace(/\s+/g, " ").trim();
  if (trimmed.length <= MAX_DESCRIPTION_LENGTH) {
    return trimmed;
  }

  return `${trimmed.slice(0, MAX_DESCRIPTION_LENGTH - 1).trimEnd()}…`;
}

export function displayNameFromCask(cask: HomebrewCaskRecord): string {
  if (typeof cask.name === "string" && cask.name.trim()) {
    return cask.name.trim();
  }

  if (Array.isArray(cask.name)) {
    const first = cask.name.find((item) => item.trim());
    if (first) {
      return first.trim();
    }
  }

  return cask.token;
}

export function isOfficialCoreFormula(formula: HomebrewFormulaRecord): boolean {
  const tap = formula.tap ?? "homebrew/core";
  return (
    !isUnavailable(formula.deprecated) &&
    !isUnavailable(formula.disabled) &&
    isHomebrewToken(formula.name) &&
    (tap === "homebrew/core" || formula.full_name === formula.name)
  );
}

export function isOfficialCask(cask: HomebrewCaskRecord): boolean {
  const tap = cask.tap ?? "homebrew/cask";
  return (
    !isUnavailable(cask.deprecated) &&
    !isUnavailable(cask.disabled) &&
    isHomebrewToken(cask.token) &&
    (tap === "homebrew/cask" || cask.full_token === cask.token)
  );
}

export function formulaVersion(formula: HomebrewFormulaRecord): string {
  return asString(formula.versions?.stable) ?? asString(formula.version) ?? "";
}

export function uniqueAliases(
  token: string,
  name: string,
  extras: string[],
): string[] {
  const seen = new Set<string>([token.toLowerCase(), name.toLowerCase()]);
  const aliases: string[] = [];

  for (const extra of extras) {
    const normalized = extra.trim();
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    aliases.push(normalized);
  }

  return aliases;
}
