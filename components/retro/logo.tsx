import Link from "next/link";

export function MacKitLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-1.5 px-1 py-0.5 text-foreground hover:bg-foreground hover:text-background"
      aria-label="MacKit home"
    >
      <svg
        viewBox="0 0 16 16"
        className="size-4"
        fill="currentColor"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <path d="M4 1h8v2H4zM2 3h12v9H2zM3 4h1v7H3zM12 4h1v7h-1zM4 12h8v1H4zM6 13h4v2H6zM7 11h2v1H7z" />
      </svg>
      {compact ? null : (
        <span className="text-[13px] font-bold tracking-normal">MacKit</span>
      )}
    </Link>
  );
}
