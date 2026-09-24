import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Collapsed by default. The everyday view stays free of package-manager
 * detail; anyone curious can open this to see exactly what runs.
 */
export function TechnicalDetails({
  children,
  className,
  label = "Technical details",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <details className={cn("group min-w-0 text-sm", className)}>
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md text-muted-foreground select-none hover:text-foreground [&::-webkit-details-marker]:hidden">
        <ChevronRight
          aria-hidden="true"
          className="size-3.5 transition-transform duration-150 group-open:rotate-90"
        />
        {label}
      </summary>
      <div className="mt-3 min-w-0">{children}</div>
    </details>
  );
}
