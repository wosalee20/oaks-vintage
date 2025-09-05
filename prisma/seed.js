// CHANGE imports to CommonJS:
const { PrismaClient } = require("../app/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.upsert({
    where: { slug: "jackets" },
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
          { url: "/demo/denim1.jpg", alt: "Front" },
          { url: "/demo/denim2.jpg", alt: "Back" },
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
      images: { create: [{ url: "/demo/leather1.jpg", alt: "Angle" }] },
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
