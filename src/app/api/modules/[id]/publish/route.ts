import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { requireAuthRole } from "@/lib/auth";

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Only admin or teacher
  try {
    await requireAuthRole(_req, ["admin", "teacher"]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { id } = await context.params;
  const moduleId = id;

  // Mark module as published and run RPC to fan-out progress
  const { error: updateError } = await supabase
    .from("modules")
    .update({ is_published: true, updated_at: new Date().toISOString() })
    .eq("id", moduleId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  const { error } = await supabase.rpc("publish_module", {
    p_module_id: moduleId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, moduleId });
}
