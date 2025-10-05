import { StrictMode } from "react";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// styles.
import "@/App.css";

// react components.
import App from "@/App";

// providers.
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root") as HTMLDivElement);

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
        <Toaster position="bottom-center" toastOptions={{ duration: 3000 }} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
