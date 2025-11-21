import type { LandingContentInput } from "./landing-content";

// Lightweight API helpers for client-side calls
type FetchOptions = { token?: string };

async function fetchJSON<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchCatalog(includeAll = false, opts: FetchOptions = {}) {
  const qs = includeAll ? "?all=1" : "";
  return fetchJSON<{ courses: unknown[] }>(`/api/catalog${qs}`, {
    headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  });
}

export async function publishModule(moduleId: string, { token }: FetchOptions = {}) {
  return fetchJSON(`/api/modules/${moduleId}/publish`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function unpublishModule(moduleId: string, { token }: FetchOptions = {}) {
  return fetchJSON(`/api/modules/${moduleId}/unpublish`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function publishCourse(courseId: string, { token }: FetchOptions = {}) {
  return fetchJSON(`/api/courses/${courseId}/publish`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function unpublishCourse(courseId: string, { token }: FetchOptions = {}) {
  return fetchJSON(`/api/courses/${courseId}/unpublish`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

export async function updateProgress(
  input: { studentId: string; moduleId: string; status: string; score?: number },
  { token }: FetchOptions = {}
) {
  return fetchJSON("/api/progress", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(input),
  });
}

export async function uploadMaterial(
  file: File,
  meta: { moduleId: string; title: string; materialType?: string },
  { token }: FetchOptions = {}
) {
  const form = new FormData();
  form.append("file", file);
  form.append("moduleId", meta.moduleId);
  form.append("title", meta.title);
  if (meta.materialType) form.append("materialType", meta.materialType);

  return fetchJSON("/api/materials/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
}

export async function fetchLandingContentPublic(opts: FetchOptions = {}) {
  return fetchJSON<{ content: unknown }>("/api/landing", {
    headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : undefined,
  });
}

export async function uploadLandingImage(
  file: File,
  { token, folder }: { token?: string; folder?: string } = {}
) {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);

  return fetchJSON<{ url: string; path: string }>("/api/landing/upload", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  });
}

export async function saveLandingContentClient(
  content: LandingContentInput,
  { token }: FetchOptions = {}
) {
  return fetchJSON("/api/landing", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
  });
}
