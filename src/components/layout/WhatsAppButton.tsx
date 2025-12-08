import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phoneNumber = "5543988652498";
  const message = encodeURIComponent(
    "Olá! Gostaria de agendar uma aula experimental gratuita na Elevate Jiu-Jitsu."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300 animate-float"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-8 h-8 text-white fill-white" />
    </a>
  );
};

export default WhatsAppButton;
