import { useEffect, useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { productFormSchema } from "@shared/schema";
import { z } from "zod";
import { Product, Category, Supplier } from "@/lib/types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CategoryModal from "@/components/categories/category-modal";
import { Card, CardContent } from "@/components/ui/card";

interface ProductFormProps {
  productId?: number;
}

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductForm({ productId }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const isEditMode = !!productId;

  // Buscar dados do produto se estiver no modo de edição
  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: isEditMode,
  });

  // Buscar categorias
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Buscar fornecedores
  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  // Configurar formulário com validação
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      description: "",
      stock: 0,
      minStock: 5,
      costPrice: 0,
      salePrice: 0,
    },
  });

  // Preencher o formulário com os dados do produto quando estiver disponível
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode || "",
        description: product.description || "",
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        stock: product.stock,
        minStock: product.minStock,
        costPrice: product.costPrice || 0,
        salePrice: product.salePrice || 0,
      });

      // Se o produto tiver imagens, mostrar as previews
      if (product.imageUrls && product.imageUrls.length > 0) {
        setPreviewUrls(product.imageUrls);
      }
    }
  }, [product, form]);

  // Mutação para criar/atualizar produto
  const saveProduct = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Se estiver editando, faz PUT, senão faz POST
      if (isEditMode) {
        return apiRequest("PUT", `/api/products/${productId}`, data);
      } else {
        return apiRequest("POST", "/api/products", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: isEditMode ? "Produto atualizado" : "Produto criado",
        description: isEditMode
          ? "O produto foi atualizado com sucesso."
          : "O produto foi criado com sucesso.",
      });
      navigate("/products");
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar produto",
        description: error.message || "Ocorreu um erro ao salvar o produto.",
        variant: "destructive",
      });
    },
  });

  // Lidar com o envio do formulário
  const onSubmit = (data: ProductFormValues) => {
    // Criar uma cópia para não modificar o objeto original diretamente
    const formData = { ...data };
    
    // Converter strings para number quando necessário
    if (formData.categoryId && formData.categoryId !== "none") {
      formData.categoryId = Number(formData.categoryId);
    } else {
      // Se for "none" ou outro valor inválido, remover para não causar erro
      delete formData.categoryId;
    }
    
    if (formData.supplierId && formData.supplierId !== "none") {
      formData.supplierId = Number(formData.supplierId);
    } else {
      // Se for "none" ou outro valor inválido, remover para não causar erro
      delete formData.supplierId;
    }

    // Temporariamente, só suporta URLs para imagens
    // Em uma implementação real, aqui faria o upload das imagens para um serviço
    if (previewUrls.length > 0) {
      formData.imageUrls = previewUrls;
    }

    // Log para debug
    console.log("Dados do formulário:", formData);
    
    saveProduct.mutate(formData);
  };

  // Lidar com seleção de arquivos de imagem
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      // Criar URLs temporárias para preview
      const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  // Remover uma imagem da preview
  const removeImage = (index: number) => {
    // Remover da lista de arquivos e previews
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previewUrls];
    
    // Se for uma URL temporária, revogar para evitar vazamentos de memória
    if (newPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };

  // Função auxiliar para mapear categorias
  const getCategoryOptions = () => {
    // Todas as categorias ordenadas
    return categories.map(category => (
      <SelectItem key={category.id} value={category.id.toString()}>
        {category.parentId 
          ? `${categories.find(c => c.id === category.parentId)?.name || ''} > ${category.name}`
          : category.name
        }
      </SelectItem>
    ));
  };

  // Mostrar carregamento enquanto busca os dados do produto
  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do produto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: PROD-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código de Barras</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o código de barras" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Categoria</FormLabel>
                      <CategoryModal 
                        className="h-7 text-xs px-2" 
                        onCategoryAdded={(categoryId) => {
                          field.onChange(categoryId.toString());
                          // Recarregar categorias
                          queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
                        }}
                      />
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Selecione a categoria</SelectItem>
                        {getCategoryOptions()}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Selecione o fornecedor</SelectItem>
                        {suppliers.map(supplier => (
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
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade em Estoque</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Mínimo</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Custo (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de Venda (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a descrição do produto"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormLabel>Imagens do Produto</FormLabel>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <i className="fas fa-image text-gray-400 text-3xl"></i>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Carregar imagens</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                  </div>
                </div>
                
                {previewUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-24 object-cover rounded border border-gray-300"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          onClick={() => removeImage(index)}
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/products")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saveProduct.isPending}>
                {saveProduct.isPending ? (
                  <>
                    <span className="mr-2">
                      <i className="fas fa-spinner fa-spin"></i>
                    </span>
                    Salvando...
                  </>
                ) : (
                  <>Salvar Produto</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
