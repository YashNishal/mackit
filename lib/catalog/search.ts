import type { CatalogPackage, SearchHit } from "@/lib/catalog/types";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function compact(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function isSubsequence(query: string, target: string): boolean {
  let index = 0;
  for (const char of target) {
    if (char === query[index]) {
      index += 1;
      if (index === query.length) {
        return true;
      }
    }
  }
  return false;
}

function popularityBonus(popularity: number): number {
  if (popularity <= 0) {
    return 0;
  }

  return Math.log10(popularity + 1) * 8;
}

export function scorePackage(query: string, pkg: CatalogPackage): number {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return 0;
  }

  const compactQuery = compact(query);
  const token = pkg.token.toLowerCase();
  const compactToken = compact(pkg.token);
  const name = normalize(pkg.name);
  const compactName = compact(pkg.name);
  const aliases = pkg.aliases.map((alias) => alias.toLowerCase());
  const compactAliases = pkg.aliases.map((alias) => compact(alias));
  const desc = normalize(pkg.desc);

  let score = 0;

  if (token === normalizedQuery || compactToken === compactQuery) {
    score = 1000;
  } else if (name === normalizedQuery || compactName === compactQuery) {
    score = 940;
  } else if (
    aliases.includes(normalizedQuery) ||
    compactAliases.includes(compactQuery)
  ) {
    score = 900;
  } else if (token.startsWith(normalizedQuery) || compactToken.startsWith(compactQuery)) {
    score = 760;
  } else if (name.startsWith(normalizedQuery) || compactName.startsWith(compactQuery)) {
    score = 700;
  } else if (token.includes(normalizedQuery) || compactToken.includes(compactQuery)) {
    score = 520;
  } else if (name.includes(normalizedQuery) || compactName.includes(compactQuery)) {
    score = 460;
  } else if (
    aliases.some(
      (alias) =>
        alias.includes(normalizedQuery) || compact(alias).includes(compactQuery),
    )
  ) {
    score = 420;
  } else if (desc.includes(normalizedQuery)) {
    score = 180;
  } else if (
    compactQuery.length >= 3 &&
    (isSubsequence(compactQuery, compactToken) ||
      isSubsequence(compactQuery, compactName))
  ) {
    score = 80;
  }

  if (score === 0) {
    return 0;
  }

  return score + popularityBonus(pkg.popularity);
}

export function searchCatalog(
  packages: CatalogPackage[],
  query: string,
  limit = 40,
): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const hits: SearchHit[] = [];

  for (const pkg of packages) {
    const score = scorePackage(trimmed, pkg);
    if (score > 0) {
      hits.push({ pkg, score });
    }
  }

  hits.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (right.pkg.popularity !== left.pkg.popularity) {
      return right.pkg.popularity - left.pkg.popularity;
    }

    return left.pkg.name.localeCompare(right.pkg.name);
  });

  return hits.slice(0, limit);
}
