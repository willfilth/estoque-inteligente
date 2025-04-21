import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import General from './General';

const Config: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 border-b w-full justify-start rounded-none space-x-8">
          <TabsTrigger 
            value="general"
            className="pb-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger 
            value="users"
            className="pb-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Usuários
          </TabsTrigger>
          <TabsTrigger 
            value="permissions"
            className="pb-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Permissões
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="pb-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Notificações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0">
          <General />
        </TabsContent>
        
        <TabsContent value="users" className="mt-0">
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Usuários</h2>
            <p className="text-muted-foreground">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-0">
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Permissões</h2>
            <p className="text-muted-foreground">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <div className="bg-card p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Configurações de Notificações</h2>
            <p className="text-muted-foreground">
              Esta funcionalidade estará disponível em breve.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Config;
