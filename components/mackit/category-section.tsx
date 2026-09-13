"use client";

import { PackageTile } from "@/components/mackit/package-tile";
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
    <section aria-labelledby={`category-${category.id}`} className="space-y-3 border-t border-border/70 pt-8">
      <div className="max-w-xl">
        <h2
          id={`category-${category.id}`}
          className="font-display text-lg font-semibold tracking-tight"
        >
          {category.label}
        </h2>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
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
    </section>
  );
}
