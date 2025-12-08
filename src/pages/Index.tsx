import { Link } from "react-router-dom";
import { Users, Award, Baby, Dumbbell, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import heroBjj from "@/assets/hero-bjj.jpg";
import professorSamura from "@/assets/professor-samura (1).jpeg";
import professorRenan from "@/assets/professor-renan (1).jpeg";

const testimonials = [
  {
    name: "Carlos Silva",
    text: "A Elevate mudou minha vida. Perdi 20kg e ganhei confiança. Os professores são excepcionais!",
    role: "Aluno há 2 anos",
    rating: 5,
  },
  {
    name: "Fernanda Costa",
    text: "Meu filho começou com 6 anos e a evolução na disciplina e foco foi incrível. Ambiente familiar e seguro.",
    role: "Mãe de aluno",
    rating: 5,
  },
  {
    name: "Roberto Mendes",
    text: "Técnica de altíssimo nível com Samura e Renan. Melhor academia de Londrina, sem dúvida.",
    role: "Faixa Roxa",
    rating: 5,
  },
];

const features = [
  {
    icon: Award,
    title: "Jiu-Jitsu Adulto",
    description: "Do iniciante ao competidor de alto nível",
  },
  {
    icon: Baby,
    title: "Jiu-Jitsu Kids",
    description: "Disciplina e desenvolvimento infantil",
  },
  {
    icon: Dumbbell,
    title: "Condicionamento",
    description: "Preparação física complementar",
  },
];

const schedulePreview = [
  { time: "07:00", class: "BJJ Adulto" },
  { time: "12:00", class: "BJJ Adulto" },
  { time: "18:30", class: "BJJ Kids" },
  { time: "20:30", class: "BJJ Adulto" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBjj}
            alt="Treino de Jiu-Jitsu na Elevate"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-custom text-center px-4 pt-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 animate-fade-up">
              <span className="text-gradient">Transforme-se</span>
              <br />
              <span className="text-foreground">com o Jiu-Jitsu em Londrina</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-up delay-100">
              Técnica, Disciplina e Família. Treine com os Professores Samura e Renan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-200">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contato">
                  Agende Sua Aula Gratuita
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/modalidades">Conheça as Modalidades</Link>
              </Button>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              <span className="text-gradient">Modalidades</span> para Todos os Níveis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Do iniciante ao competidor, temos a modalidade ideal para você e sua família.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-elevated p-8 text-center group hover:border-primary/50 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="gold" size="lg" asChild>
              <Link to="/modalidades">Ver Todas as Modalidades</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Professors Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Conheça Nossos <span className="text-gradient">Professores</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mais de 20 anos de experiência combinada em Jiu-Jitsu brasileiro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Samura */}
            <div className="card-elevated overflow-hidden group">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={professorSamura}
                  alt="Professor Samura Vieira"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-heading font-bold text-gradient mb-2">
                  Prof. Samura Vieira
                </h3>
                <p className="text-primary font-heading text-sm uppercase tracking-wider mb-3">
                  Faixa Preta • Head Coach
                </p>
                <p className="text-muted-foreground text-sm">
                  Especialista em técnicas de solo e competição. Formou dezenas de
                  faixas pretas ao longo de sua carreira.
                </p>
              </div>
            </div>

            {/* Renan */}
            <div className="card-elevated overflow-hidden group">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={professorRenan}
                  alt="Professor Renan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-heading font-bold text-gradient mb-2">
                  Prof. Renan
                </h3>
                <p className="text-primary font-heading text-sm uppercase tracking-wider mb-3">
                  Faixa Preta • Coach Assistente
                </p>
                <p className="text-muted-foreground text-sm">
                  Foco em desenvolvimento de iniciantes e turmas infantis. Metodologia
                  didática e acolhedora.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/sobre">Saiba Mais Sobre Nós</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              O Que Nossos <span className="text-gradient">Alunos</span> Dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="card-elevated p-6 relative animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-heading font-bold">{testimonial.name}</p>
                  <p className="text-primary text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card-elevated p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  <span className="text-gradient">Horários</span> de Treino
                </h2>
                <p className="text-muted-foreground mb-6">
                  Oferecemos horários flexíveis para se adequar à sua rotina. 
                  Treinos de manhã, tarde e noite.
                </p>
                <Button variant="gold" asChild>
                  <Link to="/horarios">Ver Grade Completa</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {schedulePreview.map((item) => (
                  <div
                    key={item.time}
                    className="bg-muted p-4 rounded-lg text-center"
                  >
                    <p className="text-2xl font-heading font-bold text-primary">
                      {item.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.class}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
              Pronto para <span className="text-gradient">Começar</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Agende agora sua aula experimental gratuita e descubra o poder
              transformador do Jiu-Jitsu.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contato">
                Agende Sua Aula Gratuita
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
