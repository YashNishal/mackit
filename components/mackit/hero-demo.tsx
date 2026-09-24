"use client";

import { Check } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { MacKitMark } from "@/components/mackit/logo";
import { PackageIcon } from "@/components/mackit/package-icon";
import type { ResolvedCategory } from "@/data/categories";
import type { CatalogPackage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/*
 * A looping, wordless demo of the product: pick three apps, watch them land in
 * the Dock, press Install, and a Terminal ticks them off. Everything sits on a
 * fixed 420×360 stage so the cursor and flight paths can use plain numbers.
 */

const STAGE = { w: 420, h: 360 } as const;

const GRID_TOKENS = [
  "google-chrome",
  "slack",
  "notion",
  "figma",
  "spotify",
  "visual-studio-code",
];

/** Grid cell centers (icon centers) for a 3×2 grid. */
const CELL = [
  { x: 114, y: 44 },
  { x: 210, y: 44 },
  { x: 306, y: 44 },
  { x: 114, y: 150 },
  { x: 210, y: 150 },
  { x: 306, y: 150 },
] as const;

/** Grid cells the cursor picks, in order. */
const PICKS = [0, 5, 1] as const;

/** Dock slot centers, and the Install button. See the Dock markup below. */
const SLOT = [
  { x: 144, y: 318 },
  { x: 190, y: 318 },
  { x: 236, y: 318 },
] as const;
const INSTALL = { x: 313, y: 318 } as const;
const REST = { x: 372, y: 250 } as const;

/** [duration in ms] for each step of the loop. */
const STEPS = [
  900, // 0 idle
  750, // 1 move to pick 1
  450, // 2 click pick 1
  700, // 3 move to pick 2
  450, // 4 click pick 2
  700, // 5 move to pick 3
  550, // 6 click pick 3
  800, // 7 move to Install
  320, // 8 click Install
  650, // 9 Terminal opens
  520, // 10 line 1
  520, // 11 line 2
  620, // 12 line 3
  1300, // 13 summary
  1800, // 14 Terminal closes, apps "running"
  650, // 15 fade out
] as const;
const STATIC_STEP = 14;

function cursorAt(step: number) {
  const target = (cell: number) => ({ x: CELL[cell].x + 6, y: CELL[cell].y + 8 });
  if (step === 0) return REST;
  if (step <= 2) return target(PICKS[0]);
  if (step <= 4) return target(PICKS[1]);
  if (step <= 6) return target(PICKS[2]);
  if (step <= 8) return { x: INSTALL.x + 4, y: INSTALL.y + 4 };
  return REST;
}

function pickedCount(step: number) {
  if (step >= 6) return 3;
  if (step >= 4) return 2;
  if (step >= 2) return 1;
  return 0;
}

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function pickPackages(featured: ResolvedCategory[]): CatalogPackage[] {
  const all = featured.flatMap((category) => category.packages);
  const byToken = new Map(all.map((pkg) => [pkg.token, pkg]));
  const chosen = GRID_TOKENS.map((token) => byToken.get(token)).filter(
    (pkg): pkg is CatalogPackage => Boolean(pkg),
  );
  for (const pkg of all) {
    if (chosen.length >= GRID_TOKENS.length) break;
    if (!chosen.includes(pkg)) chosen.push(pkg);
  }
  return chosen.slice(0, GRID_TOKENS.length);
}

function Cursor({ step }: { step: number }) {
  const { x, y } = cursorAt(step);
  const pressed = step === 2 || step === 4 || step === 6 || step === 8;
  const hidden = step >= 9;

  return (
    <div
      className="absolute top-0 left-0 z-30 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.45,0,0.2,1)]"
      style={{ transform: `translate(${x}px, ${y}px)`, opacity: hidden ? 0 : 1 }}
    >
      <svg
        viewBox="0 0 14 20"
        width="15"
        height="21"
        className={cn(
          "drop-shadow-[0_1px_1.5px_rgb(0_0_0/0.3)] transition-transform duration-100",
          pressed && "scale-85",
        )}
      >
        <path
          d="M1 1v15.2l3.9-3.7 2.7 6 2.4-1.1-2.6-5.8h5.4z"
          fill="#1c1c1f"
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Terminal({ step, picks }: { step: number; picks: CatalogPackage[] }) {
  const open = step >= 9 && step <= 13;
  const shown = (from: number) => (step >= from ? "opacity-100" : "opacity-0");

  return (
    <div
      className={cn(
        "terminal-preview absolute z-20 overflow-hidden rounded-[12px] shadow-2xl ring-1 ring-black/15 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
      style={{ left: 38, top: 36, width: 344 }}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="flex-1 pr-10 text-center text-[11px] text-white/45">Terminal</span>
      </div>
      <div className="space-y-1 px-4 pt-3 pb-4 font-mono text-[11.5px] leading-5">
        <p className={cn("text-white/55 transition-opacity duration-300", shown(9))}>
          MacKit: Installing {picks.length} apps
        </p>
        {picks.map((pkg, index) => (
          <p
            key={pkg.id}
            className={cn(
              "flex items-center gap-2 transition-opacity duration-300",
              shown(10 + index),
            )}
          >
            <Check className="size-3.5 text-[#28c840]" strokeWidth={3} />
            {pkg.name}
          </p>
        ))}
        <p className={cn("pt-2 text-white/55 transition-opacity duration-300", shown(13))}>
          Done. {picks.length} installed, 0 failed.
        </p>
      </div>
    </div>
  );
}

export function HeroDemo({ featured }: { featured: ResolvedCategory[] }) {
  const packages = useMemo(() => pickPackages(featured), [featured]);
  const picks = PICKS.map((cell) => packages[cell]).filter(Boolean);
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry.isIntersecting),
    );
    observer.observe(node);
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const running = !reduced && onScreen && pageVisible;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setStep((current) => (current + 1) % STEPS.length),
      STEPS[step],
    );
    return () => window.clearTimeout(timer);
  }, [running, step]);

  if (packages.length < GRID_TOKENS.length) {
    return null;
  }

  const current = reduced ? STATIC_STEP : step;
  const picked = pickedCount(current);
  const installed = current >= 14;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Animation: three apps are picked and collect in the Dock, then one Terminal command installs them all."
      className="relative shrink-0 select-none"
      style={{ width: STAGE.w, height: STAGE.h }}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          current === 15 ? "opacity-0" : "opacity-100",
        )}
      >
        {packages.map((pkg, index) => {
          const pickOrder = PICKS.indexOf(index as (typeof PICKS)[number]);
          const selected = pickOrder !== -1 && pickOrder < picked;
          return (
            <div
              key={pkg.id}
              className={cn(
                "absolute flex w-24 flex-col items-center gap-2 transition-opacity duration-500",
                current >= 9 && current <= 13 && "opacity-25",
              )}
              style={{ left: CELL[index].x - 48, top: CELL[index].y - 28 }}
            >
              <span className="relative">
                <PackageIcon pkg={pkg} size="lg" selected={selected} />
                <span
                  className={cn(
                    "absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background transition-[opacity,scale] duration-200",
                    selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                  )}
                >
                  <Check className="size-3 stroke-3" />
                </span>
              </span>
              <span className="w-full truncate text-center text-[11px] text-muted-foreground">
                {pkg.name}
              </span>
            </div>
          );
        })}

        <Terminal step={current} picks={picks} />

        {/* Mini Dock. Widths are fixed so SLOT and INSTALL line up. */}
        <div
          className="dock absolute flex items-center gap-2 rounded-[18px] p-2"
          style={{ left: 59, top: 290, width: 302, height: 56 }}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-primary text-primary-foreground">
            <MacKitMark className="size-5" />
          </span>
          <span className="h-8 w-px shrink-0 bg-foreground/15" />
          <span className="flex w-[132px] shrink-0 gap-1.5">
            {SLOT.map((slot, index) => {
              const pkg = picks[index];
              const filled = pkg && index < picked;
              const from = CELL[PICKS[index]];
              return (
                <span key={index} className="relative size-10 shrink-0">
                  {filled ? (
                    <span
                      className="demo-fly absolute inset-0 [&>span]:size-10! [&>span]:rounded-[11px]!"
                      style={
                        {
                          "--dx": `${from.x - slot.x}px`,
                          "--dy": `${from.y - slot.y}px`,
                        } as CSSProperties
                      }
                    >
                      <PackageIcon pkg={pkg} size="md" />
                    </span>
                  ) : (
                    <span className="absolute inset-0 rounded-[11px] border border-dashed border-foreground/15" />
                  )}
                  <span
                    className={cn(
                      "absolute -bottom-[5px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground/60 transition-opacity duration-300",
                      filled && installed ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
              );
            })}
          </span>
          <span className="h-8 w-px shrink-0 bg-foreground/15" />
          <span
            className={cn(
              "flex h-10 w-20 shrink-0 items-center justify-center rounded-[11px] bg-primary text-[13px] font-semibold text-primary-foreground tabular-nums transition-[opacity,scale] duration-150",
              picked === 0 && "opacity-40",
              current === 8 && "scale-95",
            )}
          >
            {installed ? "Done" : picked > 0 ? `Install ${picked}` : "Install"}
          </span>
        </div>
      </div>

      {reduced ? null : <Cursor step={current} />}
    </div>
  );
}
