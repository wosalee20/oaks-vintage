"use client";

import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useEffect, useRef, useState, useMemo } from "react";

type Banner = {
  id: string;
  image: string;
  alt?: string | null;
  link?: string | null;
};

const View = styled.div`
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: 8px auto 16px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff; /* fallback */
`;

const Track = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  > div {
    scroll-snap-align: start;
  }
`;

const Slide = styled.div`
  position: relative;
  width: 100%;
  height: clamp(160px, 32vw, 420px);
`;

const Dots = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 6px;
  pointer-events: none;
`;
const Dot = styled.button<{ $active?: boolean }>`
  pointer-events: auto;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: ${({ $active }) =>
    $active ? "#2563EB" : "rgba(255,255,255,.85)"};
  transform: scale(${({ $active }) => ($active ? 1.15 : 1)});
  transition: transform 0.15s ease, background 0.15s ease;
`;

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const count = useMemo(() => banners?.length ?? 0, [banners]);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Auto-advance
  useEffect(() => {
    if (!count) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 4000);
    return () => clearInterval(id);
  }, [count]);

  // Scroll to active slide
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !count) return;
    const width = el.clientWidth;
    el.scrollTo({ left: width * active, behavior: "smooth" });
  }, [active, count]);

  if (!count) return null;

  return (
    <View>
      <Track ref={trackRef}>
        {banners.map((b, idx) => {
          const img = (
            <Image
              src={b.image}
              alt={b.alt || ""}
              fill
              priority={idx === 0}
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          );
          return (
            <Slide key={b.id}>
              {b.link ? <Link href={b.link}>{img}</Link> : img}
            </Slide>
          );
        })}
      </Track>

      <Dots>
        {banners.map((_, i) => (
          <Dot
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            $active={i === active}
            onClick={() => setActive(i)}
          />
        ))}
      </Dots>
    </View>
  );
}
