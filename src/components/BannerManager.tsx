import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BannerUpload } from './BannerUpload';
import { Trash2, GripVertical, Plus } from 'lucide-react';
import { useBannerContent } from '@/hooks/useBannerContent';

interface SiteBanner {
  id: string;
  section: string;
  image_url: string;
  caption?: string;
  order_index: number;
  visibility: string;
  device_type: string;
  alt_text?: string;
  is_active: boolean;
}

const SECTIONS = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'about', label: 'About Section' },
  { value: 'services', label: 'Services Section' },
  { value: 'features', label: 'Features Section' }
];

const DEVICE_TYPES = [
  { value: 'all', label: 'All Devices' },
  { value: 'desktop', label: 'Desktop Only' },
  { value: 'mobile', label: 'Mobile Only' }
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'admin_only', label: 'Admin Only' }
];

export const BannerManager: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { refetch } = useBannerContent();

  const fetchBanners = async (section: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_banners')
        .select('*')
        .eq('section', section)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners(activeSection);
  }, [activeSection]);

  const addNewBanner = async () => {
    try {
      const maxOrder = Math.max(...banners.map(b => b.order_index), -1);
      const newBanner = {
        section: activeSection,
        image_url: '',
        caption: '',
        order_index: maxOrder + 1,
        visibility: 'public',
        device_type: 'all',
        alt_text: '',
        is_active: true
      };

      const { data, error } = await supabase
        .from('site_banners')
        .insert([newBanner])
        .select()
        .single();

      if (error) throw error;

      setBanners([...banners, data]);
      toast({
        title: "Success",
        description: "New banner added",
      });
    } catch (error) {
      console.error('Error adding banner:', error);
      toast({
        title: "Error",
        description: "Failed to add banner",
        variant: "destructive",
      });
    }
  };

  const updateBanner = async (bannerId: string, updates: Partial<SiteBanner>) => {
    try {
      // Find current banner state
      const current = banners.find(b => b.id === bannerId);

      const { error } = await supabase
        .from('site_banners')
        .update(updates)
        .eq('id', bannerId);

      if (error) throw error;

      setBanners(banners.map(banner => 
        banner.id === bannerId ? { ...banner, ...updates } : banner
      ));

      // Enforce exclusivity: only one active per section + device_type
      const willBeActive = updates.is_active ?? current?.is_active;
      const newDeviceType = updates.device_type ?? current?.device_type;
      const section = current?.section;
      if (willBeActive && section && newDeviceType) {
        const { error: deactivateError } = await supabase
          .from('site_banners')
          .update({ is_active: false })
          .eq('section', section)
          .eq('device_type', newDeviceType)
          .neq('id', bannerId)
          .eq('is_active', true);
        if (deactivateError) {
          console.warn('Failed to enforce banner exclusivity:', deactivateError);
        } else {
          // Update local state for others
          setBanners(prev => prev.map(b => (
            b.section === section && b.device_type === newDeviceType && b.id !== bannerId
              ? { ...b, is_active: false }
              : b
          )));
          toast({
            title: 'Exclusivity applied',
            description: 'Only one active banner per device type in this section.',
          });
        }
      }

      refetch(); // Refresh the frontend cache
    } catch (error) {
      console.error('Error updating banner:', error);
      toast({
        title: "Error",
        description: "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  const deleteBanner = async (bannerId: string) => {
    try {
      const { error } = await supabase
        .from('site_banners')
        .delete()
        .eq('id', bannerId);

      if (error) throw error;

      setBanners(banners.filter(banner => banner.id !== bannerId));
      refetch(); // Refresh the frontend cache

      toast({
        title: "Success",
        description: "Banner deleted",
      });
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const updateOrderIndex = async (bannerId: string, newOrder: number) => {
    await updateBanner(bannerId, { order_index: newOrder });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-luxury-heading">Banner Management</h2>
          <p className="text-muted-foreground">Manage site banners by section</p>
        </div>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          {SECTIONS.map((section) => (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {SECTIONS.map((section) => (
          <TabsContent key={section.value} value={section.value} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{section.label}</h3>
              <Button onClick={addNewBanner} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Banner
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading banners...</div>
            ) : banners.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No banners in this section. Click "Add Banner" to create one.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {banners.map((banner) => (
                  <Card key={banner.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <CardTitle className="text-sm">Banner #{banner.order_index + 1} • {banner.device_type}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={banner.is_active}
                            onCheckedChange={(checked) => 
                              updateBanner(banner.id, { is_active: checked })
                            }
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBanner(banner.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <BannerUpload
                            value={banner.image_url}
                            onChange={(url) => updateBanner(banner.id, { image_url: url })}
                            label="Banner Image"
                            section={banner.section}
                          />

                          <div>
                            <Label htmlFor={`caption-${banner.id}`}>Caption</Label>
                            <Input
                              id={`caption-${banner.id}`}
                              value={banner.caption || ''}
                              onChange={(e) => updateBanner(banner.id, { caption: e.target.value })}
                              placeholder="Optional caption"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`alt-text-${banner.id}`}>Alt Text</Label>
                            <Input
                              id={`alt-text-${banner.id}`}
                              value={banner.alt_text || ''}
                              onChange={(e) => updateBanner(banner.id, { alt_text: e.target.value })}
                              placeholder="Alt text for accessibility"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`order-${banner.id}`}>Order</Label>
                            <Input
                              id={`order-${banner.id}`}
                              type="number"
                              value={banner.order_index}
                              onChange={(e) => updateOrderIndex(banner.id, parseInt(e.target.value) || 0)}
                              min="0"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`device-${banner.id}`}>Device Type</Label>
                            <Select
                              value={banner.device_type}
                              onValueChange={(value) => updateBanner(banner.id, { device_type: value })}
                            >
                              <SelectTrigger id={`device-${banner.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {DEVICE_TYPES.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`visibility-${banner.id}`}>Visibility</Label>
                            <Select
                              value={banner.visibility}
                              onValueChange={(value) => updateBanner(banner.id, { visibility: value })}
                            >
                              <SelectTrigger id={`visibility-${banner.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {VISIBILITY_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};