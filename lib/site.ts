import type { Metadata } from "next";

export const SITE_NAME = "MacKit";

export const SITE_DESCRIPTION =
  "Pick the apps you want on your Mac, then install them all with one Terminal command. Free, no account, and nothing leaves your browser.";

/** Production origin, falling back to the Vercel URL or localhost. */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
);

/** Metadata for a subpage. Next.js replaces nested objects rather than merging them, so every field is set here. */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: "/opengraph-image",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: "/opengraph-image",
    },
  };
}
