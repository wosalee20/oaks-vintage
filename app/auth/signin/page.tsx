"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Container, Button, Card } from "@/components/ui";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: fd.get("email"),
      password: fd.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (!res?.error) window.location.href = "/account";
    else alert(res.error);
  };
  return (
    <Container style={{ padding: "32px 16px" }}>
      <Card style={{ maxWidth: 480, margin: "0 auto", padding: 18 }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
          Sign in
        </h2>
        <form onSubmit={onSubmit}>
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
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </Container>
  );
}
