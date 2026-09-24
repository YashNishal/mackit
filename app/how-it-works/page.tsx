import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { HowShell } from "@/components/shells/how-shell";

export const metadata: Metadata = pageMetadata({
  title: "How it works",
  description:
    "Pick apps in your browser, copy one command, and paste it into Terminal. Here's what MacKit does at each step.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return <HowShell />;
}
