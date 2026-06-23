import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { isFrontendOnly } from "@/lib/frontendOnly";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Marketplace from "@/pages/marketplace";
import CourseDetail from "@/pages/course-detail";
import Subscribe from "@/pages/subscribe";
import NotFound from "@/pages/not-found";

function AuthenticatedRoutes() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/subscribe" component={Subscribe} />
    </>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isFrontendOnly) {
    return (
      <Switch>
        <Route path="/landing" component={Landing} />
        <AuthenticatedRoutes />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <AuthenticatedRoutes />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  const showAppShell = isFrontendOnly || (!isLoading && isAuthenticated);

  return (
    <TooltipProvider>
      {showAppShell ? (
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b border-border bg-card">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="text-sm text-muted-foreground">
                  Welcome to EduConnect
                </div>
              </header>
              <main className="flex-1 overflow-hidden">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <Router />
      )}
      <Toaster />
    </TooltipProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
