import type { PackageId } from "@/lib/catalog/types";
import { encodeManifestBase64 } from "@/lib/installer/manifest";

export const INSTALLER_PATH = "/install/v1/mackit-install.sh";
export const INSTALLER_META_PATH = "/install/v1/mackit-install.meta.json";

export interface InstallerMeta {
  version: string;
  sha256: string;
  path: string;
}

export function shellSingleQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function buildInstallCommand(options: {
  origin: string;
  ids: PackageId[];
  sha256: string;
}): string {
  const origin = options.origin.replace(/\/$/, "");
  const scriptUrl = `${origin}${INSTALLER_PATH}`;
  const manifest = encodeManifestBase64(options.ids);

  return [
    "tmp=\"$(/usr/bin/mktemp -t mackit-install)\"",
    `&& /usr/bin/curl -fsSL ${shellSingleQuote(scriptUrl)} -o "$tmp"`,
    `&& printf '%s  %s\\n' ${shellSingleQuote(options.sha256)} "$tmp" | /usr/bin/shasum -a 256 -c -`,
    `&& /bin/bash "$tmp" --manifest ${shellSingleQuote(manifest)}`,
    `; status=$?`,
    `; /bin/rm -f "$tmp"`,
    `; exit "$status"`,
  ].join(" ");
}
