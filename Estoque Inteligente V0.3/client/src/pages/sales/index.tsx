import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Plus, 
  Minus,
  X,
  PackageCheck, 
  CreditCard,
  Truck
} from "lucide-react";

// Esquema para validação do formulário
const saleFormSchema = z.object({
  customerName: z.string().min(3, { message: "Nome do cliente é obrigatório" }),
  customerDocument: z.string().optional(),
  paymentMethod: z.enum(["dinheiro", "debito", "credito", "pix"]),
  creditCardInstallments: z.number().optional(),
  creditCardBrand: z.string().optional(),
  notes: z.string().optional(),
});

// Interface para produto
interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

// Interface para item do carrinho
interface CartItem {
  productId: number;
  product: Product;
  quantity: number;
  price: number;
  discount: number;
}

const Sales = () => {
  const { toast } = useToast();
  const [searchSku, setSearchSku] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const skuInputRef = useRef<HTMLInputElement>(null);
  
  // Formulário de venda
  const form = useForm<z.infer<typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      customerName: "",
      customerDocument: "",
      paymentMethod: "dinheiro",
      notes: "",
    },
  });
  
  // Recarregar foco no input SKU após adicionar produto
  useEffect(() => {
    if (skuInputRef.current) {
      skuInputRef.current.focus();
    }
  }, [cart]);
  
  // Calcular total do carrinho
  useEffect(() => {
    const total = cart.reduce((acc, item) => {
      return acc + (item.price * item.quantity) - item.discount;
    }, 0);
    setTotalAmount(total);
  }, [cart]);

  // Consultar todos os produtos para exibir em um carrinho
  const { data: products } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => apiRequest('GET', '/api/products').then(res => res.json()),
  });
  
  // Consultar produto por SKU
  const { 
    data: searchedProduct, 
    isLoading, 
    refetch: searchProduct,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/products/sku', searchSku],
    queryFn: () => {
      if (!searchSku) return Promise.resolve(null);
      return apiRequest('GET', `/api/products/sku/${searchSku}`).then(res => res.json());
    },
    enabled: false, // Não executar automaticamente
  });
  
  // Mutação para criar venda
  const createSaleMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/sales', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/sales'] });
      
      // Agora vamos adicionar os itens da venda
      const promises = cart.map(item => 
        apiRequest('POST', '/api/sales/items', {
          saleId: data.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0
        })
      );
      
      Promise.all(promises).then(() => {
        toast({
          title: "Venda finalizada",
          description: `Venda #${data.id} registrada com sucesso!`,
        });
        
        // Limpar carrinho e formulário
        setCart([]);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao finalizar venda",
        description: error.message || "Ocorreu um erro ao registrar a venda.",
        variant: "destructive",
      });
    }
  });
  
  // Buscar produto por SKU
  const handleSearchProduct = async () => {
    if (!searchSku) return;
    
    await searchProduct();
    
    if (searchedProduct && !isError) {
      // Verificar se o produto já está no carrinho
      const existingItemIndex = cart.findIndex(item => item.productId === searchedProduct.id);
      
      if (existingItemIndex >= 0) {
        // Atualizar quantidade se já estiver no carrinho
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += 1;
        setCart(updatedCart);
      } else {
        // Adicionar ao carrinho se não estiver
        setCart([...cart, {
          productId: searchedProduct.id,
          product: searchedProduct,
          quantity: 1,
          price: searchedProduct.price,
          discount: 0
        }]);
      }
      
      // Limpar campo de busca
      setSearchSku("");
    } else if (isError) {
      toast({
        title: "Produto não encontrado",
        description: "Verifique o SKU e tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  // Atualizar quantidade de um item no carrinho
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const product = cart[index].product;
    
    // Verificar se tem estoque suficiente
    if (newQuantity > product.quantity) {
      toast({
        title: "Estoque insuficiente",
        description: `Apenas ${product.quantity} unidades disponíveis.`,
        variant: "destructive",
      });
      return;
    }
    
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };
  
  // Remover item do carrinho
  const removeItem = (index: number) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };
  
  // Finalizar venda
  const onSubmit = (data: z.infer<typeof saleFormSchema>) => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a venda.",
        variant: "destructive",
      });
      return;
    }
    
    // Preparar dados da venda
    const saleData = {
      ...data,
      totalAmount,
      status: "completed"
    };
    
    // Criar venda
    createSaleMutation.mutate(saleData);
  };
  
  // Cancelar venda
  const cancelSale = () => {
    setCart([]);
    form.reset();
    toast({
      title: "Venda cancelada",
      description: "Os itens foram removidos do carrinho.",
    });
  };
  
  // Mostrar opções adicionais quando método de pagamento for crédito
  const watchPaymentMethod = form.watch("paymentMethod");
  useEffect(() => {
    setShowPaymentOptions(watchPaymentMethod === "credito");
  }, [watchPaymentMethod]);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Coluna da esquerda - Busca de produtos e carrinho */}
        <div className="w-full sm:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nova Venda</CardTitle>
              <CardDescription>
                Adicione produtos ao carrinho para realizar uma venda
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Busca de produto por SKU */}
              <div className="grid gap-4">
                <div className="flex w-full items-center space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="sku">Código do Produto (SKU)</Label>
                    <div className="flex w-full items-center space-x-2 mt-1">
                      <Input
                        id="sku"
                        placeholder="Digite o SKU do produto"
                        value={searchSku}
                        onChange={(e) => setSearchSku(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearchProduct();
                          }
                        }}
                        ref={skuInputRef}
                      />
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handleSearchProduct}
                        disabled={isLoading || !searchSku}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Buscar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tabela de carrinho */}
              <div className="mt-8">
                <Table>
                  <TableCaption>Itens no carrinho</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Qtde</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Nenhum produto adicionado ao carrinho
                        </TableCell>
                      </TableRow>
                    ) : (
                      cart.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                            </div>
                          </TableCell>
                          <TableCell>R$ {(item.price / 100).toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(index, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span>{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => updateQuantity(index, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            R$ {((item.price * item.quantity) / 100).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Total do carrinho */}
              {cart.length > 0 && (
                <div className="mt-6 flex justify-end">
                  <div className="bg-secondary p-4 rounded-lg">
                    <div className="text-lg font-semibold flex justify-between">
                      <span>Total:</span>
                      <span>R$ {(totalAmount / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna da direita - Formulário de venda */}
        <div className="w-full sm:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Venda</CardTitle>
              <CardDescription>
                Informe os dados do cliente e forma de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Cliente</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customerDocument"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="CPF ou CNPJ do cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Forma de Pagamento</FormLabel>
                        <FormControl>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a forma de pagamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dinheiro">Dinheiro</SelectItem>
                              <SelectItem value="debito">Cartão de Débito</SelectItem>
                              <SelectItem value="credito">Cartão de Crédito</SelectItem>
                              <SelectItem value="pix">PIX</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Opções para cartão de crédito */}
                  {showPaymentOptions && (
                    <>
                      <FormField
                        control={form.control}
                        name="creditCardInstallments"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parcelas</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={(value) => field.onChange(parseInt(value))} 
                                defaultValue={field.value?.toString() || "1"}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o número de parcelas" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[...Array(12)].map((_, i) => (
                                    <SelectItem key={i} value={(i + 1).toString()}>
                                      {i + 1}x {i === 0 ? '(à vista)' : ''}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="creditCardBrand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bandeira do Cartão</FormLabel>
                            <FormControl>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a bandeira" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="visa">Visa</SelectItem>
                                  <SelectItem value="mastercard">Mastercard</SelectItem>
                                  <SelectItem value="amex">American Express</SelectItem>
                                  <SelectItem value="elo">Elo</SelectItem>
                                  <SelectItem value="hipercard">Hipercard</SelectItem>
                                  <SelectItem value="other">Outra</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Observações sobre a venda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Botões de finalizar ou cancelar venda */}
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={cart.length === 0 || createSaleMutation.isPending}
                    >
                      {createSaleMutation.isPending ? (
                        "Processando..."
                      ) : (
                        <>
                          <PackageCheck className="mr-2 h-4 w-4" />
                          Finalizar Venda
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={cancelSale}
                      disabled={cart.length === 0 || createSaleMutation.isPending}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Sales;