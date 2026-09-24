"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { MacKitMark } from "@/components/mackit/logo";
import { useMode } from "@/components/mode-provider";

const CLICKS_TO_TRIGGER = 5;
const CLICK_WINDOW_MS = 1500;

/**
 * The Dock's first tile, where Finder sits on a real Mac. One click jumps to
 * search; five quick clicks switch on retro mode.
 */
export function ForMacEgg() {
  const { setMode } = useMode();
  const [clicks, setClicks] = useState(0);
  const [jiggleKey, setJiggleKey] = useState(0);
  const firstClickAt = useRef(0);

  function onClick() {
    const now = Date.now();
    const count =
      now - firstClickAt.current > CLICK_WINDOW_MS ? 1 : clicks + 1;
    if (count === 1) {
      firstClickAt.current = now;
    }
    if (count >= CLICKS_TO_TRIGGER) {
      setClicks(0);
      setMode("retro");
      toast.success("Retro mode engaged.");
      window.scrollTo({ top: 0 });
      return;
    }
    setClicks(count);
    setJiggleKey((key) => key + 1);
    if (count === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document
        .querySelector<HTMLInputElement>("[role=combobox]")
        ?.focus({ preventScroll: true });
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Search apps"
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[12px] bg-primary text-primary-foreground"
    >
      {/* Remount only the glyph to replay the jiggle, so the button keeps focus. */}
      <span key={jiggleKey} className={jiggleKey > 0 ? "egg-jiggle flex" : "flex"}>
        <MacKitMark className="size-6" />
      </span>
    </button>
  );
}
