import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, Muted } from "@/components/ui";
import ProfileClient from "@/components/account/ProfileClient";

export default async function ProfilePage() {
  const session = await auth();
  const email = session?.user?.email as string | undefined;
  const user = email
    ? await prisma.user.findUnique({ where: { email } })
    : null;

  // This is a hack to allow client-side state in a server component
  // The edit button and form will only show for signed-in users
  return (
    <Card style={{ padding: 16 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Profile
      </h2>
      {!user && <Muted>Not signed in.</Muted>}
      {user && <ProfileClient user={user} />}
    </Card>
  );
}
