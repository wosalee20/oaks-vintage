import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

/* ---------- Cookie helpers (guest cart) ---------- */
const COOKIE = "ov_cart";
async function readCookieCart() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE)?.value;
  try {
    const parsed = raw ? JSON.parse(raw) : { items: [] };
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    // sanitize
    return {
      items: items
        .filter((it: any) => it?.productId && Number(it?.quantity) > 0)
        .map((it: any) => ({
          productId: String(it.productId),
          quantity: Math.max(1, Number(it.quantity)),
        })),
    };
  } catch {
    return { items: [] as Array<{ productId: string; quantity: number }> };
  }
}
async function writeCookieCart(payload: any) {
  (await cookies()).set(COOKIE, JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/* ---------- GET: return normalized cart (items + totals) ---------- */
export async function GET() {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (userId) {
    // DB cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: { include: { images: { take: 1 } } } } },
      },
    });
    console.log("[API CART GET] userId:", userId, "cart:", cart);
    const items = (cart?.items ?? []).map((ci) => ({
      itemId: ci.id,
      productId: ci.productId,
      title: ci.product.title,
      imageUrl: ci.product.images[0]?.url ?? "",
      priceKobo: ci.priceKobo ?? ci.product.priceKobo,
      quantity: ci.quantity,
      lineTotalKobo: (ci.priceKobo ?? ci.product.priceKobo) * ci.quantity,
      slug: ci.product.slug,
      stock: ci.product.stock,
    }));
    console.log("[API CART GET] items:", items);
    const subtotalKobo = items.reduce((s, it) => s + it.lineTotalKobo, 0);
    return NextResponse.json({ items, subtotalKobo, source: "db" });
  }

  const cookieCart = await readCookieCart();
  interface CookieCartItem {
    productId: string;
    quantity: number;
  }
  const ids: string[] = cookieCart.items.map(
    (i: CookieCartItem) => i.productId
  );
  const products = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids } },
        include: { images: { take: 1 } },
      })
    : [];
  const byId = new Map(products.map((p) => [p.id, p]));
  interface CookieCartItem {
    productId: string;
    quantity: number;
  }

  interface ProductImage {
    url: string;
  }

  interface Product {
    id: string;
    title: string;
    priceKobo: number;
    slug: string;
    stock: number;
    images: ProductImage[];
  }

  interface CookieCartLineItem {
    itemId: string;
    productId: string;
    title: string;
    imageUrl: string;
    priceKobo: number;
    quantity: number;
    lineTotalKobo: number;
    slug: string;
    stock: number;
  }

  const items: CookieCartLineItem[] = cookieCart.items
    .map((ci: CookieCartItem): CookieCartLineItem | null => {
      const p = byId.get(ci.productId) as Product | undefined;
      if (!p) return null;
      const priceKobo = p.priceKobo;
      return {
        itemId: `cookie-${ci.productId}`,
        productId: p.id,
        title: p.title,
        imageUrl: p.images[0]?.url ?? "",
        priceKobo,
        quantity: ci.quantity,
        lineTotalKobo: priceKobo * ci.quantity,
        slug: p.slug,
        stock: p.stock,
      };
    })
    .filter(Boolean) as CookieCartLineItem[];
  const subtotalKobo = items.reduce((s, it) => s + it.lineTotalKobo, 0);
  return NextResponse.json({ items, subtotalKobo, source: "cookie" });
}

/* ---------- POST: add to cart {productId, quantity?} ---------- */
export async function POST(req: Request) {
  try {
    let productId: string | undefined;
    let quantity: number | undefined;
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      productId = body.productId;
      quantity = body.quantity;
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const formData = await req.formData();
      productId = formData.get("productId")?.toString();
      quantity = formData.get("quantity")
        ? Number(formData.get("quantity"))
        : undefined;
    }
    if (!productId)
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    const qty = Math.max(1, Number(quantity ?? 1));

    const session = await auth();
    const userId = session?.user?.id as string | undefined;

    // Fetch product & price snapshot
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (userId) {
      // Check if user exists before upserting cart
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const cart = await prisma.cart.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });

        const existing = await prisma.cartItem.findFirst({
          where: { cartId: cart.id, productId },
        });
        if (existing) {
          const updated = await prisma.cartItem.update({
            where: { id: existing.id },
            data: {
              quantity: existing.quantity + qty,
              priceKobo: product.priceKobo,
            },
          });
          return NextResponse.json({ ok: true, itemId: updated.id });
        } else {
          const created = await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
              quantity: qty,
              priceKobo: product.priceKobo,
            },
          });
          return NextResponse.json({ ok: true, itemId: created.id });
        }
      }
      // If userId does not exist in DB, fallback to guest cart logic below
    }

    const cart = await readCookieCart();
    interface CookieCartItem {
      productId: string;
      quantity: number;
    }
    const idx: number = cart.items.findIndex(
      (i: CookieCartItem) => i.productId === productId
    );
    if (idx >= 0) cart.items[idx].quantity += qty;
    else cart.items.push({ productId, quantity: qty });
    // Set cookie in response
    const res = NextResponse.json({ ok: true, itemId: `cookie-${productId}` });
    res.cookies.set("ov_cart", JSON.stringify(cart), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
  } catch (error) {
    console.error("[API CART POST ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}

/* ---------- PATCH: update quantity {itemId? | productId, quantity} ---------- */
export async function PATCH(req: Request) {
  const { itemId, productId, quantity } = await req.json().catch(() => ({}));
  const qty = Math.max(0, Number(quantity ?? 0));

  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (userId) {
    // DB branch
    if (!itemId && !productId)
      return NextResponse.json(
        { error: "Provide itemId or productId" },
        { status: 400 }
      );
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return NextResponse.json({ ok: true }); // nothing to do

    const where = itemId
      ? { id: String(itemId) }
      : { cartId_productId: { cartId: cart.id, productId: String(productId) } };

    if (qty <= 0) {
      // delete
      await prisma.cartItem.deleteMany({ where });
      return NextResponse.json({ ok: true, deleted: true });
    }

    const item = await prisma.cartItem.findFirst({ where });
    if (!item) {
      // create (idempotent)
      const product = await prisma.product.findUnique({
        where: { id: String(productId) },
      });
      if (!product)
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity: qty,
          priceKobo: product.priceKobo,
        },
      });
      return NextResponse.json({ ok: true, created: true });
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: qty },
    });
    return NextResponse.json({ ok: true, updated: true });
  }

  // cookie branch
  if (!productId && !itemId)
    return NextResponse.json(
      { error: "Provide productId or itemId" },
      { status: 400 }
    );
  const cart = await readCookieCart();
  interface CookieCartItem {
    productId: string;
    quantity: number;
  }
  const idx: number = cart.items.findIndex(
    (i: CookieCartItem) => i.productId === productId
  );
  if (idx < 0) return NextResponse.json({ ok: true }); // nothing

  if (qty <= 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].quantity = qty;
  }
  writeCookieCart(cart);
  return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: true });
}

/* ---------- DELETE: remove item {itemId? | productId} ---------- */
export async function DELETE(req: Request) {
  const { itemId, productId } = await req.json().catch(() => ({}));
  const session = await auth();
  const userId = session?.user?.id as string | undefined;

  if (userId) {
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return NextResponse.json({ ok: true });
    const where = itemId
      ? { id: String(itemId) }
      : { cartId_productId: { cartId: cart.id, productId: String(productId) } };
    await prisma.cartItem.deleteMany({ where });
    return NextResponse.json({ ok: true });
  }

  const cart = await readCookieCart();
  interface CookieCartItem {
    productId: string;
    quantity: number;
  }
  const i: number = cart.items.findIndex(
    (x: CookieCartItem) => x.productId === productId
  );
  if (i >= 0) cart.items.splice(i, 1);
  writeCookieCart(cart);
  return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: true });
}
