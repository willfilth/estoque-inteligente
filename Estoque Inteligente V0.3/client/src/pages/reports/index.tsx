import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-10">
            <h3 className="text-lg font-medium mb-2">Módulo em desenvolvimento</h3>
            <p className="text-muted-foreground">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
