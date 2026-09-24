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
  const picked = category.packages.filter((pkg) => selectedIds.has(pkg.id)).length;

  return (
    <section
      aria-labelledby={`category-${category.id}`}
      className="grid gap-4 border-t py-8 md:grid-cols-[13rem_1fr] md:gap-8"
    >
      <div className="md:pt-3">
        <h2
          id={`category-${category.id}`}
          className="text-[17px] font-semibold tracking-[-0.01em]"
        >
          {category.label}
        </h2>
        <p className="mt-1 max-w-[34ch] text-sm leading-5 text-muted-foreground">
          {category.description}
        </p>
        {picked > 0 ? (
          <p className="mt-2 text-xs font-medium text-foreground/70 tabular-nums">
            {picked} of {category.packages.length} picked
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(5.25rem,1fr))] gap-x-1 gap-y-2">
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
