"use client";

import { Monitor, Moon, Sun } from "lucide-react";
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

function ThemeIcon({ theme }: { theme: ThemeChoice }) {
  switch (theme) {
    case "light":
      return <Sun />;
    case "dark":
      return <Moon />;
    case "system":
      return <Monitor />;
    default: {
      const exhaustive: never = theme;
      return exhaustive;
    }
  }
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
            size="icon"
            aria-label="Choose color theme"
          />
        }
      >
        <ThemeIcon theme={current} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value) => {
            if (typeof value === "string" && isThemeChoice(value)) {
              setTheme(value);
            }
          }}
        >
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
