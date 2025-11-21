import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { requireAuthRole } from "@/lib/auth";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuthRole(req, ["admin", "teacher"]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { id } = await context.params;
  const moduleId = id;

  const { error } = await supabase
    .from("modules")
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq("id", moduleId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, moduleId, is_published: false });
}
