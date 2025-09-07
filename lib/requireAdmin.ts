import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role === "ADMIN") return session;
  redirect("/?auth=required");
}
