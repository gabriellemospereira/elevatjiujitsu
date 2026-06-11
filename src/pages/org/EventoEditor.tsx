import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) + "-" + Math.random().toString(36).slice(2, 6);

const empty = {
  name: "", description: "", banner_url: "", starts_at: "", ends_at: "",
  city: "", state: "", address: "", organizer_name: "",
  base_price: 0, regulation_url: "", awards: "", schedule: "",
  status: "rascunho", registration_deadline: "",
};

const EventoEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = !id || id === "novo";
  const [form, setForm] = useState<any>(empty);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data: e } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      if (e) {
        setForm({
          ...e,
          starts_at: e.starts_at ? new Date(e.starts_at).toISOString().slice(0, 16) : "",
          ends_at: e.ends_at ? new Date(e.ends_at).toISOString().slice(0, 16) : "",
          registration_deadline: e.registration_deadline ? new Date(e.registration_deadline).toISOString().slice(0, 16) : "",
        });
      }
      const { data: cats } = await supabase.from("event_categories").select("*").eq("event_id", id).order("name");
      setCategories(cats ?? []);
      setLoading(false);
    })();
  }, [id, isNew]);

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!user) return;
    if (!form.name || !form.starts_at || !form.city || !form.state) {
      toast.error("Nome, data, cidade e UF são obrigatórios.");
      return;
    }
    setSaving(true);
    const payload: any = {
      ...form,
      organizer_id: user.id,
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
      registration_deadline: form.registration_deadline ? new Date(form.registration_deadline).toISOString() : null,
      base_price: Number(form.base_price) || 0,
      state: String(form.state).toUpperCase().slice(0, 2),
    };
    if (isNew) payload.slug = slugify(form.name);
    const { data, error } = isNew
      ? await supabase.from("events").insert(payload).select().single()
      : await supabase.from("events").update(payload).eq("id", id).select().single();
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Evento salvo");
    if (isNew && data) navigate(`/app/org/evento/${data.id}`, { replace: true });
  };

  const addCategory = async () => {
    if (isNew) { toast.error("Salve o evento primeiro."); return; }
    const { data, error } = await supabase.from("event_categories").insert({
      event_id: id, name: "Nova categoria", price: 0,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setCategories([...categories, data]);
  };

  const updateCategory = async (catId: string, patch: any) => {
    const { error } = await supabase.from("event_categories").update(patch).eq("id", catId);
    if (error) { toast.error(error.message); return; }
    setCategories(categories.map((c) => c.id === catId ? { ...c, ...patch } : c));
  };

  const removeCategory = async (catId: string) => {
    await supabase.from("event_categories").delete().eq("id", catId);
    setCategories(categories.filter((c) => c.id !== catId));
  };

  if (loading) return <AppLayout><p className="text-foreground/60">Carregando...</p></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-heading font-bold mb-6">{isNew ? "Novo Evento" : "Editar Evento"}</h1>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4 mb-8">
          <div>
            <Label>Nome do campeonato *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Início *</Label><Input type="datetime-local" value={form.starts_at} onChange={(e) => set("starts_at", e.target.value)} /></div>
            <div><Label>Fim</Label><Input type="datetime-local" value={form.ends_at} onChange={(e) => set("ends_at", e.target.value)} /></div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2"><Label>Cidade *</Label><Input value={form.city} onChange={(e) => set("city", e.target.value)} /></div>
            <div><Label>UF *</Label><Input value={form.state} onChange={(e) => set("state", e.target.value.toUpperCase())} maxLength={2} /></div>
          </div>
          <div><Label>Endereço</Label><Input value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} /></div>
          <div><Label>Organizador (nome exibido)</Label><Input value={form.organizer_name ?? ""} onChange={(e) => set("organizer_name", e.target.value)} /></div>
          <div><Label>Banner (URL da imagem)</Label><Input value={form.banner_url ?? ""} onChange={(e) => set("banner_url", e.target.value)} /></div>
          <div><Label>Descrição</Label><Textarea rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
          <div><Label>Cronograma</Label><Textarea rows={4} value={form.schedule ?? ""} onChange={(e) => set("schedule", e.target.value)} /></div>
          <div><Label>Premiação</Label><Textarea rows={3} value={form.awards ?? ""} onChange={(e) => set("awards", e.target.value)} /></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Valor base (R$)</Label><Input type="number" step="0.01" value={form.base_price ?? 0} onChange={(e) => set("base_price", e.target.value)} /></div>
            <div><Label>Inscrições até</Label><Input type="datetime-local" value={form.registration_deadline} onChange={(e) => set("registration_deadline", e.target.value)} /></div>
          </div>
          <div><Label>URL do regulamento (PDF)</Label><Input value={form.regulation_url ?? ""} onChange={(e) => set("regulation_url", e.target.value)} /></div>
          <div>
            <Label>Status</Label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option value="rascunho">Rascunho</option>
              <option value="publicado">Publicado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <Button variant="gold" onClick={save} disabled={saving}><Save className="w-4 h-4 mr-2" />{saving ? "Salvando..." : "Salvar evento"}</Button>
        </div>

        {!isNew && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold">Categorias</h2>
              <Button size="sm" onClick={addCategory}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
            </div>
            {categories.length === 0 ? (
              <p className="text-sm text-foreground/60">Nenhuma categoria cadastrada.</p>
            ) : (
              <div className="space-y-3">
                {categories.map((c) => (
                  <div key={c.id} className="border border-border rounded p-3 grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-end">
                    <div><Label className="text-xs">Nome</Label><Input value={c.name} onChange={(e) => updateCategory(c.id, { name: e.target.value })} /></div>
                    <div><Label className="text-xs">Faixa</Label><Input value={c.belt ?? ""} onChange={(e) => updateCategory(c.id, { belt: e.target.value })} /></div>
                    <div><Label className="text-xs">Gênero</Label>
                      <select value={c.gender ?? ""} onChange={(e) => updateCategory(c.id, { gender: e.target.value || null })} className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm">
                        <option value="">—</option><option value="masculino">M</option><option value="feminino">F</option><option value="misto">Misto</option>
                      </select>
                    </div>
                    <div><Label className="text-xs">Preço</Label><Input type="number" step="0.01" value={c.price ?? 0} onChange={(e) => updateCategory(c.id, { price: Number(e.target.value) })} /></div>
                    <Button size="icon" variant="ghost" onClick={() => removeCategory(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default EventoEditor;