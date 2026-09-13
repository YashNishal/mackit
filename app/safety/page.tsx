import type { Metadata } from "next";
import { SafetyShell } from "@/components/shells/safety-shell";

export const metadata: Metadata = {
  title: "Safety",
};

export default function SafetyPage() {
  return <SafetyShell />;
}
