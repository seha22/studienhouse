import { getAnonSupabase, getServiceSupabase } from "./supabase/server";
import {
  LandingContent,
  LandingContentInput,
  defaultLandingContent,
  landingSlug,
  mergeLandingContent,
} from "./landing-content";

export type LandingContentResult = {
  content: LandingContent;
  source: "database" | "fallback";
  updated_at?: string | null;
  updated_by?: string | null;
};

export async function fetchLandingContent(): Promise<LandingContentResult> {
  try {
    const supabase = getAnonSupabase();
    const { data, error } = await supabase
      .from("landing_content")
      .select("content, updated_at, updated_by")
      .eq("slug", landingSlug)
      .single();

    if (error || !data?.content) {
      return {
        content: defaultLandingContent,
        source: "fallback",
      };
    }

    return {
      content: mergeLandingContent(data.content as LandingContentInput),
      source: "database",
      updated_at: data.updated_at,
      updated_by: data.updated_by,
    };
  } catch {
    return {
      content: defaultLandingContent,
      source: "fallback",
    };
  }
}

export async function saveLandingContent(
  payload: LandingContentInput,
  userId: string
): Promise<LandingContentResult> {
  const supabase = getServiceSupabase();
  const merged = mergeLandingContent(payload);
  const { data, error } = await supabase
    .from("landing_content")
    .upsert({
      slug: landingSlug,
      content: merged,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .select("content, updated_at, updated_by")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    content: mergeLandingContent((data?.content as LandingContentInput | undefined) ?? merged),
    source: "database",
    updated_at: data?.updated_at,
    updated_by: data?.updated_by,
  };
}
