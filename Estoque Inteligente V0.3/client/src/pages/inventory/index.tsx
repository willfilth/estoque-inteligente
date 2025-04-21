import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertProductSchema, Product, Category, Supplier } from '@shared/schema';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Estendendo o schema de inserção do produto com validações adicionais
const formSchema = insertProductSchema.extend({
  // Confirme que os campos numéricos são parseados corretamente
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: "Preço deve ser um número" })
      .min(0, "O preço deve ser maior ou igual a zero")
  ),
  cost: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: "Custo deve ser um número" })
      .min(0, "O custo deve ser maior ou igual a zero")
      .optional()
  ),
  quantity: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: "Quantidade deve ser um número" })
      .min(0, "A quantidade deve ser maior ou igual a zero")
  ),
  minQuantity: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number({ invalid_type_error: "Quantidade mínima deve ser um número" })
      .min(0, "A quantidade mínima deve ser maior ou igual a zero")
      .optional()
  ),
  // Atualizado para garantir conversão de string para number
  categoryId: z.union([
    z.string().transform(val => val === '' ? undefined : Number(val)),
    z.number(),
    z.undefined()
  ]).optional(),
  
  // Atualizado para garantir conversão de string para number
  supplierId: z.union([
    z.string().transform(val => val === '' ? undefined : Number(val)),
    z.number(),
    z.undefined()
  ]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Inventory: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Buscar produtos
  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Buscar categorias
  const { data: categories = [], isLoading: loadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Buscar fornecedores
  const { data: suppliers = [], isLoading: loadingSuppliers } = useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  // Formulário de produto
  const productForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      sku: '',
      price: 0,
      cost: undefined,
      quantity: 0,
      minQuantity: undefined,
      categoryId: undefined,
      supplierId: undefined,
    },
  });

  // Formulário de categoria
  const categoryForm = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Nome da categoria é obrigatório"),
        description: z.string().optional(),
      })
    ),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Formulário de fornecedor
  const supplierForm = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, "Nome do fornecedor é obrigatório"),
        cnpj: z.string().optional(),
        contact: z.string().optional(),
        email: z.string().email("Email inválido").optional().or(z.literal('')),
        phone: z.string().optional(),
      })
    ),
    defaultValues: {
      name: '',
      cnpj: '',
      contact: '',
      email: '',
      phone: '',
    },
  });

  // Mutação para criar/editar produto
  const productMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (editingId) {
        return apiRequest("PUT", `/api/products/${editingId}`, data);
      } else {
        return apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: editingId 
          ? "Produto atualizado com sucesso!" 
          : "Produto adicionado com sucesso!",
      });
      setProductModalOpen(false);
      setEditingId(null);
      productForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar o produto.",
        variant: "destructive",
      });
    }
  });

  // Mutação para criar/editar categoria
  const categoryMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingId) {
        return apiRequest("PUT", `/api/categories/${editingId}`, data);
      } else {
        return apiRequest("POST", "/api/categories", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: editingId 
          ? "Categoria atualizada com sucesso!" 
          : "Categoria adicionada com sucesso!",
      });
      setCategoryModalOpen(false);
      setEditingId(null);
      categoryForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar a categoria.",
        variant: "destructive",
      });
    }
  });

  // Mutação para criar/editar fornecedor
  const supplierMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingId) {
        return apiRequest("PUT", `/api/suppliers/${editingId}`, data);
      } else {
        return apiRequest("POST", "/api/suppliers", data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: editingId 
          ? "Fornecedor atualizado com sucesso!" 
          : "Fornecedor adicionado com sucesso!",
      });
      setSupplierModalOpen(false);
      setEditingId(null);
      supplierForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/suppliers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar o fornecedor.",
        variant: "destructive",
      });
    }
  });

  // Editar produto
  const editProduct = (product: Product) => {
    setEditingId(product.id);
    productForm.reset({
      name: product.name,
      description: product.description || '',
      sku: product.sku || '',
      price: product.price,
      cost: product.cost || undefined,
      quantity: product.quantity,
      minQuantity: product.minQuantity || undefined,
      categoryId: product.categoryId || undefined,
      supplierId: product.supplierId || undefined,
    });
    setProductModalOpen(true);
  };

  // Editar categoria
  const editCategory = (category: Category) => {
    setEditingId(category.id);
    categoryForm.reset({
      name: category.name,
      description: category.description || '',
    });
    setCategoryModalOpen(true);
  };

  // Editar fornecedor
  const editSupplier = (supplier: Supplier) => {
    setEditingId(supplier.id);
    supplierForm.reset({
      name: supplier.name,
      cnpj: supplier.cnpj || '',
      contact: supplier.contact || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
    });
    setSupplierModalOpen(true);
  };

  // Formatar o preço para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value / 100); // Considerando que o preço está armazenado em centavos
  };

  // Encontrar o nome da categoria pelo ID
  const getCategoryName = (id: number) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : '-';
  };

  // Encontrar o nome do fornecedor pelo ID
  const getSupplierName = (id: number) => {
    const supplier = suppliers.find(sup => sup.id === id);
    return supplier ? supplier.name : '-';
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 border-b w-full justify-start rounded-none">
          <TabsTrigger 
            value="products"
            className="pb-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Produtos
          </TabsTrigger>
          <TabsTrigger 
            value="categories"
            className="pb-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Categorias
          </TabsTrigger>
          <TabsTrigger 
            value="suppliers"
            className="pb-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Fornecedores
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Produtos</CardTitle>
              <Button 
                onClick={() => {
                  setEditingId(null);
                  productForm.reset({
                    name: '',
                    description: '',
                    sku: '',
                    price: 0,
                    cost: undefined,
                    quantity: 0,
                    minQuantity: undefined,
                    categoryId: undefined,
                    supplierId: undefined,
                  });
                  setProductModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </CardHeader>
            <CardContent>
              {loadingProducts ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.
                </div>
              ) : (
                <div className="table-container rounded-md border">
                  <Table className="data-table">
                    <TableHeader className="table-head">
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Fornecedor</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="table-row">
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku || '-'}</TableCell>
                          <TableCell>{product.categoryId ? getCategoryName(product.categoryId) : '-'}</TableCell>
                          <TableCell>{product.supplierId ? getSupplierName(product.supplierId) : '-'}</TableCell>
                          <TableCell>{formatCurrency(product.price)}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Categorias</CardTitle>
              <Button
                onClick={() => {
                  setEditingId(null);
                  categoryForm.reset({
                    name: '',
                    description: '',
                  });
                  setCategoryModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Categoria
              </Button>
            </CardHeader>
            <CardContent>
              {loadingCategories ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhuma categoria cadastrada. Clique em "Adicionar Categoria" para começar.
                </div>
              ) : (
                <div className="table-container rounded-md border">
                  <Table className="data-table">
                    <TableHeader className="table-head">
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id} className="table-row">
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description || '-'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editCategory(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="mt-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fornecedores</CardTitle>
              <Button
                onClick={() => {
                  setEditingId(null);
                  supplierForm.reset({
                    name: '',
                    cnpj: '',
                    contact: '',
                    email: '',
                    phone: '',
                  });
                  setSupplierModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Fornecedor
              </Button>
            </CardHeader>
            <CardContent>
              {loadingSuppliers ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum fornecedor cadastrado. Clique em "Adicionar Fornecedor" para começar.
                </div>
              ) : (
                <div className="table-container rounded-md border">
                  <Table className="data-table">
                    <TableHeader className="table-head">
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suppliers.map((supplier) => (
                        <TableRow key={supplier.id} className="table-row">
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>{supplier.cnpj || '-'}</TableCell>
                          <TableCell>{supplier.contact || '-'}</TableCell>
                          <TableCell>{supplier.email || '-'}</TableCell>
                          <TableCell>{supplier.phone || '-'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editSupplier(supplier)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Produto */}
      <Dialog open={productModalOpen} onOpenChange={setProductModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
          </DialogHeader>
          
          <Form {...productForm}>
            <form onSubmit={productForm.handleSubmit((data) => productMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={productForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          required
                          min="0"
                          step="1"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="minQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade Mínima</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          min="0"
                          step="1"
                          onChange={(e) => field.onChange(e.target.value)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'none' ? undefined : Number(value))}
                        value={field.value?.toString() || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'none' ? undefined : Number(value))}
                        value={field.value?.toString() || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um fornecedor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhum</SelectItem>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={productForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={productMutation.isPending}
                >
                  {productMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Categoria */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Categoria' : 'Adicionar Categoria'}</DialogTitle>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit((data) => categoryMutation.mutate(data))} className="space-y-4">
              <FormField
                control={categoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={categoryMutation.isPending}
                >
                  {categoryMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Fornecedor */}
      <Dialog open={supplierModalOpen} onOpenChange={setSupplierModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Fornecedor' : 'Adicionar Fornecedor'}</DialogTitle>
          </DialogHeader>
          
          <Form {...supplierForm}>
            <form onSubmit={supplierForm.handleSubmit((data) => supplierMutation.mutate(data))} className="space-y-4">
              <FormField
                control={supplierForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={supplierForm.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={supplierForm.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={supplierForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={supplierForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={supplierMutation.isPending}
                >
                  {supplierMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
