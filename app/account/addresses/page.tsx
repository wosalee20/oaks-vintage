import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, Muted, Button } from "@/components/ui";

export default async function AddressesPage() {
  const session = await auth();
  const email = session?.user?.email as string | undefined;

  const addresses = email
    ? await prisma.address.findMany({
        where: { user: { email } },
        orderBy: { id: "desc" },
      })
    : [];

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
        Addresses
      </h2>
      <div style={{ display: "grid", gap: 12 }}>
        {addresses.length === 0 && <Muted>No addresses yet.</Muted>}
        {addresses.map((a) => (
          <Card key={a.id} style={{ padding: 14 }}>
            <div style={{ fontWeight: 600 }}>{a.fullName}</div>
            <div>
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
            </div>
            <div>
              {a.city}
              {a.state ? `, ${a.state}` : ""}
            </div>
            <div>
              {a.country}
              {a.phone ? ` · ${a.phone}` : ""}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 14 }}>
        <Button disabled>Add new (soon)</Button>
      </div>
    </div>
  );
}
