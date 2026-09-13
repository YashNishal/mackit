"use client";

import { PackageTile } from "@/components/retro/package-tile";
import { RetroWindow } from "@/components/retro/retro-window";
import type { ResolvedCategory } from "@/data/categories";
import type { CatalogPackage } from "@/lib/catalog/types";

export function CategorySection({
  category,
  selectedIds,
  onToggle,
  onDetails,
}: {
  category: ResolvedCategory;
  selectedIds: Set<string>;
  onToggle: (pkg: CatalogPackage) => void;
  onDetails: (pkg: CatalogPackage) => void;
}) {
  return (
    <RetroWindow
      title={category.label}
      meta={`${category.packages.length} items`}
      id={`category-${category.id}`}
    >
      <p className="mb-3 max-w-xl text-[13px] text-foreground">{category.description}</p>
      <div className="flex flex-wrap gap-x-1 gap-y-3">
        {category.packages.map((pkg) => (
          <PackageTile
            key={pkg.id}
            pkg={pkg}
            selected={selectedIds.has(pkg.id)}
            onToggle={onToggle}
            onDetails={onDetails}
          />
        ))}
      </div>
    </RetroWindow>
  );
}
