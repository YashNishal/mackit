import Link from "next/link";
import { RetroWindow } from "@/components/retro/retro-window";
import { SiteFooter } from "@/components/retro/site-footer";
import { SiteHeader } from "@/components/retro/site-header";

export function RetroSafety() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-2 py-6 sm:px-3">
        <RetroWindow title="Safety" meta="Read me">
          <p className="font-mono text-[11px]">MacKit</p>
          <h1 className="mt-1 font-display text-2xl font-bold">
            Inspect before you paste.
          </h1>
          <div className="mt-4 space-y-4 text-[13px] leading-6">
            <p>
              Installing software always requires trust. MacKit is designed so you
              can see exactly what will run.
            </p>
            <ul className="list-disc space-y-3 border-2 border-foreground p-4 pl-8">
              <li>The cart never leaves your browser. There are no accounts or analytics.</li>
              <li>
                The copied command downloads a versioned runner and verifies its
                SHA-256 digest before executing it.
              </li>
              <li>
                The runner accepts only a typed list of known app IDs. It rejects
                flags, paths, and extra commands.
              </li>
              <li>
                Your Mac may ask for your password while some apps install.
                MacKit does not use sudo.
              </li>
              <li>
                Checkout shows the runner source, checksum, and package list before
                you copy anything.
              </li>
            </ul>
            <p>
              Apps are installed with Homebrew, so you still need to trust this
              website and Homebrew. Read the generated command. If anything
              looks unexpected, do not run it.
            </p>
            <p>
              <Link href="/" className="border border-foreground px-2 py-1 font-bold hover:bg-foreground hover:text-background">
                Back to the catalog
              </Link>
            </p>
          </div>
        </RetroWindow>
      </main>
      <SiteFooter />
    </div>
  );
}
