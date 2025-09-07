"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/components/cart/CartContext";

export default function QuickAdd({ productId }: { productId: string }) {
  const router = useRouter();
  const { fetchCount, increment } = useCart();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      if (loading) return;
      setLoading(true);
      increment(1); // optimistic
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Added to cart!");
      await fetchCount();
      window.dispatchEvent(new CustomEvent("ov:cart-changed"));
      router.refresh();
    } catch (e) {
      increment(-1);
      toast.error("Could not add to cart");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add to cart"
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: "#fff",
        border: "1px solid rgba(0,0,0,.08)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 8px 18px rgba(0,0,0,.08)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="9" cy="20" r="1.6" />
        <circle cx="17" cy="20" r="1.6" />
        <path
          d="M3 4h2l2.2 10.4A2 2 0 009.1 16h7.8a2 2 0 001.9-1.4L21 8H6.2"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}
