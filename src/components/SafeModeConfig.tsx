import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { RefreshCw, Settings, AlertTriangle } from 'lucide-react';

export const SafeModeConfig: React.FC = () => {
  const [preferLocalImages, setPreferLocalImages] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<boolean | null>(null);

  const loadCurrentSetting = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('setting_value')
        .eq('setting_key', 'prefer_local_images')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const value = data?.setting_value?.enabled || false;
      setPreferLocalImages(value);
      setCurrentSetting(value);
    } catch (error) {
      console.error('Error loading setting:', error);
      toast.error('Failed to load current setting');
    }
  };

  const updateSetting = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('seo_settings')
        .upsert({
          setting_key: 'prefer_local_images',
          setting_value: { enabled: preferLocalImages },
          category: 'image_system',
          description: 'Controls whether to prefer local optimized images over external URLs'
        });

      if (error) throw error;

      setCurrentSetting(preferLocalImages);
      toast.success(`Safe Mode ${preferLocalImages ? 'OFF' : 'ON'} - Prefer Local Images ${preferLocalImages ? 'enabled' : 'disabled'}`);
      
      // Trigger a page refresh to apply changes
      if (preferLocalImages !== currentSetting) {
        toast.info('Refreshing page to apply changes...');
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setLoading(false);
    }
  };

  const toggleSafeMode = () => {
    setPreferLocalImages(!preferLocalImages);
  };

  useEffect(() => {
    loadCurrentSetting();
  }, []);

  const getSafeModeStatus = () => {
    if (preferLocalImages) {
      return {
        text: 'Safe Mode OFF',
        description: 'Local images preferred - fastest loading',
        color: 'bg-green-100 text-green-800',
        icon: '🟢'
      };
    } else {
      return {
        text: 'Safe Mode ON',
        description: 'External images shown - immediate visibility',
        color: 'bg-orange-100 text-orange-800',
        icon: '🟡'
      };
    }
  };

  const status = getSafeModeStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Safe Mode Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className={status.color}>
                {status.icon} {status.text}
              </Badge>
              {currentSetting !== null && currentSetting !== preferLocalImages && (
                <Badge variant="outline">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Pending Save
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {status.description}
            </p>
          </div>
          <Switch
            checked={!preferLocalImages}
            onCheckedChange={() => toggleSafeMode()}
            disabled={loading}
          />
        </div>

        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h4 className="font-medium">How Safe Mode Works:</h4>
          <div className="text-sm space-y-1">
            <p><strong>Safe Mode ON (external preferred):</strong> Shows external images immediately, even if local versions are missing. Best for ensuring images appear.</p>
            <p><strong>Safe Mode OFF (local preferred):</strong> Shows optimized local images when available, falls back to external. Best for performance.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={updateSetting}
            disabled={loading || currentSetting === preferLocalImages}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Save Configuration
          </Button>
          
          <Button 
            variant="outline" 
            onClick={loadCurrentSetting}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};