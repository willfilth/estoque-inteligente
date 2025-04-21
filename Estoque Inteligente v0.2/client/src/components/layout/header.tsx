import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert } from "@/lib/types";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  
  const { data: alerts } = useQuery<Alert[]>({
    queryKey: ["/api/alerts/unread"],
    refetchInterval: 60000, // Atualizar a cada minuto
  });
  
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between p-4 md:py-0">
      <div className="flex md:hidden">
        <button className="text-primary-700" onClick={toggleSidebar}>
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>
      <div className="flex items-center ml-auto">
        <div className="relative mr-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative text-neutral-800 focus:outline-none">
                <i className="fas fa-bell"></i>
                {alerts && alerts.length > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-alert-500 rounded-full"></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-heading font-semibold">Notificações</h3>
                {alerts && alerts.length > 0 && (
                  <span className="bg-alert-500 text-white text-xs px-2 py-1 rounded-full">
                    {alerts.length} {alerts.length === 1 ? 'nova' : 'novas'}
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-200">
                {alerts && alerts.length > 0 ? (
                  alerts.map(alert => (
                    <div key={alert.id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${alert.type === 'low_stock' ? 'bg-alert-100 text-alert-500' : 'bg-warning-100 text-warning-500'} flex items-center justify-center mr-3`}>
                          <i className={`fas ${alert.type === 'low_stock' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-800">
                            {alert.type === 'low_stock' ? 'Estoque crítico' : 'Alerta'}
                          </p>
                          <p className="text-xs text-neutral-200">{alert.message}</p>
                          <p className="text-xs text-neutral-200 mt-1">
                            {new Date(alert.createdAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nenhuma notificação no momento
                  </div>
                )}
              </div>
              {alerts && alerts.length > 0 && (
                <div className="p-2 text-center border-t border-gray-200">
                  <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                    Ver todas as notificações
                  </button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white mr-2">
            <span>A</span>
          </div>
          <span className="text-neutral-800 hidden md:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
