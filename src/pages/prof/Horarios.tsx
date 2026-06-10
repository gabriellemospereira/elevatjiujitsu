import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/app/AppLayout";
import SchedulesManager from "@/components/app/SchedulesManager";

const ProfHorarios = () => (
  <AppLayout>
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/app/prof" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>
      <h1 className="text-2xl font-heading font-bold text-gradient">Meus Horários</h1>
      <SchedulesManager filterByCurrentUser />
    </div>
  </AppLayout>
);

export default ProfHorarios;