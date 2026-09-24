import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildCatalog, serializeCatalog } from "@/lib/catalog/build";
import { CATALOG_DIR } from "@/lib/catalog/paths";

const built = await buildCatalog();
const { files, meta } = serializeCatalog(built.catalog, built.meta);
const publicDir = path.join(process.cwd(), "public");
const catalogDir = path.join(publicDir, CATALOG_DIR);
await mkdir(catalogDir, { recursive: true });

const keep = new Set(files.map((file) => path.basename(file.path)));
for (const name of await readdir(catalogDir)) {
  if (!keep.has(name)) {
    await rm(path.join(catalogDir, name));
  }
}
for (const file of files) {
  await writeFile(path.join(publicDir, file.path), file.contents);
}

console.log(
  `Wrote ${meta.packageCount} packages (${meta.caskCount} apps, ${meta.formulaCount} CLI tools) to ${meta.packagesFile}`,
);
