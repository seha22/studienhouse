import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { requireAuthRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let auth;
  try {
    auth = await requireAuthRole(req, ["admin", "teacher"]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const moduleId = formData.get("moduleId") as string | null;
  const title = formData.get("title") as string | null;
  const materialType = (formData.get("materialType") as string | null) || "file";

  if (!file || !(file instanceof File) || !moduleId || !title) {
    return NextResponse.json(
      { error: "file, moduleId, and title are required" },
      { status: 400 }
    );
  }

  const supabase = getServiceSupabase();
  const fileExt = file.name.split(".").pop() || "bin";
  const path = `${moduleId}/${crypto.randomUUID()}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("materials")
    .upload(path, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: publicUrl } = supabase.storage.from("materials").getPublicUrl(path);

  const { error: insertError } = await supabase.from("materials").insert({
    module_id: moduleId,
    title,
    material_type: materialType,
    storage_path: path,
    url: publicUrl?.publicUrl,
    created_by: auth.userId,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, path, url: publicUrl?.publicUrl });
}

