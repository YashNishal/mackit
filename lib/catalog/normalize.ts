import { applyExtraAliases } from "@/data/categories";
import { packageId } from "@/lib/catalog/ids";
import {
  displayNameFromCask,
  formulaVersion,
  isOfficialCask,
  isOfficialCoreFormula,
  truncateDescription,
  uniqueAliases,
  type HomebrewCaskRecord,
  type HomebrewFormulaRecord,
} from "@/lib/catalog/schema";
import type { CatalogPackage } from "@/lib/catalog/types";

export function normalizeFormula(
  formula: HomebrewFormulaRecord,
  popularity: number,
): CatalogPackage | null {
  if (!isOfficialCoreFormula(formula)) {
    return null;
  }

  const pkg: CatalogPackage = {
    id: packageId("formula", formula.name),
    kind: "formula",
    token: formula.name,
    name: formula.name,
    desc: truncateDescription(formula.desc),
    homepage: formula.homepage ?? "",
    version: formulaVersion(formula),
    popularity,
    aliases: uniqueAliases(formula.name, formula.name, [
      ...(formula.aliases ?? []),
      ...(formula.oldnames ?? []),
    ]),
  };

  return applyExtraAliases(pkg);
}

export function normalizeCask(
  cask: HomebrewCaskRecord,
  popularity: number,
): CatalogPackage | null {
  if (!isOfficialCask(cask)) {
    return null;
  }

  const name = displayNameFromCask(cask);
  const pkg: CatalogPackage = {
    id: packageId("cask", cask.token),
    kind: "cask",
    token: cask.token,
    name,
    desc: truncateDescription(cask.desc),
    homepage: cask.homepage ?? "",
    version: cask.version ?? "",
    popularity,
    aliases: uniqueAliases(cask.token, name, []),
  };

  return applyExtraAliases(pkg);
}

export function sortPackages(packages: CatalogPackage[]): CatalogPackage[] {
  return [...packages].sort((left, right) => {
    if (right.popularity !== left.popularity) {
      return right.popularity - left.popularity;
    }

    return left.id.localeCompare(right.id);
  });
}
