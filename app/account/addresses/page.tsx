import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Card, Muted, Button } from "@/components/ui";
import AddressesClient from "@/components/account/AddressesClient";

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
      <AddressesClient initialAddresses={addresses} />
    </div>
  );
}
