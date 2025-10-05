import { UserCheck } from "lucide-react";
import { useLocation, Navigate, Outlet } from "react-router-dom";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

const Redirecting = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100dvh-64px)] px-4">
      <div className="flex flex-col items-center text-center">
        <UserCheck className="w-16 h-16 text-emerald-400 animate-pulse" />
        <div className="mt-3 text-xl font-medium text-gray-300">
          You're already logged in
        </div>
      </div>
    </div>
  );
};

const PublicRoute = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.includes(pathname);

  if (isLoading) {
    return <Redirecting />;
  } else if (isAuthenticated && isPublicPath) {
    return <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }
};

export default PublicRoute;
