import { NextRequest, NextResponse } from "next/server";
import { getAnonSupabase, getServiceSupabase } from "@/lib/supabase/server";
import { requireAuthRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all") === "1";

  // For public catalog: only published items
  async function fetchPublished() {
    const supabase = getAnonSupabase();
    return supabase
      .from("courses")
      .select(
        `
        id,
        title,
        category,
        mode,
        level,
        description,
        is_published,
        modules:modules!inner(
          id,
          title,
          summary,
          order_index,
          duration_minutes,
          is_published,
          materials:materials(
            id, title, material_type, url, storage_path
          )
        )
      `
      )
      .eq("is_published", true)
      .eq("modules.is_published", true)
      .order("title");
  }

  // For admin/teacher: include unpublished (requires bearer and role)
  async function fetchAllWithAuth() {
    try {
      await requireAuthRole(req, ["admin", "teacher"]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unauthorized";
      return { data: null, error: { message } };
    }
    const supabase = getServiceSupabase();
    return supabase
      .from("courses")
      .select(
        `
        id,
        title,
        category,
        mode,
        level,
        description,
        is_published,
        modules:modules(
          id,
          title,
          summary,
          order_index,
          duration_minutes,
          is_published,
          materials:materials(
            id, title, material_type, url, storage_path
          )
        )
      `
      )
      .order("title");
  }

  const { data: courses, error: coursesError } = all
    ? await fetchAllWithAuth()
    : await fetchPublished();

  if (coursesError) {
    const status = coursesError.message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: coursesError.message }, { status });
  }

  return NextResponse.json({ courses });
}
