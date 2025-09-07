import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import WishlistClient from "@/components/WishlistClient";

function parseWishlistCookie(cookieValue: string | undefined): string[] {
  if (!cookieValue) return [];
  try {
    return JSON.parse(cookieValue);
  } catch {
    return [];
  }
}

export default async function WishlistPage() {
  // Read wishlist from cookies (array of product IDs)
  const cookieStore = await cookies();
  const wishlistRaw = cookieStore.get("wishlist")?.value;
  const wishlistIds = parseWishlistCookie(wishlistRaw);

  let products: any[] = [];
  if (wishlistIds.length > 0) {
    products = await prisma.product.findMany({
      where: { id: { in: wishlistIds }, isActive: true },
      include: { images: { take: 1 } },
      orderBy: { createdAt: "desc" },
    });
  }

  return <WishlistClient products={products} />;
}
