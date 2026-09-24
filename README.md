# MacKit

Set up a Mac in one go. Search Homebrew apps, add a cart, and copy one Terminal command.

## Stack

- Next.js 16, React 19, Tailwind v4, shadcn/ui, Bun
- Homebrew formulae and casks as the package backend

## Scripts

```bash
bun install
bun run catalog
bun run hash-installer
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

`bun run build` refreshes the installer checksum, then builds the app.

## Catalog

The Homebrew catalog is generated data and is not committed.

- **Production:** Vercel Cron (`vercel.json`) calls `/api/cron/catalog` every Monday. It rebuilds the catalog from the Homebrew API, uploads it to Vercel Blob, and revalidates the home page. The full catalog goes to `catalog/packages-<hash>.json`, which is cached for a year because a new catalog gets a new name. `catalog/meta.json` points at the current file, and `catalog/featured.json` holds the curated apps the server renders. Each publish keeps the previous packages file and deletes older ones.
- **Local:** `bun run catalog` writes the same files to `public/catalog/`, which is used whenever `NEXT_PUBLIC_CATALOG_BASE_URL` is unset. `bun run catalog:publish` uploads to Blob by hand using the credentials from `vercel env pull`.

Setup: create a public Blob store and connect it to the Vercel project, add a random `CRON_SECRET`, publish once with `bun run catalog:publish`, then set `NEXT_PUBLIC_CATALOG_BASE_URL` (the store origin, e.g. `https://<id>.public.blob.vercel-storage.com`) and redeploy.

## How install works

Checkout copies a command that:

1. Downloads `public/install/v1/mackit-install.sh`
2. Verifies its SHA-256
3. Installs only the selected Homebrew tokens

The cart stays in the browser. Share links encode package IDs in the URL.
