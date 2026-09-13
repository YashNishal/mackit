import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { AppProviders } from "@/components/mackit/app-providers";
import { InlineScript } from "@/components/mackit/inline-script";
import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme";
import { UI_MODE_BOOTSTRAP_SCRIPT } from "@/lib/ui-mode";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MacKit — Set up your Mac in one go",
    template: "%s · MacKit",
  },
  description:
    "Choose apps for your Mac, add them to a cart, and install everything with one command.",
  applicationName: "MacKit",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={THEME_BOOTSTRAP_SCRIPT} />
        <InlineScript html={UI_MODE_BOOTSTRAP_SCRIPT} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
