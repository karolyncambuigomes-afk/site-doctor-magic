import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  confirmMessage?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showIcon = true,
  children = 'Sign Out',
  confirmMessage = 'Are you sure you want to sign out?'
}) => {
  const { signOut } = useAuth() || {};

  const handleLogout = () => {
    if (window.confirm(confirmMessage)) {
      signOut?.();
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 ${className}`}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
};
