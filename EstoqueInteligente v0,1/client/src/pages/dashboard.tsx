import { useQuery } from "@tanstack/react-query";
import MetricCard from "@/components/dashboard/metric-card";
import StockSummaryTable from "@/components/dashboard/stock-summary-table";
import RecentSalesTable from "@/components/dashboard/recent-sales-table";
import { PackageSearch, Tags, LineChart, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DashboardSummary } from "@shared/schema";

export default function Dashboard() {
  const [_, navigate] = useLocation();

  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
          <h3 className="mt-4 text-lg font-medium">Erro ao carregar dados</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Não foi possível carregar as informações do dashboard.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total em Estoque"
          value={formatCurrency(data.purchaseValue)}
          icon={<PackageSearch className="h-6 w-6" />}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900"
          trend="up"
          trendValue="+5% este mês"
        />
        <MetricCard
          title="Valor Total (Compras)"
          value={formatCurrency(data.purchaseValue)}
          icon={<Tags className="h-6 w-6" />}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-100 dark:bg-purple-900"
          trend="down"
          trendValue="-2% comparado ao anterior"
          trendColor="text-muted-foreground"
        />
        <MetricCard
          title="Valor Potencial (Vendas)"
          value={formatCurrency(data.potentialSales)}
          icon={<LineChart className="h-6 w-6" />}
          iconColor="text-green-600 dark:text-green-400"
          iconBgColor="bg-green-100 dark:bg-green-900"
          trend="up"
          trendValue="+8% em potencial de lucro"
        />
        <MetricCard
          title="Itens em Estoque Baixo"
          value={data.lowStockItems.toString()}
          icon={<AlertTriangle className="h-6 w-6" />}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBgColor="bg-amber-100 dark:bg-amber-900"
          actionLabel="Ver detalhes"
          onActionClick={() => navigate("/estoque")}
        />
      </div>

      {/* Stock Summary */}
      <StockSummaryTable categories={data.categories} />

      {/* Recent Sales */}
      <RecentSalesTable sales={data.recentSales} />
    </div>
  );
}
