import { requireAdmin } from "@/lib/requireAdmin";
import AdminShell from "../../components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  // Note: RootLayout still wraps this, but Header is hidden on /admin,
  // and Providers skip Cart/Auth on /admin. So this renders cleanly.
  return <AdminShell>{children}</AdminShell>;
}
