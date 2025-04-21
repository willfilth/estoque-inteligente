import { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header"; // Assuming Header component exists
import { useSidebar } from "@/contexts/sidebar-context";


interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col ${isOpen ? 'ml-64' : ''}`}>
        <Header />
        <main className="flex-1 p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}