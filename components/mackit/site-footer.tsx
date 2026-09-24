import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter({
  generatedAt,
  className,
}: {
  generatedAt?: string;
  className?: string;
}) {
  const formatted = generatedAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
        new Date(generatedAt),
      )
    : null;

  return (
    <footer className={cn("border-t pt-8 pb-10", className)}>
      <div className="mx-auto grid w-full max-w-6xl gap-x-8 gap-y-3 px-4 text-sm text-muted-foreground sm:px-6 md:grid-cols-[13rem_1fr_auto]">
        <p className="font-medium text-foreground">MacKit</p>
        <p className="max-w-[60ch]">
          Your list stays in this browser. MacKit has no accounts or analytics,
          and never sees what you install.{" "}
          <Link href="/safety" className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
            How MacKit stays safe
          </Link>
        </p>
        {formatted ? (
          <p className="tabular-nums md:text-right">App list updated {formatted}</p>
        ) : null}
      </div>
    </footer>
  );
}
