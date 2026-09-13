"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { PackageIcon } from "@/components/retro/package-icon";
import { PackageInfoButton } from "@/components/retro/package-info-button";
import { PackageTooltip } from "@/components/retro/package-tooltip";
import { Input } from "@/components/ui/input";
import { kindLabel } from "@/lib/catalog/ids";
import { searchCatalog } from "@/lib/catalog/search";
import type { CatalogPackage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

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
      <div className="border-2 border-foreground bg-background p-1">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="pl-2 font-sans text-[13px] font-bold whitespace-nowrap">
            Find:
          </span>
          <Input
            value={query}
            disabled={disabled}
            placeholder="Search apps and tools"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={open && hits.length > 0}
            role="combobox"
            className="h-10 scroll-mt-20 border-0 bg-transparent px-2 text-[13px] shadow-none focus-visible:ring-0"
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
          <kbd className="mr-2 hidden shrink-0 border border-foreground px-1.5 py-0.5 font-mono text-[11px] sm:inline">
            /
          </kbd>
        </div>
      </div>
      {open && query.trim() ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-80 w-full overflow-auto border-2 border-foreground bg-background p-1 shadow-[4px_4px_0_0_var(--foreground)]"
        >
          {hits.length === 0 ? (
            <li className="px-3 py-6 text-center text-[13px]">
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
                  className={cn(
                    "flex items-center border border-transparent",
                    index === activeIndex
                      ? "bg-foreground text-background"
                      : "hover:bg-muted",
                  )}
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
                        selected={index === activeIndex ? true : selected}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold">
                          {hit.pkg.name}
                        </span>
                        <span
                          className={cn(
                            "block truncate font-mono text-[11px]",
                            index === activeIndex ? "text-background" : "opacity-70",
                          )}
                        >
                          {hit.pkg.desc || hit.pkg.token}
                        </span>
                      </span>
                      <span className="font-mono text-[11px]">
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
