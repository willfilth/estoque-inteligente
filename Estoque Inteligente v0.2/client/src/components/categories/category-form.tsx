import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/lib/types";
import { categoryFormSchema } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  category: Category | null;
  categories: Category[];
  onSuccess: () => void;
}

export default function CategoryForm({
  category,
  categories,
  onSuccess,
}: CategoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!category;

  // Configurar formulário com validação
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      parentId: category?.parentId ? category.parentId.toString() : undefined,
    },
  });

  // Mutation para criar/atualizar categoria
  const saveCategory = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      // Converter parentId para number se presente e não for "none"
      if (data.parentId && data.parentId !== "none") {
        data.parentId = Number(data.parentId);
      } else {
        // Se for "none", remover para que seja undefined
        delete data.parentId;
      }

      if (isEditMode) {
        return apiRequest("PUT", `/api/categories/${category.id}`, data);
      } else {
        return apiRequest("POST", "/api/categories", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: isEditMode ? "Categoria atualizada" : "Categoria criada",
        description: isEditMode
          ? "A categoria foi atualizada com sucesso."
          : "A categoria foi criada com sucesso.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar categoria",
        description: error.message || "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive",
      });
    },
  });

  // Lidar com o envio do formulário
  const onSubmit = (data: CategoryFormValues) => {
    // Se a categoria está sendo editada e tem o próprio ID como parentId, isso criaria um ciclo
    if (isEditMode && data.parentId && Number(data.parentId) === category.id) {
      toast({
        title: "Erro ao salvar categoria",
        description: "Uma categoria não pode ser pai dela mesma.",
        variant: "destructive",
      });
      return;
    }

    saveCategory.mutate(data);
  };

  // Filtrar categorias para evitar ciclos em edição
  const getAvailableParentCategories = () => {
    if (!isEditMode) return categories;

    // Função recursiva para encontrar todas as subcategorias de uma categoria
    const findAllSubcategories = (categoryId: number): number[] => {
      const directSubcats = categories.filter(c => c.parentId === categoryId);
      if (directSubcats.length === 0) return [];
      
      const subcatIds = directSubcats.map(c => c.id);
      const deeperSubcats = directSubcats.flatMap(c => findAllSubcategories(c.id));
      
      return [...subcatIds, ...deeperSubcats];
    };

    // Obter todas as subcategorias da categoria atual
    const subcategoryIds = findAllSubcategories(category.id);
    
    // Filtrar categorias que não são a categoria atual nem suas subcategorias
    return categories.filter(c => c.id !== category.id && !subcategoryIds.includes(c.id));
  };

  const availableParentCategories = getAvailableParentCategories();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da categoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite uma descrição para a categoria (opcional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria Pai</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria pai (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Nenhuma (categoria principal)</SelectItem>
                  {availableParentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={saveCategory.isPending}>
          {saveCategory.isPending ? (
            <>
              <span className="mr-2">
                <i className="fas fa-spinner fa-spin"></i>
              </span>
              Salvando...
            </>
          ) : (
            <>Salvar Categoria</>
          )}
        </Button>
      </form>
    </Form>
  );
}
