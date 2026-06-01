import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sobre from "./pages/Sobre";
import Modalidades from "./pages/Modalidades";
import Horarios from "./pages/Horarios";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/app/Dashboard";
import Perfil from "./pages/app/Perfil";
import Graduacao from "./pages/app/Graduacao";
import Historico from "./pages/app/Historico";
import ProtectedRoute from "./components/app/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/modalidades" element={<Modalidades />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/app/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/app/graduacao" element={<ProtectedRoute><Graduacao /></ProtectedRoute>} />
            <Route path="/app/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
