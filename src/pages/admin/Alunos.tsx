import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Search, Award } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";
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

type Profile = {
  id: string; full_name: string; email: string | null; phone: string | null;
  degree: number; belt_id: string | null; belts: { name: string; color_hex: string } | null;
};
type Belt = { id: string; name: string; rank_order: number };

const AdminAlunos = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Profile[]>([]);
  const [belts, setBelts] = useState<Belt[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [gradFor, setGradFor] = useState<Profile | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: profs }, { data: bs }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, phone, degree, belt_id, belts(name, color_hex)").order("full_name"),
      supabase.from("belts").select("id, name, rank_order").order("rank_order"),
    ]);
    setRows((profs ?? []) as any);
    setBelts((bs ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () => rows.filter((r) => r.full_name?.toLowerCase().includes(search.toLowerCase()) || r.email?.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  );

  const saveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.from("profiles").update({
      full_name: String(f.get("full_name")),
      phone: String(f.get("phone")) || null,
      belt_id: String(f.get("belt_id")) || null,
      degree: Number(f.get("degree") || 0),
    }).eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Aluno atualizado.");
    setEditing(null);
    load();
  };

  const saveGrad = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!gradFor || !user) return;
    const f = new FormData(e.currentTarget);
    const toBeltId = String(f.get("to_belt_id"));
    const toDegree = Number(f.get("to_degree") || 0);
    const { error: gErr } = await supabase.from("graduations").insert({
      profile_id: gradFor.id,
      from_belt_id: gradFor.belt_id,
      to_belt_id: toBeltId,
      from_degree: gradFor.degree,
      to_degree: toDegree,
      professor_id: user.id,
      notes: String(f.get("notes") || ""),
    });
    if (gErr) return toast.error(gErr.message);
    await supabase.from("profiles").update({ belt_id: toBeltId, degree: toDegree }).eq("id", gradFor.id);
    toast.success("Graduação registrada!");
    setGradFor(null);
    load();
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Link to="/app/admin" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gradient">Alunos</h1>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        ) : (
          <div className="card-elevated divide-y divide-border">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold">{p.full_name}</div>
                  <div className="text-xs text-muted-foreground">{p.email}</div>
                </div>
                <Badge variant="outline" className="gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: p.belts?.color_hex ?? "#999" }} />
                  {p.belts?.name ?? "—"} • {p.degree}°
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Editar</Button>
                  <Button size="sm" variant="gold" onClick={() => setGradFor(p)}>
                    <Award className="w-4 h-4 mr-1" /> Graduar
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">Nenhum aluno encontrado.</div>
            )}
          </div>
        )}

        <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar aluno</DialogTitle></DialogHeader>
            {editing && (
              <form onSubmit={saveEdit} className="space-y-4">
                <div><Label>Nome</Label><Input name="full_name" defaultValue={editing.full_name} required /></div>
                <div><Label>Telefone</Label><Input name="phone" defaultValue={editing.phone ?? ""} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Faixa</Label>
                    <Select name="belt_id" defaultValue={editing.belt_id ?? undefined}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {belts.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Grau</Label><Input name="degree" type="number" min={0} max={4} defaultValue={editing.degree} /></div>
                </div>
                <DialogFooter><Button type="submit" variant="gold">Salvar</Button></DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!gradFor} onOpenChange={(v) => !v && setGradFor(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar graduação</DialogTitle></DialogHeader>
            {gradFor && (
              <form onSubmit={saveGrad} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Atual: <strong>{gradFor.belts?.name}</strong> • {gradFor.degree}°
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Nova faixa</Label>
                    <Select name="to_belt_id" defaultValue={gradFor.belt_id ?? undefined} required>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {belts.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Novo grau</Label><Input name="to_degree" type="number" min={0} max={4} defaultValue={0} /></div>
                </div>
                <div><Label>Observações</Label><Input name="notes" /></div>
                <DialogFooter><Button type="submit" variant="gold">Registrar</Button></DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AdminAlunos;