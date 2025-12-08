import { Link } from "react-router-dom";
import { Award, Baby, Dumbbell, Shield, Brain, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import kidsClass from "@/assets/kids-class.jpg";
import functionalTraining from "@/assets/functional-training.jpg";
import heroBjj from "@/assets/hero-bjj.jpg";

const modalities = [
  {
    id: "bjj-adulto",
    icon: Award,
    title: "Jiu-Jitsu Adulto",
    subtitle: "Para maiores de 15 anos",
    description: "O Jiu-Jitsu Brasileiro é uma arte marcial focada em técnicas de solo, alavancas e finalizações. Na Elevate, oferecemos treinos para todos os níveis, do iniciante ao competidor.",
    benefits: [
      "Melhora do condicionamento físico",
      "Técnicas de autodefesa",
      "Desenvolvimento de foco e disciplina",
      "Redução do estresse",
      "Comunidade e networking",
    ],
    image: heroBjj,
    levels: ["Iniciante", "Intermediário", "Avançado", "Competição"],
  },
  {
    id: "bjj-kids",
    icon: Baby,
    title: "Jiu-Jitsu Kids & Juvenil",
    subtitle: "De 4 a 14 anos",
    description: "Programa especialmente desenvolvido para crianças e adolescentes, focando no desenvolvimento motor, disciplina e prevenção ao bullying através da confiança e respeito.",
    benefits: [
      "Desenvolvimento motor e coordenação",
      "Disciplina e respeito",
      "Prevenção ao bullying",
      "Socialização saudável",
      "Melhora no desempenho escolar",
    ],
    image: kidsClass,
    levels: ["4-6 anos", "7-10 anos", "11-14 anos"],
  },
  {
    id: "funcional",
    icon: Dumbbell,
    title: "Condicionamento Físico",
    subtitle: "Treino funcional para lutadores",
    description: "Programa de preparação física complementar ao Jiu-Jitsu, focando em força, resistência e explosão muscular. Ideal para melhorar o desempenho no tatame.",
    benefits: [
      "Aumento de força e resistência",
      "Melhora da explosão muscular",
      "Prevenção de lesões",
      "Recuperação mais rápida",
      "Melhor desempenho em competições",
    ],
    image: functionalTraining,
    levels: ["Todos os níveis"],
  },
];

const plans = [
  {
    name: "Mensal",
    price: "R$ 180",
    period: "/mês",
    description: "Flexibilidade total",
    features: [
      "Acesso a todas as modalidades",
      "Treinos ilimitados",
      "Acompanhamento dos professores",
      "Sem fidelidade",
    ],
    popular: false,
  },
  {
    name: "Trimestral",
    price: "R$ 150",
    period: "/mês",
    description: "Economia de 17%",
    features: [
      "Acesso a todas as modalidades",
      "Treinos ilimitados",
      "Acompanhamento dos professores",
      "Kimono básico incluso",
      "1 mês de pausa no ano",
    ],
    popular: true,
  },
  {
    name: "Semestral",
    price: "R$ 130",
    period: "/mês",
    description: "Economia de 28%",
    features: [
      "Acesso a todas as modalidades",
      "Treinos ilimitados",
      "Acompanhamento VIP",
      "Kimono premium incluso",
      "2 meses de pausa no ano",
      "Desconto em eventos",
    ],
    popular: false,
  },
];

const Modalidades = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              <span className="text-gradient">Modalidades</span> e Planos
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubra a modalidade ideal para você e sua família. 
              Oferecemos opções para todas as idades e níveis.
            </p>
          </div>
        </div>
      </section>

      {/* Modalities */}
      <section className="section-padding">
        <div className="container-custom">
          {modalities.map((modality, index) => (
            <div
              key={modality.id}
              id={modality.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index !== modalities.length - 1 ? "mb-20" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <modality.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-primary font-heading uppercase tracking-wider text-sm">
                    {modality.subtitle}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  {modality.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {modality.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-heading font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    Benefícios
                  </h4>
                  <ul className="space-y-2">
                    {modality.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {modality.levels.map((level) => (
                    <span
                      key={level}
                      className="px-4 py-2 bg-muted rounded-full text-sm font-heading"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              <div className={index % 2 === 1 ? "order-1" : ""}>
                <div className="card-elevated overflow-hidden">
                  <img
                    src={modality.image}
                    alt={modality.title}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Escolha Seu <span className="text-gradient">Plano</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Todas as modalidades incluídas em todos os planos. 
              Escolha o que melhor se adequa ao seu objetivo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card-elevated p-8 relative ${
                  plan.popular ? "border-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-gold-dark px-4 py-1 rounded-full text-sm font-heading text-primary-foreground">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-heading font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-heading font-bold text-gradient">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-primary text-sm mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "gold" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/contato">Matricule-se</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ainda em <span className="text-gradient">Dúvida</span>?
            </h2>
            <p className="text-muted-foreground mb-8">
              Agende uma aula experimental gratuita e conheça nossa estrutura 
              e metodologia de ensino.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contato">Aula Experimental Grátis</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Modalidades;
