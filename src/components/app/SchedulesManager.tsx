import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

type Schedule = {
  id: string;
  class_id: string;
  professor_id: string | null;
  day_of_week: number;
  start_time: string;
  end_time: string;
  location: string;
  capacity: number;
  active: boolean;
  classes: { name: string } | null;
  professor: { full_name: string } | null;
};

const SchedulesManager = ({ filterByCurrentUser = false }: { filterByCurrentUser?: boolean }) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [professors, setProfessors] = useState<{ id: string; full_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("class_schedules")
      .select("*, classes(name), professor:profiles!class_schedules_professor_id_fkey(full_name)")
      .order("day_of_week").order("start_time");
    if (filterByCurrentUser && user) q = q.eq("professor_id", user.id);
    const { data } = await q;
    setRows((data ?? []) as any);

    const { data: cls } = await supabase.from("classes").select("id, name").order("name");
    setClasses(cls ?? []);
    const { data: profs } = await supabase
      .from("user_roles").select("user_id, profiles!user_roles_user_id_fkey(id, full_name)")
      .in("role", ["professor", "admin"]);
    const dedup = new Map<string, { id: string; full_name: string }>();
    (profs ?? []).forEach((p: any) => {
      if (p.profiles) dedup.set(p.profiles.id, p.profiles);
    });
    setProfessors([...dedup.values()].sort((a, b) => a.full_name.localeCompare(b.full_name)));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = {
      class_id: String(f.get("class_id")),
      professor_id: filterByCurrentUser ? user!.id : (String(f.get("professor_id")) || null),
      day_of_week: Number(f.get("day_of_week")),
      start_time: String(f.get("start_time")),
      end_time: String(f.get("end_time")),
      location: String(f.get("location") || "Elevate HQ"),
      capacity: Number(f.get("capacity") || 30),
    };
    const { error } = await supabase.from("class_schedules").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Horário criado!");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este horário? Sessões já agendadas não são removidas.")) return;
    const { error } = await supabase.from("class_schedules").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const toggle = async (s: Schedule) => {
    await supabase.from("class_schedules").update({ active: !s.active }).eq("id", s.id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" size="sm"><Plus className="w-4 h-4 mr-1" /> Novo horário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo horário</DialogTitle></DialogHeader>
            <form onSubmit={onCreate} className="space-y-4">
              <div>
                <Label>Aula</Label>
                <Select name="class_id" required>
                  <SelectTrigger><SelectValue placeholder="Escolha a aula" /></SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {!filterByCurrentUser && (
                <div>
                  <Label>Professor</Label>
                  <Select name="professor_id">
                    <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                    <SelectContent>
                      {professors.map((p) => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label>Dia</Label>
                  <Select name="day_of_week" defaultValue="1">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Início</Label>
                  <Input name="start_time" type="time" required defaultValue="19:00" />
                </div>
                <div>
                  <Label>Fim</Label>
                  <Input name="end_time" type="time" required defaultValue="20:30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Local</Label>
                  <Input name="location" defaultValue="Elevate HQ" />
                </div>
                <div>
                  <Label>Vagas</Label>
                  <Input name="capacity" type="number" min={1} defaultValue={30} />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant="gold">Criar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
      ) : rows.length === 0 ? (
        <div className="card-elevated p-8 text-center text-muted-foreground">Nenhum horário cadastrado.</div>
      ) : (
        <div className="card-elevated divide-y divide-border">
          {rows.map((s) => (
            <div key={s.id} className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-heading font-bold flex items-center gap-2">
                  {s.classes?.name}
                  {!s.active && <Badge variant="outline">Inativo</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {DAYS[s.day_of_week]} • {s.start_time.slice(0,5)}–{s.end_time.slice(0,5)} • {s.location} • {s.capacity} vagas
                  {s.professor?.full_name ? ` • ${s.professor.full_name}` : ""}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toggle(s)}>
                  {s.active ? "Pausar" : "Ativar"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchedulesManager;