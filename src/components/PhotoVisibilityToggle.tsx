import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface PhotoVisibilityToggleProps {
  visibility: 'public' | 'members_only';
  onToggle: (newVisibility: 'public' | 'members_only') => void;
  imageId: string;
  disabled?: boolean;
}

export const PhotoVisibilityToggle: React.FC<PhotoVisibilityToggleProps> = ({
  visibility,
  onToggle,
  imageId,
  disabled = false
}) => {
  const isPublic = visibility === 'public';

  const handleToggle = () => {
    const newVisibility = isPublic ? 'members_only' : 'public';
    onToggle(newVisibility);
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={`visibility-${imageId}`} className="flex items-center gap-1 text-xs">
        {isPublic ? (
          <>
            <Eye className="h-3 w-3" />
            Public
          </>
        ) : (
          <>
            <EyeOff className="h-3 w-3" />
            Members Only
          </>
        )}
      </Label>
      <Switch
        id={`visibility-${imageId}`}
        checked={isPublic}
        onCheckedChange={handleToggle}
        disabled={disabled}
      />
    </div>
  );
};