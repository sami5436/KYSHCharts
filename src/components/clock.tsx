"use client";

import { useEffect, useState } from "react";

function format(now: Date): { date: string; time: string; tz: string } {
  const date = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const time = now.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const tz =
    new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return { date, time, tz };
}

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div className="px-3 flex items-center k-border-r">
        <span className="k-label mr-2">now</span>
        <span className="text-muted">--:--:--</span>
      </div>
    );
  }

  const { date, time, tz } = format(now);
  return (
    <div className="px-3 flex items-center k-border-r k-tabular">
      <span className="k-label mr-2">now</span>
      <span className="text-fg">{date}</span>
      <span className="text-muted mx-2">/</span>
      <span className="text-fg">{time}</span>
      <span className="text-muted ml-2">{tz}</span>
    </div>
  );
}
