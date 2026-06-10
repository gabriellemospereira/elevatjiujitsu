import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Loader2 } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

type Row = {
  id: string;
  attended_at: string;
  classes: { name: string } | null;
  professor: { full_name: string } | null;
};

const Historico = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("attendance")
        .select("id, attended_at, classes(name), professor:profiles!attendance_professor_id_fkey(full_name)")
        .eq("profile_id", user.id)
        .order("attended_at", { ascending: false })
        .limit(200);
      setRows((data ?? []) as any);
      setLoading(false);
    })();
  }, [user]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient">Histórico de Treinos</h1>
          <p className="text-sm text-muted-foreground">Suas presenças registradas pelo professor.</p>
        </div>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mt-12" />
        ) : rows.length === 0 ? (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Nenhuma presença registrada ainda.
          </div>
        ) : (
          <div className="card-elevated divide-y divide-border">
            {rows.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold">{r.classes?.name ?? "Aula"}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(r.attended_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    {r.professor?.full_name ? ` • ${r.professor.full_name}` : ""}
                  </div>
                </div>
                <Badge variant="secondary" className="gap-1"><Check className="w-3 h-3" /> Presente</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Historico;