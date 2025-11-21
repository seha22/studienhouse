"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCatalog } from "@/lib/api-client";

type Material = {
  id: string;
  title: string;
  material_type: string;
  url?: string | null;
  storage_path?: string | null;
};

type Module = {
  id: string;
  title: string;
  summary?: string | null;
  order_index?: number | null;
  duration_minutes?: number | null;
  is_published?: boolean;
  materials?: Material[];
};

type Course = {
  id: string;
  title: string;
  category: string;
  mode: string;
  level: string | null;
  description: string | null;
  is_published?: boolean;
  modules?: Module[];
};

export function useCatalogData(includeAll: boolean, token?: string) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCatalog(includeAll, { token });
      setCourses((res as { courses: Course[] }).courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  }, [includeAll, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { courses, error, loading, reload };
}

