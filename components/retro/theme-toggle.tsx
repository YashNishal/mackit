"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/components/mackit/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isThemeChoice, type ThemeChoice } from "@/lib/theme";

function ThemeGlyph({ theme }: { theme: ThemeChoice }) {
  // 1-bit glyph: filled square = inverted, hollow = classic
  if (theme === "dark") {
    return (
      <span aria-hidden="true" className="block size-3.5 border-2 border-current bg-current" />
    );
  }
  if (theme === "light") {
    return (
      <span aria-hidden="true" className="block size-3.5 border-2 border-current bg-transparent" />
    );
  }
  return (
    <span aria-hidden="true" className="flex">
      <span className="block size-3.5 border-2 border-current bg-transparent" />
      <span className="-ml-1 block size-3.5 border-2 border-current bg-current" />
    </span>
  );
}

function subscribe() {
  return () => {};
}

function clientTrue() {
  return true;
}

function serverFalse() {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, clientTrue, serverFalse);
  const current = mounted ? theme : "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Choose display: classic or inverted"
            className="border-0"
          />
        }
      >
        <ThemeGlyph theme={current} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 border-2 border-foreground">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value) => {
            if (typeof value === "string" && isThemeChoice(value)) {
              setTheme(value);
            }
          }}
        >
          <DropdownMenuRadioItem value="system">System setting</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Classic B&W</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Inverted</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
