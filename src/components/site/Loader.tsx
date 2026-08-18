"use client";

import { Wordmark } from "@/components/site/Logo";

export function EditorialLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8" role="status">
      <div className="relative h-px w-24 overflow-hidden rounded-full bg-rule">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-loader-slide rounded-full bg-ink" />
      </div>
      {label && (
        <p className="font-sans text-[0.75rem] font-medium tracking-wide text-muted">
          {label}
        </p>
      )}
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper">
      {/* Wordmark */}
      <div className="animate-loader-fade-in">
        <Wordmark name="PrimeCrest" className="text-[2rem] text-ink sm:text-[2.4rem]" />
      </div>
      
      {/* Minimal line loader */}
      <div className="mt-8 animate-loader-fade-in [animation-delay:200ms]">
        <div className="relative h-[2px] w-32 overflow-hidden rounded-full bg-rule">
          <div className="absolute inset-y-0 left-0 w-2/5 animate-loader-slide rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper">
      <div className="relative h-px w-24 overflow-hidden rounded-full bg-rule">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-loader-slide rounded-full bg-ink" />
      </div>
    </div>
  );
}

export function InlineLoader() {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="h-1 w-1 animate-loader-dot rounded-full bg-current [animation-delay:0ms]" />
      <span className="h-1 w-1 animate-loader-dot rounded-full bg-current [animation-delay:160ms]" />
      <span className="h-1 w-1 animate-loader-dot rounded-full bg-current [animation-delay:320ms]" />
    </span>
  );
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-shimmer rounded bg-gradient-to-r from-paper-2 via-rule/50 to-paper-2 bg-[length:200%_100%] ${className}`} />
  );
}

export function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonLine className="h-4 w-20" />
      <SkeletonLine className="h-8 w-full" />
      <SkeletonLine className="h-8 w-4/5" />
      <SkeletonLine className="h-4 w-32" />
    </div>
  );
}
