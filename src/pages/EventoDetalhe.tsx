import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useEventBySlug } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Trophy, FileText, Award, Users, ExternalLink } from "lucide-react";
import Countdown from "@/components/events/Countdown";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EventoDetalhe = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { event, categories, media, loading } = useEventBySlug(slug);
  const [myRegs, setMyRegs] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !event) return;
    supabase
      .from("event_registrations")
      .select("category_id")
      .eq("event_id", event.id)
      .eq("profile_id", user.id)
      .then(({ data }) => setMyRegs(new Set((data ?? []).map((r) => r.category_id))));
  }, [user, event]);

  const handleRegister = async (categoryId: string) => {
    if (!user) { navigate("/auth"); return; }
    if (!event) return;
    setSubmitting(categoryId);
    const { error } = await supabase.from("event_registrations").insert({
      event_id: event.id,
      category_id: categoryId,
      profile_id: user.id,
    });
    setSubmitting(null);
    if (error) { toast.error(error.message); return; }
    toast.success("Inscrição realizada! Aguarde confirmação do organizador.");
    setMyRegs(new Set([...myRegs, categoryId]));
  };

  if (loading) return <Layout><div className="container-custom pt-32 pb-20 text-foreground/60">Carregando...</div></Layout>;
  if (!event) return <Layout><div className="container-custom pt-32 pb-20 text-center"><h1 className="text-2xl font-heading mb-4">Evento não encontrado</h1><Button asChild><Link to="/eventos">Voltar</Link></Button></div></Layout>;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.address ?? ""} ${event.city} ${event.state}`)}`;

  return (
    <Layout>
      <section className="relative pt-32 pb-12 border-b border-border">
        {event.banner_url && (
          <div className="absolute inset-0 -z-10 opacity-20">
            <img src={event.banner_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>
        )}
        <div className="container-custom">
          <Badge variant="secondary" className="mb-3">{new Date(event.starts_at).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</Badge>
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">{event.name}</h1>
          <div className="flex flex-wrap gap-4 text-foreground/70 mb-6">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.address ? `${event.address}, ` : ""}{event.city}/{event.state}</span>
            {event.organizer_name && <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.organizer_name}</span>}
            {event.base_price != null && Number(event.base_price) > 0 && (
              <span className="flex items-center gap-1"><Trophy className="w-4 h-4" /> A partir de R$ {Number(event.base_price).toFixed(2)}</span>
            )}
          </div>
          <div className="max-w-md"><Countdown target={event.starts_at} /></div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom grid lg:grid-cols-[1fr_320px] gap-10">
          <div className="space-y-10">
            {event.description && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-3">Sobre o evento</h2>
                <p className="text-foreground/80 whitespace-pre-line leading-relaxed">{event.description}</p>
              </div>
            )}

            {event.schedule && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-3 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Cronograma</h2>
                <pre className="bg-card border border-border rounded-lg p-4 text-sm whitespace-pre-wrap font-body">{event.schedule}</pre>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Categorias e Inscrição</h2>
              {categories.length === 0 ? (
                <p className="text-foreground/60">Nenhuma categoria publicada.</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((c) => {
                    const isRegistered = myRegs.has(c.id);
                    return (
                      <div key={c.id} className="bg-card border border-border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="font-heading font-bold">{c.name}</div>
                          <div className="text-xs text-foreground/60 mt-1 flex flex-wrap gap-2">
                            {c.belt && <span>Faixa: {c.belt}</span>}
                            {c.gender && <span>· {c.gender}</span>}
                            {(c.age_min || c.age_max) && <span>· {c.age_min ?? "—"}–{c.age_max ?? "—"} anos</span>}
                            {(c.weight_min || c.weight_max) && <span>· {c.weight_min ?? "—"}–{c.weight_max ?? "—"} kg</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {c.price != null && Number(c.price) > 0 && <span className="text-primary font-bold">R$ {Number(c.price).toFixed(2)}</span>}
                          {isRegistered ? (
                            <Badge variant="default">Inscrito</Badge>
                          ) : (
                            <Button size="sm" onClick={() => handleRegister(c.id)} disabled={submitting === c.id}>
                              {submitting === c.id ? "..." : "Inscrever-se"}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {media.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Galeria</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {media.map((m) => (
                    <img key={m.id} src={m.url} alt={m.caption ?? ""} className="rounded-lg aspect-square object-cover" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-heading font-bold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Local</h3>
              <p className="text-sm text-foreground/80">{event.address}<br />{event.city}/{event.state}</p>
              <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                <a href={mapsUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-2" /> Abrir no Google Maps</a>
              </Button>
            </div>
            {event.awards && (
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-heading font-bold mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Premiação</h3>
                <p className="text-sm text-foreground/80 whitespace-pre-line">{event.awards}</p>
              </div>
            )}
            {event.regulation_url && (
              <div className="bg-card border border-border rounded-lg p-5">
                <h3 className="font-heading font-bold mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Regulamento</h3>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={event.regulation_url} target="_blank" rel="noreferrer">Baixar regulamento</a>
                </Button>
              </div>
            )}
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default EventoDetalhe;