import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useMobile();
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {!isMobile && <Sidebar className="hidden md:block" />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="" />
        
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
