import Link from "next/link";
import { RetroWindow } from "@/components/retro/retro-window";
import { SiteFooter } from "@/components/retro/site-footer";
import { SiteHeader } from "@/components/retro/site-header";

export function RetroHowItWorks() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-2 py-6 sm:px-3">
        <RetroWindow title="How it works" meta="Read me">
          <p className="font-mono text-[11px]">MacKit</p>
          <h1 className="mt-1 font-display text-2xl font-bold">
            Three steps, then Terminal.
          </h1>
          <div className="mt-4 space-y-4 text-[13px] leading-6">
            <p>
              MacKit is a shopping list for macOS. You pick apps in
              the browser. Installation happens on your Mac through Homebrew.
            </p>
            <ol className="list-decimal space-y-3 border-2 border-foreground p-4 pl-8">
              <li>
                Search any Homebrew app or browse curated categories, then add
                items to a cart stored only in this browser.
              </li>
              <li>
                Copy one command. It downloads MacKit&apos;s installer, checks a
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
