"use client";

import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PackageIcon } from "@/components/mackit/package-icon";
import { PackageInfoButton } from "@/components/mackit/package-info-button";
import { PackageTooltip } from "@/components/mackit/package-tooltip";
import { useMode } from "@/components/mode-provider";
import { Input } from "@/components/ui/input";
import { kindLabel } from "@/lib/catalog/ids";
import { searchCatalog } from "@/lib/catalog/search";
import type { CatalogPackage } from "@/lib/catalog/types";

/** Typing any of these reveals a hidden result that opens the retro UI. */
const RETRO_QUERIES = new Set(["retro", "classic", "classic mac", "1984", "system 7", "macintosh"]);

function HappyMac({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="5" y="2" width="14" height="19" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <rect x="7.5" y="4.5" width="9" height="7.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.2 6.6v1.1M13.8 6.6v1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10.2 9.6c1.1.9 2.5.9 3.6 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12.5 15.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6.5 21v1h11v-1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

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
  const { setMode } = useMode();
  const retro = RETRO_QUERIES.has(query.trim().toLowerCase());
  const offset = retro ? 1 : 0;
  const rowCount = hits.length + offset;
  const activeIndex = rowCount === 0 ? 0 : Math.min(active, rowCount - 1);

  function enterRetro() {
    setOpen(false);
    setQuery("");
    setMode("retro");
    toast.success("Welcome back to 1984.");
    window.scrollTo({ top: 0 });
  }

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
        <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          disabled={disabled}
          placeholder={`Search ${packages.length.toLocaleString("en")} apps and tools`}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open && rowCount > 0}
          role="combobox"
          className="h-13 rounded-[14px] border-input bg-card pr-14 pl-11 text-base shadow-xs placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:ring-offset-0 md:text-base dark:bg-card"
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
              setActive((value) => Math.min(value + 1, Math.max(rowCount - 1, 0)));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((value) => Math.max(value - 1, 0));
            } else if (event.key === "Enter" && retro && activeIndex === 0) {
              event.preventDefault();
              enterRetro();
            } else if (event.key === "Enter" && hits[activeIndex - offset]) {
              event.preventDefault();
              const hit = hits[activeIndex - offset];
              if (event.shiftKey) {
                openDetails(hit.pkg);
              } else {
                onToggle(hit.pkg);
              }
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        />
        <kbd className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 rounded-[6px] border bg-background px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline">
          /
        </kbd>
      </div>
      {open && query.trim() ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-96 w-full overflow-auto rounded-[14px] border bg-popover p-1.5 shadow-xl"
        >
          {retro ? (
            <li
              role="option"
              aria-selected={activeIndex === 0}
              className={`flex items-center rounded-[10px] ${activeIndex === 0 ? "bg-muted" : ""}`}
              onMouseEnter={() => setActive(0)}
            >
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 px-2.5 py-2 text-left"
                onFocus={() => setActive(0)}
                onClick={enterRetro}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-[#efead8] text-[#23221e] shadow-[inset_0_0_0_1.5px_#23221e]">
                  <HappyMac className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">Classic Mac</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    Switch MacKit to the 1984 look
                  </span>
                </span>
              </button>
            </li>
          ) : null}
          {rowCount === 0 ? (
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
                  aria-selected={index + offset === activeIndex}
                  className={`flex items-center rounded-[10px] ${
                    index + offset === activeIndex ? "bg-muted" : ""
                  }`}
                  onMouseEnter={() => setActive(index + offset)}
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
                      onFocus={() => setActive(index + offset)}
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
                      <span
                        className={
                          selected
                            ? "rounded-md bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground"
                            : "text-xs text-muted-foreground"
                        }
                      >
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
