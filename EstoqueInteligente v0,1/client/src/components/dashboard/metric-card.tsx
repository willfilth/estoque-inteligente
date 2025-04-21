import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconColor: string;
  iconBgColor: string;
  trend?: "up" | "down";
  trendValue?: string;
  trendColor?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export default function MetricCard({
  title,
  value,
  icon,
  iconColor,
  iconBgColor,
  trend,
  trendValue,
  trendColor,
  actionLabel,
  onActionClick,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
          <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center", iconBgColor)}>
            <div className={cn("text-xl", iconColor)}>{icon}</div>
          </div>
        </div>
        <div className="mt-4">
          {trend && trendValue ? (
            <span
              className={cn(
                "flex items-center text-xs font-medium",
                trendColor ||
                  (trend === "up"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400")
              )}
            >
              {trend === "up" ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              {trendValue}
            </span>
          ) : actionLabel && onActionClick ? (
            <button
              className="flex items-center text-xs font-medium text-primary hover:text-primary/90"
              onClick={onActionClick}
            >
              {actionLabel}
              <ChevronRight className="ml-1 h-3 w-3" />
            </button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
