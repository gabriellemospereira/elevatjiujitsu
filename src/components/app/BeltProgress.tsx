import { motion } from "framer-motion";
import type { GraduationData } from "@/hooks/useGraduation";

const BeltSwatch = ({ color, label }: { color: string; label: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-16 h-6 rounded-sm border border-border shadow-inner"
      style={{ backgroundColor: color }}
    />
    <span className="text-xs font-heading uppercase tracking-wider text-foreground/80">{label}</span>
  </div>
);

const BeltProgress = ({ data }: { data: GraduationData }) => {
  const { currentBelt, nextBelt, totalClasses, classesRequired, classesRemaining, percent } = data;
  const isBlack = !nextBelt;

  return (
    <div className="card-elevated p-6 md:p-8 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <BeltSwatch color={currentBelt?.color_hex ?? "#fff"} label={currentBelt?.name ?? "—"} />
        {nextBelt ? (
          <>
            <div className="flex-1 text-center text-xs text-muted-foreground font-heading uppercase tracking-widest">
              Próxima
            </div>
            <BeltSwatch color={nextBelt.color_hex} label={nextBelt.name} />
          </>
        ) : (
          <div className="flex-1 text-center text-xs text-primary font-heading uppercase tracking-widest">
            Faixa máxima atingida
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm font-heading uppercase tracking-wider">
          <span className="text-foreground/80">Progresso</span>
          <span className="text-primary font-bold">{Math.round(percent)}%</span>
        </div>
        <div className="relative h-4 rounded-full bg-muted overflow-hidden border border-border">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: "var(--gradient-gold)" }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
      </div>

      {!isBlack && (
        <div className="grid grid-cols-3 gap-4 pt-2">
          <Stat label="Realizadas" value={totalClasses} accent />
          <Stat label="Meta" value={classesRequired ?? 0} />
          <Stat label="Faltam" value={classesRemaining ?? 0} />
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
  <div className="text-center">
    <div className={`text-3xl font-heading font-bold ${accent ? "text-gradient" : "text-foreground"}`}>{value}</div>
    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
  </div>
);

export default BeltProgress;