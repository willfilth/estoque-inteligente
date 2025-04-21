import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Users, 
  BarChart,
  Menu,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, href, active, onClick }) => {
  return (
    <div className="sidebar-item-container">
      <Link href={href}>
        <div
          className={`flex items-center px-4 py-2 rounded-md transition-colors cursor-pointer ${
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50"
          }`}
          onClick={onClick}
        >
          <span className="mr-3">{icon}</span>
          <span>{text}</span>
        </div>
      </Link>
    </div>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const sidebarItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      text: "Dashboard", 
      href: "/dashboard",
      active: location === "/" || location === "/dashboard"
    },
    { 
      icon: <Package size={20} />, 
      text: "Controle de Estoque", 
      href: "/inventory",
      active: location === "/inventory"
    },
    { 
      icon: <ShoppingCart size={20} />, 
      text: "Vendas", 
      href: "/sales",
      active: location === "/sales"
    },
    { 
      icon: <BarChart size={20} />, 
      text: "Relatórios", 
      href: "/reports",
      active: location === "/reports"
    },
    { 
      icon: <Settings size={20} />, 
      text: "Configurações", 
      href: "/config",
      active: location === "/config"
    }
  ];

  // Menu deslizante para todos os tamanhos de tela
  return (
    <>
      <Button 
        variant="ghost" 
        className="text-foreground" 
        onClick={toggleSidebar}
        size="icon"
      >
        <Menu />
      </Button>
      
      {/* Overlay quando o menu está aberto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40"
          onClick={closeSidebar}
        />
      )}
      
      {/* Menu deslizante */}
      <div 
        className={`fixed top-0 left-0 w-64 h-full bg-sidebar-background border-r border-sidebar-border z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">Estoque Inteligente</h1>
        </div>
        
        <nav className="px-2 py-4">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                href={item.href}
                active={item.active}
                onClick={closeSidebar}
              />
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
