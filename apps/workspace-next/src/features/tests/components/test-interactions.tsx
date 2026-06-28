"use client";

import type { ReactNode } from "react";

export type OverlayLine = {
  className?: string;
  id: string;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export function ImageOverlay({
  alt,
  children,
  className,
  src,
}: {
  alt: string;
  children: ReactNode;
  className: string;
  src: string;
}) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} />
      {children}
    </div>
  );
}

export function ImageOverlayBoard({
  alt,
  children,
  className,
  lines,
  src,
  viewBox,
}: {
  alt: string;
  children: ReactNode;
  className: string;
  lines: OverlayLine[];
  src: string;
  viewBox: string;
}) {
  return (
    <ImageOverlay alt={alt} className={className} src={src}>
      <svg viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {lines.map((line) => (
          <line
            className={line.className}
            key={line.id}
            x1={line.x1}
            x2={line.x2}
            y1={line.y1}
            y2={line.y2}
          />
        ))}
      </svg>
      {children}
    </ImageOverlay>
  );
}
