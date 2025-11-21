import { NextRequest } from "next/server";
import { getAnonSupabase, getServiceSupabase } from "./supabase/server";

export type Role = "admin" | "teacher" | "student";

export type AuthContext = {
  userId: string;
  role: Role;
};

function parseBearer(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const [, token] = auth.split("Bearer ");
  return token?.trim();
}

export async function requireAuthRole(
  req: NextRequest,
  allowed: Role[]
): Promise<AuthContext> {
  const token = parseBearer(req);
  if (!token) {
    throw new Error("Unauthorized: missing bearer token");
  }

  const anon = getAnonSupabase();
  const { data: userData, error: userErr } = await anon.auth.getUser(token);
  if (userErr || !userData?.user) {
    throw new Error("Unauthorized: invalid token");
  }
  const userId = userData.user.id;

  // Fetch role using service client (server-side only)
  const svc = getServiceSupabase();
  const { data: profile, error: profileErr } = await svc
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileErr || !profile?.role) {
    throw new Error("Unauthorized: profile not found");
  }

  if (!allowed.includes(profile.role as Role)) {
    throw new Error("Forbidden");
  }

  return { userId, role: profile.role as Role };
}

