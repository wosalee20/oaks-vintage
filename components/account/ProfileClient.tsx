"use client";
import { useState } from "react";
import { Button } from "@/components/ui";
import dynamic from "next/dynamic";

const EditProfileForm = dynamic(
  () => import("@/components/account/EditProfileForm"),
  { ssr: false }
);

export default function ProfileClient({ user }: { user: any }) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div>
        <b>Name:</b> {user.name ?? "—"}
      </div>
      <div>
        <b>Phone:</b> {user.phone ?? "—"}
      </div>
      <div>
        <b>Email:</b> {user.email ?? "—"}
      </div>
      <div>
        <b>Role:</b> {user.role}
      </div>
      {!editing && (
        <Button onClick={() => setEditing(true)} style={{ marginTop: 10 }}>
          Edit
        </Button>
      )}
      {editing && (
        <EditProfileForm
          initialName={user.name}
          initialPhone={user.phone}
          onSaved={() => setEditing(false)}
        />
      )}
    </div>
  );
}
