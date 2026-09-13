"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useMode } from "@/components/mode-provider";

const CLICKS_TO_TRIGGER = 5;
const CLICK_WINDOW_MS = 1500;
const GROWTH_PER_CLICK = 0.05;

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
  }

  const scale = 1 + Math.min(clicks, CLICKS_TO_TRIGGER - 1) * GROWTH_PER_CLICK;

  return (
    <span className="inline-flex origin-left" style={{ transform: `scale(${scale})` }}>
      <button
        key={jiggleKey}
        type="button"
        onClick={onClick}
        aria-label="For Mac"
        className="egg-jiggle inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-card/80 px-3 py-1 font-mono text-[11px] tracking-wide text-muted-foreground"
      >
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-primary"
        />
        For Mac
      </button>
    </span>
  );
}
