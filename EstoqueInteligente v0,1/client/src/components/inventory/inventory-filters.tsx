import { Category, Supplier } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  FileSpreadsheet,
  File,
} from "lucide-react";

interface InventoryFiltersProps {
  filters: {
    code: string;
    category: string;
    supplier: string;
    stock: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      code: string;
      category: string;
      supplier: string;
      stock: string;
    }>
  >;
  categories: Category[];
  suppliers: Supplier[];
  onNewItem: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export function InventoryFilters({
  filters,
  setFilters,
  categories,
  suppliers,
  onNewItem,
  onExportExcel,
  onExportPDF,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between space-y-4 lg:space-y-0 lg:space-x-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
        <div className="flex-1">
          <label htmlFor="filterCode" className="block text-sm font-medium mb-1">
            Código/Nome
          </label>
          <div className="relative rounded-md">
            <Input
              id="filterCode"
              placeholder="Buscar por código ou nome"
              value={filters.code}
              onChange={(e) =>
                setFilters({ ...filters, code: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label htmlFor="filterCategory" className="block text-sm font-medium mb-1">
            Categoria
          </label>
          <Select
            value={filters.category}
            onValueChange={(value) =>
              setFilters({ ...filters, category: value })
            }
          >
            <SelectTrigger id="filterCategory">
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="filterSupplier" className="block text-sm font-medium mb-1">
            Fornecedor
          </label>
          <Select
            value={filters.supplier}
            onValueChange={(value) =>
              setFilters({ ...filters, supplier: value })
            }
          >
            <SelectTrigger id="filterSupplier">
              <SelectValue placeholder="Todos fornecedores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos fornecedores</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="filterStock" className="block text-sm font-medium mb-1">
            Estoque
          </label>
          <Select
            value={filters.stock}
            onValueChange={(value) =>
              setFilters({ ...filters, stock: value })
            }
          >
            <SelectTrigger id="filterStock">
              <SelectValue placeholder="Qualquer estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Qualquer estoque</SelectItem>
              <SelectItem value="low">Estoque baixo</SelectItem>
              <SelectItem value="normal">Estoque normal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onNewItem}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Item
        </Button>
        <Button variant="outline" onClick={onExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
        <Button variant="outline" onClick={onExportPDF}>
          <File className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
