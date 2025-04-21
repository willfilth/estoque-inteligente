import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  change?: string | number;
  changeType?: "increase" | "decrease" | "neutral";
  borderColor: string;
  iconBackground: string;
  iconColor: string;
}

export default function DashboardCard({
  title,
  value,
  icon,
  change,
  changeType = "increase",
  borderColor,
  iconBackground,
  iconColor
}: DashboardCardProps) {
  const getChangeIcon = () => {
    if (changeType === "increase") return "fa-arrow-up";
    if (changeType === "decrease") return "fa-arrow-down";
    return "";
  };

  const getChangeColor = () => {
    if (changeType === "increase") return "text-green-600";
    if (changeType === "decrease") return "text-alert-500";
    return "text-gray-500";
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${borderColor}`}>
      <div className="flex justify-between">
        <div>
          <p className="text-neutral-200 text-sm">{title}</p>
          <p className="text-2xl font-bold text-neutral-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${iconBackground} flex items-center justify-center ${iconColor}`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
      </div>
      {change && (
        <div className={cn("mt-4 text-sm", getChangeColor())}>
          <i className={`fas ${getChangeIcon()}`}></i>
          <span className="ml-1">{change}</span>
          {changeType === "increase" && " desde o mês passado"}
          {changeType === "decrease" && " desde o mês passado"}
        </div>
      )}
    </div>
  );
}
