import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE!;
const supabase = createClient(url, serviceRole, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const folder = String(form.get("folder") || "uploads");

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const arrayBuf = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("assets")
    .upload(key, new Uint8Array(arrayBuf), {
      contentType: file.type,
      upsert: false,
    });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const publicUrl = `${url}/storage/v1/object/public/assets/${key}`;
  return NextResponse.json({ url: publicUrl });
}
