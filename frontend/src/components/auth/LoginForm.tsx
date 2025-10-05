import { z } from "zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

// validation schema.
const loginSchema = z.object({
  email: z.email("Please enter a valid email address").trim(),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data);
  };

  return (
    <div className="w-full max-w-sm p-8 bg-zinc-950 border border-gray-700 rounded-lg shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        <div>
          <label htmlFor="email" className="block mb-1 text-sm">
            Email
          </label>
          <input
            id="email"
            type="text"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 font-medium text-white transition-colors bg-indigo-600 rounded cursor-pointer hover:bg-indigo-700 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <svg
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 animate-spin text-white"
            >
              <circle
                r="10"
                cx="12"
                cy="12"
                strokeWidth="4"
                className="opacity-25"
                stroke="currentColor"
              ></circle>
              <path
                fill="currentColor"
                className="opacity-75"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors"
        >
          Register now
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
