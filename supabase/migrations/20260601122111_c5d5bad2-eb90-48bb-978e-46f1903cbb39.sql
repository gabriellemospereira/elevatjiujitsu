
-- =========================================================
-- FASE 1: Fundação Elevate Jiu-Jitsu
-- =========================================================

-- 1. ROLES (user_roles + has_role)
CREATE TYPE public.app_role AS ENUM ('admin', 'professor', 'aluno');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. BELTS (faixas)
CREATE TABLE public.belts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  rank_order INT NOT NULL UNIQUE,
  color_hex TEXT NOT NULL,
  classes_to_next_belt INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.belts TO anon, authenticated;
GRANT ALL ON public.belts TO service_role;

ALTER TABLE public.belts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Belts are viewable by everyone"
  ON public.belts FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage belts"
  ON public.belts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.belts (name, rank_order, color_hex, classes_to_next_belt) VALUES
  ('Branca',  1, '#FFFFFF',  60),
  ('Azul',    2, '#1E40AF', 120),
  ('Roxa',    3, '#7C3AED', 180),
  ('Marrom',  4, '#78350F', 250),
  ('Preta',   5, '#0A0A0A', NULL);

-- 3. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  phone TEXT,
  birth_date DATE,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  avatar_url TEXT,
  belt_id UUID REFERENCES public.belts(id),
  degree INT NOT NULL DEFAULT 0 CHECK (degree BETWEEN 0 AND 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'professor'));

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Trigger to auto-create profile + role 'aluno' on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  white_belt_id UUID;
BEGIN
  SELECT id INTO white_belt_id FROM public.belts WHERE rank_order = 1 LIMIT 1;

  INSERT INTO public.profiles (id, full_name, email, belt_id, enrollment_date)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    white_belt_id,
    CURRENT_DATE
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'aluno');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. CLASSES (modalidades / aulas catálogo)
CREATE TYPE public.modality AS ENUM ('bjj_adulto', 'bjj_kids', 'bjj_juvenil', 'funcional', 'open_mat');

CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  modality public.modality NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.classes TO anon, authenticated;
GRANT ALL ON public.classes TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.classes TO authenticated;

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Classes viewable by everyone"
  ON public.classes FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins manage classes"
  ON public.classes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.classes (name, modality, description) VALUES
  ('Jiu-Jitsu Adulto', 'bjj_adulto', 'Treino para adultos do iniciante ao avançado'),
  ('Jiu-Jitsu Kids', 'bjj_kids', 'Aula para crianças'),
  ('Jiu-Jitsu Juvenil', 'bjj_juvenil', 'Aula para adolescentes'),
  ('Condicionamento Funcional', 'funcional', 'Preparação física complementar'),
  ('Open Mat', 'open_mat', 'Treino livre');

-- 5. ATTENDANCE (presenças)
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE RESTRICT,
  professor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  attended_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendance_profile ON public.attendance(profile_id);
CREATE INDEX idx_attendance_attended_at ON public.attendance(attended_at);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own attendance"
  ON public.attendance FOR SELECT TO authenticated
  USING (
    auth.uid() = profile_id
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'professor')
  );

CREATE POLICY "Professors/admins record attendance"
  ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'professor')
  );

CREATE POLICY "Professors/admins update attendance"
  ON public.attendance FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'professor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'professor'));

CREATE POLICY "Admins delete attendance"
  ON public.attendance FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 6. STORAGE: avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatars are publicly viewable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload own avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users update own avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users delete own avatar"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
