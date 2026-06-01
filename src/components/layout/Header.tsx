import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Logo.png";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, User } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/sobre", label: "Sobre" },
    { href: "/modalidades", label: "Modalidades" },
    { href: "/horarios", label: "Horários" },
    { href: "/contato", label: "Contato" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
           <img
                  src={logo}
                  alt="logo elevate jiu-jitsu"
                  className="w-12 aspect-square object-cover"
                />
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl font-heading font-bold text-gradient">
              ELEVATE
            </span>
            <span className="text-sm md:text-base font-heading text-foreground/80 uppercase tracking-widest">
              Jiu-Jitsu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-heading text-sm uppercase tracking-wider transition-colors duration-300 ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="default" asChild>
                <Link to={user ? "/app/dashboard" : "/auth"}>
                  {user ? <><User className="w-4 h-4" /> Área do Aluno</> : <><LogIn className="w-4 h-4" /> Entrar</>}
                </Link>
              </Button>
              <Button variant="gold" size="default" asChild>
                <Link to="/contato">Aula Gratuita</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border animate-fade-in">
            <nav className="flex flex-col py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-heading text-lg uppercase tracking-wider py-4 px-6 transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-primary bg-muted"
                      : "text-foreground/80 hover:text-primary hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-6 pt-4">
                <Button variant="gold" size="lg" className="w-full" asChild>
                  <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)}>
                    Aula Gratuita
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
