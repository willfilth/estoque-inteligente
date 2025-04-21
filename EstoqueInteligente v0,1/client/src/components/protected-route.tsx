import { Route, Redirect } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
};

export default function ProtectedRoute({ 
  path, 
  component: Component, 
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, isLoading, needsOnboarding } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          // Mostra um loader enquanto verifica a autenticação
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        // Se o usuário não está autenticado, redireciona para o login
        if (!user) {
          return <Redirect to="/login" />;
        }

        // Se a rota é apenas para administradores e o usuário não é admin
        if (adminOnly && !user.isAdmin) {
          return <Redirect to="/" />;
        }
        
        // Se o usuário precisa completar o onboarding e não está na página de onboarding
        if (needsOnboarding && path !== "/onboarding") {
          return <Redirect to="/onboarding" />;
        }

        // Se passou por todas as verificações, renderiza o componente
        return <Component />;
      }}
    </Route>
  );
}