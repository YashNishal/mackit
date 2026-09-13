"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MacKitLogo } from "@/components/retro/logo";
import { ThemeToggle } from "@/components/retro/theme-toggle";
import { useTheme } from "@/components/mackit/theme-provider";
import { useMode } from "@/components/mode-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  dispatchMenuAction,
  stashPendingAction,
  type MenuAction,
} from "@/lib/menu-actions";
import { isThemeChoice } from "@/lib/theme";

const VIEW_NAV = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/safety", label: "Safety" },
] as const;

const MENU_CONTENT =
  "min-w-52 border-2 border-foreground bg-background p-1 text-[13px] shadow-[4px_4px_0_0_var(--foreground)]";
const MENU_TRIGGER =
  "px-2 py-0.5 data-popup-open:bg-foreground data-popup-open:text-background hover:bg-foreground hover:text-background";
const MENU_ITEM = "text-[13px]";

export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setMode } = useMode();

  function run(action: MenuAction) {
    if (pathname === "/") {
      dispatchMenuAction(action);
    } else {
      stashPendingAction(action);
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background text-foreground">
      <div className="mx-auto flex h-8 w-full max-w-6xl items-center justify-between gap-2 px-2 sm:px-3">
        <div className="flex min-w-0 items-center gap-0 overflow-x-auto font-sans text-[13px] whitespace-nowrap">
          <MacKitLogo />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<button type="button" className={`${MENU_TRIGGER} font-bold`} />}
            >
              File
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={MENU_CONTENT}>
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("find")}>
                Find in Catalog…
                <DropdownMenuShortcut>/</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("install")}>
                Install Selected…
              </DropdownMenuItem>
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("share")}>
                Copy Share Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("clear")}>
                Empty Trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<button type="button" className={MENU_TRIGGER} />}
            >
              Edit
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={MENU_CONTENT}>
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("undo")}>
                Undo
                <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("share")}>
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("paste")}>
                Paste Cart Link
              </DropdownMenuItem>
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("clear")}>
                Clear
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {VIEW_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-0.5 font-normal hover:bg-foreground hover:text-background"
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={`${MENU_TRIGGER} hidden font-normal md:inline`}
                />
              }
            >
              Special
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={MENU_CONTENT}>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  if (typeof value === "string" && isThemeChoice(value)) {
                    setTheme(value);
                  }
                }}
              >
                <DropdownMenuRadioItem value="light" className={MENU_ITEM}>
                  Classic B&W
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className={MENU_ITEM}>
                  Inverted
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" className={MENU_ITEM}>
                  System Setting
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className={MENU_ITEM} onClick={() => run("clear")}>
                Empty Trash
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className={MENU_ITEM}
                onClick={() => {
                  setMode("modern");
                  window.scrollTo({ top: 0 });
                }}
              >
                Return to Modern…
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex shrink-0 items-center gap-1 font-sans text-[13px]">
          <span aria-hidden="true" className="hidden font-mono text-[11px] sm:inline">
            MacKit
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
