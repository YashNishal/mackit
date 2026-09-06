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

`bun run build` refreshes the installer checksum and Homebrew catalog, then builds the app.

## How install works

Checkout copies a command that:

1. Downloads `public/install/v1/mackit-install.sh`
2. Verifies its SHA-256
3. Installs only the selected Homebrew tokens

The cart stays in the browser. Share links encode package IDs in the URL.
