import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Notification } from '@shared/schema';

const NotificationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });

  // Contar notificações não lidas
  const unreadCount = notifications.filter((notification) => !notification.read).length;

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

  // Formatar a data relativa
  const formatRelativeTime = (date: string | Date | null) => {
    try {
      if (!date) return 'Data desconhecida';
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      return formatDistanceToNow(parsedDate, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
      return 'Data desconhecida';
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button 
        className="text-foreground p-1 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificações"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-md shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <h3 className="text-card-foreground font-medium notification-title">Notificações</h3>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-3 text-center text-muted-foreground">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b border-border hover:bg-muted ${!notification.read ? 'bg-accent/10' : ''}`}
                >
                  <p className="text-foreground text-sm font-medium">{notification.title}</p>
                  <p className="text-muted-foreground text-sm">{notification.message}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-2 text-center border-t border-border">
              <a href="#" className="text-primary text-sm hover:underline">Ver todas</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
