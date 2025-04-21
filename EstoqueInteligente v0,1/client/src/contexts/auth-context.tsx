import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { Company, CompanyWithPhones } from "@shared/schema";

// Tipo para usuário autenticado
export interface AuthUser {
  id: number;
  companyId: number | null;
  name: string;
  username: string;
  role: string;
  isAdmin: boolean;
  lastActive: string | null;
}

// Tipo para contexto de autenticação
interface AuthContextType {
  user: AuthUser | null;
  company: CompanyWithPhones | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  needsOnboarding: boolean;
  updateLastActive: () => void;
  keepSessionActive: () => void;
  saveCompany: (company: Partial<CompanyWithPhones>) => Promise<boolean>;
}

// Valores padrão para o contexto
const defaultContext: AuthContextType = {
  user: null,
  company: null,
  login: async () => false,
  logout: () => {},
  isLoading: true,
  needsOnboarding: false,
  updateLastActive: () => {},
  keepSessionActive: () => {},
  saveCompany: async () => false
};

// Criação do contexto
const AuthContext = createContext<AuthContextType>(defaultContext);

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Constantes para controle de inatividade
const INACTIVITY_TIME = 15 * 60 * 1000; // 15 minutos em ms 
const WARNING_DISPLAY_TIME = 30 * 1000; // 30 segundos em ms

// Provedor de autenticação
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<CompanyWithPhones | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [infiniteSession, setInfiniteSession] = useState(false);
  const { toast } = useToast();
  
  const [location, setLocation] = useLocation();
  
  // Referências para timers de inatividade
  const inactivityTimerRef = useRef<number | null>(null);
  const warningTimerRef = useRef<number | null>(null);
  
  // Limpar os timers ao desmontar o componente
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        window.clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        window.clearTimeout(warningTimerRef.current);
      }
    };
  }, []);
  
  // Iniciar o timer de inatividade
  const startInactivityTimer = useCallback(() => {
    // Não inicia o timer se a sessão for infinita
    if (infiniteSession) return;
    
    // Limpa qualquer timer atual
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
    }
    
    // Define um novo timer
    inactivityTimerRef.current = window.setTimeout(() => {
      setShowInactivityWarning(true);
      
      // Define um timer para logout automático após o tempo de exibição do aviso
      warningTimerRef.current = window.setTimeout(() => {
        logout();
        toast({
          title: "Sessão encerrada",
          description: "Sua sessão foi encerrada devido à inatividade."
        });
      }, WARNING_DISPLAY_TIME);
    }, INACTIVITY_TIME);
  }, [infiniteSession]);
  
  // Atualizar o último momento de atividade
  const updateLastActive = useCallback(() => {
    if (user) {
      startInactivityTimer();
      
      // Em uma aplicação real, enviaria para o servidor
      const timestamp = new Date().toISOString();
      const updatedUser = { ...user, lastActive: timestamp };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      
      // Também atualizaria no servidor com uma requisição
      // apiRequest('PUT', `/api/users/${user.id}/last-active`, { lastActive: timestamp });
    }
  }, [user, startInactivityTimer]);
  
  // Manter a sessão ativa indefinidamente
  const keepSessionActive = useCallback(() => {
    setInfiniteSession(true);
    setShowInactivityWarning(false);
    
    // Cancela o timer de aviso
    if (warningTimerRef.current) {
      window.clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    
    toast({
      title: "Sessão ativa",
      description: "Sua sessão permanecerá ativa até que você faça logout manualmente."
    });
  }, []);
  
  // Função para verificar se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('auth_user');
      const storedCompany = localStorage.getItem('company');
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Inicia o timer de inatividade
          startInactivityTimer();
          
          // Verifica se há uma empresa cadastrada
          if (storedCompany) {
            try {
              const parsedCompany = JSON.parse(storedCompany);
              setCompany(parsedCompany);
              
              // Se a empresa não está configurada, direciona para onboarding
              if (!parsedCompany.isConfigured && parsedUser.role === 'admin') {
                setNeedsOnboarding(true);
              }
            } catch (error) {
              console.error('Erro ao processar dados da empresa:', error);
              localStorage.removeItem('company');
              setNeedsOnboarding(true);
            }
          } else if (parsedUser.role === 'admin') {
            // Se não há empresa e o usuário é admin, precisa de onboarding
            setNeedsOnboarding(true);
          }
        } catch (error) {
          console.error('Erro ao processar usuário armazenado:', error);
          localStorage.removeItem('auth_user');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [startInactivityTimer]);

  // Monitora eventos do usuário para resetar o timer de inatividade
  useEffect(() => {
    const resetTimer = () => {
      updateLastActive();
    };
    
    // Adiciona listeners para os eventos do usuário
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    
    // Remove os listeners quando o componente é desmontado
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };
  }, [updateLastActive]);

  // Função para realizar login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Em uma aplicação real, você faria uma requisição ao servidor
      // Aqui estamos simulando com localStorage
      
      // Simulação de chamada API:
      // const response = await apiRequest('POST', '/api/login', { username, password });
      // const userData = await response.json();
      
      // Simulação com localStorage:
      const storedUsers = localStorage.getItem('users');
      let users = [];
      
      if (storedUsers) {
        try {
          users = JSON.parse(storedUsers);
        } catch (error) {
          console.error('Erro ao processar usuários armazenados:', error);
        }
      } else {
        // Usuário administrador padrão se não houver usuários cadastrados
        users = [
          { 
            id: 1, 
            name: "Administrador", 
            username: "admin", 
            password: "123456",
            role: "admin", 
            isAdmin: true,
            companyId: null,
            lastActive: null
          }
        ];
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // Verifica credenciais padrão
      if (username === 'admin' && password === '123456') {
        const defaultUser = {
          id: 1,
          name: "Administrador",
          username: "admin",
          role: "admin",
          isAdmin: true,
          companyId: null,
          lastActive: new Date().toISOString()
        };
        
        setUser(defaultUser);
        localStorage.setItem('auth_user', JSON.stringify(defaultUser));
        startInactivityTimer();
        setNeedsOnboarding(true);
        return true;
      }

      // Procura o usuário pelo nome de usuário (para futura implementação)
      const foundUser = users.find(
        (u: any) => u.username === username && u.password === password
      );
      
      if (foundUser) {
        // Remove a senha antes de armazenar no estado
        const { password, ...safeUser } = foundUser;
        
        // Atualiza o último momento de atividade
        const userWithActive = {
          ...safeUser,
          lastActive: new Date().toISOString()
        };
        
        setUser(userWithActive as AuthUser);
        localStorage.setItem('auth_user', JSON.stringify(userWithActive));
        
        // Inicia o timer de inatividade
        startInactivityTimer();
        
        // Verifica se há uma empresa cadastrada
        if (userWithActive.companyId) {
          // Em uma aplicação real, carregaria do servidor
          // const response = await apiRequest('GET', `/api/companies/${userWithActive.companyId}`);
          // const companyData = await response.json();
          
          const storedCompanies = localStorage.getItem('companies');
          if (storedCompanies) {
            try {
              const companies = JSON.parse(storedCompanies);
              const userCompany = companies.find((c: any) => c.id === userWithActive.companyId);
              
              if (userCompany) {
                setCompany(userCompany);
                localStorage.setItem('company', JSON.stringify(userCompany));
                
                // Se a empresa não está configurada, direciona para onboarding
                if (!userCompany.isConfigured && userWithActive.role === 'admin') {
                  setNeedsOnboarding(true);
                }
              } else if (userWithActive.role === 'admin') {
                setNeedsOnboarding(true);
              }
            } catch (error) {
              console.error('Erro ao processar empresas armazenadas:', error);
              
              if (userWithActive.role === 'admin') {
                setNeedsOnboarding(true);
              }
            }
          } else if (userWithActive.role === 'admin') {
            setNeedsOnboarding(true);
          }
        } else if (userWithActive.role === 'admin') {
          setNeedsOnboarding(true);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  // Função para salvar empresa
  const saveCompany = async (companyData: Partial<CompanyWithPhones>): Promise<boolean> => {
    try {
      // Em uma aplicação real, você faria uma requisição ao servidor
      // const response = await apiRequest('POST', '/api/companies', companyData);
      // const savedCompany = await response.json();
      
      // Simulação com localStorage:
      console.log("Dados da empresa salvos:", companyData);
      
      const storedCompanies = localStorage.getItem('companies');
      let companies = [];
      
      if (storedCompanies) {
        try {
          companies = JSON.parse(storedCompanies);
        } catch (error) {
          console.error('Erro ao processar empresas armazenadas:', error);
        }
      }
      
      // Se já existe a empresa, atualiza
      if (company && company.id) {
        const updatedCompanies = companies.map((c: any) => 
          c.id === company.id ? { ...c, ...companyData } : c
        );
        
        localStorage.setItem('companies', JSON.stringify(updatedCompanies));
        
        const updatedCompany = { ...company, ...companyData, isConfigured: true };
        setCompany(updatedCompany);
        localStorage.setItem('company', JSON.stringify(updatedCompany));
      } else {
        // Se não existe, cria uma nova
        // Criando nova empresa com cast para resolver problema de tipos
        const newCompany = {
          id: companies.length + 1,
          ...companyData,
          isConfigured: true,
          createdAt: new Date().toISOString()
        } as unknown as CompanyWithPhones;
        
        companies.push(newCompany);
        localStorage.setItem('companies', JSON.stringify(companies));
        
        setCompany(newCompany);
        localStorage.setItem('company', JSON.stringify(newCompany));
        
        // Atualiza o usuário com o ID da nova empresa
        if (user) {
          const updatedUser = { ...user, companyId: newCompany.id };
          setUser(updatedUser);
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
          
          // Atualiza na lista de usuários
          const storedUsers = localStorage.getItem('users');
          if (storedUsers) {
            try {
              const users = JSON.parse(storedUsers);
              const updatedUsers = users.map((u: any) => 
                u.id === user.id ? { ...u, companyId: newCompany.id } : u
              );
              
              localStorage.setItem('users', JSON.stringify(updatedUsers));
            } catch (error) {
              console.error('Erro ao processar usuários armazenados:', error);
            }
          }
        }
      }
      
      // Empresa configurada, não precisa mais de onboarding
      setNeedsOnboarding(false);
      
      toast({
        title: "Empresa salva",
        description: "As informações da empresa foram salvas com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as informações da empresa.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Função para realizar logout
  const logout = () => {
    setUser(null);
    setCompany(null);
    setNeedsOnboarding(false);
    setInfiniteSession(false);
    
    // Limpa os timers
    if (inactivityTimerRef.current) {
      window.clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    
    if (warningTimerRef.current) {
      window.clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    
    localStorage.removeItem('auth_user');
    localStorage.removeItem('company');
    
    setLocation('/login');
  };

  // Retorna o provedor com o valor do contexto
  return (
    <>
      <AuthContext.Provider 
        value={{ 
          user, 
          company,
          login, 
          logout, 
          isLoading, 
          needsOnboarding,
          updateLastActive,
          keepSessionActive,
          saveCompany
        }}
      >
        {children}
      </AuthContext.Provider>
      
      {/* Diálogo de aviso de inatividade */}
      <Dialog open={showInactivityWarning} onOpenChange={setShowInactivityWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sessão prestes a expirar</DialogTitle>
            <DialogDescription>
              Você está inativo há algum tempo. Sua sessão será encerrada automaticamente em 30 segundos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowInactivityWarning(false);
                updateLastActive();
              }}
              className="flex-1"
            >
              Continuar por mais 15 minutos
            </Button>
            <Button 
              onClick={keepSessionActive}
              className="flex-1"
            >
              Manter sempre ativo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}