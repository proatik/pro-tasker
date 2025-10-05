import { LogIn } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

const Redirecting = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100dvh-64px)] px-4">
      <div className="flex flex-col items-center text-center">
        <LogIn className="w-16 h-16 text-blue-400 animate-pulse" />
        <div className="mt-3 text-xl font-medium text-gray-300">
          You must login first
        </div>
      </div>
    </div>
  );
};

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Redirecting />;
  } else if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  } else {
    return <Outlet />;
  }
};

export default PrivateRoute;
