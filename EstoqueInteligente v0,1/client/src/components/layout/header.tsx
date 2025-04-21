import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/sidebar-context";
import { useLanguage } from "@/contexts/language-context";
import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  userName?: string;
}

export default function Header({ title, userName = "Admin" }: HeaderProps) {
  const { toggle } = useSidebar();
  const { translation } = useLanguage();

  return (
    <header className="bg-background border-b border-border">
      <div className="mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            {translation.language === "Idioma" ? "Olá, " : "Hello, "} 
            <span className="font-medium">{userName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
