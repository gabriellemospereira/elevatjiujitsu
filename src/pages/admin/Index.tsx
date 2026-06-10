import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, GraduationCap, Calendar, TrendingUp, Shield, Settings as SettingsIcon } from "lucide-react";
import { startOfMonth, endOfMonth } from "date-fns";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";

const AdminHome = () => {
  const [stats, setStats] = useState({ alunos: 0, aulasMes: 0, presencasMes: 0, proxGrad: 0 });

  useEffect(() => {
    (async () => {
      const s = startOfMonth(new Date()).toISOString();
      const e = endOfMonth(new Date()).toISOString();
      const [{ count: alunos }, { count: aulasMes }, { count: presencasMes }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("class_sessions").select("*", { count: "exact", head: true }).gte("starts_at", s).lte("starts_at", e),
        supabase.from("attendance").select("*", { count: "exact", head: true }).gte("attended_at", s).lte("attended_at", e),
      ]);

      // Alunos próximos da graduação: >80% das aulas requeridas pela faixa atual
      const { data: profs } = await supabase.from("profiles").select("id, belt_id, belts(classes_to_next_belt)");
      let near = 0;
      for (const p of profs ?? []) {
        const req = (p as any).belts?.classes_to_next_belt;
        if (!req) continue;
        const { count } = await supabase.from("attendance").select("*", { count: "exact", head: true }).eq("profile_id", p.id);
        if ((count ?? 0) >= req * 0.8) near++;
      }
      setStats({ alunos: alunos ?? 0, aulasMes: aulasMes ?? 0, presencasMes: presencasMes ?? 0, proxGrad: near });
    })();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gradient">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground">Visão geral da academia.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={Users} label="Alunos cadastrados" value={stats.alunos} />
          <Stat icon={Calendar} label="Aulas no mês" value={stats.aulasMes} />
          <Stat icon={TrendingUp} label="Presenças no mês" value={stats.presencasMes} />
          <Stat icon={GraduationCap} label="Próximos da graduação" value={stats.proxGrad} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminLink to="/app/admin/alunos" icon={Users} title="Alunos" desc="Gerenciar perfis, faixas e papéis" />
          <AdminLink to="/app/admin/turmas" icon={Calendar} title="Turmas & Horários" desc="Grade semanal e geração de sessões" />
          <AdminLink to="/app/admin/graduacoes" icon={GraduationCap} title="Graduações" desc="Requisitos das faixas e histórico" />
          <AdminLink to="/app/admin/papeis" icon={Shield} title="Papéis" desc="Promover professor/admin" />
        </div>
      </div>
    </AppLayout>
  );
};

const Stat = ({ icon: Icon, label, value }: any) => (
  <div className="card-elevated p-4">
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-heading font-bold mt-1">{value}</div>
  </div>
);

const AdminLink = ({ to, icon: Icon, title, desc }: any) => (
  <Link to={to} className="card-elevated p-5 hover:border-primary/50 flex items-start gap-3">
    <div className="p-2 rounded-md bg-primary/10 text-primary"><Icon className="w-5 h-5" /></div>
    <div>
      <div className="font-heading font-bold uppercase tracking-wider">{title}</div>
      <div className="text-xs text-muted-foreground">{desc}</div>
    </div>
  </Link>
);

export default AdminHome;