import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/status-badge";
import { Product, Category, Supplier } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ImageModal from "./image-modal";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  isLoading?: boolean;
}

export default function ProductTable({ products, categories, suppliers, isLoading = false }: ProductTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "-";
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "-";
  };
  
  const getCategoryPath = (categoryId?: number) => {
    if (!categoryId) return [];
    
    const result: string[] = [];
    let currentCategory = categories.find(c => c.id === categoryId);
    
    while (currentCategory) {
      result.unshift(currentCategory.name);
      
      if (currentCategory.parentId) {
        currentCategory = categories.find(c => c.id === currentCategory.parentId);
      } else {
        currentCategory = undefined;
      }
    }
    
    return result;
  };
  
  const getSubcategoryName = (categoryId?: number) => {
    if (!categoryId) return "-";
    
    const category = categories.find(c => c.id === categoryId);
    if (!category || !category.parentId) return "-";
    
    const categoryPath = getCategoryPath(categoryId);
    return categoryPath.length > 1 ? categoryPath[categoryPath.length - 1] : "-";
  };
  
  const getSupplierName = (supplierId?: number) => {
    if (!supplierId) return "-";
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : "-";
  };
  
  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) return "out_of_stock";
    if (product.stock < product.minStock) return "critical";
    if (product.stock < product.minStock * 2) return "low";
    return "available";
  };
  
  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir produto",
        description: error.message || "Ocorreu um erro ao excluir o produto.",
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete.id);
      setProductToDelete(null);
    }
  };
  
  const handleShowImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Carregando produtos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {product.imageUrls && product.imageUrls.length > 0 ? (
                            <img 
                              src={product.imageUrls[0]} 
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover cursor-pointer"
                              onClick={() => handleShowImage(product.imageUrls![0])}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                              <i className="fas fa-image"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getCategoryName(product.categoryId)}</div>
                      <div className="text-sm text-gray-500">{getSubcategoryName(product.categoryId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock} unidades</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.salePrice?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={getStockStatus(product)} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getSupplierName(product.supplierId)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800 mr-2">
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Link href={`/products/edit/${product.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800 mr-2">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-alert-500 hover:text-alert-700"
                        onClick={() => setProductToDelete(product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {products.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{products.length}</span> de <span className="font-medium">{products.length}</span> resultados
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Próximo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-alert-500 hover:bg-alert-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de visualização de imagem */}
      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </>
  );
}
