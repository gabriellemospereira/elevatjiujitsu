
-- Reservation status enum
CREATE TYPE public.reservation_status AS ENUM ('confirmed','cancelled','attended','no_show');

-- 1. class_schedules: weekly recurring grid
CREATE TABLE public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL DEFAULT 'Elevate HQ',
  capacity INT NOT NULL DEFAULT 30,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.class_schedules TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.class_schedules TO authenticated;
GRANT ALL ON public.class_schedules TO service_role;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "schedules readable" ON public.class_schedules FOR SELECT USING (true);
CREATE POLICY "schedules admin manage" ON public.class_schedules FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "schedules professor manage own" ON public.class_schedules FOR UPDATE TO authenticated
  USING (professor_id = auth.uid() AND public.has_role(auth.uid(),'professor'))
  WITH CHECK (professor_id = auth.uid() AND public.has_role(auth.uid(),'professor'));
CREATE TRIGGER trg_schedules_updated BEFORE UPDATE ON public.class_schedules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. class_sessions: concrete occurrences
CREATE TABLE public.class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.class_schedules(id) ON DELETE SET NULL,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL DEFAULT 'Elevate HQ',
  capacity INT NOT NULL DEFAULT 30,
  cancelled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (schedule_id, starts_at)
);
CREATE INDEX idx_sessions_starts_at ON public.class_sessions(starts_at);
GRANT SELECT ON public.class_sessions TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.class_sessions TO authenticated;
GRANT ALL ON public.class_sessions TO service_role;
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions readable" ON public.class_sessions FOR SELECT USING (true);
CREATE POLICY "sessions admin manage" ON public.class_sessions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "sessions professor update own" ON public.class_sessions FOR UPDATE TO authenticated
  USING (professor_id = auth.uid() AND public.has_role(auth.uid(),'professor'))
  WITH CHECK (professor_id = auth.uid() AND public.has_role(auth.uid(),'professor'));
CREATE TRIGGER trg_sessions_updated BEFORE UPDATE ON public.class_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. reservations
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.reservation_status NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, profile_id)
);
CREATE INDEX idx_reservations_session ON public.reservations(session_id);
CREATE INDEX idx_reservations_profile ON public.reservations(profile_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "res self select" ON public.reservations FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "res self insert" ON public.reservations FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "res self update" ON public.reservations FOR UPDATE TO authenticated
  USING (profile_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'))
  WITH CHECK (profile_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "res admin delete" ON public.reservations FOR DELETE TO authenticated
  USING (profile_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_reservations_updated BEFORE UPDATE ON public.reservations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. graduations
CREATE TABLE public.graduations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  from_belt_id UUID REFERENCES public.belts(id),
  to_belt_id UUID NOT NULL REFERENCES public.belts(id),
  from_degree SMALLINT NOT NULL DEFAULT 0,
  to_degree SMALLINT NOT NULL DEFAULT 0,
  graduated_at DATE NOT NULL DEFAULT CURRENT_DATE,
  professor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_grad_profile ON public.graduations(profile_id);
GRANT SELECT ON public.graduations TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.graduations TO authenticated;
GRANT ALL ON public.graduations TO service_role;
ALTER TABLE public.graduations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "grad self read" ON public.graduations FOR SELECT TO authenticated
  USING (profile_id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "grad admin manage" ON public.graduations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));

-- 5. student_notes
CREATE TABLE public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_notes TO authenticated;
GRANT ALL ON public.student_notes TO service_role;
ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes prof read" ON public.student_notes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "notes prof manage" ON public.student_notes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR (public.has_role(auth.uid(),'professor') AND professor_id = auth.uid()))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR (public.has_role(auth.uid(),'professor') AND professor_id = auth.uid()));
CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON public.student_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. Add class_session_id to attendance
ALTER TABLE public.attendance ADD COLUMN class_session_id UUID REFERENCES public.class_sessions(id) ON DELETE SET NULL;

-- 7. user_roles: allow admin to manage roles
CREATE POLICY "roles admin manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 8. profiles: allow admin/professor to read all profiles, admin update
CREATE POLICY "profiles staff read all" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "profiles admin update all" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 9. attendance: allow professor/admin to insert
CREATE POLICY "attendance staff insert" ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "attendance staff update" ON public.attendance FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
CREATE POLICY "attendance staff delete" ON public.attendance FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'professor'));
