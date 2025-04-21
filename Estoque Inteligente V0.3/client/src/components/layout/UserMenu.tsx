import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Usuário mockado para demonstração
  const user = {
    name: 'Administrador',
    avatar: null
  };

  // Fechar o menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="relative" ref={ref}>
      <button 
        className="flex items-center space-x-2 text-foreground focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.avatar ? (
          <img 
            className="h-8 w-8 rounded-full"
            src={user.avatar}
            alt="Avatar do usuário"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <span className="hidden md:block text-sm">{user.name}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="py-1">
            <Link href="/profile">
              <a className="block px-4 py-2 text-foreground text-sm hover:bg-muted">
                Perfil
              </a>
            </Link>
            <Link href="/config">
              <a className="block px-4 py-2 text-foreground text-sm hover:bg-muted">
                Configurações
              </a>
            </Link>
            <button 
              className="block w-full text-left px-4 py-2 text-foreground text-sm hover:bg-muted"
              onClick={() => console.log('Logout')}
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
