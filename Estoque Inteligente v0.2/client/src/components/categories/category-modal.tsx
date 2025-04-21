import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CategoryForm from "./category-form";
import CategoryTable from "./category-table";
import { Category } from "@/lib/types";

interface CategoryModalProps {
  className?: string;
  onCategoryAdded?: (categoryId: number) => void;
}

export default function CategoryModal({ className, onCategoryAdded }: CategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Buscar categorias
  const { data: categories = [], refetch } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Manipuladores
  const handleSuccess = () => {
    refetch();
    setSelectedCategory(null);
    
    // Se uma categoria for selecionada, chama o callback
    if (selectedCategory && onCategoryAdded) {
      onCategoryAdded(selectedCategory.id);
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/categories/${id}`, { 
        method: "DELETE" 
      });
      refetch();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  // Função para encontrar subcategorias
  const findSubcategories = (parentId: number) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Gerenciar Categorias
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <div>
            <h3 className="text-lg font-medium mb-4">
              {selectedCategory ? "Editar Categoria" : "Adicionar Nova Categoria"}
            </h3>
            <CategoryForm
              category={selectedCategory}
              categories={categories}
              onSuccess={handleSuccess}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Categorias Existentes</h3>
            <CategoryTable
              categories={categories}
              allCategories={categories}
              findSubcategories={findSubcategories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}