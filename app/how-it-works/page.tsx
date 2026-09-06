import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/mackit/site-footer";
import { SiteHeader } from "@/components/mackit/site-header";

export const metadata: Metadata = {
  title: "How it works",
};

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-primary">How it works</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Three steps, then Terminal.
        </h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-muted-foreground">
          <p>
            MacKit is a Ninite-style shopping list for macOS. You pick apps in
            the browser. Installation happens on your Mac through Homebrew.
          </p>
          <ol className="list-decimal space-y-4 pl-5">
            <li>
              Search any Homebrew app or browse curated categories, then add
              items to a cart stored only in this browser.
            </li>
            <li>
              Copy one command. It downloads MacKit’s installer, checks a
              checksum, and installs only the selected Homebrew tokens.
            </li>
            <li>
              Paste it in Terminal. If Homebrew is missing, the script explains
              what will happen and asks before installing it.
            </li>
          </ol>
          <p>
            Share a setup by copying the cart link. The selected package IDs are
            in the URL. Nothing is saved on a server.
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
