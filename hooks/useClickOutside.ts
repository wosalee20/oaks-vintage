"use client";
import { useEffect, useRef } from "react";

export default function useClickOutside<T extends HTMLElement>(
  onOut: () => void
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onOut();
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOut();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onOut]);

  return ref;
}
