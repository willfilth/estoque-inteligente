import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import { useSidebar } from "@/contexts/sidebar-context";
import { useLanguage } from "@/contexts/language-context";
import { useQuery } from "@tanstack/react-query";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
};

export default function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { isOpen, toggle } = useSidebar();
  const { translation: t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // Fetch low stock count for badge
  const { data: lowStockCount } = useQuery({
    queryKey: ["/api/products/low-stock"],
    select: (data) => data.length || 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      href: "/",
      label: t.dashboard,
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/estoque",
      label: t.inventory,
      icon: <Package className="h-5 w-5" />,
      badge: lowStockCount,
    },
    {
      href: "/vendas",
      label: t.sales,
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      href: "/fornecedores",
      label: t.suppliers,
      icon: <Truck className="h-5 w-5" />,
    },
    {
      href: "/relatorios",
      label: t.reports,
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/configuracoes",
      label: t.settings,
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <aside
      className={cn(
        "h-screen flex-shrink-0 border-r border-border bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-[72px]"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo section */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-6 w-6" />
            </div>
            <h1
              className={cn(
                "text-lg font-semibold transition-opacity duration-300",
                isOpen ? "opacity-100" : "w-0 overflow-hidden opacity-0"
              )}
            >
              Estoque Pro
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            title={isOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <li key={item.href}>
                  <div
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg py-2 px-3 transition-colors cursor-pointer",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                    onClick={() => {
                      window.location.href = item.href;
                    }}
                  >
                    <div className="flex items-center">
                      <span className="flex w-6 justify-center">
                        {item.icon}
                      </span>
                      <span
                        className={cn(
                          "ml-3 transition-all duration-300",
                          isOpen
                            ? ""
                            : "w-0 overflow-hidden opacity-0"
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    {item.badge && item.badge > 0 ? (
                      <Badge
                        variant="destructive"
                        className={cn(
                          "ml-auto",
                          !isOpen && "absolute right-1.5"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <div
            className={cn(
              "flex items-center gap-3 transition-opacity duration-300",
              isOpen ? "opacity-100" : "w-0 overflow-hidden opacity-0"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                A
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
