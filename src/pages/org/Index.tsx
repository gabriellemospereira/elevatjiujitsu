import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/app/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trophy, Users, Calendar, MapPin, Pencil } from "lucide-react";

const OrgIndex = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("events").select("*").eq("organizer_id", user.id).order("starts_at", { ascending: false })
      .then(({ data }) => { setEvents(data ?? []); setLoading(false); });
  }, [user]);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2"><Trophy className="w-7 h-7 text-primary" /> Painel do Organizador</h1>
          <p className="text-foreground/60 mt-1">Gerencie seus eventos e inscrições.</p>
        </div>
        <Button asChild variant="gold"><Link to="/app/org/evento/novo"><Plus className="w-4 h-4 mr-2" /> Novo Evento</Link></Button>
      </div>

      {loading ? <p className="text-foreground/60">Carregando...</p> : events.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-10 text-center">
          <Trophy className="w-12 h-12 mx-auto text-foreground/30 mb-3" />
          <p className="text-foreground/60 mb-4">Você ainda não criou nenhum evento.</p>
          <Button asChild variant="gold"><Link to="/app/org/evento/novo">Criar primeiro evento</Link></Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((e) => (
            <div key={e.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-heading text-lg font-bold">{e.name}</h2>
                <Badge variant={e.status === "publicado" ? "default" : "secondary"}>{e.status}</Badge>
              </div>
              <div className="text-sm text-foreground/60 space-y-1 mb-4">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(e.starts_at).toLocaleDateString("pt-BR")}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{e.city}/{e.state}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild><Link to={`/app/org/evento/${e.id}`}><Pencil className="w-4 h-4 mr-1" />Editar</Link></Button>
                <Button size="sm" variant="outline" asChild><Link to={`/app/org/evento/${e.id}/inscricoes`}><Users className="w-4 h-4 mr-1" />Inscritos</Link></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default OrgIndex;