import { useState } from "react";
import { useLocation } from "wouter";
import NotificationMenu from "./NotificationMenu";
import UserMenu from "./UserMenu";
import Sidebar from "./Sidebar";
import { useMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const isMobile = useMobile();
  const [location] = useLocation();
  
  // Determinar o título baseado na rota atual
  const getTitle = () => {
    switch (location) {
      case "/":
      case "/dashboard":
        return "Dashboard";
      case "/inventory":
        return "Controle de Estoque";
      case "/config":
        return "Configurações";
      case "/users":
        return "Usuários";
      case "/reports":
        return "Relatórios";
      default:
        return title;
    }
  };

  return (
    <header className="bg-card border-b border-border">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && <Sidebar />}
            <h1 className="text-xl font-bold text-foreground ml-4 md:ml-0">{getTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <NotificationMenu />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
