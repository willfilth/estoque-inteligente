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
import { formatCurrency } from "@/lib/utils";
import { CategorySummary } from "@shared/schema";

interface StockSummaryTableProps {
  categories: CategorySummary[];
}

export default function StockSummaryTable({
  categories,
}: StockSummaryTableProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Resumo do Estoque</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Qtd Itens</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Valor Potencial</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    Nenhum produto em estoque
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.itemCount}</TableCell>
                    <TableCell>{formatCurrency(category.totalValue)}</TableCell>
                    <TableCell>{formatCurrency(category.potentialValue)}</TableCell>
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
