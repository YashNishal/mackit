import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { SafetyShell } from "@/components/shells/safety-shell";

export const metadata: Metadata = pageMetadata({
  title: "Safety",
  description:
    "How MacKit keeps installs safe: your cart stays in your browser, the installer is checksum verified, and you can read everything before it runs.",
  path: "/safety",
});

export default function SafetyPage() {
  return <SafetyShell />;
}
