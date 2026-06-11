import { useEffect, useState } from "react";

const calc = (target: Date) => {
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs };
};

const Countdown = ({ target }: { target: string }) => {
  const date = new Date(target);
  const [t, setT] = useState(() => calc(date));
  useEffect(() => {
    const id = setInterval(() => setT(calc(date)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items: [string, number][] = [
    ["Dias", t.days],
    ["Horas", t.hours],
    ["Min", t.mins],
    ["Seg", t.secs],
  ];

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4">
      {items.map(([label, v]) => (
        <div key={label} className="bg-card border border-border rounded-lg p-3 md:p-4 text-center">
          <div className="text-2xl md:text-4xl font-heading font-bold text-primary tabular-nums">
            {String(v).padStart(2, "0")}
          </div>
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/60 mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;