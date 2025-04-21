import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, Category, Supplier } from "@/lib/types";
import { useMoneyFormatter } from "@/lib/hooks";

export default function Reports() {
  const { format } = useMoneyFormatter();
  const [reportType, setReportType] = useState("inventory");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");

  // Buscar dados necessários para relatórios
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  // Filtrar produtos com base nos filtros selecionados
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryFilter === "all" || (product.categoryId?.toString() === categoryFilter);
    const matchesSupplier =
      supplierFilter === "all" || (product.supplierId?.toString() === supplierFilter);
    return matchesCategory && matchesSupplier;
  });

  // Calcular estatísticas do relatório
  const calculateStats = () => {
    if (filteredProducts.length === 0) {
      return {
        totalProducts: 0,
        totalValue: 0,
        averagePrice: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      };
    }

    const totalValue = filteredProducts.reduce(
      (acc, product) => acc + (product.salePrice || 0) * product.stock,
      0
    );

    const averagePrice =
      filteredProducts.reduce(
        (acc, product) => acc + (product.salePrice || 0),
        0
      ) / filteredProducts.length;

    const lowStockCount = filteredProducts.filter(
      (product) => product.stock > 0 && product.stock < product.minStock
    ).length;

    const outOfStockCount = filteredProducts.filter(
      (product) => product.stock <= 0
    ).length;

    return {
      totalProducts: filteredProducts.length,
      totalValue,
      averagePrice,
      lowStockCount,
      outOfStockCount,
    };
  };

  const stats = calculateStats();

  // Funções auxiliares para obter nomes
  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "-";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "-";
  };

  const getSupplierName = (supplierId?: number) => {
    if (!supplierId) return "-";
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : "-";
  };

  // Função para exportar o relatório (simplificada)
  const handleExport = () => {
    alert("Função de exportação seria implementada aqui");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-800">
          Relatórios
        </h2>
        <Button onClick={handleExport} variant="outline">
          <i className="fas fa-download mr-2"></i>Exportar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Tipo de Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">Inventário Atual</SelectItem>
                <SelectItem value="low_stock">Estoque Baixo</SelectItem>
                <SelectItem value="value">Valor em Estoque</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Fornecedor</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os fornecedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os fornecedores</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id.toString()}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-200">Total de Produtos</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                <i className="fas fa-boxes text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-200">Valor em Estoque</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {format(stats.totalValue)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning-100 flex items-center justify-center text-warning-500">
                <i className="fas fa-dollar-sign text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-200">Itens com Estoque Baixo</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {stats.lowStockCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-alert-100 flex items-center justify-center text-alert-500">
                <i className="fas fa-exclamation-triangle text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-neutral-200">Preço Médio</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {format(stats.averagePrice)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-500">
                <i className="fas fa-chart-line text-xl"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-heading font-semibold">
            {reportType === "inventory"
              ? "Relatório de Inventário"
              : reportType === "low_stock"
              ? "Relatório de Estoque Baixo"
              : "Relatório de Valor em Estoque"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Filtrar com base no tipo de relatório selecionado */}
              {filteredProducts
                .filter((product) => {
                  if (reportType === "low_stock") {
                    return product.stock < product.minStock;
                  }
                  return true;
                })
                .map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {product.imageUrls && product.imageUrls.length > 0 ? (
                            <img
                              src={product.imageUrls[0]}
                              alt={product.name}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                              <i className="fas fa-image"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCategoryName(product.categoryId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getSupplierName(product.supplierId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock} unidades
                      </div>
                      {product.stock < product.minStock && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-alert-100 text-alert-500">
                          Estoque Baixo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(product.salePrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format((product.salePrice || 0) * product.stock)}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum produto encontrado para os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  );
}
