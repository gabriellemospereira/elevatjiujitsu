import { Link } from "react-router-dom";
import { Award, Calendar, TrendingUp, Trophy, ChevronRight } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import BeltProgress from "@/components/app/BeltProgress";
import { useProfile } from "@/hooks/useProfile";
import { useGraduation } from "@/hooks/useGraduation";
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
            icon={Trophy}
            label="Ranking"
            value="—"
            sub="em breve"
            loading={loading}
          />
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