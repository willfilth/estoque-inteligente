import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryForm } from "@/components/inventory/inventory-form";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { 
  Box, Package, DollarSign, AlertTriangle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Product, ProductWithDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { exportToExcel } from "@/lib/excel-export";
import { exportToPDF } from "@/lib/pdf-export";
import { Badge } from "@/components/ui/badge";

export default function Inventory() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    code: "",
    category: "",
    supplier: "",
    stock: "",
  });
  const [editingProduct, setEditingProduct] = useState<ProductWithDetails | null>(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  
  // Fetch products
  const { 
    data: products = [], 
    isLoading 
  } = useQuery<ProductWithDetails[]>({
    queryKey: ["/api/products"],
  });

  // Fetch categories for dropdown
  const { 
    data: categories = [] 
  } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Fetch suppliers for dropdown
  const { 
    data: suppliers = [] 
  } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  // Apply filters
  const filteredProducts = products.filter((product) => {
    const matchesCode = filters.code 
      ? product.code.toLowerCase().includes(filters.code.toLowerCase()) || 
        product.name.toLowerCase().includes(filters.code.toLowerCase())
      : true;
    
    const matchesCategory = filters.category 
      ? product.categoryId === parseInt(filters.category)
      : true;
    
    const matchesSupplier = filters.supplier 
      ? product.supplierId === parseInt(filters.supplier)
      : true;
    
    const matchesStock = filters.stock 
      ? (filters.stock === "low" && product.quantity <= product.minQuantity) ||
        (filters.stock === "normal" && product.quantity > product.minQuantity)
      : true;
    
    return matchesCode && matchesCategory && matchesSupplier && matchesStock;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // Calculate summary data
  const totalItems = filteredProducts.length;
  const totalValue = filteredProducts.reduce(
    (sum, product) => sum + product.quantity * product.buyPrice,
    0
  );
  const lowStockItems = filteredProducts.filter(
    (product) => product.quantity <= product.minQuantity
  ).length;

  // Handle export
  const handleExportToExcel = () => {
    exportToExcel(
      filteredProducts,
      "Inventário",
      ["Código", "Nome", "Categoria", "Fornecedor", "Tamanho", "Qtd", "Mínimo", "Preço Compra", "Preço Venda", "Total"],
      [
        "code", 
        "name", 
        "category", 
        "supplier", 
        "size", 
        "quantity", 
        "minQuantity", 
        "buyPrice", 
        "sellPrice", 
        (row: ProductWithDetails) => row.quantity * row.buyPrice
      ]
    );
  };

  const handleExportToPDF = () => {
    exportToPDF(
      filteredProducts,
      "Inventário",
      ["Código", "Nome", "Categoria", "Qtd", "Preço Compra", "Preço Venda", "Total"],
      [
        "code", 
        "name", 
        "category", 
        "quantity", 
        (row: ProductWithDetails) => formatCurrency(row.buyPrice),
        (row: ProductWithDetails) => formatCurrency(row.sellPrice),
        (row: ProductWithDetails) => formatCurrency(row.quantity * row.buyPrice)
      ]
    );
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleEditProduct = (product: ProductWithDetails) => {
    setEditingProduct(product);
    // Scroll to form
    document.getElementById("itemForm")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-6">
          <InventoryFilters 
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            suppliers={suppliers}
            onNewItem={() => {
              setEditingProduct(null);
              document.getElementById("itemForm")?.scrollIntoView({ behavior: "smooth" });
            }}
            onExportExcel={handleExportToExcel}
            onExportPDF={handleExportToPDF}
          />
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total de Itens</p>
                <p className="text-xl font-bold mt-1">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Itens em Estoque Baixo</p>
                <p className="text-xl font-bold mt-1">{lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <InventoryTable 
        products={paginatedProducts}
        isLoading={isLoading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        pagination={{
          page,
          totalPages,
          totalItems: filteredProducts.length,
          setPage,
        }}
      />

      {/* Product Form */}
      <Card id="itemForm">
        <CardContent className="p-6">
          <InventoryForm 
            categories={categories}
            suppliers={suppliers}
            product={editingProduct}
            onSuccess={() => {
              setEditingProduct(null);
              queryClient.invalidateQueries({ queryKey: ["/api/products"] });
              queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
