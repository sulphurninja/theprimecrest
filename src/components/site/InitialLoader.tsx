"use client";

import { useState, useEffect } from "react";
import { Wordmark } from "@/components/site/Logo";

const MIN_DISPLAY_MS = 2400;

function getInitialShowState() {
  if (typeof window === "undefined") return true;
  return !sessionStorage.getItem("loader-shown");
}

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(getInitialShowState);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("loader-shown", "1");
      }, 500);
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return <>{children}</>;

  return (
    <>
      {/* Content hidden but rendered for SEO */}
      <div className="invisible absolute">{children}</div>
      
      {/* Loader overlay */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper transition-opacity duration-500 ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="animate-loader-fade-in">
          <Wordmark name="PrimeCrest" className="text-[2rem] text-ink sm:text-[2.4rem]" />
        </div>
        
        <div className="mt-8 animate-loader-fade-in [animation-delay:200ms]">
          <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-rule">
            <div className="absolute inset-y-0 left-0 w-2/5 animate-loader-slide rounded-full bg-ink" />
          </div>
        </div>
        
        <p className="mt-6 animate-loader-fade-in font-serif text-[0.85rem] italic text-muted [animation-delay:400ms]">
          Setting the type…
        </p>
      </div>
    </>
  );
}
