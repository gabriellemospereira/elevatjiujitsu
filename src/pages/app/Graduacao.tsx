import AppLayout from "@/components/app/AppLayout";
import BeltProgress from "@/components/app/BeltProgress";
import { useGraduation } from "@/hooks/useGraduation";
import { Skeleton } from "@/components/ui/skeleton";

const Graduacao = () => {
  const { data, loading } = useGraduation();

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <p className="text-sm text-muted-foreground font-heading uppercase tracking-wider">Sua jornada</p>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gradient">Graduação</h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe sua evolução até a próxima faixa. Cada presença registrada conta.
          </p>
        </header>

        {loading || !data ? <Skeleton className="h-80 w-full" /> : <BeltProgress data={data} />}

        <div className="card-elevated p-6">
          <h2 className="font-heading font-bold uppercase tracking-wider mb-4">Requisitos por faixa</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Branca → Azul</span><span className="text-primary font-bold">60 aulas</span></li>
            <li className="flex justify-between"><span>Azul → Roxa</span><span className="text-primary font-bold">120 aulas</span></li>
            <li className="flex justify-between"><span>Roxa → Marrom</span><span className="text-primary font-bold">180 aulas</span></li>
            <li className="flex justify-between"><span>Marrom → Preta</span><span className="text-primary font-bold">250 aulas</span></li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
};

export default Graduacao;