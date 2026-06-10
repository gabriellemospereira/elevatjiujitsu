import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Check, X, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Session = {
  id: string; starts_at: string; ends_at: string; location: string; class_id: string;
  classes: { name: string } | null;
};
type Row = {
  reservation_id: string | null;
  profile_id: string;
  full_name: string;
  status: string;
  attendance_id: string | null;
};

const Chamada = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [allStudents, setAllStudents] = useState<{ id: string; full_name: string }[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (!sessionId) return;
    const { data: s } = await supabase
      .from("class_sessions")
      .select("id, starts_at, ends_at, location, class_id, classes(name)")
      .eq("id", sessionId).maybeSingle();
    setSession(s as any);

    const { data: res } = await supabase
      .from("reservations")
      .select("id, profile_id, status, profiles!reservations_profile_id_fkey(full_name)")
      .eq("session_id", sessionId);

    const { data: att } = await supabase
      .from("attendance")
      .select("id, profile_id")
      .eq("class_session_id", sessionId);
    const attMap = new Map<string, string>();
    (att ?? []).forEach((a) => attMap.set(a.profile_id, a.id));

    setRows(
      (res ?? []).map((r: any) => ({
        reservation_id: r.id,
        profile_id: r.profile_id,
        full_name: r.profiles?.full_name ?? "—",
        status: r.status,
        attendance_id: attMap.get(r.profile_id) ?? null,
      })),
    );

    const { data: students } = await supabase
      .from("profiles")
      .select("id, full_name")
      .order("full_name");
    setAllStudents(students ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const markPresent = async (row: Row) => {
    if (!session || !user) return;
    if (row.attendance_id) {
      await supabase.from("attendance").delete().eq("id", row.attendance_id);
      if (row.reservation_id) {
        await supabase.from("reservations").update({ status: "confirmed" }).eq("id", row.reservation_id);
      }
    } else {
      await supabase.from("attendance").insert({
        profile_id: row.profile_id,
        class_id: session.class_id,
        class_session_id: session.id,
        professor_id: user.id,
        attended_at: session.starts_at,
      });
      if (row.reservation_id) {
        await supabase.from("reservations").update({ status: "attended" }).eq("id", row.reservation_id);
      }
    }
    load();
  };

  const markAbsent = async (row: Row) => {
    if (row.reservation_id) {
      await supabase.from("reservations").update({ status: "no_show" }).eq("id", row.reservation_id);
    }
    if (row.attendance_id) {
      await supabase.from("attendance").delete().eq("id", row.attendance_id);
    }
    load();
  };

  const addDropIn = async (profileId: string) => {
    if (!session) return;
    if (rows.some((r) => r.profile_id === profileId)) {
      toast.info("Aluno já está na lista.");
      return;
    }
    const { error } = await supabase.from("reservations").insert({
      session_id: session.id, profile_id: profileId, status: "confirmed",
    });
    if (error) return toast.error(error.message);
    setOpen(false);
    load();
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/app/prof" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        {session && (
          <div>
            <h1 className="text-2xl font-heading font-bold text-gradient">{session.classes?.name}</h1>
            <p className="text-sm text-muted-foreground">
              {format(new Date(session.starts_at), "EEEE, dd/MM 'às' HH:mm", { locale: ptBR })} • {session.location}
            </p>
          </div>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Adicionar aluno avulso</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0 pointer-events-auto">
            <Command>
              <CommandInput placeholder="Buscar aluno..." />
              <CommandList>
                <CommandEmpty>Nenhum encontrado</CommandEmpty>
                <CommandGroup>
                  {allStudents.map((s) => (
                    <CommandItem key={s.id} onSelect={() => addDropIn(s.id)}>
                      {s.full_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        ) : rows.length === 0 ? (
          <div className="card-elevated p-8 text-center text-muted-foreground">Sem inscritos.</div>
        ) : (
          <div className="card-elevated divide-y divide-border">
            {rows.map((r) => (
              <div key={r.profile_id} className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{r.full_name}</div>
                  <div className="text-xs">
                    {r.attendance_id ? (
                      <Badge variant="secondary" className="gap-1"><Check className="w-3 h-3" /> Presente</Badge>
                    ) : r.status === "no_show" ? (
                      <Badge variant="destructive">Falta</Badge>
                    ) : (
                      <Badge variant="outline">Inscrito</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={r.attendance_id ? "gold" : "outline"} onClick={() => markPresent(r)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant={r.status === "no_show" ? "destructive" : "outline"} onClick={() => markAbsent(r)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Chamada;