import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRole, type AppRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({
  children,
  requireRole,
}: {
  children: ReactNode;
  requireRole?: AppRole | AppRole[];
}) => {
  const { user, loading } = useAuth();
  const { roles, loading: rolesLoading } = useRole();
  const location = useLocation();

  if (loading || (requireRole && rolesLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (requireRole) {
    const required = Array.isArray(requireRole) ? requireRole : [requireRole];
    const allowed = required.some((r) => roles.includes(r)) || roles.includes("admin");
    if (!allowed) {
      return <Navigate to="/app/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;