import prisma from "@/lib/prisma";
import BannerRow from "@/components/admin/BannerRow";
import { requireAdmin } from "@/lib/requireAdmin";

interface Banner {
  id: number | string;
  // Add other banner fields as needed, e.g.:
  // title: string;
  // imageUrl: string;
  // order: number;
  [key: string]: any;
}

interface BannerRowProps {
  banner?: Banner;
  index?: number;
  total?: number;
}

export default async function BannersPage() {
  await requireAdmin();
  const banners = await prisma.banner.findMany({ orderBy: { order: "asc" } });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>
        Homepage Banners (max 3)
      </h1>

      {/* create slot (only if < 3) */}
      {banners.length < 3 && <BannerRow />}

      <div style={{ display: "grid", gap: 10 }}>
        {banners.map((b: Banner, i: number) => (
          <BannerRow key={b.id} banner={b} index={i} total={banners.length} />
        ))}
      </div>
    </div>
  );
}
