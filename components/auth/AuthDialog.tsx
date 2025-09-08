"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { signIn, getProviders } from "next-auth/react";

const Overlay = styled.div<{ open: boolean }>`
  position: fixed;
  inset: 0;
  display: ${({ open }) => (open ? "grid" : "none")};
  place-items: start center;
  padding: 8vh 16px 24px;
  background: rgba(0, 0, 0, 0.55);
  z-index: 80;
`;
const Panel = styled.div`
  width: 100%;
  max-width: 540px;
  background: #fff;
  color: #111827;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
    border-radius: 12px;
  }
`;
const Head = styled.div`
  padding: 18px 18px 6px;
  text-align: center;
  position: relative;
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
  }
  .sub {
    color: #059669;
    font-size: 12px;
    margin-top: 6px;
  }
  button.close {
    position: absolute;
    top: 10px;
    right: 10px;
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
  padding: 10px 14px 4px;
  text-align: center;
  color: rgba(17, 24, 39, 0.85);
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
    border: 1px solid rgba(0, 0, 0, 0.06);
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
const Minor = styled.button`
  display: inline-block;
  margin-top: 10px;
  font-size: 12px;
  color: #2563eb;
  cursor: pointer;
  background: none;
  border: 0;
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
  span {
    font-size: 12px;
    color: rgba(17, 24, 39, 0.65);
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
function Ret() {
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

type Step = "input" | "password" | "register";

export default function AuthDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.ReactElement | null {
  const [providers, setProviders] = useState<any>(null);
  useEffect(() => {
    getProviders().then(setProviders);
  }, []);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("input");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // close on ESC & lock scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // close on outside click
  function onOverlayClick(e: React.MouseEvent) {
    if (!panelRef.current) return;
    if (!panelRef.current.contains(e.target as Node)) onClose();
  }

  async function checkIdentifier(id: string) {
    const res = await fetch("/api/auth/check-identifier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: id }),
    });
    const data = await res.json();
    return Boolean(data.exists);
  }

  async function submitIdentifier(e: React.FormEvent) {
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

  async function submitSignIn(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: identifier.trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res && !res.error) {
      onClose();
      router.push("/account");
      router.refresh();
    } else setErr(res?.error || "Invalid credentials");
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier.trim(), password }),
    });
    setLoading(false);
    if (res.ok) {
      onClose();
      router.push("/account");
      router.refresh();
    } else setErr((await res.json()).error || "Registration failed");
  }

  return (
    <Overlay open={open} onMouseDown={onOverlayClick} aria-hidden={!open}>
      <Panel
        role="dialog"
        aria-modal="true"
        aria-label="Sign in or register"
        ref={panelRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Head>
          <h2>Sign in / Register</h2>
          <div className="sub">🔒 All data will be encrypted</div>
          <button className="close" aria-label="Close" onClick={onClose}>
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
              <Ret />
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
            <form onSubmit={submitIdentifier}>
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
              <Minor type="button">Trouble signing in?</Minor>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={submitSignIn}>
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
            <form onSubmit={submitRegister}>
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
            <span>Or continue with other ways</span>
          </Divider>

          <Socials>
            {providers &&
              Object.values(providers)
                .filter(
                  (provider: any) =>
                    provider.id !== "credentials" && provider.id !== "github"
                )
                .map((provider: any) => (
                  <button
                    key={provider.name}
                    aria-label={`Continue with ${provider.name}`}
                    onClick={() =>
                      signIn(provider.id, { callbackUrl: "/account" })
                    }
                  >
                    {provider.id === "google" ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
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
                        <span>Sign in with Google</span>
                      </span>
                    ) : (
                      `Sign in with ${provider.name}`
                    )}
                  </button>
                ))}
          </Socials>
        </Body>
      </Panel>
    </Overlay>
  );
}
