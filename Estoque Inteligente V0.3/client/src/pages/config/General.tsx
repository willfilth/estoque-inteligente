import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone as PhoneIcon, Upload, Plus, Trash2 } from 'lucide-react';
import { useCep } from '@/hooks/use-cep';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertCompanySchema } from '@shared/schema';
import CompanyInfoModal from '@/components/layout/CompanyInfoModal';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Estendendo o schema de inserção da empresa com validações adicionais
const formSchema = insertCompanySchema.extend({
  // Garantindo que CNPJ tem o formato correto
  cnpj: z.string().min(18, 'CNPJ é obrigatório').max(18, 'CNPJ inválido'),
  // Garantindo que CEP tem o formato correto
  zipCode: z.string().min(9, 'CEP é obrigatório').max(9, 'CEP inválido'),
  // Garantir que pelo menos um telefone é cadastrado
  phones: z.array(
    z.object({
      number: z.string().min(1, 'Telefone obrigatório'),
      isWhatsapp: z.boolean().default(false),
    })
  ).min(1, 'Pelo menos um telefone deve ser cadastrado'),
  // Campo para arquivo (não persiste no banco, apenas para upload)
  logoFile: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const General: React.FC = () => {
  const { toast } = useToast();
  const { addressData, loading: loadingCep, error: cepError, fetchAddress } = useCep();
  const [modalOpen, setModalOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Buscar dados da empresa
  const { data: company, isLoading } = useQuery({
    queryKey: ['/api/company'],
  });

  // Formulário com validação
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      legalName: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      city: '',
      state: '',
      email: '',
      phones: [{ number: '', isWhatsapp: false }],
      logo: '',
    },
  });

  // Preencher o formulário quando os dados da empresa forem carregados
  useEffect(() => {
    if (company) {
      form.reset({
        ...company,
        logoFile: undefined
      });
      
      if (company.logo) {
        setLogoPreview(company.logo);
      }
    }
  }, [company, form]);

  // Quando o CEP é alterado, busca o endereço
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'zipCode') {
        const zipCode = value.zipCode as string;
        if (zipCode && zipCode.length === 9) {
          fetchAddress(zipCode);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, fetchAddress]);

  // Quando o endereço é carregado, preenche os campos
  useEffect(() => {
    if (addressData) {
      form.setValue('street', addressData.logradouro || '');
      form.setValue('city', addressData.localidade || '');
      form.setValue('state', addressData.uf || '');
      
      // Focus no campo número após preencher o endereço
      if (addressData.logradouro) {
        const numberField = document.getElementById('number');
        if (numberField) {
          numberField.focus();
        }
      }
    }
  }, [addressData, form]);

  // Mutação para salvar empresa
  const saveMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Se tem um arquivo de logo, primeiro faz upload
      let logoUrl = data.logo;
      
      if (data.logoFile && data.logoFile instanceof FileList && data.logoFile.length > 0) {
        const file = data.logoFile[0];
        // Em um cenário real, faria upload do arquivo para um servidor
        // Como é apenas mock, cria uma URL de dados
        logoUrl = await convertFileToBase64(file);
      }
      
      // Remover o campo de arquivo do payload
      const { logoFile, ...payload } = data;
      
      // Enviar os dados para a API
      return apiRequest("POST", "/api/company", { 
        ...payload, 
        logo: logoUrl 
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Dados da empresa salvos com sucesso!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/company'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar os dados da empresa.",
        variant: "destructive",
      });
    }
  });

  // Formatador de CNPJ
  const formatCNPJ = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a máscara de CNPJ: 00.000.000/0000-00
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 5) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2)}`;
    } else if (numericValue.length <= 8) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5)}`;
    } else if (numericValue.length <= 12) {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8)}`;
    } else {
      return `${numericValue.slice(0, 2)}.${numericValue.slice(2, 5)}.${numericValue.slice(5, 8)}/${numericValue.slice(8, 12)}-${numericValue.slice(12, 14)}`;
    }
  };

  // Formatador de CEP
  const formatCEP = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a máscara de CEP: 00000-000
    if (numericValue.length <= 5) {
      return numericValue;
    } else {
      return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
    }
  };

  // Formatador de telefone
  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Aplica a máscara de telefone: (00) 00000-0000 ou (00) 0000-0000
    if (numericValue.length <= 2) {
      return `(${numericValue}`;
    } else if (numericValue.length <= 6) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 10) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    } else {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    }
  };

  // Converter arquivo para Base64 (para preview)
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Manipular upload de logo
  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Verificar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "O arquivo deve ter menos de 2MB",
          variant: "destructive",
        });
        return;
      }
      
      // Verificar tipo
      if (!['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'].includes(file.type)) {
        toast({
          title: "Erro",
          description: "Formato de arquivo não suportado. Use JPG, PNG, SVG ou GIF.",
          variant: "destructive",
        });
        return;
      }
      
      // Criar preview
      const base64 = await convertFileToBase64(file);
      setLogoPreview(base64);
      
      // Armazenar arquivo no formulário
      form.setValue('logoFile', event.target.files);
    }
  };

  // Adicionar telefone
  const addPhone = () => {
    const currentPhones = form.getValues('phones');
    form.setValue('phones', [...currentPhones, { number: '', isWhatsapp: false }]);
  };

  // Remover telefone
  const removePhone = (index: number) => {
    const currentPhones = form.getValues('phones');
    if (currentPhones.length > 1) {
      const updatedPhones = [...currentPhones];
      updatedPhones.splice(index, 1);
      form.setValue('phones', updatedPhones);
    }
  };

  // Enviar formulário
  const onSubmit = (data: FormValues) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Cadastro da Empresa</h2>
          <p className="text-muted-foreground mb-6">* (campos obrigatórios)</p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome da empresa */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa *</FormLabel>
                      <FormControl>
                        <Input {...field} required onDoubleClick={() => setModalOpen(true)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* CNPJ */}
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="00.000.000/0000-00"
                          required
                          onChange={(e) => {
                            const formatted = formatCNPJ(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={18}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Razão Social */}
                <FormField
                  control={form.control}
                  name="legalName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Razão Social</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* CEP */}
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="00000-000"
                          required
                          onChange={(e) => {
                            const formatted = formatCEP(e.target.value);
                            field.onChange(formatted);
                          }}
                          maxLength={9}
                        />
                      </FormControl>
                      {loadingCep && <p className="text-xs text-muted-foreground">Buscando CEP...</p>}
                      {cepError && <p className="text-xs text-destructive">{cepError}</p>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Logradouro */}
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logradouro *</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Número */}
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número *</FormLabel>
                      <FormControl>
                        <Input {...field} id="number" required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Complemento */}
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Cidade */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input {...field} required readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Estado */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <FormControl>
                        <Input {...field} required readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Telefones */}
                <div className="col-span-2">
                  <FormLabel>Telefone *</FormLabel>
                  <div className="space-y-2">
                    {form.getValues('phones').map((_, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name={`phones.${index}.number`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="flex items-center">
                                  <PhoneIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    placeholder="(00) 00000-0000"
                                    required
                                    onChange={(e) => {
                                      const formatted = formatPhone(e.target.value);
                                      field.onChange(formatted);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`phones.${index}.isWhatsapp`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm cursor-pointer">WhatsApp</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removePhone(index)}
                          disabled={form.getValues('phones').length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPhone}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Telefone
                    </Button>
                  </div>
                </div>
                
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Logo da empresa */}
                <div className="col-span-2">
                  <FormLabel>Logo da Empresa</FormLabel>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center border border-border overflow-hidden">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logoUpload')?.click()}
                      >
                        Escolher Arquivo
                      </Button>
                      <input
                        type="file"
                        id="logoUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                      <p className="text-muted-foreground text-xs mt-2">
                        Formatos suportados: JPG, PNG, SVG, GIF. Tamanho máximo: 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botões de ação */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Modal de informações da empresa */}
      <CompanyInfoModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </>
  );
};

export default General;
