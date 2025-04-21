import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";

// Esquema de validação para as configurações gerais
const generalSettingsSchema = z.object({
  companyName: z.string().min(2, "O nome da empresa deve ter pelo menos 2 caracteres"),
  companyLegalName: z.string().min(2, "A razão social deve ter pelo menos 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos").max(18, "CNPJ deve ter no máximo 18 caracteres"),
  email: z.string().email("Email inválido"),
  
  // Telefones
  phones: z.array(
    z.object({
      number: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
      isWhatsapp: z.boolean().default(false)
    })
  ).min(1, "Pelo menos um telefone é necessário"),
  
  // Endereço com campos separados
  address: z.object({
    cep: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP deve ter no máximo 9 caracteres"),
    street: z.string().min(2, "Logradouro é obrigatório"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    district: z.string().min(2, "Bairro é obrigatório"),
    city: z.string().min(2, "Cidade é obrigatória"),
    state: z.string().length(2, "Estado deve ter 2 caracteres")
  }),
  
  currency: z.string().default("BRL"),
  language: z.string().default("pt-BR"),
  minStockAlerts: z.boolean().default(true),
  minStockThreshold: z.number().min(1).default(5),
  
  // Logo da empresa
  logoUrl: z.string().optional(),
});

// Esquema de validação para as configurações de notificações
const notificationsSettingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  lowStockAlerts: z.boolean().default(true),
  stockExpiryAlerts: z.boolean().default(false),
  dailyReports: z.boolean().default(false),
  weeklyReports: z.boolean().default(true),
  emailRecipients: z.string().optional(),
});

// Esquema de validação para as configurações de aparência
const appearanceSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
type NotificationsSettingsValues = z.infer<typeof notificationsSettingsSchema>;
type AppearanceSettingsValues = z.infer<typeof appearanceSettingsSchema>;

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  
  // Estado para upload de logo
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  // Função para lidar com upload de logo
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      const preview = URL.createObjectURL(file);
      setLogoPreview(preview);
    }
  };

  // Função para abrir modal da logo
  const handleLogoClick = () => {
    if (logoPreview) {
      setModalImageUrl(logoPreview);
      setIsModalOpen(true);
    }
  };

  // Configurar formulário para configurações gerais
  const generalForm = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      companyName: "Minha Empresa",
      companyLegalName: "Minha Empresa Ltda",
      cnpj: "12.345.678/0001-90",
      email: "contato@minhaempresa.com",
      phones: [
        { number: "(11) 98765-4321", isWhatsapp: true },
      ],
      address: {
        cep: "01234-567",
        street: "Rua Exemplo",
        number: "123",
        complement: "Sala 45",
        district: "Centro",
        city: "São Paulo",
        state: "SP"
      },
      currency: "BRL",
      language: "pt-BR",
      minStockAlerts: true,
      minStockThreshold: 5,
      logoUrl: "",
    },
  });

  // Configurar formulário para configurações de notificações
  const notificationsForm = useForm<NotificationsSettingsValues>({
    resolver: zodResolver(notificationsSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      lowStockAlerts: true,
      stockExpiryAlerts: false,
      dailyReports: false,
      weeklyReports: true,
      emailRecipients: "admin@minhaempresa.com, gerente@minhaempresa.com",
    },
  });
  
  // Configurar formulário para configurações de aparência
  const appearanceForm = useForm<AppearanceSettingsValues>({
    resolver: zodResolver(appearanceSettingsSchema),
    defaultValues: {
      theme: theme === "light" || theme === "dark" || theme === "system" 
        ? theme 
        : "system",
    },
  });

  // Funções para lidar com submissão dos formulários
  const onSubmitGeneral = (data: GeneralSettingsValues) => {
    console.log("Configurações gerais:", data);
    toast({
      title: "Configurações salvas",
      description: "As configurações gerais foram atualizadas com sucesso.",
    });
  };

  const onSubmitNotifications = (data: NotificationsSettingsValues) => {
    console.log("Configurações de notificações:", data);
    toast({
      title: "Configurações salvas",
      description: "As configurações de notificações foram atualizadas com sucesso.",
    });
  };
  
  const onSubmitAppearance = (data: AppearanceSettingsValues) => {
    console.log("Configurações de aparência:", data);
    
    // Atualizar tema
    setTheme(data.theme);
    
    toast({
      title: "Tema atualizado",
      description: "O tema foi atualizado com sucesso.",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-800">
          Configurações
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure informações básicas sobre sua empresa e preferências do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form
                  onSubmit={generalForm.handleSubmit(onSubmitGeneral)}
                  className="space-y-6"
                >
                  <FormField
                    control={generalForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4 border p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium">Telefones</h3>
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const currentPhones = generalForm.getValues("phones") || [];
                            generalForm.setValue("phones", [
                              ...currentPhones, 
                              { number: "", isWhatsapp: false }
                            ]);
                          }}
                        >
                          Adicionar
                        </Button>
                      </div>
                      
                      {generalForm.watch("phones")?.map((_, index) => (
                        <div key={index} className="flex items-end gap-2">
                          <FormField
                            control={generalForm.control}
                            name={`phones.${index}.number`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>{`Telefone ${index + 1}`}</FormLabel>
                                <FormControl>
                                  <Input placeholder="(00) 00000-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={generalForm.control}
                            name={`phones.${index}.isWhatsapp`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 h-10">
                                <FormControl>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                    <FormLabel className="cursor-pointer">
                                      WhatsApp
                                    </FormLabel>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const currentPhones = generalForm.getValues("phones");
                              generalForm.setValue(
                                "phones",
                                currentPhones.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                      ))}
                      
                      {(!generalForm.watch("phones") || generalForm.watch("phones").length === 0) && (
                        <div className="text-center py-2 text-muted-foreground">
                          Nenhum telefone cadastrado. Clique em "Adicionar" para incluir um número.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 border p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="address.cep"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <Input placeholder="12345-678" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rua</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da rua" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="address.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="address.district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do bairro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="address.complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input placeholder="Apto, Bloco, etc" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="UF" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moeda</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Código da moeda, ex: BRL, USD, EUR
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="minStockAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Alertas de Estoque Mínimo
                          </FormLabel>
                          <FormDescription>
                            Receber alertas quando produtos atingirem o estoque mínimo
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Salvar Configurações</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Aparência</CardTitle>
              <CardDescription>
                Escolha o tema e as cores para personalizar a aparência do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appearanceForm}>
                <form
                  onSubmit={appearanceForm.handleSubmit(onSubmitAppearance)}
                  className="space-y-6"
                >
                  <FormField
                    control={appearanceForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tema" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="system">Sistema</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Escolha entre tema claro, escuro ou use as configurações do sistema.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <h3 className="text-base font-medium mb-2">Visualização do tema</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <div>
                          <p>Modo: {appearanceForm.watch("theme") === "system" ? "Sistema" : appearanceForm.watch("theme") === "dark" ? "Escuro" : "Claro"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="default" size="sm">Botão Primário</Button>
                        <Button variant="outline" size="sm">Botão Secundário</Button>
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Aplicar Tema</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Gerencie como e quando você recebe notificações do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form
                  onSubmit={notificationsForm.handleSubmit(onSubmitNotifications)}
                  className="space-y-6"
                >
                  <FormField
                    control={notificationsForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Notificações por Email
                          </FormLabel>
                          <FormDescription>
                            Receber notificações importantes por email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="lowStockAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Alertas de Estoque Baixo
                          </FormLabel>
                          <FormDescription>
                            Notificar quando produtos atingirem estoque mínimo
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={notificationsForm.control}
                    name="stockExpiryAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Alertas de Validade
                          </FormLabel>
                          <FormDescription>
                            Notificar sobre produtos próximos da data de validade
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={notificationsForm.control}
                      name="dailyReports"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Relatórios Diários
                            </FormLabel>
                            <FormDescription>
                              Receber resumo diário por email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={notificationsForm.control}
                      name="weeklyReports"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Relatórios Semanais
                            </FormLabel>
                            <FormDescription>
                              Receber resumo semanal por email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={notificationsForm.control}
                    name="emailRecipients"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destinatários dos Emails</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Adicione emails separados por vírgula"
                          />
                        </FormControl>
                        <FormDescription>
                          Lista de emails que receberão as notificações
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Salvar Configurações</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Adicione, edite e remova usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              <div className="text-center">
                <i className="fas fa-users text-gray-300 text-6xl mb-4"></i>
                <h3 className="text-lg font-medium mb-2">Módulo em Desenvolvimento</h3>
                <p className="text-gray-500 mb-4">
                  O gerenciamento de usuários estará disponível em breve.
                </p>
                <Button variant="outline" disabled>
                  Adicionar Usuário
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup e Restauração</CardTitle>
              <CardDescription>
                Faça backup dos seus dados ou restaure a partir de um backup anterior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Backup do Sistema</h3>
                  <p className="text-gray-500 mb-4">
                    Crie um backup completo dos dados do sistema. Recomendamos fazer
                    backups regulares para evitar perda de dados.
                  </p>
                  <Button>
                    <i className="fas fa-download mr-2"></i>
                    Iniciar Backup
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Backups Automáticos</h3>
                  <p className="text-gray-500 mb-4">
                    Configure backups automáticos diários, semanais ou mensais.
                  </p>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch id="auto-backup" />
                    <label
                      htmlFor="auto-backup"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ativar backup automático
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    O próximo backup automático está agendado para 01/01/2024 às 00:00
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Restaurar Backup</h3>
                  <p className="text-gray-500 mb-4">
                    Restaure o sistema a partir de um arquivo de backup anterior.
                    Atenção: todos os dados atuais serão substituídos.
                  </p>
                  <div className="flex flex-col space-y-4">
                    <Input type="file" className="max-w-sm" />
                    <Button variant="outline" className="max-w-sm">
                      <i className="fas fa-upload mr-2"></i>
                      Restaurar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <p className="text-sm text-gray-500">
                <i className="fas fa-info-circle mr-2"></i>
                Os backups são armazenados de forma segura e incluem todos os dados do
                sistema.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
