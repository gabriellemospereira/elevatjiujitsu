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
import Agenda from "./pages/app/Agenda";
import ProfHome from "./pages/prof/Index";
import ProfChamada from "./pages/prof/Chamada";
import ProfHorarios from "./pages/prof/Horarios";
import ProfNotas from "./pages/prof/Notas";
import AdminHome from "./pages/admin/Index";
import AdminAlunos from "./pages/admin/Alunos";
import AdminTurmas from "./pages/admin/Turmas";
import AdminGraduacoes from "./pages/admin/Graduacoes";
import AdminPapeis from "./pages/admin/Papeis";
import Eventos from "./pages/Eventos";
import EventoDetalhe from "./pages/EventoDetalhe";
import MeusEventos from "./pages/app/MeusEventos";
import OrgIndex from "./pages/org/Index";
import OrgEventoEditor from "./pages/org/EventoEditor";
import OrgInscricoes from "./pages/org/Inscricoes";
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
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/eventos/:slug" element={<EventoDetalhe />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/app/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/app/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
            <Route path="/app/graduacao" element={<ProtectedRoute><Graduacao /></ProtectedRoute>} />
            <Route path="/app/historico" element={<ProtectedRoute><Historico /></ProtectedRoute>} />
            <Route path="/app/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
            <Route path="/app/eventos" element={<ProtectedRoute><MeusEventos /></ProtectedRoute>} />
            <Route path="/app/org" element={<ProtectedRoute requireRole="organizador"><OrgIndex /></ProtectedRoute>} />
            <Route path="/app/org/evento/:id" element={<ProtectedRoute requireRole="organizador"><OrgEventoEditor /></ProtectedRoute>} />
            <Route path="/app/org/evento/:id/inscricoes" element={<ProtectedRoute requireRole="organizador"><OrgInscricoes /></ProtectedRoute>} />
            <Route path="/app/prof" element={<ProtectedRoute requireRole="professor"><ProfHome /></ProtectedRoute>} />
            <Route path="/app/prof/chamada/:sessionId" element={<ProtectedRoute requireRole="professor"><ProfChamada /></ProtectedRoute>} />
            <Route path="/app/prof/horarios" element={<ProtectedRoute requireRole="professor"><ProfHorarios /></ProtectedRoute>} />
            <Route path="/app/prof/notas" element={<ProtectedRoute requireRole="professor"><ProfNotas /></ProtectedRoute>} />
            <Route path="/app/admin" element={<ProtectedRoute requireRole="admin"><AdminHome /></ProtectedRoute>} />
            <Route path="/app/admin/alunos" element={<ProtectedRoute requireRole="admin"><AdminAlunos /></ProtectedRoute>} />
            <Route path="/app/admin/turmas" element={<ProtectedRoute requireRole="admin"><AdminTurmas /></ProtectedRoute>} />
            <Route path="/app/admin/graduacoes" element={<ProtectedRoute requireRole="admin"><AdminGraduacoes /></ProtectedRoute>} />
            <Route path="/app/admin/papeis" element={<ProtectedRoute requireRole="admin"><AdminPapeis /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
