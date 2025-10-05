import { z } from "zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

// contexts.
import { useAuth } from "@/contexts/AuthContext";

// validation schema.
const registerSchema = z
  .object({
    fullName: z
      .string()
      .nonempty("Full Name is required")
      .min(3, "Full Name must be at least 3 characters long")
      .trim(),
    email: z.email("Please enter a valid email address").trim(),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .nonempty("Confirm Password is required")
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const navigate = useNavigate();

  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    const success = await registerUser(data);

    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="w-full max-w-sm p-8 bg-zinc-950 border border-gray-700 rounded-lg shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Register</h2>

        <div>
          <label htmlFor="name" className="block mb-1 text-sm">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-red-400 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
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

        <div>
          <label htmlFor="confirmPassword" className="block mb-1 text-sm">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm mt-1">
              {errors.confirmPassword.message}
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
              className="w-6 h-6 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
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
            "Register"
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors"
        >
          Login here
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
