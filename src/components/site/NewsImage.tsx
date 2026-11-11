"use client";

import { useState } from "react";

/**
 * Remote image from a news publisher. Hosts are unknown ahead of time, so
 * this is a plain <img>; if the publisher blocks hotlinking or the URL is
 * dead, it removes itself and the placeholder behind it shows instead.
 */
export function NewsImage({ src, className = "" }: { src: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
