import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Search,
  Target,
  FileText,
  Code
} from 'lucide-react';

interface SEOSettings {
  global_meta_title: string;
  global_meta_description: string;
  global_meta_keywords: string[];
  organization_schema: any;
  robots_txt: string;
}

export const GlobalSEO: React.FC = () => {
  const [settings, setSettings] = useState<SEOSettings>({
    global_meta_title: '',
    global_meta_description: '',
    global_meta_keywords: [],
    organization_schema: {},
    robots_txt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*');

      if (error) throw error;

      const settingsMap = data.reduce((acc: any, item: any) => {
        if (item.setting_key === 'global_meta_keywords') {
          acc[item.setting_key] = item.setting_value.value || [];
        } else if (item.setting_key === 'robots_txt') {
          acc[item.setting_key] = item.setting_value.content || '';
        } else {
          acc[item.setting_key] = item.setting_value.value || item.setting_value;
        }
        return acc;
      }, {});

      setSettings({
        global_meta_title: settingsMap.global_meta_title || '',
        global_meta_description: settingsMap.global_meta_description || '',
        global_meta_keywords: settingsMap.global_meta_keywords || [],
        organization_schema: settingsMap.organization_schema || {},
        robots_txt: settingsMap.robots_txt || ''
      });
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      toast({
        title: "Error",
        description: "Failed to load SEO settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSEOSettings = async () => {
    setSaving(true);
    try {
      const updates = [
        {
          setting_key: 'global_meta_title',
          setting_value: { value: settings.global_meta_title },
          category: 'global'
        },
        {
          setting_key: 'global_meta_description',
          setting_value: { value: settings.global_meta_description },
          category: 'global'
        },
        {
          setting_key: 'global_meta_keywords',
          setting_value: { value: settings.global_meta_keywords },
          category: 'global'
        },
        {
          setting_key: 'robots_txt',
          setting_value: { content: settings.robots_txt },
          category: 'technical'
        }
      ];

      for (const update of updates) {
        await supabase
          .from('seo_settings')
          .upsert(update, { onConflict: 'setting_key' });
      }

      toast({
        title: "Success",
        description: "SEO settings saved successfully"
      });
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast({
        title: "Error",
        description: "Failed to save SEO settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    const newKeyword = prompt('Enter new keyword:');
    if (newKeyword && !settings.global_meta_keywords.includes(newKeyword)) {
      setSettings(prev => ({
        ...prev,
        global_meta_keywords: [...prev.global_meta_keywords, newKeyword]
      }));
    }
  };

  const removeKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      global_meta_keywords: prev.global_meta_keywords.filter(k => k !== keyword)
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title="Global SEO Settings - Admin"
        description="Manage global SEO settings for Five London"
        noIndex={true}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="luxury-heading-xl mb-2 flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Global SEO Settings
          </h1>
          <p className="text-muted-foreground">
            Configure site-wide SEO settings, meta tags, and technical SEO elements.
          </p>
        </div>

        <Tabs defaultValue="meta-tags" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meta-tags" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Meta Tags
            </TabsTrigger>
            <TabsTrigger value="keywords" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Keywords
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Schema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meta-tags" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Meta Tags</CardTitle>
                <CardDescription>
                  Default meta tags that will be used across the site when specific page meta tags are not defined.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Default Site Title</Label>
                  <Input
                    id="title"
                    value={settings.global_meta_title}
                    onChange={(e) => setSettings(prev => ({ ...prev, global_meta_title: e.target.value }))}
                    placeholder="Five London - Luxury Companion Services"
                  />
                  <p className="text-xs text-muted-foreground">
                    Length: {settings.global_meta_title.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Default Meta Description</Label>
                  <Textarea
                    id="description"
                    value={settings.global_meta_description}
                    onChange={(e) => setSettings(prev => ({ ...prev, global_meta_description: e.target.value }))}
                    placeholder="Premium luxury companion services in London..."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    Length: {settings.global_meta_description.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Global Keywords</CardTitle>
                <CardDescription>
                  Manage global keywords that will be used across the site for SEO optimization.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {settings.global_meta_keywords.map((keyword, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <Button onClick={addKeyword} variant="outline" size="sm">
                  Add Keyword
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Robots.txt</CardTitle>
                <CardDescription>
                  Configure crawler directives and sitemap location.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="robots">Robots.txt Content</Label>
                  <Textarea
                    id="robots"
                    value={settings.robots_txt}
                    onChange={(e) => setSettings(prev => ({ ...prev, robots_txt: e.target.value }))}
                    placeholder="User-agent: *&#10;Disallow: /admin&#10;&#10;Sitemap: https://fivelondon.com/sitemap.xml"
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schema" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Schema</CardTitle>
                <CardDescription>
                  Structured data for your organization (automatically configured).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm text-muted-foreground">
                    {JSON.stringify(settings.organization_schema, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSEOSettings} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};