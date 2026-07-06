"use client";

import { useEffect, useState } from "react";

function getTimeLeft(endTime: number) {
  const diff = Math.max(0, endTime - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

export function CountdownTimer() {
  const [endTime] = useState(() => {
    if (typeof window === "undefined") return Date.now() + 24 * 60 * 60 * 1000;
    const stored = sessionStorage.getItem("sale_end");
    if (stored) return parseInt(stored, 10);
    const end = Date.now() + 24 * 60 * 60 * 1000;
    sessionStorage.setItem("sale_end", end.toString());
    return end;
  });

  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(getTimeLeft(endTime));
    const interval = setInterval(() => {
      setTime(getTimeLeft(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-1 font-mono text-lg font-bold text-[#111]">
      <span className="bg-white px-2 py-1 rounded-md min-w-[2.5rem] text-center">
        {pad(time.hours)}
      </span>
      <span className="text-[#777]">:</span>
      <span className="bg-white px-2 py-1 rounded-md min-w-[2.5rem] text-center">
        {pad(time.minutes)}
      </span>
      <span className="text-[#777]">:</span>
      <span className="bg-white px-2 py-1 rounded-md min-w-[2.5rem] text-center">
        {pad(time.seconds)}
      </span>
    </div>
  );
}
