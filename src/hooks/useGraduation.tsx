import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Belt } from "./useProfile";

export interface GraduationData {
  currentBelt: Belt | null;
  nextBelt: Belt | null;
  totalClasses: number;
  classesRequired: number | null;
  classesRemaining: number | null;
  percent: number;
}

export const useGraduation = () => {
  const { user } = useAuth();
  const [data, setData] = useState<GraduationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoading(true);

      const [{ data: profile }, { data: belts }, { count }] = await Promise.all([
        supabase.from("profiles").select("belt_id").eq("id", user.id).maybeSingle(),
        supabase.from("belts").select("*").order("rank_order"),
        supabase.from("attendance").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
      ]);

      if (cancelled) return;

      const beltList = (belts ?? []) as unknown as Belt[];
      const currentBelt = beltList.find((b) => b.id === profile?.belt_id) ?? beltList[0] ?? null;
      const nextBelt = currentBelt
        ? beltList.find((b) => b.rank_order === currentBelt.rank_order + 1) ?? null
        : null;

      const totalClasses = count ?? 0;
      const classesRequired = currentBelt?.classes_to_next_belt ?? null;
      const classesRemaining = classesRequired !== null ? Math.max(0, classesRequired - totalClasses) : null;
      const percent = classesRequired ? Math.min(100, (totalClasses / classesRequired) * 100) : 100;

      setData({ currentBelt, nextBelt, totalClasses, classesRequired, classesRemaining, percent });
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user]);

  return { data, loading };
};