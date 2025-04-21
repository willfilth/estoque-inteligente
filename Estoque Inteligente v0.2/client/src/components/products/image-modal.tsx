import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
}

export default function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  if (!imageUrl) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Visualizar Imagem</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <img
            src={imageUrl}
            alt="Visualização ampliada"
            className="max-h-96 object-contain"
          />
        </div>
        <DialogFooter className="sm:justify-center">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
