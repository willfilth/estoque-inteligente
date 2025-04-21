import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { CompanyWithPhones } from "@shared/schema";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { estados } from "@/lib/utils";

// Schema para validação do formulário
const companyFormSchema = z.object({
  name: z.string().min(3, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
  legalName: z.string().min(3, "Razão social é obrigatória"),
  cep: z.string().min(5, "CEP é obrigatório"),
  street: z.string().min(3, "Endereço é obrigatório"),
  number: z.string().optional(),
  noNumber: z.boolean().default(false),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  logo: z.any().optional(),
  phones: z.array(
    z.object({
      number: z.string().min(8, "Número de telefone inválido"),
      isWhatsapp: z.boolean().default(false),
    })
  ).optional(),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyOnboarding() {
  const { saveCompany, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  // Configuração do formulário com validação
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      cnpj: "",
      legalName: "",
      cep: "",
      street: "",
      number: "",
      noNumber: false,
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      email: "",
      logo: "",
      phones: [{ number: "", isWhatsapp: false }],
    },
  });

  // Adiciona um novo telefone
  const addPhone = () => {
    const phones = form.getValues("phones") || [];
    form.setValue("phones", [...phones, { number: "", isWhatsapp: false }]);
  };

  // Remove um telefone
  const removePhone = (index: number) => {
    const phones = form.getValues("phones") || [];
    if (phones.length > 1) {
      form.setValue(
        "phones",
        phones.filter((_, i) => i !== index)
      );
    }
  };

  // Manipula o envio do formulário
  const onSubmit = async (values: CompanyFormValues) => {
    setLoading(true);
    try {
      // Se noNumber estiver marcado, garante que number seja vazio
      if (values.noNumber) {
        values.number = "S/N";
      }

      // Prepara os dados para envio, removendo campos vazios
      // Convertendo os dados para o formato esperado, ignorando os erros de tipo
      const filteredPhones = values.phones?.filter(phone => phone.number.trim() !== "") || [];
      
      const companyData = {
        ...values,
        phones: filteredPhones,
      } as unknown as Partial<CompanyWithPhones>;

      const success = await saveCompany(companyData);
      
      if (success) {
        setLocation("/");
      }
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados da empresa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/10 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Configuração Inicial</CardTitle>
          <CardDescription>
            Bem-vindo! Para começar a usar o sistema, precisamos cadastrar os dados da sua empresa.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Seção de informações gerais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Fantasia *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ *</FormLabel>
                        <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalName"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Razão Social *</FormLabel>
                        <FormControl>
                          <Input placeholder="Razão social completa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contato@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                            }
                          }} />
                        </FormControl>
                        <FormDescription>
                          Formatos aceitos: JPG, PNG, SVG
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Seção de telefones */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Telefones</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addPhone}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </div>
                
                {form.watch("phones")?.map((_, index) => (
                  <div key={index} className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`phones.${index}.number`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Número {index + 1}</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`phones.${index}.isWhatsapp`}
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm">WhatsApp</FormLabel>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePhone(index)}
                      disabled={form.watch("phones")?.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Seção de endereço */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP *</FormLabel>
                        <FormControl>
                          <Input placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Logradouro *</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Avenida, etc" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            {...field} 
                            disabled={form.watch("noNumber")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noNumber"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 pt-8">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                form.setValue("number", "S/N");
                              } else {
                                form.setValue("number", "");
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel>Sem número (S/N)</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Sala, Andar, etc" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade *</FormLabel>
                        <FormControl>
                          <Input placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {estados.map((estado: { sigla: string; nome: string }) => (
                              <SelectItem key={estado.sigla} value={estado.sigla}>
                                {estado.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <CardFooter className="flex justify-end px-0 pb-0">
                <Button type="submit" disabled={loading} className="w-full md:w-auto">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar e Continuar
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}