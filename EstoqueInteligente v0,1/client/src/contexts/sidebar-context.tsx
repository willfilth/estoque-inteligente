import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SidebarContextProps {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isOpen: true,
  toggle: () => {},
  close: () => {},
  open: () => {},
});

interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarProvider({ 
  children, 
  defaultOpen = true 
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-open");
    if (stored !== null) {
      setIsOpen(stored === "true");
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-open", isOpen ? "true" : "false");
  }, [isOpen]);

  // Close sidebar on mobile screens by default
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    
    // Check on mount
    checkWidth();
    
    // Add resize listener
    window.addEventListener("resize", checkWidth);
    
    // Clean up
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close, open }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
