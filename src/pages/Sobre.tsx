import { Link } from "react-router-dom";
import { Target, Heart, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import professorSamura from "@/assets/professor-samura (1).jpeg";
import professorRenan from "@/assets/professor-renan (1).jpeg";

const values = [
  {
    icon: Target,
    title: "Excelência Técnica",
    description: "Foco em fundamentos sólidos e técnicas eficientes para todos os níveis.",
  },
  {
    icon: Heart,
    title: "Família",
    description: "Um ambiente acolhedor onde todos são bem-vindos e respeitados.",
  },
  {
    icon: Users,
    title: "Comunidade",
    description: "Construímos laços que vão além do tatame.",
  },
  {
    icon: Trophy,
    title: "Resultados",
    description: "Desenvolvimento pessoal e conquistas em competições.",
  },
];

const Sobre = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Sobre a <span className="text-gradient">Elevate</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Mais do que uma academia, somos uma família unida pelo Jiu-Jitsu. 
              Conheça nossa história e nossos valores.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                Nossa <span className="text-gradient">Missão</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Na Elevate Jiu-Jitsu, acreditamos que o Jiu-Jitsu Brasileiro vai muito 
                além da luta. É uma ferramenta poderosa de transformação pessoal que 
                desenvolve disciplina, confiança e qualidade de vida.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nossa missão é proporcionar um ambiente de excelência técnica e humana, 
                onde cada aluno possa evoluir no seu próprio ritmo, seja ele um iniciante 
                buscando saúde e autodefesa, ou um competidor almejando o pódio.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Em Londrina, construímos uma comunidade forte baseada no respeito mútuo, 
                na dedicação ao treinamento e no apoio entre todos os membros da nossa família.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="card-elevated p-6 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <value.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-heading font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professors */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Nossos <span className="text-gradient">Professores</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Profissionais dedicados com vasta experiência e paixão pelo ensino.
            </p>
          </div>

          {/* Samura */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-gradient mb-4">
                Professor Samura Vieira
              </h3>
              <p className="text-primary font-heading uppercase tracking-wider mb-4">
                Faixa Preta • Head Coach
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Samura Vieira é o fundador e head coach da Elevate Jiu-Jitsu. Com mais de 
                15 anos dedicados ao Jiu-Jitsu Brasileiro, formou dezenas de faixas pretas 
                e conquistou inúmeros títulos em competições regionais e nacionais.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sua filosofia de ensino combina técnica rigorosa com um ambiente acolhedor, 
                garantindo que cada aluno receba atenção individualizada para desenvolver 
                seu máximo potencial.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-heading">
                  Técnicas de Solo
                </span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-heading">
                  Competição
                </span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-heading">
                  BJJ Adulto
                </span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="card-elevated overflow-hidden">
                <img
                  src={professorSamura}
                  alt="Professor Samura Vieira"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>

          {/* Renan */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="card-elevated overflow-hidden">
                <img
                  src={professorRenan}
                  alt="Professor Renan"
                  className="w-full aspect-square object-cover"
                />
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-gradient mb-4">
                Professor Renan
              </h3>
              <p className="text-primary font-heading uppercase tracking-wider mb-4">
                Faixa Marron • Coach Assistente
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Renan é responsável pelo desenvolvimento de iniciantes e pela coordenação 
                das turmas infantis. Sua metodologia didática e acolhedora é reconhecida 
                por transformar alunos que nunca tiveram contato com lutas em praticantes 
                apaixonados pelo Jiu-Jitsu.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Com especialização em pedagogia esportiva, Renan cria um ambiente seguro 
                e motivador para crianças e adultos iniciantes, focando não apenas nas 
                técnicas, mas também no desenvolvimento de valores como respeito e disciplina.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-heading">
                  BJJ Kids
                </span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-heading">
                  Iniciantes
                </span>
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-heading">
                  Pedagogia Esportiva
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Faça Parte da Nossa <span className="text-gradient">Família</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Venha conhecer nossa estrutura e treinar com professores de alto nível.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contato">Agende Sua Aula Gratuita</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sobre;
