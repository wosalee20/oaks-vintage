// Server component for the cart page
import prisma from "@/lib/prisma";
// Import authentication utility
import { auth } from "@/auth";
// Import cookies utility for guest cart
import { cookies } from "next/headers";
// Import CartClient component to render the cart UI
import CartClient from "@/components/cart/CartClient";

// Cart item type definition
type Item = {
  itemId: string;
  productId: string;
  slug: string;
  title: string;
  imageUrl: string;
  priceKobo: number;
  quantity: number;
  stock: number;
};

// Cart page server component
export default async function CartPage() {
  // Get the current user session
  const session = await auth();
  // Get the user ID from the session
  const userId = (session?.user as any)?.id as string | undefined;

  let items: Item[] = [];

  if (userId) {
    // Fetch cart from DB for logged-in users
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                title: true,
                priceKobo: true,
                stock: true,
                images: {
                  select: { url: true },
                  orderBy: { id: "asc" },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    items =
      cart?.items.map((ci) => ({
        itemId: ci.id,
        productId: ci.productId,
        slug: ci.product.slug,
        title: ci.product.title,
        imageUrl: ci.product.images[0]?.url || "/demo/vintage-shirt1.jpg",
        priceKobo: ci.priceKobo ?? ci.product.priceKobo,
        quantity: ci.quantity,
        stock: ci.product.stock,
      })) ?? [];
  } else {
    // Guest cart from cookie (supports either {items:[{productId,quantity}]} or map {id:qty})
    const cookieStore = await cookies();
    const raw =
      cookieStore.get("ov_cart")?.value ||
      cookieStore.get("cart")?.value ||
      "[]";
    let pairs: Array<{ productId: string; quantity: number }> = [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.items)) pairs = parsed.items;
      else if (Array.isArray(parsed)) pairs = parsed;
      else if (parsed && typeof parsed === "object") {
        pairs = Object.entries(parsed).map(([productId, qty]) => ({
          productId,
          quantity: Number(qty) || 0,
        }));
      }
    } catch {
      // ignore malformed cookie
    }

    const ids = pairs.filter((p) => p.quantity > 0).map((p) => p.productId);
    if (ids.length > 0) {
      const prods = await prisma.product.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          slug: true,
          title: true,
          priceKobo: true,
          stock: true,
          images: { select: { url: true }, orderBy: { id: "asc" }, take: 1 },
        },
      });
      const byId = new Map(prods.map((p) => [p.id, p]));
      items = pairs
        .filter((p) => byId.has(p.productId))
        .map((p) => {
          const prod = byId.get(p.productId)!;
          return {
            itemId: `cookie-${prod.id}`,
            productId: prod.id,
            slug: prod.slug,
            title: prod.title,
            imageUrl: prod.images[0]?.url || "/demo/vintage-shirt1.jpg",
            priceKobo: prod.priceKobo,
            quantity: p.quantity,
            stock: prod.stock,
          } as Item;
        });
    }
  }

  const subtotalKobo = items.reduce(
    (s, it) => s + it.priceKobo * it.quantity,
    0
  );

  return (
    <div
      style={{ width: "100%", maxWidth: 1180, margin: "0 auto", padding: 16 }}
    >
      <CartClient
        initialItems={items}
        initialSubtotalKobo={subtotalKobo}
        isAuthed={Boolean(userId)}
      />
    </div>
  );
}
