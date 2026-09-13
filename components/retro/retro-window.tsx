import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RetroWindow({
  title,
  meta,
  children,
  className,
  bodyClassName,
  id,
}: {
  title: string;
  meta?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
}) {
  return (
    <section
      aria-label={title}
      id={id}
      className={cn("retro-window bg-background text-foreground", className)}
    >
      <div className="flex items-center gap-2 border-b-2 border-foreground px-2 py-1">
        <span aria-hidden="true" className="size-3 shrink-0 border-2 border-foreground bg-background" />
        <span aria-hidden="true" className="retro-stripes h-3 min-w-4 flex-1" />
        <h2 className="shrink-0 bg-background px-2 text-center font-sans text-[13px] font-bold tracking-normal">
          {title}
        </h2>
        <span aria-hidden="true" className="retro-stripes h-3 min-w-4 flex-1" />
        <span aria-hidden="true" className="flex shrink-0 gap-1">
          <span className="block size-3 border-2 border-foreground" />
        </span>
      </div>
      {meta ? (
        <div className="flex items-center justify-between gap-3 border-b-2 border-foreground px-3 py-1 font-mono text-[11px]">
          <span>{meta}</span>
        </div>
      ) : null}
      <div className={cn("p-3", bodyClassName)}>{children}</div>
    </section>
  );
}
