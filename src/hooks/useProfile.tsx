import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Belt {
  id: string;
  name: string;
  rank_order: number;
  color_hex: string;
  classes_to_next_belt: number | null;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  enrollment_date: string | null;
  avatar_url: string | null;
  belt_id: string | null;
  degree: number;
  belts: Belt | null;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*, belts (*)")
      .eq("id", user.id)
      .maybeSingle();
    if (!error) setProfile(data as unknown as Profile);
    setLoading(false);
  }, [user]);

  useEffect(() => { refetch(); }, [refetch]);

  return { profile, loading, refetch };
};