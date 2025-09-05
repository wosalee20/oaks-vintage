"use client";
import { useState } from "react";
import { Container, Button, Card } from "@/components/ui";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        password: fd.get("password"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) window.location.href = "/api/auth/signin";
    else alert((await res.json()).error || "Failed");
  };
  return (
    <Container style={{ padding: "32px 16px" }}>
      <Card style={{ maxWidth: 480, margin: "0 auto", padding: 18 }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
          Create account
        </h2>
        <form onSubmit={onSubmit}>
          <input
            name="name"
            placeholder="Full name"
            required
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.1)",
              background: "transparent",
              color: "#fff",
            }}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.1)",
              background: "transparent",
              color: "#fff",
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 14,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,.1)",
              background: "transparent",
              color: "#fff",
            }}
          />
          <Button disabled={loading} type="submit">
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
