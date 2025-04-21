import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductWithDetails } from "@shared/schema";
import { formatCurrency, getStockStatusClass } from "@/lib/utils";
import { Pencil, Trash } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface InventoryTableProps {
  products: ProductWithDetails[];
  isLoading: boolean;
  onEdit: (product: ProductWithDetails) => void;
  onDelete: (id: number) => void;
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    setPage: (page: number) => void;
  };
}

export function InventoryTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  pagination,
}: InventoryTableProps) {
  const { page, totalPages, totalItems, setPage } = pagination;

  if (isLoading) {
    return (
      <Card>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-sm text-muted-foreground">
              Carregando produtos...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente alterar os filtros ou adicione um novo produto.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Subcategoria</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Qtd</TableHead>
              <TableHead>Compra (R$)</TableHead>
              <TableHead>Venda (R$)</TableHead>
              <TableHead>Total (R$)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.supplier || "—"}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.subcategory || "—"}</TableCell>
                <TableCell>{product.size || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStockStatusClass(
                      product.quantity,
                      product.minQuantity
                    )}
                  >
                    {product.quantity}
                  </Badge>
                </TableCell>
                <TableCell>{formatCurrency(product.buyPrice)}</TableCell>
                <TableCell>{formatCurrency(product.sellPrice)}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(product.buyPrice * product.quantity)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product.id)}
                    title="Excluir"
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium">{(page - 1) * 10 + 1}</span> a{" "}
                <span className="font-medium">
                  {Math.min(page * 10, totalItems)}
                </span>{" "}
                de <span className="font-medium">{totalItems}</span> resultados
              </p>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      isActive={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </Card>
  );
}
