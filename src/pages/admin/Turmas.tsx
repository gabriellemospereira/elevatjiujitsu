import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";
import SchedulesManager from "@/components/app/SchedulesManager";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const AdminTurmas = () => {
  const [generating, setGenerating] = useState(false);

  const generateSessions = async (weeks = 4) => {
    setGenerating(true);
    try {
      const { data: schedules } = await supabase
        .from("class_schedules").select("*").eq("active", true);
      if (!schedules || schedules.length === 0) {
        toast.info("Nenhum horário ativo. Crie horários primeiro.");
        return;
      }
      const start = startOfWeek(new Date(), { weekStartsOn: 1 });
      const rows: any[] = [];
      for (let w = 0; w < weeks; w++) {
        for (const s of schedules) {
          const day = addDays(addWeeks(start, w), (s.day_of_week + 6) % 7); // 0=Sun→6, 1=Mon→0
          const [sh, sm] = s.start_time.split(":").map(Number);
          const [eh, em] = s.end_time.split(":").map(Number);
          const startsAt = new Date(day); startsAt.setHours(sh, sm, 0, 0);
          const endsAt = new Date(day); endsAt.setHours(eh, em, 0, 0);
          if (startsAt < new Date()) continue;
          rows.push({
            schedule_id: s.id,
            class_id: s.class_id,
            professor_id: s.professor_id,
            starts_at: startsAt.toISOString(),
            ends_at: endsAt.toISOString(),
            location: s.location,
            capacity: s.capacity,
          });
        }
      }
      if (rows.length === 0) {
        toast.info("Nenhuma sessão futura para gerar.");
        return;
      }
      // Upsert by (schedule_id, starts_at)
      const { error } = await supabase.from("class_sessions").upsert(rows, {
        onConflict: "schedule_id,starts_at", ignoreDuplicates: true,
      });
      if (error) throw error;
      toast.success(`${rows.length} sessões geradas (duplicadas foram ignoradas).`);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao gerar sessões.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/app/admin" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h1 className="text-2xl font-heading font-bold text-gradient">Turmas & Horários</h1>
          <Button onClick={() => generateSessions(4)} variant="gold" disabled={generating}>
            {generating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
            Gerar 4 semanas
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          A grade abaixo define a recorrência semanal. Clique em "Gerar 4 semanas" para criar as sessões reais
          que os alunos verão na agenda. Sessões duplicadas são ignoradas.
        </p>
        <SchedulesManager />
      </div>
    </AppLayout>
  );
};

export default AdminTurmas;