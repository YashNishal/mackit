"use client";

import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { PackageIcon } from "@/components/mackit/package-icon";
import { PackageInfoButton } from "@/components/mackit/package-info-button";
import { PackageTooltip } from "@/components/mackit/package-tooltip";
import { Input } from "@/components/ui/input";
import { kindLabel } from "@/lib/catalog/ids";
import { searchCatalog } from "@/lib/catalog/search";
import type { CatalogPackage } from "@/lib/catalog/types";

export function SearchBox({
  packages,
  selectedIds,
  onToggle,
  onDetails,
  disabled,
}: {
  packages: CatalogPackage[];
  selectedIds: Set<string>;
  onToggle: (pkg: CatalogPackage) => void;
  onDetails: (pkg: CatalogPackage) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const hits = useMemo(
    () => searchCatalog(packages, query, 12),
    [packages, query],
  );
  const activeIndex = hits.length === 0 ? 0 : Math.min(active, hits.length - 1);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function openDetails(pkg: CatalogPackage) {
    setOpen(false);
    onDetails(pkg);
  }

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          disabled={disabled}
          placeholder="Search apps and tools"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open && hits.length > 0}
          role="combobox"
          className="h-14 rounded-xl border-border/80 bg-card/90 pr-16 pl-12 text-base shadow-lg md:text-base"
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((value) => Math.min(value + 1, Math.max(hits.length - 1, 0)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((value) => Math.max(value - 1, 0));
            } else if (event.key === "Enter" && hits[activeIndex]) {
              event.preventDefault();
              if (event.shiftKey) {
                openDetails(hits[activeIndex].pkg);
              } else {
                onToggle(hits[activeIndex].pkg);
              }
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        <kbd className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-md border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline">
          /
        </kbd>
      </div>
      {open && query.trim() ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-xl border bg-popover p-1.5 shadow-lg"
        >
          {hits.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No apps match “{query.trim()}”.
            </li>
          ) : (
            hits.map((hit, index) => {
              const selected = selectedIds.has(hit.pkg.id);
              return (
                <li
                  key={hit.pkg.id}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`flex items-center rounded-xl ${
                    index === activeIndex ? "bg-muted" : "hover:bg-muted/70"
                  }`}
                  onMouseEnter={() => setActive(index)}
                >
                  <PackageTooltip pkg={hit.pkg}>
                    <button
                      type="button"
                      aria-pressed={selected}
                      aria-label={
                        selected
                          ? `Remove ${hit.pkg.name}`
                          : `Add ${hit.pkg.name}`
                      }
                      className="flex min-w-0 flex-1 items-center gap-3 px-2.5 py-2 text-left"
                      onFocus={() => setActive(index)}
                      onClick={() => onToggle(hit.pkg)}
                    >
                      <PackageIcon
                        pkg={hit.pkg}
                        size="sm"
                        selected={selected}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {hit.pkg.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {hit.pkg.desc || hit.pkg.token}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selected ? "Added" : kindLabel(hit.pkg.kind)}
                      </span>
                    </button>
                  </PackageTooltip>
                  <PackageInfoButton
                    pkg={hit.pkg}
                    onDetails={openDetails}
                    tabIndex={-1}
                    className="mr-2 shrink-0"
                  />
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
