import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/layout/dashboard-card";
import AlertItem from "@/components/layout/alert-item";
import { DashboardData, Product, Alert } from "@/lib/types";
import { useMoneyFormatter } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { format } = useMoneyFormatter();
  
  // Buscar dados do dashboard
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });
  
  // Buscar produtos recentes (últimos adicionados)
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Obter os produtos mais recentes
  const recentProducts = products
    ? [...products]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3)
    : [];
  
  if (isLoadingDashboard || isLoadingProducts) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-800">Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-sm">
            <i className="fas fa-download mr-2"></i>Exportar
          </Button>
          <Button variant="default" className="text-sm">
            <i className="fas fa-sync-alt mr-2"></i>Atualizar
          </Button>
        </div>
      </div>

      {/* Cards do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Total de Produtos"
          value={dashboardData?.totalProducts || 0}
          icon="fa-boxes"
          change="12%"
          changeType="increase"
          borderColor="border-primary-500"
          iconBackground="bg-primary-50"
          iconColor="text-primary-500"
        />
        
        <DashboardCard
          title="Valor em Estoque"
          value={format(dashboardData?.stockValue)}
          icon="fa-dollar-sign"
          change="8%"
          changeType="increase"
          borderColor="border-warning-500"
          iconBackground="bg-warning-100"
          iconColor="text-warning-500"
        />
        
        <DashboardCard
          title="Itens com Estoque Baixo"
          value={dashboardData?.lowStockCount || 0}
          icon="fa-exclamation-triangle"
          change="3"
          changeType="increase"
          borderColor="border-alert-500"
          iconBackground="bg-alert-100"
          iconColor="text-alert-500"
        />
        
        <DashboardCard
          title="Vendas Recentes"
          value={dashboardData?.recentSales || 0}
          icon="fa-shopping-cart"
          change="5%"
          changeType="increase"
          borderColor="border-secondary-500"
          iconBackground="bg-secondary-50"
          iconColor="text-secondary-500"
        />
      </div>

      {/* Gráfico e Lista de Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-heading font-semibold">Movimentação de Estoque</h3>
          </div>
          <div className="p-4" style={{ height: "300px" }}>
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Gráfico de movimentação de estoque</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-heading font-semibold">Alertas de Estoque</h3>
            {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
              <span className="bg-alert-500 text-white text-xs px-2 py-1 rounded-full">
                {dashboardData.alerts.length} {dashboardData.alerts.length === 1 ? 'novo' : 'novos'}
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-200">
            {dashboardData?.alerts && dashboardData.alerts.length > 0 ? (
              dashboardData.alerts.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                Nenhum alerta no momento
              </div>
            )}
            <div className="p-4 text-center">
              <Button variant="link" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                Ver todos os alertas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Produtos Recentes */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-heading font-semibold">Produtos Recentes</h3>
          <Link href="/products">
            <Button variant="link" className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Ver todos
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProducts.length > 0 ? (
                recentProducts.map(product => (
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
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">-</div>
                      <div className="text-sm text-gray-500">-</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock} unidades</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{format(product.salePrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock <= 0 ? "bg-gray-100 text-gray-500" :
                        product.stock < product.minStock ? "bg-alert-100 text-alert-500" :
                        product.stock < product.minStock * 2 ? "bg-warning-100 text-warning-500" :
                        "bg-success-100 text-success-500"
                      }`}>
                        {product.stock <= 0 ? "Sem Estoque" :
                         product.stock < product.minStock ? "Estoque Crítico" :
                         product.stock < product.minStock * 2 ? "Estoque Baixo" :
                         "Disponível"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/products/edit/${product.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-800 mr-3">
                          <i className="fas fa-edit"></i>
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-alert-500 hover:text-alert-700">
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Nenhum produto recente encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
