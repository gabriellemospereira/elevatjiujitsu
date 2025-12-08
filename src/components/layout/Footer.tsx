import { Link } from "react-router-dom";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-heading font-bold text-gradient">
                ELEVATE
              </span>
              <span className="block text-sm font-heading text-foreground/80 uppercase tracking-widest">
                Jiu-Jitsu
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Transformando vidas através do Jiu-Jitsu em Londrina. Técnica,
              disciplina e família.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg uppercase tracking-wider text-primary mb-6">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/sobre", label: "Sobre Nós" },
                { href: "/modalidades", label: "Modalidades" },
                { href: "/horarios", label: "Horários" },
                { href: "/contato", label: "Contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg uppercase tracking-wider text-primary mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Rua Alagoas, 971 - Centro, Londrina - PR</span>
              </li>
              <li>
                <a
                  href="tel:+554398865-2498"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                  (43) 98865-2498
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@elevatejiujitsu.com.br"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                  contato@elevatejiujitsu.com.br
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-lg uppercase tracking-wider text-primary mb-6">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Elevate Jiu-Jitsu. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
