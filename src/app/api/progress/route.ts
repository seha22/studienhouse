import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/server";
import { requireAuthRole } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const supabase = getServiceSupabase();
  const body = await req.json();
  const { studentId, moduleId, status, score } = body || {};

  if (!studentId || !moduleId || !status) {
    return NextResponse.json(
      { error: "studentId, moduleId, and status are required" },
      { status: 400 }
    );
  }

  let auth;
  try {
    auth = await requireAuthRole(req, ["admin", "teacher", "student"]);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  // Students may only write their own progress; admin allowed for any; teacher optional
  if (auth.role === "student" && auth.userId !== studentId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("progress").upsert(
    {
      student_id: studentId,
      module_id: moduleId,
      status,
      score,
      updated_at: new Date().toISOString(),
      last_viewed_at: new Date().toISOString(),
    },
    { onConflict: "student_id,module_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
