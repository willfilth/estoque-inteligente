
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/hooks/use-theme";
import { Globe, Moon, Sun, Monitor, Package, ShoppingCart, Truck, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface LoginProps {
  onLogin: (code: string, password: string) => Promise<boolean>;
}

export default function LoginPage({ onLogin }: LoginProps) {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { language, translation, setLanguage, availableLanguages } = useLanguage();
  const { theme, setTheme } = useTheme();
  const t = translation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const success = await onLogin(code, password);
      if (!success) {
        setError("Código de usuário ou senha inválidos");
      }
    } catch (err) {
      setError("Erro ao realizar login. Tente novamente.");
      console.error("Erro de login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Área Hero - Lado Esquerdo */}
      <div className="w-1/2 bg-primary p-8 text-primary-foreground flex flex-col justify-center">
        <div className="max-w-xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold">Gerencie seu negócio de forma eficiente</h1>
          <p className="text-xl">
            Sistema completo para controle de estoque, vendas e relatórios
            para pequenas empresas.
          </p>
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <span className="text-lg">Controle de estoque avançado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <span className="text-lg">Registro de vendas simplificado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <Truck className="h-5 w-5" />
                </div>
                <span className="text-lg">Gerenciamento de fornecedores</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-lg">Relatórios detalhados</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Login - Lado Direito */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sistema de Gestão</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Usuário</Label>
                <Input
                  id="code"
                  placeholder="Seu código de usuário"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full space-y-2">
              <Label>Idioma</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <Globe className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.selectOption} />
                </SelectTrigger>
                <SelectContent>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full space-y-2">
              <Label>Tema</Label>
              <RadioGroup
                defaultValue={theme}
                onValueChange={setTheme as any}
                className="flex justify-between"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="login-light" />
                  <Label htmlFor="login-light" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    {t.light}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="login-dark" />
                  <Label htmlFor="login-dark" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    {t.dark}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="login-system" />
                  <Label htmlFor="login-system" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    {t.system}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
