"use client";

const widths = [480, 640, 828, 1200];

export default function photoLoader({
  src,
  width,
}: {
  src: string;
  width: number;
}) {
  const match = src.match(/^\/photos\/([\w-]+)\.webp$/);
  if (!match) return src;

  const size = widths.find((value) => value >= width) ?? widths.at(-1);
  return `/photos/${match[1]}-${size}.webp`;
}
