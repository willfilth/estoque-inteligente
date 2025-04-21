import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import ProductForm from "@/components/products/product-form";

export default function ProductFormPage() {
  const params = useParams();
  const productId = params.id ? parseInt(params.id) : undefined;
  const isEditMode = !!productId;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-heading text-neutral-800">
          {isEditMode ? "Editar Produto" : "Cadastrar Novo Produto"}
        </h2>
        <Link href="/products">
          <Button variant="outline" className="bg-gray-200 text-gray-700 hover:bg-gray-300">
            <i className="fas fa-arrow-left mr-2"></i>Voltar
          </Button>
        </Link>
      </div>

      <ProductForm productId={productId} />
    </div>
  );
}
