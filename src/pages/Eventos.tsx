import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { usePublishedEvents } from "@/hooks/useEvents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, Trophy } from "lucide-react";
import Countdown from "@/components/events/Countdown";

const BR_STATES = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

const Eventos = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const filters = useMemo(() => ({ search, city, state }), [search, city, state]);
  const { events, loading } = usePublishedEvents(filters);

  const featured = events[0];

  return (
    <Layout>
      <section className="bg-gradient-to-br from-background via-card to-background pt-32 pb-12 border-b border-border">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-7 h-7 text-primary" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold">Agenda do Jiu-Jitsu</h1>
          </div>
          <p className="text-foreground/70 max-w-2xl">
            Campeonatos, seminários e eventos de Jiu-Jitsu da região. Encontre, inscreva-se e acompanhe sua jornada esportiva.
          </p>

          {featured && (
            <div className="mt-10 grid md:grid-cols-[1fr_auto] gap-6 items-center bg-card/60 border border-primary/30 rounded-xl p-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-primary mb-2">Próximo destaque</div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2">{featured.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(featured.starts_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{featured.city}/{featured.state}</span>
                </div>
                <Button variant="gold" size="lg" asChild className="mt-4">
                  <Link to={`/eventos/${featured.slug}`}>Ver detalhes e inscrever</Link>
                </Button>
              </div>
              <Countdown target={featured.starts_at} />
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-[1fr_200px_120px] gap-3 mb-8">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <Input placeholder="Buscar campeonato..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)} />
            <select value={state} onChange={(e) => setState(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">UF</option>
              {BR_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20 text-foreground/60">Carregando eventos...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-foreground/60">Nenhum evento encontrado.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e) => (
                <Link key={e.id} to={`/eventos/${e.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary transition-all">
                  <div className="aspect-video bg-muted overflow-hidden">
                    {e.banner_url ? (
                      <img src={e.banner_url} alt={e.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-foreground/30"><Trophy className="w-12 h-12" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-xs uppercase tracking-widest text-primary mb-2">
                      {new Date(e.starts_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </div>
                    <h3 className="font-heading text-lg font-bold mb-2 line-clamp-2">{e.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-foreground/60">
                      <MapPin className="w-4 h-4" /> {e.city}/{e.state}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Eventos;