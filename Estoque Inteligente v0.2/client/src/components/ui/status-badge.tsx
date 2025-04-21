import { cn } from "@/lib/utils";

type StatusType = "available" | "low" | "critical" | "out_of_stock";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "available":
        return {
          label: "Disponível",
          className: "bg-success-100 text-success-500",
        };
      case "low":
        return {
          label: "Estoque Baixo",
          className: "bg-warning-100 text-warning-500",
        };
      case "critical":
        return {
          label: "Estoque Crítico",
          className: "bg-alert-100 text-alert-500",
        };
      case "out_of_stock":
        return {
          label: "Sem Estoque",
          className: "bg-gray-100 text-gray-500",
        };
      default:
        return {
          label: "Desconhecido",
          className: "bg-gray-100 text-gray-500",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={cn(
        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
