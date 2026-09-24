import Link from "next/link";

/** A Dock shelf holding three app tiles. */
export function MacKitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="4" y="6.5" width="4.5" height="4.5" rx="1.3" fill="currentColor" />
      <rect x="9.75" y="6.5" width="4.5" height="4.5" rx="1.3" fill="currentColor" />
      <rect x="15.5" y="6.5" width="4.5" height="4.5" rx="1.3" fill="currentColor" opacity="0.45" />
      <path d="M3 15.5h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MacKitLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-lg text-foreground"
      aria-label="MacKit home"
    >
      <span className="flex size-7 items-center justify-center rounded-[8px] bg-primary text-primary-foreground">
        <MacKitMark className="size-[18px]" />
      </span>
      {compact ? null : (
        <span className="text-[15px] font-semibold tracking-[-0.01em]">MacKit</span>
      )}
    </Link>
  );
}
