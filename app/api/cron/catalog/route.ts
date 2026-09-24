import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { publishCatalog } from "@/lib/catalog/publish";

// Fetching and parsing the Homebrew API takes several seconds.
export const maxDuration = 120;

/** Invoked weekly by Vercel Cron (see vercel.json). */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[catalog] CRON_SECRET is not set; refusing to publish");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    console.warn("[catalog] Rejected publish request with invalid authorization");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  try {
    const meta = await publishCatalog();
    revalidateTag("catalog", "max");

    console.log(
      `[catalog] Published ${meta.packageCount} packages to ${meta.packagesFile} in ${Date.now() - startedAt}ms`,
    );
    return Response.json({
      generatedAt: meta.generatedAt,
      packageCount: meta.packageCount,
      packagesFile: meta.packagesFile,
    });
  } catch (error) {
    // The previous catalog stays live; the next scheduled run retries.
    console.error(
      `[catalog] Publish failed after ${Date.now() - startedAt}ms:`,
      error,
    );
    return Response.json({ error: "Catalog publish failed" }, { status: 500 });
  }
}
