import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/mackit/site-footer";
import { SiteHeader } from "@/components/mackit/site-header";

export const metadata: Metadata = {
  title: "Safety",
};

export default function SafetyPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-primary">Safety</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Inspect before you paste.
        </h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-muted-foreground">
          <p>
            Installing software always requires trust. MacKit is designed so you
            can see exactly what will run.
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>The cart never leaves your browser. There are no accounts or analytics.</li>
            <li>
              The copied command downloads a versioned runner and verifies its
              SHA-256 digest before executing it.
            </li>
            <li>
              The runner accepts only a typed list of Homebrew tokens. It rejects
              flags, paths, and extra commands.
            </li>
            <li>
              Homebrew itself may ask for your Mac password. MacKit does not use
              sudo.
            </li>
            <li>
              Checkout shows the runner source, checksum, and package list before
              you copy anything.
            </li>
          </ul>
          <p>
            You still need to trust this website and Homebrew. Read the generated
            command. If anything looks unexpected, do not run it.
          </p>
          <p>
            <Link href="/" className="text-foreground underline underline-offset-4">
              Back to the catalog
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
