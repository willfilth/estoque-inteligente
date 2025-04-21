
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Category, InsertProduct, Product, ProductWithDetails, Supplier } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface InventoryFormProps {
  product: ProductWithDetails | null;
  categories: Category[];
  suppliers: Supplier[];
  onSuccess: () => void;
  onAddCategory?: () => void;
}

const productSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  name: z.string().min(1, "Nome do produto é obrigatório"),
  categoryId: z.coerce.number().min(1, "Selecione uma categoria"),
  supplierId: z.coerce.number().optional(),
  subcategory: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  photo: z.any().optional(),
  quantity: z.coerce.number().min(0, "Quantidade não pode ser negativa"),
  minQuantity: z.coerce.number().min(0, "Quantidade mínima não pode ser negativa"),
  buyPrice: z.coerce.number().min(0.01, "Preço de compra deve ser maior que zero"),
  sellPrice: z.coerce.number().min(0.01, "Preço de venda deve ser maior que zero"),
});

export function InventoryForm({ 
  product, 
  categories,
  suppliers,
  onSuccess,
  onAddCategory
}: InventoryFormProps) {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: "",
      name: "",
      categoryId: 0,
      supplierId: undefined,
      subcategory: "",
      description: "",
      photo: null,
      quantity: 0,
      minQuantity: 1,
      buyPrice: 0,
      sellPrice: 0,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        code: product.code,
        name: product.name,
        categoryId: product.categoryId,
        supplierId: product.supplierId,
        subcategory: product.subcategory || "",
        description: product.description,
        photo: product.photo,
        quantity: product.quantity,
        minQuantity: product.minQuantity,
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
      });
      
      if (product.photo) {
        setPreviewUrl(product.photo);
      }
    }
  }, [product, form]);

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      if (product) {
        return apiRequest("PUT", `/api/products/${product.id}`, formData);
      } else {
        return apiRequest("POST", "/api/products", formData);
      }
    },
    onSuccess: () => {
      toast({
        title: product ? "Produto atualizado" : "Produto criado",
        description: product 
          ? "O produto foi atualizado com sucesso." 
          : "O produto foi adicionado ao estoque.",
        variant: "success",
      });
      form.reset();
      setPreviewUrl(null);
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar produto",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    mutation.mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("photo", file);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">
        {product ? "Editar Produto" : "Adicionar Novo Produto"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código do Produto*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: PROD001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Categoria*</FormLabel>
                    <Select 
                      value={field.value ? field.value.toString() : ""} 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
              {onAddCategory && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={onAddCategory}
                  className="mb-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategoria</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Brincos" />
                  </FormControl>
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
                    value={field.value?.toString() || ""} 
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um fornecedor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
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
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Produto*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descreva o produto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto do Produto</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {previewUrl && (
                        <div className="relative w-20 h-20">
                          <img 
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-md cursor-pointer"
                            onClick={() => setShowImagePreview(true)}
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade em Estoque*</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="minQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estoque Mínimo*</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="buyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Compra (R$)*</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sellPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor de Venda (R$)*</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                form.reset();
                setPreviewUrl(null);
                onSuccess();
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Salvando...
                </span>
              ) : (
                product ? "Atualizar Produto" : "Salvar Produto"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          {previewUrl && (
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-full object-contain"
              onClick={() => setShowImagePreview(false)}
            />
          )}
        </div>
      </Dialog>
    </div>
  );
}
