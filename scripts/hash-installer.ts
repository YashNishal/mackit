import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { InstallerMeta } from "@/lib/installer/command";
import { INSTALLER_PATH } from "@/lib/installer/command";

const SCRIPT_RELATIVE_PATH = "public/install/v1/mackit-install.sh";
const META_RELATIVE_PATH = "public/install/v1/mackit-install.meta.json";

export async function hashInstaller(
  cwd = process.cwd(),
): Promise<InstallerMeta> {
  const scriptPath = path.join(cwd, SCRIPT_RELATIVE_PATH);
  const contents = await readFile(scriptPath);
  const sha256 = createHash("sha256").update(contents).digest("hex");
  const meta: InstallerMeta = {
    version: "1",
    sha256,
    path: INSTALLER_PATH,
  };

  await writeFile(
    path.join(cwd, META_RELATIVE_PATH),
    `${JSON.stringify(meta, null, 2)}\n`,
  );

  return meta;
}

const isDirect =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirect) {
  const meta = await hashInstaller();
  console.log(`Installer SHA-256: ${meta.sha256}`);
}
