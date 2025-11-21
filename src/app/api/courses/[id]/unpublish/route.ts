import { NextRequest, NextResponse } from "next/server";
import { requireAuthRole } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAuthRole(req, ["admin"]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { id } = await context.params;
  const courseId = id;

  const { error } = await supabase
    .from("courses")
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq("id", courseId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, courseId, is_published: false });
}
