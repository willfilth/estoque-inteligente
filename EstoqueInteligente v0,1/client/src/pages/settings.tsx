import { AlertCircle, Globe, Sun, Moon, Monitor, Settings as SettingsIcon, User, Database, UserPlus, Users, Trash, Shield, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage } from "@/contexts/language-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Interface para dados de empresa
interface CompanyData {
  name: string;
  cnpj: string;
  legalName: string;
  cep: string;
  street: string;
  number: string;
  noNumber: boolean;
  city: string;
  state: string;
  phones: {
    number: string;
    isWhatsapp: boolean;
  }[];
  email: string;
  logo?: File;
}

// Interface para dados de usuário
interface User {
  id: number;
  name: string;
  cpf: string;
  code: string;
  password: string;
  isAdmin: boolean;
}

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, translation, setLanguage, availableLanguages } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin || false;
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "Minha Empresa",
    cnpj: "",
    legalName: "",
    cep: "",
    street: "",
    number: "",
    noNumber: false,
    city: "",
    state: "",
    phones: [{ number: "", isWhatsapp: false }],
    email: ""
  });
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Administrador", cpf: "000.000.000-00", code: "admin", password: "123456", isAdmin: true }
  ]);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({ 
    name: "", 
    cpf: "", 
    code: "", 
    password: "", 
    isAdmin: false 
  });
  const t = translation;

  // Função para buscar CEP
  const fetchAddressByCep = (cep: string) => {
    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            setCompanyData({
              ...companyData,
              cep: cep,
              street: data.logradouro,
              city: data.localidade,
              state: data.uf
            });
          }
        })
        .catch(error => console.error("Erro ao buscar CEP:", error));
    }
  };

  // Função para adicionar um telefone
  const addPhone = () => {
    setCompanyData({
      ...companyData,
      phones: [...companyData.phones, { number: "", isWhatsapp: false }]
    });
  };

  // Função para remover um telefone
  const removePhone = (index: number) => {
    if (companyData.phones.length > 1) {
      const newPhones = [...companyData.phones];
      newPhones.splice(index, 1);
      setCompanyData({
        ...companyData,
        phones: newPhones
      });
    }
  };

  // Função para atualizar um telefone
  const updatePhone = (index: number, value: string, field: 'number' | 'isWhatsapp') => {
    const newPhones = [...companyData.phones];
    if (field === 'number') {
      newPhones[index].number = value;
    } else {
      newPhones[index].isWhatsapp = !newPhones[index].isWhatsapp;
    }
    setCompanyData({
      ...companyData,
      phones: newPhones
    });
  };

  // Estados para o diálogo de senha de administrador
  const [showAdminPasswordDialog, setShowAdminPasswordDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  const [userToRemove, setUserToRemove] = useState<number | null>(null);
  const [dialogAction, setDialogAction] = useState<"add" | "remove">("add");

  // Verificação de senha de administrador
  const checkAdminPassword = (password: string): boolean => {
    const admin = users.find(u => u.id === 1);
    return admin?.password === password;
  };

  // Função para adicionar um novo usuário
  const addUser = () => {
    if (newUser.name && newUser.cpf && newUser.code && newUser.password) {
      setDialogAction("add");
      setShowAdminPasswordDialog(true);
    }
  };

  // Função para confirmar adição de usuário após verificação de senha
  const confirmAddUser = () => {
    if (checkAdminPassword(adminPassword)) {
      const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      setUsers([...users, { ...newUser, id: newId }]);
      setNewUser({ 
        name: "", 
        cpf: "", 
        code: "", 
        password: "", 
        isAdmin: false 
      });
      setAdminPassword("");
      setAdminPasswordError(false);
      setShowAdminPasswordDialog(false);
    } else {
      setAdminPasswordError(true);
    }
  };

  // Função para iniciar processo de remoção de usuário
  const startRemoveUser = (id: number) => {
    setUserToRemove(id);
    setDialogAction("remove");
    setShowAdminPasswordDialog(true);
  };

  // Função para confirmar remoção de usuário após verificação de senha
  const confirmRemoveUser = () => {
    if (checkAdminPassword(adminPassword) && userToRemove) {
      setUsers(users.filter(user => user.id !== userToRemove));
      setAdminPassword("");
      setAdminPasswordError(false);
      setShowAdminPasswordDialog(false);
      setUserToRemove(null);
    } else {
      setAdminPasswordError(true);
    }
  };

  // Função para salvar os dados da empresa
  const saveCompanyData = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica para salvar os dados
    console.log("Dados da empresa salvos:", companyData);
    // Exibir modal de confirmação ou mensagem de sucesso
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t.settings}</h1>
        <SettingsIcon className="h-6 w-6" />
      </div>

      {/* Modal de informações da empresa */}
      <Dialog open={showCompanyInfo} onOpenChange={setShowCompanyInfo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Informações da Empresa</DialogTitle>
            <DialogDescription>
              Detalhes completos da empresa cadastrada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h3 className="font-semibold">{companyData.name}</h3>
              {companyData.legalName && (
                <p className="text-sm text-muted-foreground">{companyData.legalName}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">CNPJ</p>
                <p>{companyData.cnpj || "-"}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p>{companyData.email || "-"}</p>
              </div>
            </div>
            <div>
              <p className="font-medium">Endereço</p>
              {companyData.street ? (
                <p className="text-sm">
                  {companyData.street}, {companyData.number} - {companyData.city}/{companyData.state} - CEP: {companyData.cep}
                </p>
              ) : (
                <p className="text-sm">-</p>
              )}
            </div>
            <div>
              <p className="font-medium">Telefones</p>
              {companyData.phones.length > 0 ? (
                <ul className="text-sm">
                  {companyData.phones.map((phone, idx) => (
                    <li key={idx}>
                      {phone.number} {phone.isWhatsapp && "(WhatsApp)"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm">-</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de senha de administrador */}
      <Dialog open={showAdminPasswordDialog} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setAdminPasswordError(false);
          setAdminPassword("");
        }
        setShowAdminPasswordDialog(isOpen);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Autenticação Necessária</DialogTitle>
            <DialogDescription>
              {dialogAction === "add" ? 
                "Digite a senha de administrador para adicionar um novo usuário." :
                "Digite a senha de administrador para remover o usuário."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="admin-password">
                  Senha de Administrador
                </Label>
                <input
                  id="admin-password"
                  type="password"
                  className={`flex h-10 w-full rounded-md border ${adminPasswordError ? 'border-red-500' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background`}
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (adminPasswordError) setAdminPasswordError(false);
                  }}
                />
                {adminPasswordError && (
                  <p className="text-sm text-red-500">Senha incorreta. Tente novamente.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={dialogAction === "add" ? confirmAddUser : confirmRemoveUser}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="appearance" className="w-full">
        {/* Lista de abas */}
        <TabsList className={`grid ${isAdmin ? 'grid-cols-4' : 'grid-cols-1'} mb-8`}>
          <TabsTrigger value="appearance">
            <Sun className="mr-2 h-4 w-4" />
            {t.appearance}
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="general">
                <User className="mr-2 h-4 w-4" />
                {t.general}
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="data">
                <Database className="mr-2 h-4 w-4" />
                {t.backupRestore}
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Conteúdo da aba Aparência */}
        <TabsContent value="appearance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.language}</CardTitle>
                <CardDescription>
                  {t.language === "Idioma" 
                    ? "Escolha o idioma da interface do usuário."
                    : "Choose the user interface language."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={language}
                  onValueChange={setLanguage}
                >
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.theme}</CardTitle>
                <CardDescription>
                  {t.theme === "Tema" 
                    ? "Escolha o tema da interface do usuário."
                    : "Choose the user interface theme."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue={theme}
                  onValueChange={setTheme as any}
                  className="flex flex-col gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light" className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      {t.light}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark" className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      {t.dark}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <Label htmlFor="system" className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      {t.system}
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo das abas administrativas */}
        {isAdmin && (
          <>
            <TabsContent value="general">
              <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  <span 
                    className="cursor-pointer hover:underline"
                    onClick={() => companyData.name && setShowCompanyInfo(true)}
                  >
                    {t.companyInfo}
                  </span>
                </CardTitle>
                <CardDescription>
                  {t.language === "Idioma" 
                    ? "Configure as informações básicas da sua empresa. * (campos obrigatórios)"
                    : "Configure your company's basic information. * (required fields)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={saveCompanyData}>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="company-name">
                        {t.companyName} *
                      </Label>
                      <input
                        id="company-name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={companyData.name}
                        required
                        onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="company-cnpj">
                        CNPJ *
                      </Label>
                      <input
                        id="company-cnpj"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        placeholder="00.000.000/0000-00"
                        value={companyData.cnpj}
                        required
                        onChange={(e) => setCompanyData({...companyData, cnpj: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="company-legal-name">
                      Razão Social
                    </Label>
                    <input
                      id="company-legal-name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={companyData.legalName}
                      onChange={(e) => setCompanyData({...companyData, legalName: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>
                      Endereço *
                    </Label>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="company-cep">
                          CEP *
                        </Label>
                        <input
                          id="company-cep"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          placeholder="00000-000"
                          value={companyData.cep}
                          required
                          onChange={(e) => {
                            const cep = e.target.value;
                            setCompanyData({...companyData, cep});
                            if (cep.replace(/\D/g, '').length === 8) {
                              fetchAddressByCep(cep);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="company-street">
                          Logradouro *
                        </Label>
                        <input
                          id="company-street"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={companyData.street}
                          required
                          onChange={(e) => setCompanyData({...companyData, street: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="grid gap-2">
                        <Label htmlFor="company-number">
                          Número
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            id="company-number"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={companyData.number}
                            onChange={(e) => setCompanyData({...companyData, number: e.target.value})}
                            disabled={companyData.noNumber}
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              id="no-number"
                              checked={companyData.noNumber}
                              onChange={(e) => {
                                const noNumber = e.target.checked;
                                setCompanyData({
                                  ...companyData, 
                                  noNumber: noNumber,
                                  number: noNumber ? "S/N" : ""
                                });
                              }}
                              className="h-4 w-4 rounded border-primary text-primary"
                            />
                            <Label htmlFor="no-number" className="text-sm">S/N</Label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="company-city">
                          Cidade *
                        </Label>
                        <input
                          id="company-city"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={companyData.city}
                          required
                          onChange={(e) => setCompanyData({...companyData, city: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="company-state">
                          Estado *
                        </Label>
                        <input
                          id="company-state"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={companyData.state}
                          required
                          onChange={(e) => setCompanyData({...companyData, state: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>
                        Telefone *
                      </Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="h-8"
                        onClick={addPhone}
                      >
                        Adicionar telefone
                      </Button>
                    </div>
                    
                    {companyData.phones.map((phone, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="grid gap-2 flex-1">
                          <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            placeholder="(00) 00000-0000"
                            value={phone.number}
                            required
                            onChange={(e) => updatePhone(index, e.target.value, 'number')}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={phone.isWhatsapp}
                            className="h-4 w-4 rounded border-primary text-primary"
                            onChange={() => updatePhone(index, '', 'isWhatsapp')}
                          />
                          <Label className="text-sm">
                            WhatsApp
                          </Label>
                        </div>
                        
                        {companyData.phones.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => removePhone(index)}
                          >
                            X
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="company-email">
                      Email
                    </Label>
                    <input
                      id="company-email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="company-logo">{t.companyLogo}</Label>
                    <input
                      id="company-logo"
                      type="file"
                      accept="image/*"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCompanyData({...companyData, logo: e.target.files[0]});
                        }
                      }}
                    />
                  </div>
                  
                  <Button className="mt-4" type="submit">{t.save}</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Cadastro de Usuários</CardTitle>
                <CardDescription>
                  Gerencie os usuários que terão acesso ao sistema. * (campos obrigatórios)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addUser(); }}>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="user-name">
                          Nome *
                        </Label>
                        <input
                          id="user-name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={newUser.name}
                          required
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="user-cpf">
                          CPF *
                        </Label>
                        <input
                          id="user-cpf"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          placeholder="000.000.000-00"
                          value={newUser.cpf}
                          required
                          onChange={(e) => setNewUser({...newUser, cpf: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="user-code">
                          Código de Usuário *
                        </Label>
                        <input
                          id="user-code"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={newUser.code}
                          required
                          onChange={(e) => setNewUser({...newUser, code: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="user-password">
                          Senha *
                        </Label>
                        <input
                          id="user-password"
                          type="password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          value={newUser.password}
                          required
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="user-admin"
                        checked={newUser.isAdmin}
                        className="h-4 w-4 rounded border-primary text-primary"
                        onChange={(e) => setNewUser({...newUser, isAdmin: e.target.checked})}
                      />
                      <Label htmlFor="user-admin">
                        Usuário Administrador
                      </Label>
                    </div>
                    
                    <Button type="submit" className="mt-2">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Adicionar Usuário
                    </Button>
                  </form>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Usuários Cadastrados</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Código</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="w-24">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.cpf}</TableCell>
                              <TableCell>{user.code}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-md text-xs ${user.isAdmin ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                                  {user.isAdmin ? 'Administrador' : 'Usuário'}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => startRemoveUser(user.id)}
                                  disabled={user.id === 1} // Não permite remover o admin
                                >
                                  <span className="sr-only">Excluir</span>
                                  X
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>{t.backupRestore}</CardTitle>
                <CardDescription>
                  {t.backupRestore === "Backup e Restauração" 
                    ? "Faça backup dos seus dados ou restaure a partir de um arquivo existente."
                    : "Back up your data or restore from an existing file."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button variant="outline">
                      {t.exportData}
                    </Button>
                    <Button variant="outline">
                      {t.importData}
                    </Button>
                  </div>
                  <Separator className="my-4" />
                  <div>
                    <h3 className="mb-3 text-lg font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      {t.resetSystem === "Resetar Sistema"
                        ? "Área de perigo"
                        : "Danger zone"}
                    </h3>
                    <Button variant="destructive">
                      {t.resetSystem}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}