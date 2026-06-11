import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type EventRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  banner_url: string | null;
  starts_at: string;
  ends_at: string | null;
  city: string;
  state: string;
  address: string | null;
  organizer_id: string;
  organizer_name: string | null;
  base_price: number | null;
  regulation_url: string | null;
  awards: string | null;
  schedule: string | null;
  status: "rascunho" | "publicado" | "cancelado";
  registration_deadline: string | null;
};

export type EventCategoryRow = {
  id: string;
  event_id: string;
  name: string;
  belt: string | null;
  gender: "masculino" | "feminino" | "misto" | null;
  age_min: number | null;
  age_max: number | null;
  weight_min: number | null;
  weight_max: number | null;
  capacity: number | null;
  price: number | null;
};

export const usePublishedEvents = (filters?: {
  city?: string;
  state?: string;
  belt?: string;
  search?: string;
}) => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let q = supabase
        .from("events")
        .select("*")
        .eq("status", "publicado")
        .order("starts_at", { ascending: true });
      if (filters?.city) q = q.ilike("city", `%${filters.city}%`);
      if (filters?.state) q = q.eq("state", filters.state.toUpperCase());
      if (filters?.search) q = q.ilike("name", `%${filters.search}%`);
      const { data } = await q;
      if (cancelled) return;
      setEvents((data ?? []) as EventRow[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [filters?.city, filters?.state, filters?.belt, filters?.search]);

  return { events, loading };
};

export const useEventBySlug = (slug: string | undefined) => {
  const [event, setEvent] = useState<EventRow | null>(null);
  const [categories, setCategories] = useState<EventCategoryRow[]>([]);
  const [media, setMedia] = useState<{ id: string; url: string; caption: string | null; media_type: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: e } = await supabase.from("events").select("*").eq("slug", slug).maybeSingle();
      if (cancelled) return;
      if (e) {
        setEvent(e as EventRow);
        const [cats, med] = await Promise.all([
          supabase.from("event_categories").select("*").eq("event_id", e.id).order("name"),
          supabase.from("event_media").select("*").eq("event_id", e.id).order("created_at"),
        ]);
        if (!cancelled) {
          setCategories((cats.data ?? []) as EventCategoryRow[]);
          setMedia((med.data ?? []) as any);
        }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return { event, categories, media, loading };
};