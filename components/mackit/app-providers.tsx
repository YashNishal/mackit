"use client";

import { ThemeProvider } from "@/components/mackit/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delay={200}>
        {children}
        <Toaster position="top-center" />
      </TooltipProvider>
    </ThemeProvider>
  );
}
