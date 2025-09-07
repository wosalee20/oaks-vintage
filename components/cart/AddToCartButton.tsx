"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { useCart } from "@/components/cart/CartContext";

export default function AddToCartButton({ productId }: { productId: string }) {
  const router = useRouter();
  const { fetchCount, increment } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // optimistic bump for header badge
      increment(1);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error(await res.text());

      toast.success("Added to cart!");
      await fetchCount(); // reconcile
      window.dispatchEvent(new CustomEvent("ov:cart-changed")); // 🔔 notify cart UI
      router.refresh(); // revalidate server components
    } catch (e) {
      increment(-1); // rollback optimistic bump
      toast.error("Could not add to cart");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 18 }}>
      <Button type="button" onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add to cart"}
      </Button>
    </div>
  );
}
