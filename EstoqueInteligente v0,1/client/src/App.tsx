
import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Sales from "@/pages/sales";
import Suppliers from "@/pages/suppliers";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import LoginPage from "@/pages/login-page";
import CompanyOnboarding from "@/pages/company-onboarding";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/hooks/use-theme";
import Layout from "@/components/layout/layout";

function Router() {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user && location !== "/login") {
      navigate("/login");
    }

    if (!isLoading && user && location === "/login") {
      navigate("/");
    }
  }, [user, isLoading, location, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/:rest*">
          {() => <LoginPage />}
        </Route>
      </Switch>
    );
  }

  return (
    <SidebarProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/estoque" component={Inventory} />
          <Route path="/vendas" component={Sales} />
          <Route path="/fornecedores" component={Suppliers} />
          <Route path="/relatorios" component={Reports} />
          <Route path="/configuracoes" component={Settings} />
          <Route path="/onboarding" component={CompanyOnboarding} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </SidebarProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <Toaster />
              <Router />
            </AuthProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
