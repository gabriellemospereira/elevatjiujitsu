import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, ClipboardList, Loader2 } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";

type Sess = {
  id: string;
  starts_at: string;
  classes: { name: string } | null;
  reservation_count: number;
};

const ProfHome = () => {
  const { user } = useAuth();
  const { isAdmin } = useRole();
  const [sessions, setSessions] = useState<Sess[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const now = new Date();
      const in7 = new Date(now.getTime() + 7 * 86400 * 1000);
      let q = supabase
        .from("class_sessions")
        .select("id, starts_at, classes(name)")
        .gte("starts_at", now.toISOString())
        .lte("starts_at", in7.toISOString())
        .order("starts_at");
      if (!isAdmin) q = q.eq("professor_id", user.id);
      const { data } = await q;
      const ids = (data ?? []).map((d) => d.id);
      let counts = new Map<string, number>();
      if (ids.length) {
        const { data: res } = await supabase
          .from("reservations").select("session_id").in("session_id", ids).neq("status", "cancelled");
        (res ?? []).forEach((r) => counts.set(r.session_id, (counts.get(r.session_id) ?? 0) + 1));
      }
      setSessions(
        (data ?? []).map((d: any) => ({ ...d, reservation_count: counts.get(d.id) ?? 0 })),
      );
      setLoading(false);
    })();
  }, [user, isAdmin]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient">Área do Professor</h1>
          <p className="text-sm text-muted-foreground">Suas próximas aulas e chamada.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/app/prof/horarios">
            <span className="card-elevated px-4 py-3 inline-flex items-center gap-2 text-sm font-heading uppercase tracking-wider hover:border-primary/50">
              <ClipboardList className="w-4 h-4" /> Horários
            </span>
          </Link>
          <Link to="/app/prof/notas">
            <span className="card-elevated px-4 py-3 inline-flex items-center gap-2 text-sm font-heading uppercase tracking-wider hover:border-primary/50">
              Notas de alunos
            </span>
          </Link>
        </div>

        <h2 className="text-sm uppercase tracking-widest font-heading text-primary">Próximos 7 dias</h2>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        ) : sessions.length === 0 ? (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Nenhuma aula agendada.
          </div>
        ) : (
          <div className="card-elevated divide-y divide-border">
            {sessions.map((s) => (
              <Link
                key={s.id}
                to={`/app/prof/chamada/${s.id}`}
                className="p-4 flex items-center justify-between hover:bg-muted/30"
              >
                <div>
                  <div className="font-heading font-bold">{s.classes?.name ?? "Aula"}</div>
                  <div className="text-xs text-muted-foreground">
                    {isToday(new Date(s.starts_at)) ? "Hoje" : format(new Date(s.starts_at), "EEE dd/MM", { locale: ptBR })}
                    {" "}às{" "}
                    {format(new Date(s.starts_at), "HH:mm")} • {s.reservation_count} inscritos
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfHome;