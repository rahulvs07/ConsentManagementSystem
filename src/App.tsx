import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/useLanguage";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuditLogsPage from "./pages/AuditLogsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* DPDP Compliance Routes */}
              <Route path="/consent/notice" element={<Index />} />
              <Route path="/consent/manage" element={<Index />} />
              <Route path="/consent/cookie" element={<Index />} />
              <Route path="/grievance/submit" element={<Index />} />
              <Route path="/grievance/track" element={<Index />} />
              <Route path="/audit/logs" element={<AuditLogsPage />} />
              <Route path="/audit-logs" element={<AuditLogsPage />} />
              <Route path="/admin/users" element={<Index />} />
              <Route path="/admin/retention" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
