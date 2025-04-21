import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Alert } from "@/lib/types";

interface AlertItemProps {
  alert: Alert;
}

export default function AlertItem({ alert }: AlertItemProps) {
  // Determina o ícone e cor com base no tipo de alerta
  const getAlertIcon = () => {
    if (alert.type === 'low_stock') {
      return "fa-exclamation-circle";
    }
    return "fa-exclamation-triangle";
  };

  const getAlertIconColor = () => {
    if (alert.type === 'low_stock') {
      return "bg-alert-100 text-alert-500";
    }
    return "bg-warning-100 text-warning-500";
  };

  const getAlertTitle = () => {
    if (alert.type === 'low_stock') {
      return "Estoque crítico";
    }
    return "Alerta";
  };

  // Formata a data em relação ao momento atual
  const formattedTime = () => {
    if (!alert.createdAt) return "";
    
    const date = new Date(alert.createdAt);
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
  };

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${getAlertIconColor()} flex items-center justify-center mr-3`}>
          <i className={`fas ${getAlertIcon()}`}></i>
        </div>
        <div>
          <p className="font-medium text-neutral-800">{getAlertTitle()}</p>
          <p className="text-sm text-neutral-200">{alert.message}</p>
          <p className="text-xs text-neutral-200 mt-1">{formattedTime()}</p>
        </div>
      </div>
    </div>
  );
}
