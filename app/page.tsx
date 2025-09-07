import ProductListSection from "@/components/ProductListSection";
import BannerCarousel from "@/components/home/BannerCarousel";
import prisma from "@/lib/prisma";

// Home page component
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Set the number of products per page
  const pageSize = 20;
  // Determine the current page from search params, default to 1
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page ?? 1) || 1);

  // Fetch products and total count from the database in parallel
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true }, // Only active products
      include: { images: { take: 1 } }, // Include the first image for each product
      orderBy: { createdAt: "desc" }, // Sort by newest first
      skip: (page - 1) * pageSize, // Pagination: skip products for previous pages
      take: pageSize, // Limit to page size
    }),
    prisma.product.count({ where: { isActive: true } }), // Count total active products
  ]);

  // Define banner slides for the homepage carousel
  const slides = [
    { src: "/demo/Oaks-vintage.jpg", alt: "oaks urban", href: "/?banner=1" },
    {
      src: "/demo/Oaks-urban.jpg",
      alt: "oaks vintage",
      href: "/category/jackets",
    },
    {
      src: "/demo/oaks-new-month.jpg",
      alt: "happy new month",
      href: "/?banner=3",
    },
  ];

  // Fetch banners for the carousel (CMS-managed)
  const banners = await prisma.banner.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    take: 3,
  });

  // Render the BannerCarousel above the ProductListSection
  return (
    <>
      <BannerCarousel banners={banners} />
      <ProductListSection products={products} slides={slides} />
    </>
  );
}
