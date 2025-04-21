import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { SaleWithItems } from "@shared/schema";

interface RecentSalesTableProps {
  sales: SaleWithItems[];
}

export default function RecentSalesTable({ sales }: RecentSalesTableProps) {
  const [_, navigate] = useLocation();

  return (
    <Card>
      <CardHeader className="border-b border-border flex flex-row items-center justify-between">
        <CardTitle>Últimas Vendas</CardTitle>
        <Button
          variant="link"
          className="text-sm"
          onClick={() => navigate("/vendas")}
        >
          Ver todas
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagamento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    Nenhuma venda registrada
                  </TableCell>
                </TableRow>
              ) : (
                sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">#{sale.id}</TableCell>
                    <TableCell>{formatDate(sale.date)}</TableCell>
                    <TableCell>{sale.itemCount} itens</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(sale.total)}
                    </TableCell>
                    <TableCell>{sale.paymentMethod}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
