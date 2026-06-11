import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/components/app/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Row = {
  id: string;
  full_name: string;
  email: string | null;
  roles: string[];
};

const ROLE_OPTIONS: ("admin" | "professor" | "aluno" | "organizador")[] = ["admin", "professor", "organizador", "aluno"];

const AdminPapeis = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email").order("full_name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const map = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const list = map.get(r.user_id) ?? [];
      list.push(r.role);
      map.set(r.user_id, list);
    });
    setRows((profs ?? []).map((p) => ({ ...p, roles: map.get(p.id) ?? [] })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRole = async (userId: string, role: "admin" | "professor" | "aluno" | "organizador", has: boolean) => {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    }
    load();
  };

  const filtered = rows.filter((r) =>
    r.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    r.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/app/admin" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <h1 className="text-2xl font-heading font-bold text-gradient flex items-center gap-2">
          <Shield className="w-6 h-6" /> Papéis
        </h1>
        <Input className="max-w-md" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        ) : (
          <div className="card-elevated divide-y divide-border">
            {filtered.map((u) => (
              <div key={u.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold">{u.full_name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ROLE_OPTIONS.map((role) => {
                    const has = u.roles.includes(role);
                    return (
                      <Button
                        key={role}
                        size="sm"
                        variant={has ? "gold" : "outline"}
                        onClick={() => toggleRole(u.id, role, has)}
                      >
                        {role}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AdminPapeis;