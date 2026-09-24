"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MacKitLogo } from "@/components/mackit/logo";
import { ThemeToggle } from "@/components/mackit/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-foreground/[0.07] bg-background/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-13 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <MacKitLogo />
        <nav className="flex items-center gap-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={cn(
                "rounded-[8px] px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                pathname === item.href && "text-foreground font-medium",
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
