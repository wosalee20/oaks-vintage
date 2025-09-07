// This file has been removed. AuthDialog is now used for authentication modal/dialog.
"use client";

import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Overlay = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: rgba(0, 0, 0, 0.55);
  padding: 90px 16px 48px;
`;
const Panel = styled.div`
  width: 100%;
  max-width: 540px;
  background: #fff;
  color: #111827;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  position: relative;
`;
const Head = styled.div`
  padding: 22px 22px 6px;
  text-align: center;
  position: relative;
  h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 800;
  }
  button {
    position: absolute;
    top: 14px;
    right: 14px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #fff;
    cursor: pointer;
  }
`;
const Perks = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px 18px 6px;
  text-align: center;
  color: rgba(17, 24, 39, 0.8);
  font-size: 13px;
  .perk {
    display: grid;
    gap: 6px;
    justify-items: center;
  }
  .ico {
    width: 38px;
    height: 38px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: #f3f6ff;
    color: #2563eb;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }
  small {
    color: rgba(17, 24, 39, 0.6);
  }
`;
const Body = styled.div`
  padding: 14px 18px 22px;
`;
const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 13px;
`;
const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  margin: 8px 0 14px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  outline: none;
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;
const Primary = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 0;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
  font-weight: 800;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const Minor = styled.a`
  display: inline-block;
  margin-top: 10px;
  font-size: 12px;
  color: #2563eb;
  cursor: pointer;
`;
const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 6px;
  &:before,
  &:after {
    content: "";
    height: 1px;
    flex: 1;
    background: rgba(0, 0, 0, 0.1);
  }
`;
const Socials = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  padding: 10px 0 4px;
  button {
    width: 44px;
    height: 44px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    display: grid;
    place-items: center;
    cursor: pointer;
  }
`;

function X() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" />
    </svg>
  );
}
function Truck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M3 7h11v8H3zM14 10h3l3 3v2h-6z" strokeWidth="2" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="17.5" cy="17.5" r="1.5" />
    </svg>
  );
}
function Shield() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" />
    </svg>
  );
}
function Return() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path d="M9 10l-4 4 4 4" />
      <path d="M20 12a8 8 0 10-8 8" strokeWidth="2" />
    </svg>
  );
}

export default function AuthPage() {
  const [step, setStep] = useState<"input" | "password" | "register">("input");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function checkIdentifier(id: string) {
    // simple email check against DB; adjust endpoint if you support phone too
    const res = await fetch("/api/auth/check-identifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: id }),
    });
    const data = await res.json();
    return Boolean(data.exists);
  }

  async function onIdentifier(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const exists = await checkIdentifier(identifier.trim());
      setStep(exists ? "password" : "register");
    } catch {
      setErr("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: identifier.trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res && !res.error) router.push("/account");
    else setErr(res?.error || "Invalid credentials");
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier.trim(), password }),
    });
    setLoading(false);
    if (res.ok) router.push("/account");
    else setErr((await res.json()).error || "Registration failed");
  }

  return (
    <Overlay>
      <Panel role="dialog" aria-modal="true" aria-label="Sign in or register">
        <Head>
          <h2>Sign in / Register</h2>
          <div style={{ color: "#059669", fontSize: 12, marginTop: 6 }}>
            🔒 All data will be encrypted
          </div>
          <button onClick={() => router.push("/")} aria-label="Close">
            <X />
          </button>
        </Head>

        <Perks>
          <div className="perk">
            <div className="ico">
              <Truck />
            </div>
            <div>Free shipping</div>
            <small>On all orders</small>
          </div>
          <div className="perk">
            <div className="ico">
              <Return />
            </div>
            <div>Return within 90d</div>
            <small>From purchase date</small>
          </div>
          <div className="perk">
            <div className="ico">
              <Shield />
            </div>
            <div>Buyer protection</div>
            <small>Secure checkout</small>
          </div>
        </Perks>

        <Body>
          {step === "input" && (
            <form onSubmit={onIdentifier}>
              <Label>Email or phone number</Label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                inputMode="email"
                placeholder="you@example.com"
              />
              <Primary type="submit" disabled={loading}>
                {loading ? "Checking..." : "Continue"}
              </Primary>
              <Minor href="/help">Trouble signing in?</Minor>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={onSignIn}>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
              />
              <Primary type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Primary>
            </form>
          )}

          {step === "register" && (
            <form onSubmit={onRegister}>
              <Label>Create password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a strong password"
              />
              <Primary type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Register"}
              </Primary>
            </form>
          )}

          {err && <div style={{ color: "#DC2626", marginTop: 12 }}>{err}</div>}

          <Divider>
            <span style={{ fontSize: 12, color: "rgba(17,24,39,.65)" }}>
              Or continue with other ways
            </span>
          </Divider>

          <Socials>
            <button
              aria-label="Continue with Google"
              onClick={() => signIn("google", { callbackUrl: "/account" })}
            >
              {/* Google */}
              <svg width="22" height="22" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.7 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10 0 18.4-7.3 19.8-16.7.1-.9.2-1.8.2-2.8 0-1.3-.1-2.6-.4-3.9z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.9 16.2 19.1 13 24 13c3 0 5.7 1.1 7.7 3l5.7-5.7C34.6 6 29.6 4 24 4 16.4 4 9.8 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29 35.8 26.7 37 24 37c-5.3 0-9.7-3.6-11.3-8.4l-6.6 5.1C9.8 39.8 16.4 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3C34.7 32 30.7 36 24 36c-6.6 0-12-5.4-12-12 0-1 .1-2 .3-3l-6.6-5.1C4.6 19.5 4 21.7 4 24c0 11.1 8.9 20 20 20 10 0 18.4-7.3 19.8-16.7.1-.9.2-1.8.2-2.8 0-1.3-.1-2.6-.4-3.9z"
                />
              </svg>
            </button>
            <button
              aria-label="Continue with Facebook"
              onClick={() => signIn("facebook", { callbackUrl: "/account" })}
            >
              {/* Facebook */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.9h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v6.99C18.34 21.13 22 17 22 12"></path>
              </svg>
            </button>
            <button
              aria-label="Continue with Apple"
              onClick={() => signIn("apple", { callbackUrl: "/account" })}
            >
              {/* Apple */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.365 1.43c0 1.14-.433 2.199-1.142 2.997-.762.86-1.992 1.526-3.232 1.438-.09-1.1.476-2.26 1.186-3.043.8-.9 2.158-1.566 3.188-1.64zM20.4 17.3c-.59 1.35-.87 1.95-1.632 3.14-1.06 1.64-2.553 3.68-4.41 3.72-1.65.04-2.08-1.06-4.33-1.06-2.25 0-2.73 1.02-4.38 1.08-1.86.08-3.28-1.78-4.34-3.42C-.03 17.65-.95 12.23 1.74 8.64c1.19-1.69 2.98-2.77 4.73-2.8 1.85-.04 3.6 1.22 4.33 1.22.72 0 2.99-1.5 5.04-1.28.86.04 3.29.35 4.85 2.66-4.08 2.25-3.43 8.02-.35 8.86z" />
              </svg>
            </button>
          </Socials>
        </Body>
      </Panel>
    </Overlay>
  );
}
