import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Suppliers() {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-10 w-10 text-amber-500" />
            <h2 className="text-xl font-semibold">Em Desenvolvimento</h2>
          </div>
          <p className="text-muted-foreground">
            O módulo de Fornecedores está em desenvolvimento e estará disponível em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
