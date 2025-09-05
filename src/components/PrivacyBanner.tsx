import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyBanner: React.FC = () => {
  const { user } = useAuth();

  // Don't show banner to authenticated users
  if (user) return null;

  return (
    <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border/50">
      <div className="container-width py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground mb-1">
                Privacy Protected
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Detailed profiles are available after registration to protect our companions' privacy and ensure discretion.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>Limited Info</span>
            </div>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Full Access</span>
            </div>
            <Link to="/auth">
              <Button size="sm" variant="outline" className="text-xs px-3 py-1.5 h-8">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};