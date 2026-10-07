"use client";

import { useEffect, useState } from "react";

export function Presence() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("darbar-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("darbar-id", id);
    }

    let stopped = false;

    async function beat() {
      try {
        const res = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        const data = (await res.json()) as { count?: number };
        if (!stopped && typeof data.count === "number") setCount(data.count);
      } catch {
        /* ignore offline blips */
      }
    }

    beat();
    const interval = window.setInterval(beat, 12_000);
    const onVis = () => {
      if (document.visibilityState === "visible") beat();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[12px] font-medium tracking-[-0.01em] text-white/90 shadow-sm backdrop-blur-md">
      <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
      {count == null ? "…" : `${count} online`}
    </div>
  );
}
