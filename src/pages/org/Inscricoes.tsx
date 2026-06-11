import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Download } from "lucide-react";
import { toast } from "sonner";

const Inscricoes = () => {
  const { id } = useParams();
  const [rows, setRows] = useState<any[]>([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data: e } = await supabase.from("events").select("name").eq("id", id).maybeSingle();
    setEventName(e?.name ?? "");
    const { data } = await supabase
      .from("event_registrations")
      .select("id,status,payment_status,created_at,category:event_categories(name),profile:profiles(full_name,email,phone)")
      .eq("event_id", id)
      .order("created_at", { ascending: false });
    setRows((data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const setStatus = async (regId: string, status: string) => {
    const { error } = await supabase.from("event_registrations").update({ status }).eq("id", regId);
    if (error) { toast.error(error.message); return; }
    load();
  };

  const exportCsv = () => {
    const header = "Atleta,Email,Telefone,Categoria,Status,Pagamento,Data\n";
    const lines = rows.map((r) =>
      [r.profile?.full_name ?? "", r.profile?.email ?? "", r.profile?.phone ?? "", r.category?.name ?? "", r.status, r.payment_status, new Date(r.created_at).toLocaleString("pt-BR")]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([header + lines], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `inscricoes-${id}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/app/org"><ChevronLeft className="w-4 h-4 mr-1" /> Voltar</Link></Button>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Inscritos — {eventName}</h1>
        <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />CSV</Button>
      </div>
      {loading ? <p className="text-foreground/60">Carregando...</p> : rows.length === 0 ? (
        <p className="text-foreground/60">Nenhuma inscrição ainda.</p>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-foreground/60 text-xs uppercase tracking-widest">
                <th className="p-3">Atleta</th><th className="p-3">Categoria</th><th className="p-3">Status</th><th className="p-3">Pagto</th><th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="font-medium">{r.profile?.full_name}</div>
                    <div className="text-xs text-foreground/60">{r.profile?.email}</div>
                  </td>
                  <td className="p-3">{r.category?.name}</td>
                  <td className="p-3"><Badge variant={r.status === "confirmada" ? "default" : r.status === "cancelada" ? "outline" : "secondary"}>{r.status}</Badge></td>
                  <td className="p-3"><Badge variant="outline">{r.payment_status}</Badge></td>
                  <td className="p-3 text-right space-x-2">
                    {r.status !== "confirmada" && <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "confirmada")}>Confirmar</Button>}
                    {r.status !== "cancelada" && <Button size="sm" variant="ghost" onClick={() => setStatus(r.id, "cancelada")}>Cancelar</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
};

export default Inscricoes;