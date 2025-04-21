import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Package, TrendingUp, AlertTriangle, Boxes, Box, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const Dashboard: React.FC = () => {
  // Carrega os dados necessários para o Dashboard
  const { data: products = [] } = useQuery<any[]>({ 
    queryKey: ['/api/products'],
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  
  const { data: categories = [] } = useQuery<any[]>({ 
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  
  const { data: suppliers = [] } = useQuery<any[]>({ 
    queryKey: ['/api/suppliers'],
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Calcula o valor total do estoque (preço x quantidade)
  const calcularValorEstoque = () => {
    if (products.length === 0) return 0;
    return products.reduce((acc: number, product: any) => 
      acc + (product.price * product.quantity) / 100, 0);
  };

  // Formata o valor em reais
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };
  
  // Conta produtos com estoque abaixo do mínimo
  const contarAlertasEstoque = () => {
    if (products.length === 0) return 0;
    return products.filter((p: any) => p.quantity < (p.minQuantity || 5)).length;
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card de Total de Produtos */}
        <Card className="overflow-hidden border-b-4 border-blue-500 shadow-md hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 h-16 w-16 bg-blue-100 rounded-bl-full flex items-start justify-end p-2">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{products?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Produtos cadastrados no sistema
            </p>
          </CardContent>
        </Card>
        
        {/* Card de Valor do Estoque */}
        <Card className="overflow-hidden border-b-4 border-green-500 shadow-md hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 h-16 w-16 bg-green-100 rounded-bl-full flex items-start justify-end p-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatarMoeda(calcularValorEstoque())}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Valor total dos produtos em estoque
            </p>
          </CardContent>
        </Card>
        
        {/* Card de Categorias */}
        <Card className="overflow-hidden border-b-4 border-purple-500 shadow-md hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 h-16 w-16 bg-purple-100 rounded-bl-full flex items-start justify-end p-2">
            <Boxes className="h-6 w-6 text-purple-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{categories?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Categorias de produtos cadastradas
            </p>
          </CardContent>
        </Card>
        
        {/* Card de Alertas */}
        <Card className="overflow-hidden border-b-4 border-amber-500 shadow-md hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 h-16 w-16 bg-amber-100 rounded-bl-full flex items-start justify-end p-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{contarAlertasEstoque()}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Produtos com estoque abaixo do mínimo
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Segunda linha de cards */}
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* Card de Fornecedores */}
        <Card className="overflow-hidden border-l-4 border-cyan-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="rounded-full p-2 bg-cyan-100">
              <Users className="h-6 w-6 text-cyan-600" />
            </div>
            <CardTitle>Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-cyan-600">{suppliers?.length || 0}</div>
              <div className="text-sm text-muted-foreground">
                Fornecedores cadastrados no sistema
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Card de Produtos em Estoque */}
        <Card className="overflow-hidden border-l-4 border-rose-500 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="rounded-full p-2 bg-rose-100">
              <Box className="h-6 w-6 text-rose-600" />
            </div>
            <CardTitle>Produtos em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-rose-600">
                {products.reduce((acc: number, product: any) => acc + (product.quantity || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Unidades totais em estoque
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Card principal */}
      <div className="mt-8">
        <Card className="border-t-4 border-indigo-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-indigo-600">Visão Geral do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-8 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-indigo-700 dark:text-indigo-300">Bem-vindo ao Estoque Inteligente</h3>
              <p className="text-muted-foreground text-base">
                Para começar, cadastre sua empresa na seção de Configurações e adicione produtos ao estoque.
              </p>
              <div className="mt-6 p-4 bg-white dark:bg-indigo-900/30 rounded-lg shadow-inner">
                <p className="text-sm font-medium text-muted-foreground">
                  O sistema permite controlar seu estoque de forma inteligente, com alertas automáticos de estoque baixo e relatórios detalhados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
