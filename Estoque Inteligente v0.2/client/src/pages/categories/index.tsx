import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CategoryTable from "@/components/categories/category-table";
import CategoryForm from "@/components/categories/category-form";

export default function Categories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Buscar categorias
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Filtrar categorias com base no termo de busca
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Preparar categorias em formato de árvore para exibição hierárquica
  const categoriesTree = filteredCategories.filter(
    (category) => !category.parentId
  );

  // Função para encontrar subcategorias
  const findSubcategories = (parentId: number) => {
    return filteredCategories.filter(
      (category) => category.parentId === parentId
    );
  };

  // Abrir modal para criar nova categoria
  const handleNewCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  // Abrir modal para editar categoria existente
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  // Mutation para excluir categoria
  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message || "Não foi possível excluir a categoria. Ela pode estar sendo usada por produtos ou subcategorias.",
        variant: "destructive",
      });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-800">Categorias</h2>
        <Button
          onClick={handleNewCategory}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <i className="fas fa-plus mr-2"></i>Nova Categoria
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <Input
                type="text"
                className="pl-10"
                placeholder="Buscar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <CategoryTable
          categories={categoriesTree}
          allCategories={categories}
          findSubcategories={findSubcategories}
          onEdit={handleEditCategory}
          onDelete={(id) => deleteCategory.mutate(id)}
          isLoading={isLoading}
        />
      </div>

      {/* Modal para criar/editar categoria */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
          </DialogHeader>

          <CategoryForm
            category={editingCategory}
            categories={categories}
            onSuccess={() => {
              setIsDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
            }}
          />

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
