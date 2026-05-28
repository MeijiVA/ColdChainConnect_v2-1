import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { InformationManagement } from "./pages/InformationManagement";
import { BookingDispatch } from "./pages/BookingDispatch";
import { AuditLogPage } from "./pages/AuditLog";
import { Topbar } from "./components/Topbar";
import { BottomNavBar } from "./components/BottomNavBar";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar
        userName={user?.username || "User"}
        onLogout={logout}
      />
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col bg-off-white min-w-0 pb-32 md:pb-0">
          {children}
        </div>
      </div>
      <BottomNavBar
        onLogout={logout}
      />
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated, user, setUser } = useAuth();

  // Demo mode: Auto-login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      setUser({
        id: "demo-user",
        username: "Demo User",
        role: "admin",
      });
    }
  }, [isAuthenticated, user, setUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/information-management/*" element={<AppLayout><InformationManagement /></AppLayout>} />
      <Route path="/booking-dispatch/*" element={<AppLayout><BookingDispatch /></AppLayout>} />
      <Route path="/audit" element={<AppLayout><AuditLogPage /></AppLayout>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.hasChildNodes()) {
  createRoot(rootElement).render(<App />);
}
