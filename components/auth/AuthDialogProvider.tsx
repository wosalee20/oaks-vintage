"use client";
import { createContext, useCallback, useContext, useState } from "react";
import AuthDialog from "./AuthDialog";

type Ctx = { open: boolean; openDialog: () => void; closeDialog: () => void };
const AuthCtx = createContext<Ctx | null>(null);

export function useAuthDialog() {
  const ctx = useContext(AuthCtx);
  if (!ctx)
    throw new Error("useAuthDialog must be used within AuthDialogProvider");
  return ctx;
}

export default function AuthDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);
  return (
    <AuthCtx.Provider value={{ open, openDialog, closeDialog }}>
      {children}
      <AuthDialog open={open} onClose={closeDialog} />
    </AuthCtx.Provider>
  );
}
