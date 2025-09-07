/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require("@prisma/client"); // ✅ use package client
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SUPERADMIN_EMAIL || "").toLowerCase();
  if (!email) throw new Error("SUPERADMIN_EMAIL is not set");

  // Ensure only ONE admin (others are demoted to user)
  await prisma.user.updateMany({
    where: { role: "ADMIN", email: { not: email } },
    data: { role: "USER" },
  });

  const data = {
    email,
    role: "ADMIN",
    name: "Super Admin",
  };
  if (process.env.SUPERADMIN_PASSWORD) {
    data.passwordHash = await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 10);
  }

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: data,
  });
  console.log("Super admin:", email);

  // --- Category & Product demo data ---
  const cat = await prisma.category.upsert({
    where: { slug: "jackets" }, // must be unique in your schema
    update: {},
    create: {
      slug: "jackets",
      name: "Jackets",
      description: "Vintage denim, leather & varsity jackets.",
    },
  });

  await prisma.product.upsert({
    where: { slug: "vintage-denim-001" },
    update: {},
    create: {
      slug: "vintage-denim-001",
      title: "Vintage Denim Jacket — 1989",
      description: "Faded wash, boxy fit.",
      priceKobo: 850000,
      stock: 5,
      categoryId: cat.id,
      images: {
        create: [
          { url: "/demo/vintage-shirt1.jpg", alt: "Front" },
          { url: "/demo/vintage-shirt1.jpg", alt: "Back" },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "leather-bomber-002" },
    update: {},
    create: {
      slug: "leather-bomber-002",
      title: "Leather Bomber — 1992",
      description: "Supple leather, ribbed hem.",
      priceKobo: 2150000,
      stock: 2,
      categoryId: cat.id,
      images: { create: [{ url: "/demo/vintage-shirt3.jpg", alt: "Angle" }] },
    },
  });

  console.log("Seeded: category + 2 products");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
