import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, Muted } from "@/components/ui";

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email as string | undefined;
  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : null;

  return (
    <Card style={{ padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Profile
      </h2>
      {!user && <Muted>Not signed in.</Muted>}
      {user && (
        <div style={{ display: "grid", gap: 8 }}>
          <div>
            <b>Name:</b> {user.name ?? "—"}
          </div>
          <div>
            <b>Email:</b> {user.email ?? "—"}
          </div>
          <div>
            <b>Role:</b> {user.role}
          </div>
        </div>
      )}
    </Card>
  );
}
