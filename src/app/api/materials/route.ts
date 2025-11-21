import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { requireAuthRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const supabase = getServiceSupabase();
  const body = await req.json();
  const { moduleId, title, materialType, storagePath, url } = body || {};

  if (!moduleId || !title || !materialType || !(storagePath || url)) {
    return NextResponse.json(
      { error: "moduleId, title, materialType, and storagePath or url are required" },
      { status: 400 }
    );
  }

  // Only admin/teacher can create materials
  let auth;
  try {
    auth = await requireAuthRole(req, ["admin", "teacher"]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const { error } = await supabase.from("materials").insert({
    module_id: moduleId,
    title,
    material_type: materialType,
    storage_path: storagePath,
    url,
    created_by: auth.userId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

