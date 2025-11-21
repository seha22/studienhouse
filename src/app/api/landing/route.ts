import { NextRequest, NextResponse } from "next/server";
import { requireAuthRole } from "@/lib/auth";
import { fetchLandingContent, saveLandingContent } from "@/lib/landing-data";
import { LandingContentInput } from "@/lib/landing-content";

export async function GET() {
  const result = await fetchLandingContent();
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuthRole(req, ["admin"]);
    const body = await req.json().catch(() => null);
    const input = (body?.content as LandingContentInput | undefined) ?? undefined;
    if (!input) {
      return NextResponse.json({ error: "Invalid content payload" }, { status: 400 });
    }

    const data = await saveLandingContent(input, auth.userId);
    return NextResponse.json({ ok: true, ...data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message.toLowerCase().includes("unauthorized") ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
