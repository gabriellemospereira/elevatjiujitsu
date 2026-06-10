import { useEffect, useMemo, useState } from "react";
import { addDays, format, isAfter, isSameDay, startOfWeek, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MapPin, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type SessionRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  location: string;
  capacity: number;
  cancelled: boolean;
  classes: { name: string; modality: string } | null;
  professor: { full_name: string } | null;
  reservation_count: number;
  my_reservation_id: string | null;
  my_status: string | null;
};

const Agenda = () => {
  const { user } = useAuth();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const weekEnd = useMemo(() => addDays(weekStart, 7), [weekStart]);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: rows } = await supabase
      .from("class_sessions")
      .select("id, starts_at, ends_at, location, capacity, cancelled, classes(name, modality), professor:profiles!class_sessions_professor_id_fkey(full_name)")
      .gte("starts_at", weekStart.toISOString())
      .lt("starts_at", weekEnd.toISOString())
      .order("starts_at");

    const ids = (rows ?? []).map((r) => r.id);
    let counts = new Map<string, number>();
    let mine = new Map<string, { id: string; status: string }>();
    if (ids.length) {
      const { data: resAll } = await supabase
        .from("reservations")
        .select("session_id, status")
        .in("session_id", ids)
        .neq("status", "cancelled");
      (resAll ?? []).forEach((r) => counts.set(r.session_id, (counts.get(r.session_id) ?? 0) + 1));

      const { data: resMine } = await supabase
        .from("reservations")
        .select("id, session_id, status")
        .in("session_id", ids)
        .eq("profile_id", user.id);
      (resMine ?? []).forEach((r) => mine.set(r.session_id, { id: r.id, status: r.status as string }));
    }

    setSessions(
      (rows ?? []).map((r) => ({
        ...(r as any),
        reservation_count: counts.get(r.id) ?? 0,
        my_reservation_id: mine.get(r.id)?.id ?? null,
        my_status: mine.get(r.id)?.status ?? null,
      })),
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, weekStart]);

  const reserve = async (s: SessionRow) => {
    if (!user) return;
    const start = new Date(s.starts_at);
    if (differenceInMinutes(start, new Date()) < 30) {
      toast.error("Reservas devem ser feitas com pelo menos 30 minutos de antecedência.");
      return;
    }
    if (s.reservation_count >= s.capacity) {
      toast.error("Aula lotada.");
      return;
    }
    setBusyId(s.id);
    if (s.my_reservation_id) {
      const { error } = await supabase
        .from("reservations")
        .update({ status: "confirmed" })
        .eq("id", s.my_reservation_id);
      setBusyId(null);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase
        .from("reservations")
        .insert({ session_id: s.id, profile_id: user.id, status: "confirmed" });
      setBusyId(null);
      if (error) return toast.error(error.message);
    }
    toast.success("Reserva confirmada!");
    load();
  };

  const cancel = async (s: SessionRow) => {
    if (!s.my_reservation_id) return;
    const start = new Date(s.starts_at);
    if (differenceInMinutes(start, new Date()) < 60) {
      toast.error("Cancelamento deve ser feito com pelo menos 1 hora de antecedência.");
      return;
    }
    setBusyId(s.id);
    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", s.my_reservation_id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Reserva cancelada.");
    load();
  };

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient">Agenda</h1>
            <p className="text-sm text-muted-foreground">
              {format(weekStart, "dd 'de' MMM", { locale: ptBR })} —{" "}
              {format(addDays(weekStart, 6), "dd 'de' MMM yyyy", { locale: ptBR })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : sessions.length === 0 ? (
          <div className="card-elevated p-8 text-center text-muted-foreground">
            Nenhuma aula encontrada para esta semana. Peça ao admin para gerar a agenda.
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day) => {
              const daySessions = sessions.filter((s) => isSameDay(new Date(s.starts_at), day));
              if (daySessions.length === 0) return null;
              return (
                <div key={day.toISOString()}>
                  <h2 className="text-sm uppercase tracking-widest font-heading text-primary mb-3">
                    {format(day, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </h2>
                  <div className="grid gap-3">
                    {daySessions.map((s) => {
                      const start = new Date(s.starts_at);
                      const remaining = s.capacity - s.reservation_count;
                      const isReserved = s.my_status === "confirmed";
                      const inPast = !isAfter(start, new Date());
                      return (
                        <div key={s.id} className="card-elevated p-4 flex flex-col md:flex-row md:items-center gap-4">
                          <div className="text-center md:w-20">
                            <div className="text-2xl font-heading font-bold text-primary">
                              {format(start, "HH:mm")}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {format(new Date(s.ends_at), "HH:mm")}
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="font-heading font-bold uppercase">{s.classes?.name ?? "Aula"}</div>
                            <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
                              <span className="flex items-center gap-1"><UserIcon className="w-3 h-3" />{s.professor?.full_name ?? "—"}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{s.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant={remaining > 0 ? "secondary" : "destructive"}>
                              {remaining > 0 ? `${remaining} vagas` : "Lotada"}
                            </Badge>
                            {s.cancelled ? (
                              <Badge variant="destructive">Cancelada</Badge>
                            ) : isReserved ? (
                              <Button size="sm" variant="outline" disabled={busyId === s.id || inPast} onClick={() => cancel(s)}>
                                {busyId === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Cancelar"}
                              </Button>
                            ) : (
                              <Button size="sm" variant="gold" disabled={busyId === s.id || inPast || remaining <= 0} onClick={() => reserve(s)}>
                                {busyId === s.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Reservar"}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Agenda;