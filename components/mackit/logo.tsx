import Link from "next/link";

export function MacKitLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-lg text-foreground"
      aria-label="MacKit home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 9.5h10M7 14.5h6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect
            x="4.25"
            y="4.25"
            width="15.5"
            height="15.5"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      </span>
      {compact ? null : (
        <span className="text-[15px] font-semibold tracking-tight">MacKit</span>
      )}
    </Link>
  );
}
