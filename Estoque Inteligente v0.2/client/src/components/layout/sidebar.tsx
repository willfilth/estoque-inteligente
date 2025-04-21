import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface MenuItemProps {
  icon: string;
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}

const MenuItem = ({ icon, label, href, active, onClick }: MenuItemProps) => {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center p-2 hover:bg-primary-600 rounded transition",
        active && "bg-primary-800"
      )}
      onClick={onClick}
    >
      <i className={`${icon} w-6`}></i>
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-primary-700 text-white w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30 md:relative md:translate-x-0 transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 flex items-center border-b border-primary-600">
          <i className="fas fa-boxes mr-3 text-xl"></i>
          <h1 className="text-xl font-bold font-heading">Estoque Inteligente</h1>
        </div>
        
        <div className="py-4">
          <div className="px-4 mb-3">
            <MenuItem 
              icon="fas fa-tachometer-alt" 
              label="Dashboard" 
              href="/" 
              active={location === "/"} 
              onClick={closeSidebar}
            />
          </div>
          <div className="px-4 mb-3">
            <MenuItem 
              icon="fas fa-box" 
              label="Produtos" 
              href="/products" 
              active={location.startsWith("/products")} 
              onClick={closeSidebar}
            />
          </div>
          <div className="px-4 mb-3">
            <MenuItem 
              icon="fas fa-tags" 
              label="Categorias" 
              href="/categories" 
              active={location.startsWith("/categories")} 
              onClick={closeSidebar}
            />
          </div>
          <div className="px-4 mb-3">
            <MenuItem 
              icon="fas fa-truck" 
              label="Fornecedores" 
              href="/suppliers" 
              active={location.startsWith("/suppliers")} 
              onClick={closeSidebar}
            />
          </div>
          <div className="px-4 mb-3">
            <MenuItem 
              icon="fas fa-file-alt" 
              label="Relatórios" 
              href="/reports" 
              active={location.startsWith("/reports")} 
              onClick={closeSidebar}
            />
          </div>
          <div className="px-4 mb-3">
            <MenuItem 
              icon="fas fa-cog" 
              label="Configurações" 
              href="/settings" 
              active={location.startsWith("/settings")} 
              onClick={closeSidebar}
            />
          </div>
        </div>
      </div>
    </>
  );
}
