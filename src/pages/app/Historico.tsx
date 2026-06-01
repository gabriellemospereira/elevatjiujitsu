import AppLayout from "@/components/app/AppLayout";
import { History } from "lucide-react";

const Historico = () => (
  <AppLayout>
    <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
      <History className="w-12 h-12 mx-auto text-primary" />
      <h1 className="text-3xl font-heading font-bold text-gradient">Histórico de Treinos</h1>
      <p className="text-muted-foreground">
        Em breve: lista completa de aulas com filtros por mês, professor e modalidade.
        Será liberado na Fase 2 (Admin + Chamada), assim que os professores começarem a registrar presença.
      </p>
    </div>
  </AppLayout>
);

export default Historico;