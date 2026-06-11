import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, XCircle } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string;
  status: string;
  payment_status: string;
  category: { name: string } | null;
  event: { id: string; slug: string; name: string; starts_at: string; city: string; state: string; banner_url: string | null } | null;
};

const MeusEventos = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("event_registrations")
      .select("id,status,payment_status,category:event_categories(name),event:events(id,slug,name,starts_at,city,state,banner_url)")
      .eq("profile_id", user.id)
      .order("created_at", { ascending: false });
    setRows((data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const cancel = async (id: string) => {
    const { error } = await supabase.from("event_registrations").update({ status: "cancelada" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Inscrição cancelada");
    load();
  };

  const upcoming = rows.filter((r) => r.event && new Date(r.event.starts_at) >= new Date() && r.status !== "cancelada");
  const history = rows.filter((r) => !upcoming.includes(r));

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2"><Trophy className="w-7 h-7 text-primary" /> Meus Eventos</h1>
        <p className="text-foreground/60 mt-1">Suas inscrições em campeonatos e seminários.</p>
      </div>

      {loading ? <p className="text-foreground/60">Carregando...</p> : (
        <>
          <section className="mb-10">
            <h2 className="font-heading uppercase text-sm tracking-widest text-foreground/60 mb-3">Próximos</h2>
            {upcoming.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-foreground/60 mb-3">Você ainda não tem inscrições futuras.</p>
                <Button asChild><Link to="/eventos">Explorar eventos</Link></Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((r) => (
                  <div key={r.id} className="bg-card border border-border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link to={`/eventos/${r.event!.slug}`} className="font-heading font-bold hover:text-primary">{r.event!.name}</Link>
                      <div className="text-xs text-foreground/60 mt-1 flex flex-wrap gap-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(r.event!.starts_at).toLocaleDateString("pt-BR")}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.event!.city}/{r.event!.state}</span>
                        <span>Categoria: {r.category?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.status === "confirmada" ? "default" : "secondary"}>{r.status}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => cancel(r.id)}><XCircle className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {history.length > 0 && (
            <section>
              <h2 className="font-heading uppercase text-sm tracking-widest text-foreground/60 mb-3">Histórico</h2>
              <div className="space-y-3">
                {history.map((r) => (
                  <div key={r.id} className="bg-card/50 border border-border rounded-lg p-4 flex justify-between items-center text-sm opacity-80">
                    <div>
                      <div className="font-heading">{r.event?.name}</div>
                      <div className="text-xs text-foreground/60">{r.event && new Date(r.event.starts_at).toLocaleDateString("pt-BR")} · {r.category?.name}</div>
                    </div>
                    <Badge variant="outline">{r.status}</Badge>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default MeusEventos;