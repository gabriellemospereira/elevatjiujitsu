import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";

type Note = {
  id: string; profile_id: string; professor_id: string; note: string; created_at: string;
  student: { full_name: string } | null;
  professor: { full_name: string } | null;
};

const ProfNotas = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [students, setStudents] = useState<{ id: string; full_name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("student_notes")
      .select("*, student:profiles!student_notes_profile_id_fkey(full_name), professor:profiles!student_notes_professor_id_fkey(full_name)")
      .order("created_at", { ascending: false });
    setNotes((data ?? []) as any);
    const { data: s } = await supabase.from("profiles").select("id, full_name").order("full_name");
    setStudents(s ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from("student_notes").insert({
      profile_id: String(f.get("profile_id")),
      professor_id: user.id,
      note: String(f.get("note")),
    });
    if (error) return toast.error(error.message);
    toast.success("Observação salva.");
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("student_notes").delete().eq("id", id);
    load();
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/app/prof" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-gradient">Observações</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" size="sm"><Plus className="w-4 h-4 mr-1" /> Nova</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nova observação</DialogTitle></DialogHeader>
              <form onSubmit={onCreate} className="space-y-4">
                <div>
                  <Label>Aluno</Label>
                  <Select name="profile_id" required>
                    <SelectTrigger><SelectValue placeholder="Escolha" /></SelectTrigger>
                    <SelectContent>
                      {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Observação</Label>
                  <Textarea name="note" required maxLength={2000} rows={5} />
                </div>
                <DialogFooter><Button type="submit" variant="gold">Salvar</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        ) : notes.length === 0 ? (
          <div className="card-elevated p-8 text-center text-muted-foreground">Nenhuma observação.</div>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="card-elevated p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-heading font-bold">{n.student?.full_name ?? "—"}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {format(new Date(n.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      {n.professor?.full_name ? ` • ${n.professor.full_name}` : ""}
                    </div>
                  </div>
                  {n.professor_id === user?.id && (
                    <Button size="sm" variant="ghost" onClick={() => remove(n.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm mt-2 whitespace-pre-wrap">{n.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ProfNotas;