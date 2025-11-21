import { NextRequest, NextResponse } from "next/server";
import { requireAuthRole } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase/server";
import { landingSlug } from "@/lib/landing-content";

const BUCKET = "landing";

async function ensureBucket() {
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.storage.getBucket(BUCKET);

  if (data) return supabase;

  // Create bucket if it does not exist yet (public read for landing assets).
  const { error: createError } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (createError && !createError.message.toLowerCase().includes("exists")) {
    throw new Error(createError.message);
  }

  // If creation succeeded or bucket already exists, return client.
  return supabase;
}

export async function POST(req: NextRequest) {
  let auth;
  try {
    auth = await requireAuthRole(req, ["admin"]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const folder = ((formData.get("folder") as string | null) || "general").trim() || "general";

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  const supabase = await ensureBucket();

  const fileExt = file.name.split(".").pop() || "bin";
  const path = `${landingSlug}/${folder}/${crypto.randomUUID()}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({
    ok: true,
    url: publicUrl?.publicUrl,
    path,
    uploaded_by: auth.userId,
  });
}
