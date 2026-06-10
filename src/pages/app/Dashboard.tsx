import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Award, Calendar, TrendingUp, Trophy, ChevronRight, CalendarCheck } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import AppLayout from "@/components/app/AppLayout";
import BeltProgress from "@/components/app/BeltProgress";
import { useProfile } from "@/hooks/useProfile";
import { useGraduation } from "@/hooks/useGraduation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const monthsSince = (date: string | null) => {
  if (!date) return 0;
  const start = new Date(date);
  const now = new Date();
  return Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
};

const Dashboard = () => {
  const { profile, loading: pLoading } = useProfile();
  const { data: grad, loading: gLoading } = useGraduation();
  const { user } = useAuth();
  const [monthlyCount, setMonthlyCount] = useState<number | null>(null);
  const [lastGrad, setLastGrad] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const start = startOfMonth(new Date()).toISOString();
      const end = endOfMonth(new Date()).toISOString();
      const [{ count }, { data: last }] = await Promise.all([
        supabase.from("attendance").select("*", { count: "exact", head: true })
          .eq("profile_id", user.id).gte("attended_at", start).lte("attended_at", end),
        supabase.from("graduations").select("graduated_at").eq("profile_id", user.id)
          .order("graduated_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      setMonthlyCount(count ?? 0);
      setLastGrad(last?.graduated_at ?? null);
    })();
  }, [user]);

  const loading = pLoading || gLoading;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 bg-muted flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-heading font-bold text-primary">
                {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-heading uppercase tracking-wider">Bem-vindo</p>
            <h1 className="text-2xl md:text-3xl font-heading font-bold">
              {profile?.full_name || "Aluno Elevate"}
            </h1>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Award}
            label="Faixa"
            value={grad?.currentBelt?.name ?? "—"}
            sub={`${profile?.degree ?? 0} grau${(profile?.degree ?? 0) !== 1 ? "s" : ""}`}
            loading={loading}
          />
          <StatCard
            icon={Calendar}
            label="Tempo de academia"
            value={`${monthsSince(profile?.enrollment_date)} m`}
            sub="meses"
            loading={loading}
          />
          <StatCard
            icon={TrendingUp}
            label="Aulas realizadas"
            value={String(grad?.totalClasses ?? 0)}
            sub="no total"
            loading={loading}
          />
          <StatCard
            icon={CalendarCheck}
            label="Presenças no mês"
            value={String(monthlyCount ?? 0)}
            sub={format(new Date(), "MMMM", { locale: ptBR })}
            loading={loading || monthlyCount === null}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest">
              <Trophy className="w-4 h-4" /> Última graduação
            </div>
            <div className="mt-1 text-lg font-heading font-bold">
              {lastGrad ? format(new Date(lastGrad), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—"}
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-[10px] uppercase tracking-widest">
              <Award className="w-4 h-4" /> Próxima faixa
            </div>
            <div className="mt-1 text-lg font-heading font-bold">
              {grad?.nextBelt ? grad.nextBelt.name : "Faixa máxima"}
              {grad?.classesRemaining !== null && grad?.nextBelt && (
                <span className="text-sm text-muted-foreground font-normal ml-2">
                  ({grad.classesRemaining} aulas restantes)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Graduation summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold uppercase tracking-wider">Próxima Graduação</h2>
            <Link to="/app/graduacao" className="text-sm text-primary flex items-center gap-1 hover:underline">
              Detalhes <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {grad ? <BeltProgress data={grad} /> : <Skeleton className="h-48 w-full" />}
        </div>
      </div>
    </AppLayout>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  loading: boolean;
}) => (
  <div className="card-elevated p-4 space-y-2">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </div>
    {loading ? (
      <Skeleton className="h-7 w-16" />
    ) : (
      <div className="text-2xl font-heading font-bold text-foreground">{value}</div>
    )}
    <div className="text-xs text-muted-foreground">{sub}</div>
  </div>
);

export default Dashboard;