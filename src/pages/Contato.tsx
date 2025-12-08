import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Send, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

const Contato = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado!",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Entre em <span className="text-gradient">Contato</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Agende sua aula experimental gratuita ou tire suas dúvidas.
              Estamos prontos para recebê-lo!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="card-elevated p-8">
              <h2 className="text-2xl font-heading font-bold mb-6">
                Envie sua <span className="text-gradient">Mensagem</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-heading mb-2"
                  >
                    Nome Completo
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-heading mb-2"
                  >
                    E-mail
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-heading mb-2"
                  >
                    Telefone (WhatsApp)
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(43) 99999-9999"
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-heading mb-2"
                  >
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    className="bg-muted border-border resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Mensagem
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="card-elevated p-6">
                  <Phone className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading font-bold mb-2">Telefone</h3>
                  <a
                    href="tel:+5543999999999"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    (43) 99999-9999
                  </a>
                </div>
                <div className="card-elevated p-6">
                  <Mail className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading font-bold mb-2">E-mail</h3>
                  <a
                    href="mailto:contato@elevatejiujitsu.com.br"
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    contato@elevatejiujitsu.com.br
                  </a>
                </div>
                <div className="card-elevated p-6">
                  <MapPin className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading font-bold mb-2">Endereço</h3>
                  <p className="text-muted-foreground text-sm">
                    Rua Alagoas, 971
                    <br />
                    Centro - Londrina, PR
                  </p>
                </div>
                <div className="card-elevated p-6">
                  <Clock className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-heading font-bold mb-2">Horário</h3>
                  <p className="text-muted-foreground text-sm">
                    Seg-Sex: 07h - 22h
                    <br />
                    Sábado: 09h - 12h
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="card-elevated p-6">
                <h3 className="font-heading font-bold mb-4">Redes Sociais</h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/elevatejiujitsu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-7 h-7" />
                  </a>
                  <a
                    href="https://facebook.com/elevatejiujitsu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-7 h-7" />
                  </a>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="card-elevated p-6 bg-[#25D366]/10 border-[#25D366]/30">
                <h3 className="font-heading font-bold mb-2 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-foreground" />
                  </span>
                  Atendimento Rápido
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Prefere falar diretamente conosco? Mande uma mensagem no WhatsApp!
                </p>
                <Button variant="gold" className="w-full" asChild>
                  <a
                    href="https://maps.app.goo.gl/gVjCZ4X2KBN4Vc1F6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chamar no WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="section-padding bg-card">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Nossa <span className="text-gradient">Localização</span>
            </h2>
            <p className="text-muted-foreground">
              Estamos localizados na rua Alagoas, 971 centro de Londrina,  próximo ao posto de gasolina na professorJoão Candido.
            </p>
          </div>
          <div className="card-elevated overflow-hidden h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58532.67139067842!2d-51.20000000000001!3d-23.31000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94eb53f4b26cd4c7%3A0xdcb1b1c62c22e9e!2sLondrina%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v1702000000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Elevate Jiu-Jitsu"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
