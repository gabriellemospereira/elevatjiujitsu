import { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { z } from "zod";
import AppLayout from "@/components/app/AppLayout";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Nome inválido").max(100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
});

const Perfil = () => {
  const { user } = useAuth();
  const { profile, loading, refetch } = useProfile();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", birth_date: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        birth_date: profile.birth_date ?? "",
      });
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        phone: parsed.data.phone || null,
        birth_date: parsed.data.birth_date || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error("Erro ao salvar: " + error.message);
    toast.success("Perfil atualizado");
    refetch();
  };

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Imagem deve ter no máximo 5MB");

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) {
      setUploading(false);
      return toast.error("Falha no upload");
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: pub.publicUrl }).eq("id", user.id);
    setUploading(false);
    toast.success("Foto atualizada");
    refetch();
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <header>
          <p className="text-sm text-muted-foreground font-heading uppercase tracking-wider">Sua conta</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient">Perfil</h1>
        </header>

        <div className="card-elevated p-6 flex items-center gap-6">
          <label className="relative cursor-pointer group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/40 bg-muted flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Camera className="w-6 h-6 text-primary" />}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={uploading} />
          </label>
          <div>
            <p className="font-heading font-bold text-lg">{profile?.full_name || "—"}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <p className="text-xs text-primary mt-1 font-heading uppercase tracking-wider">
              Faixa {profile?.belts?.name ?? "—"} · {profile?.degree ?? 0} grau{(profile?.degree ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="card-elevated p-6 space-y-4">
          <div>
            <Label htmlFor="full_name">Nome completo</Label>
            <Input id="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} maxLength={100} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(43) 99999-9999" maxLength={30} />
            </div>
            <div>
              <Label htmlFor="birth_date">Data de nascimento</Label>
              <Input id="birth_date" type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>E-mail</Label>
              <Input value={profile?.email ?? ""} disabled />
            </div>
            <div>
              <Label>Data de matrícula</Label>
              <Input value={profile?.enrollment_date ?? ""} disabled />
            </div>
          </div>
          <Button type="submit" variant="gold" disabled={saving || loading} className="w-full md:w-auto">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar alterações"}
          </Button>
        </form>

        <div className="card-elevated p-6 text-sm text-muted-foreground">
          <p className="font-heading uppercase tracking-wider text-foreground/80 mb-2">Histórico de treinos</p>
          <p>Disponível na próxima fase do sistema, junto com o ranking de frequência.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Perfil;