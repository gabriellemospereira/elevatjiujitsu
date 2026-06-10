import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Belt = { id: string; name: string; rank_order: number; color_hex: string; classes_to_next_belt: number | null };

const AdminGraduacoes = () => {
  const [belts, setBelts] = useState<Belt[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("belts").select("*").order("rank_order");
    setBelts((data ?? []) as any);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, value: number | null) => {
    const { error } = await supabase.from("belts").update({ classes_to_next_belt: value }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Requisito atualizado.");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link to="/app/admin" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gradient">Critérios de Graduação</h1>
        <p className="text-xs text-muted-foreground">
          Quantidade de aulas necessárias para passar para a próxima faixa.
        </p>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        ) : (
          <div className="card-elevated divide-y divide-border">
            {belts.map((b) => (
              <div key={b.id} className="p-4 flex items-center gap-4">
                <span className="w-8 h-8 rounded-md border border-border" style={{ background: b.color_hex }} />
                <div className="flex-1 font-heading font-bold uppercase">{b.name}</div>
                <Input
                  type="number"
                  defaultValue={b.classes_to_next_belt ?? ""}
                  className="w-28"
                  onBlur={(e) => {
                    const v = e.target.value === "" ? null : Number(e.target.value);
                    if (v !== b.classes_to_next_belt) update(b.id, v);
                  }}
                />
                <span className="text-xs text-muted-foreground">aulas</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminGraduacoes;