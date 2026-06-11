
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organizer_name TEXT,
  base_price NUMERIC(10,2) DEFAULT 0,
  regulation_url TEXT,
  awards TEXT,
  schedule TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho','publicado','cancelado')),
  registration_deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events_public_read" ON public.events FOR SELECT
  USING (status = 'publicado' OR organizer_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "events_organizer_insert" ON public.events FOR INSERT TO authenticated
  WITH CHECK (organizer_id = auth.uid() AND (public.has_role(auth.uid(),'organizador') OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "events_organizer_update" ON public.events FOR UPDATE TO authenticated
  USING (organizer_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "events_organizer_delete" ON public.events FOR DELETE TO authenticated
  USING (organizer_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  belt TEXT,
  gender TEXT CHECK (gender IN ('masculino','feminino','misto')),
  age_min INT,
  age_max INT,
  weight_min NUMERIC(5,2),
  weight_max NUMERIC(5,2),
  capacity INT,
  price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_categories TO authenticated;
GRANT ALL ON public.event_categories TO service_role;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_categories_read" ON public.event_categories FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.status='publicado' OR e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "event_categories_manage" ON public.event_categories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND (e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.event_categories(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','confirmada','cancelada')),
  payment_status TEXT NOT NULL DEFAULT 'pendente' CHECK (payment_status IN ('pendente','pago','isento')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(category_id, profile_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "registrations_read" ON public.event_registrations FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.events e WHERE e.id=event_id AND (e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "registrations_insert" ON public.event_registrations FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());
CREATE POLICY "registrations_update" ON public.event_registrations FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.events e WHERE e.id=event_id AND (e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "registrations_delete" ON public.event_registrations FOR DELETE TO authenticated
  USING (profile_id = auth.uid() OR EXISTS (SELECT 1 FROM public.events e WHERE e.id=event_id AND (e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE TRIGGER event_registrations_updated_at BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video')),
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_media TO authenticated;
GRANT ALL ON public.event_media TO service_role;
ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_media_read" ON public.event_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id=event_id AND (e.status='publicado' OR e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));
CREATE POLICY "event_media_manage" ON public.event_media FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id=event_id AND (e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id=event_id AND (e.organizer_id=auth.uid() OR public.has_role(auth.uid(),'admin'))));

CREATE TABLE public.event_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, profile_id)
);
GRANT SELECT ON public.event_reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_reviews TO authenticated;
GRANT ALL ON public.event_reviews TO service_role;
ALTER TABLE public.event_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_reviews_read" ON public.event_reviews FOR SELECT USING (true);
CREATE POLICY "event_reviews_insert" ON public.event_reviews FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());
CREATE POLICY "event_reviews_update" ON public.event_reviews FOR UPDATE TO authenticated
  USING (profile_id = auth.uid());
CREATE POLICY "event_reviews_delete" ON public.event_reviews FOR DELETE TO authenticated
  USING (profile_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE INDEX events_starts_at_idx ON public.events(starts_at);
CREATE INDEX events_status_idx ON public.events(status);
CREATE INDEX events_state_idx ON public.events(state);
