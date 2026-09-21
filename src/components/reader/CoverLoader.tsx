"use client";

import Image from "next/image";

export function CoverLoader({
  cover,
  title,
  issue,
  progress,
}: {
  cover: string;
  title: string;
  issue?: string;
  progress: number;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6">
      <div className="animate-in">
        <div className="relative mx-auto aspect-[3/4] w-[min(42vw,280px)] overflow-hidden rounded-[2px] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          {cover ? (
            <Image src={cover} alt="" fill className="object-cover" priority sizes="280px" />
          ) : (
            <div className="h-full w-full bg-stage-3" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <p className="kicker mt-8 text-center">{issue || "The issue"}</p>
        <h1 className="headline mt-2 text-center text-[1.6rem] text-paper">{title}</h1>
        <div className="mx-auto mt-8 w-40">
          <div className="h-[2px] overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
            />
          </div>
          <p className="mt-3 text-center font-sans text-[0.72rem] tracking-wide text-fog-dim">
            Opening the issue…
          </p>
        </div>
      </div>
    </div>
  );
}
