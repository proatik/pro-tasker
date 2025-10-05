import { Link } from "react-router-dom";
import { LogIn, LogOut } from "lucide-react";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-20 w-full py-2 bg-neutral-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/task.png" alt="Logo" width={36} height={36} />
          <span className="font-semibold text-2xl hidden sm:inline animate-text-flash">
            Pro Tasker
          </span>
        </Link>

        <div className="flex items-center gap-4 cursor-pointer">
          {user ? (
            <>
              <span className="text-md font-medium text-gray-300 hidden sm:inline">
                {user.fullName}
              </span>

              <button
                onClick={logout}
                className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white  rounded hover:bg-red-700 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
