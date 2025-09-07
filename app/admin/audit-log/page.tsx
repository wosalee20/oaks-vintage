import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

interface Actor {
  name: string | null;
  email: string | null;
}

interface Log {
  id: string;
  createdAt: Date;
  actor: Actor;
  action: string;
  entity: string;
  entityId: string;
}

export default async function AuditLogPage() {
  await requireAdmin();

  const logs = await prisma.adminActivityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { email: true, name: true } } },
  });

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontWeight: 900, fontSize: 24, margin: 0 }}>Audit Log</h1>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{ background: "#f9fafb", color: "#6b7280", fontSize: 12 }}
          >
            <tr>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Time</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>Actor</th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>
                Action
              </th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>
                Entity
              </th>
              <th style={{ textAlign: "left", padding: "10px 12px" }}>ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l: Log) => (
              <tr key={l.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 12px" }}>
                  {l.createdAt.toLocaleString()}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {l.actor.name || l.actor.email}
                </td>
                <td style={{ padding: "10px 12px" }}>{l.action}</td>
                <td style={{ padding: "10px 12px" }}>{l.entity}</td>
                <td style={{ padding: "10px 12px", fontFamily: "monospace" }}>
                  {l.entityId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
