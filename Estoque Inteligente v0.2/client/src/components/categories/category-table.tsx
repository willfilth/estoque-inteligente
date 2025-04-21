import { useState } from "react";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CategoryTableProps {
  categories: Category[];
  allCategories: Category[];
  findSubcategories: (parentId: number) => Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export default function CategoryTable({
  categories,
  allCategories,
  findSubcategories,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryTableProps) {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Alternar expansão da categoria
  const toggleExpand = (categoryId: number) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter((id) => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  // Verificar se a categoria tem subcategorias
  const hasSubcategories = (categoryId: number) => {
    return allCategories.some((cat) => cat.parentId === categoryId);
  };

  // Renderizar linha da categoria
  const renderCategoryRow = (category: Category, level = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const subcategories = findSubcategories(category.id);
    const hasChildren = subcategories.length > 0;

    return (
      <div key={category.id}>
        <div
          className={`flex items-center justify-between p-4 ${
            level > 0 ? "pl-8 bg-gray-50" : ""
          } hover:bg-gray-100`}
        >
          <div className="flex items-center">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="mr-2 text-gray-600 hover:text-gray-900"
              >
                <i
                  className={`fas ${
                    isExpanded ? "fa-chevron-down" : "fa-chevron-right"
                  }`}
                ></i>
              </button>
            )}
            <div className="ml-2">
              <p className="font-medium">{category.name}</p>
              {category.description && (
                <p className="text-sm text-gray-500">{category.description}</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary-600 hover:text-primary-800"
              onClick={() => onEdit(category)}
            >
              <i className="fas fa-edit"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-alert-500 hover:text-alert-700"
              onClick={() => setCategoryToDelete(category)}
            >
              <i className="fas fa-trash"></i>
            </Button>
          </div>
        </div>

        {/* Subcategorias */}
        {isExpanded && hasChildren && (
          <div className="border-l-2 border-gray-200 ml-6">
            {subcategories.map((subcat) => renderCategoryRow(subcat, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-gray-200">
        {categories.length > 0 ? (
          categories.map((category) => renderCategoryRow(category))
        ) : (
          <div className="p-6 text-center text-gray-500">
            Nenhuma categoria encontrada. Clique em "Nova Categoria" para adicionar.
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "{categoryToDelete?.name}"?
              {hasSubcategories(categoryToDelete?.id || 0) && (
                <div className="mt-2 text-alert-500">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Esta categoria possui subcategorias. A exclusão só será possível se remover primeiro as subcategorias.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (categoryToDelete) {
                  onDelete(categoryToDelete.id);
                  setCategoryToDelete(null);
                }
              }}
              className="bg-alert-500 hover:bg-alert-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
