
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@shared/schema";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onSave: (categories: Category[]) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  categories,
  onSave,
}: CategoryDialogProps) {
  const [newCategory, setNewCategory] = useState("");
  const [localCategories, setLocalCategories] = useState(categories);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setLocalCategories([
        ...localCategories,
        { id: Date.now(), name: newCategory.trim(), hasSize: false }
      ]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (id: number) => {
    setLocalCategories(localCategories.filter(cat => cat.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
          <DialogDescription>
            Adicione ou remova categorias de produtos
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nova categoria"
            />
            <Button onClick={handleAddCategory}>Adicionar</Button>
          </div>
          <div className="space-y-2">
            {localCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <span>{category.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCategory(category.id)}
                >
                  Remover
                </Button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSave(localCategories)}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
