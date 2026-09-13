import type { Metadata } from "next";
import { HowShell } from "@/components/shells/how-shell";

export const metadata: Metadata = {
  title: "How it works",
};

export default function HowItWorksPage() {
  return <HowShell />;
}
