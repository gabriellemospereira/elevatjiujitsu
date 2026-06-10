import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, Award, LogOut, History, Calendar, ClipboardList, Settings, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Logo.png";

const studentNav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/agenda", label: "Agenda", icon: Calendar },
  { to: "/app/historico", label: "Histórico", icon: History },
  { to: "/app/graduacao", label: "Graduação", icon: Award },
  { to: "/app/perfil", label: "Perfil", icon: User },
];

const profNav = [
  { to: "/app/prof", label: "Professor", icon: ClipboardList },
];

const adminNav = [
  { to: "/app/admin", label: "Admin", icon: Settings },
  { to: "/app/admin/alunos", label: "Alunos", icon: Users },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { signOut } = useAuth();
  const { isAdmin, isProfessor } = useRole();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarItems = [
    ...studentNav,
    ...(isProfessor ? profNav : []),
    ...(isAdmin ? adminNav : []),
  ];
  const mobileItems = sidebarItems.slice(0, 4);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <Link to="/" className="flex items-center gap-3 p-6 border-b border-border">
          <img src={logo} alt="Elevate" className="w-10 aspect-square object-cover" />
          <span className="text-xl font-heading font-bold text-gradient">ELEVATE</span>
        </Link>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/app/prof" || to === "/app/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md font-heading text-sm uppercase tracking-wider transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Elevate" className="w-8 aspect-square object-cover" />
            <span className="text-lg font-heading font-bold text-gradient">ELEVATE</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
          <div className="grid grid-cols-4">
            {mobileItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/app/prof" || to === "/app/admin"}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-wider ${
                    isActive ? "text-primary" : "text-foreground/60"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AppLayout;