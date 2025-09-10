import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Globe, Image, Settings, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface FeatureFlags {
  preferLocalImages: boolean;
  enableImageProxy: boolean;
  autoFixImages: boolean;
}

export const SystemSettings = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    preferLocalImages: true,
    enableImageProxy: true,
    autoFixImages: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load feature flags from localStorage
    const savedFlags = localStorage.getItem('featureFlags');
    if (savedFlags) {
      try {
        const parsed = JSON.parse(savedFlags);
        setFeatureFlags(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error parsing feature flags:', error);
      }
    }
  }, []);

  const saveFeatureFlags = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('featureFlags', JSON.stringify(featureFlags));
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving feature flags:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    setFeatureFlags(prev => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    const defaults: FeatureFlags = {
      preferLocalImages: true,
      enableImageProxy: true,
      autoFixImages: false,
    };
    setFeatureFlags(defaults);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Configure global system behavior and feature flags
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Image Pipeline Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prefer Local Images */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="preferLocalImages" className="text-sm font-medium">
                Prefer Local Images
              </Label>
              <p className="text-xs text-muted-foreground">
                Prioritize locally optimized images over external sources
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={featureFlags.preferLocalImages ? 'default' : 'secondary'}>
                {featureFlags.preferLocalImages ? 'Enabled' : 'Disabled'}
              </Badge>
              <Switch
                id="preferLocalImages"
                checked={featureFlags.preferLocalImages}
                onCheckedChange={(checked) => updateFlag('preferLocalImages', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Enable Image Proxy */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="enableImageProxy" className="text-sm font-medium">
                Enable Image Proxy
              </Label>
              <p className="text-xs text-muted-foreground">
                Route /images/* through optimized proxy with caching
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={featureFlags.enableImageProxy ? 'default' : 'secondary'}>
                {featureFlags.enableImageProxy ? 'Enabled' : 'Disabled'}
              </Badge>
              <Switch
                id="enableImageProxy"
                checked={featureFlags.enableImageProxy}
                onCheckedChange={(checked) => updateFlag('enableImageProxy', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Auto Fix Images */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="autoFixImages" className="text-sm font-medium">
                Auto-Fix Broken Images
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically detect and fix 404 images in the background
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={featureFlags.autoFixImages ? 'default' : 'secondary'}>
                {featureFlags.autoFixImages ? 'Enabled' : 'Disabled'}
              </Badge>
              <Switch
                id="autoFixImages"
                checked={featureFlags.autoFixImages}
                onCheckedChange={(checked) => updateFlag('autoFixImages', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Safety & Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Image Resolution Priority:</p>
              <p className="text-muted-foreground">Local → External → Placeholder</p>
            </div>
            <div>
              <p className="font-medium">Cache Strategy:</p>
              <p className="text-muted-foreground">Immutable, 1 year</p>
            </div>
            <div>
              <p className="font-medium">Fallback Guarantee:</p>
              <p className="text-muted-foreground">No broken images</p>
            </div>
            <div>
              <p className="font-medium">Auto-Optimization:</p>
              <p className="text-muted-foreground">WebP conversion</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={saveFeatureFlags} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};