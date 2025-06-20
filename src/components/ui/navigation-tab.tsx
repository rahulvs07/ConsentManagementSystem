import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface NavigationTabProps {
  value: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  notificationCount?: number;
  notificationVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
  className?: string;
  isCompact?: boolean;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({
  value,
  children,
  icon,
  notificationCount,
  notificationVariant = 'destructive',
  className,
  isCompact = false
}) => {
  return (
    <TabsTrigger 
      value={value} 
      className={cn(
        "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200",
        "hover:bg-accent hover:text-accent-foreground",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        "data-[state=active]:border-b-2 data-[state=active]:border-primary",
        isCompact ? "px-2 py-2 text-xs" : "px-4 py-3 text-sm",
        className
      )}
    >
      {icon && (
        <span className={cn(
          "flex-shrink-0",
          isCompact ? "h-3 w-3" : "h-4 w-4"
        )}>
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {notificationCount && notificationCount > 0 && (
        <Badge 
          variant={notificationVariant} 
          className={cn(
            "ml-1 flex-shrink-0 min-w-[1.25rem] h-5 text-xs font-semibold rounded-full flex items-center justify-center",
            notificationVariant === 'destructive' && "bg-red-500 hover:bg-red-600 text-white",
            notificationVariant === 'default' && "bg-blue-500 hover:bg-blue-600 text-white",
            notificationVariant === 'secondary' && "bg-gray-500 hover:bg-gray-600 text-white",
            isCompact && "h-4 text-[10px] min-w-[1rem]"
          )}
        >
          {notificationCount > 99 ? '99+' : notificationCount}
        </Badge>
      )}
    </TabsTrigger>
  );
};

export default NavigationTab; 