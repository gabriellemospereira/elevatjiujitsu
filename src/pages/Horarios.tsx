import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const schedule = {
  "Segunda-feira": [
    { time: "07:00 - 08:30", class: "BJJ Adulto", level: "Todos" },
    { time: "12:00 - 13:30", class: "BJJ Adulto", level: "Todos" },
    { time: "18:00 - 19:00", class: "BJJ Kids", level: "4-10 anos" },
    { time: "19:00 - 20:00", class: "BJJ Juvenil", level: "11-14 anos" },
    { time: "20:00 - 21:30", class: "BJJ Adulto", level: "Avançado" },
  ],
  "Terça-feira": [
    { time: "07:00 - 08:00", class: "Funcional", level: "Todos" },
    { time: "12:00 - 13:30", class: "BJJ Adulto", level: "Todos" },
    { time: "18:30 - 19:30", class: "BJJ Kids", level: "4-10 anos" },
    { time: "20:00 - 21:30", class: "BJJ Adulto", level: "Iniciantes" },
  ],
  "Quarta-feira": [
    { time: "07:00 - 08:30", class: "BJJ Adulto", level: "Todos" },
    { time: "12:00 - 13:30", class: "BJJ Adulto", level: "Todos" },
    { time: "18:00 - 19:00", class: "BJJ Kids", level: "4-10 anos" },
    { time: "19:00 - 20:00", class: "BJJ Juvenil", level: "11-14 anos" },
    { time: "20:00 - 21:30", class: "BJJ Adulto", level: "Avançado" },
  ],
  "Quinta-feira": [
    { time: "07:00 - 08:00", class: "Funcional", level: "Todos" },
    { time: "12:00 - 13:30", class: "BJJ Adulto", level: "Todos" },
    { time: "18:30 - 19:30", class: "BJJ Kids", level: "4-10 anos" },
    { time: "20:00 - 21:30", class: "BJJ Adulto", level: "Iniciantes" },
  ],
  "Sexta-feira": [
    { time: "07:00 - 08:30", class: "BJJ Adulto", level: "Todos" },
    { time: "12:00 - 13:30", class: "BJJ Adulto", level: "Todos" },
    { time: "18:00 - 19:00", class: "BJJ Kids", level: "4-10 anos" },
    { time: "19:00 - 21:00", class: "Open Mat", level: "Faixas Coloridas" },
  ],
  "Sábado": [
    { time: "09:00 - 11:00", class: "BJJ Adulto", level: "Treino Livre" },
    { time: "11:00 - 12:00", class: "BJJ Kids", level: "Todos" },
  ],
};

const classTypes = [
  { name: "BJJ Adulto", color: "bg-primary", description: "Jiu-Jitsu para maiores de 15 anos" },
  { name: "BJJ Kids", color: "bg-secondary", description: "Crianças de 4 a 10 anos" },
  { name: "BJJ Juvenil", color: "bg-accent", description: "Adolescentes de 11 a 14 anos" },
  { name: "Funcional", color: "bg-muted-foreground", description: "Condicionamento físico" },
  { name: "Open Mat", color: "bg-primary/50", description: "Treino livre para faixas coloridas" },
];

const Horarios = () => {
  const getClassColor = (className: string) => {
    const type = classTypes.find((t) => t.name === className);
    return type?.color || "bg-muted";
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              <span className="text-gradient">Horários</span> de Treino
            </h1>
            <p className="text-lg text-muted-foreground">
              Confira nossa grade semanal e encontre o melhor horário para você.
            </p>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section className="py-8 bg-card border-y border-border">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-6">
            {classTypes.map((type) => (
              <div key={type.name} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${type.color}`} />
                <span className="text-sm text-muted-foreground">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Table */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {Object.keys(schedule).map((day) => (
                    <th
                      key={day}
                      className="bg-card border border-border p-4 text-left font-heading font-bold text-primary"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {day}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Object.entries(schedule).map(([day, classes]) => (
                    <td
                      key={day}
                      className="border border-border p-2 align-top"
                    >
                      <div className="space-y-2">
                        {classes.map((cls, index) => (
                          <div
                            key={index}
                            className={`${getClassColor(cls.class)} p-3 rounded-lg`}
                          >
                            <div className="flex items-center gap-1 text-xs font-heading text-foreground/90 mb-1">
                              <Clock className="w-3 h-3" />
                              {cls.time}
                            </div>
                            <div className="font-heading font-bold text-sm text-foreground">
                              {cls.class}
                            </div>
                            <div className="text-xs text-foreground/70">
                              {cls.level}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6">
            {Object.entries(schedule).map(([day, classes]) => (
              <div key={day} className="card-elevated overflow-hidden">
                <div className="bg-primary/10 p-4 border-b border-border">
                  <h3 className="font-heading font-bold text-primary flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {day}
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {classes.map((cls, index) => (
                    <div
                      key={index}
                      className={`${getClassColor(cls.class)} p-4 rounded-lg`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-heading font-bold text-foreground">
                          {cls.class}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-foreground/80">
                          <Clock className="w-4 h-4" />
                          {cls.time}
                        </span>
                      </div>
                      <span className="text-sm text-foreground/70">
                        {cls.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="card-elevated p-6">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold mb-2">Horários Flexíveis</h3>
              <p className="text-muted-foreground text-sm">
                Treinos de manhã, tarde e noite para se adequar à sua rotina.
              </p>
            </div>
            <div className="card-elevated p-6">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold mb-2">6 Dias por Semana</h3>
              <p className="text-muted-foreground text-sm">
                Segunda a Sábado com opções para todas as idades.
              </p>
            </div>
            <div className="card-elevated p-6">
              <div className="w-12 h-12 text-primary mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-heading font-bold">∞</span>
              </div>
              <h3 className="font-heading font-bold mb-2">Treinos Ilimitados</h3>
              <p className="text-muted-foreground text-sm">
                Treine quantas vezes quiser em qualquer modalidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Encontrou Seu <span className="text-gradient">Horário</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Entre em contato e agende sua aula experimental gratuita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contato">Agendar Aula Gratuita</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="https://wa.me/5543999999999" target="_blank" rel="noopener noreferrer">
                  WhatsApp Direto
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Horarios;
