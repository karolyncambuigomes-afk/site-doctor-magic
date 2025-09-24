import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Download, Upload, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TechnicalSEOSettings {
  robots_txt: string;
  sitemap_urls: string[];
  canonical_rules: CanonicalRule[];
  redirects: Redirect[];
  meta_robots: MetaRobots;
}

interface CanonicalRule {
  id: string;
  pattern: string;
  canonical_url: string;
  is_active: boolean;
}

interface Redirect {
  id: string;
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: boolean;
}

interface MetaRobots {
  default_robots: string;
  page_specific: { [key: string]: string };
}

export const TechnicalSEO: React.FC = () => {
  const [settings, setSettings] = useState<TechnicalSEOSettings>({
    robots_txt: '',
    sitemap_urls: [],
    canonical_rules: [],
    redirects: [],
    meta_robots: {
      default_robots: 'index, follow',
      page_specific: {}
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('robots');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'redirect' | 'canonical' | 'sitemap'>('redirect');
  const { toast } = useToast();

  const [newRedirect, setNewRedirect] = useState({
    from_path: '',
    to_path: '',
    status_code: 301,
    is_active: true
  });

  const [newCanonical, setNewCanonical] = useState({
    pattern: '',
    canonical_url: '',
    is_active: true
  });

  const [newSitemapUrl, setNewSitemapUrl] = useState('');

  useEffect(() => {
    loadTechnicalSEOSettings();
  }, []);

  const loadTechnicalSEOSettings = async () => {
    try {
      // Carregar configurações do Supabase
<<<<<<< HEAD
      const { data: robotsData } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('key', 'robots_txt')
        .maybeSingle();

      const { data: redirectsData } = await supabase
        .from('redirects')
=======
      const { data: robotsData } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('key', 'robots_txt')
        .single();

      const { data: redirectsData } = await supabase
        .from('redirects')
>>>>>>> 4d6ac79 (Update all project files: bug fixes, new features, and improvements)
        .select('*')
        .eq('is_active', true);

      const { data: canonicalData } = await supabase
        .from('canonical_rules')
        .select('*')
        .eq('is_active', true);

      setSettings(prev => ({
        ...prev,
        robots_txt: robotsData?.value || DEFAULT_ROBOTS_TXT,
        redirects: redirectsData || [],
        canonical_rules: canonicalData || []
      }));
    } catch (error) {
      console.error('Error loading technical SEO settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações técnicas de SEO",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRobotsTxt = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('seo_settings')
        .upsert({
          key: 'robots_txt',
          value: settings.robots_txt,
          category: 'technical'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Robots.txt atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Error saving robots.txt:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar robots.txt",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addRedirect = async () => {
    try {
      const { error } = await supabase
        .from('redirects')
        .insert([{
          ...newRedirect,
          id: crypto.randomUUID()
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Redirecionamento adicionado com sucesso!"
      });

      setNewRedirect({
        from_path: '',
        to_path: '',
        status_code: 301,
        is_active: true
      });
      setIsDialogOpen(false);
      loadTechnicalSEOSettings();
    } catch (error) {
      console.error('Error adding redirect:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar redirecionamento",
        variant: "destructive"
      });
    }
  };

  const deleteRedirect = async (id: string) => {
    try {
      const { error } = await supabase
        .from('redirects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Redirecionamento removido com sucesso!"
      });

      loadTechnicalSEOSettings();
    } catch (error) {
      console.error('Error deleting redirect:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover redirecionamento",
        variant: "destructive"
      });
    }
  };

  const addCanonicalRule = async () => {
    try {
      const { error } = await supabase
        .from('canonical_rules')
        .insert([{
          ...newCanonical,
          id: crypto.randomUUID()
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Regra canônica adicionada com sucesso!"
      });

      setNewCanonical({
        pattern: '',
        canonical_url: '',
        is_active: true
      });
      setIsDialogOpen(false);
      loadTechnicalSEOSettings();
    } catch (error) {
      console.error('Error adding canonical rule:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar regra canônica",
        variant: "destructive"
      });
    }
  };

  const generateSitemap = async () => {
    try {
      // Gerar sitemap baseado nas páginas do site
      const pages = [
        { url: '/', priority: 1.0, changefreq: 'daily' },
        { url: '/sobre', priority: 0.8, changefreq: 'monthly' },
        { url: '/servicos', priority: 0.9, changefreq: 'weekly' },
        { url: '/modelos', priority: 0.9, changefreq: 'daily' },
        { url: '/localizacoes', priority: 0.8, changefreq: 'weekly' },
        { url: '/blog', priority: 0.7, changefreq: 'weekly' },
        { url: '/contato', priority: 0.6, changefreq: 'monthly' }
      ];

      const sitemap = generateSitemapXML(pages);
      
      // Salvar sitemap no storage ou como arquivo
      toast({
        title: "Sucesso",
        description: "Sitemap gerado com sucesso!"
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar sitemap",
        variant: "destructive"
      });
    }
  };

  const generateSitemapXML = (pages: any[]) => {
    const baseUrl = 'https://fivelondon.com';
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  };

  const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://fivelondon.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin pages
Disallow: /admin/
Disallow: /api/
Disallow: /login/
Disallow: /private/`;

  const openDialog = (type: 'redirect' | 'canonical' | 'sitemap') => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title="SEO Técnico - Five London Admin"
        description="Gerencie configurações técnicas de SEO"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SEO Técnico</h1>
            <p className="text-muted-foreground">
              Configure robots.txt, sitemaps, redirects e URLs canônicas
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="robots">Robots.txt</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            <TabsTrigger value="redirects">Redirects</TabsTrigger>
            <TabsTrigger value="canonical">URLs Canônicas</TabsTrigger>
          </TabsList>

          <TabsContent value="robots" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração do Robots.txt</CardTitle>
                <CardDescription>
                  Configure quais páginas os crawlers podem acessar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="robots_txt">Conteúdo do Robots.txt</Label>
                  <Textarea
                    id="robots_txt"
                    value={settings.robots_txt}
                    onChange={(e) => setSettings(prev => ({ ...prev, robots_txt: e.target.value }))}
                    rows={15}
                    className="font-mono text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={saveRobotsTxt} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar Robots.txt'}
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver Atual
                    </a>
                  </Button>
                </div>

                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Dicas:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Use "Allow: /" para permitir crawling de todas as páginas</li>
                    <li>• Use "Disallow: /admin/" para bloquear páginas administrativas</li>
                    <li>• Inclua URLs de sitemap para facilitar indexação</li>
                    <li>• Defina Crawl-delay para controlar velocidade de crawling</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Gerenciamento de Sitemap
                  <Button onClick={generateSitemap}>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Sitemap
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure e gerencie sitemaps XML para indexação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>URLs de Sitemap Configuradas</Label>
                  {settings.sitemap_urls.length > 0 ? (
                    <div className="space-y-2">
                      {settings.sitemap_urls.map((url, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{url}</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Nenhum sitemap configurado</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sitemap Principal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Sitemap principal com todas as páginas do site
                      </p>
                      <Button variant="outline" size="sm" asChild>
                        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Sitemap
                        </a>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ferramentas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href="https://search.google.com/search-console" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Google Search Console
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href="https://www.bing.com/webmasters" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Bing Webmaster
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redirects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Gerenciamento de Redirects
                  <Button onClick={() => openDialog('redirect')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Redirect
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure redirecionamentos 301/302 para URLs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.redirects.map((redirect) => (
                    <div key={redirect.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={redirect.status_code === 301 ? "default" : "secondary"}>
                            {redirect.status_code}
                          </Badge>
                          {redirect.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="font-mono">{redirect.from_path}</span>
                          <span className="mx-2">→</span>
                          <span className="font-mono">{redirect.to_path}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja remover este redirect?')) {
                            deleteRedirect(redirect.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {settings.redirects.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhum redirecionamento configurado ainda.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="canonical" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  URLs Canônicas
                  <Button onClick={() => openDialog('canonical')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Regra
                  </Button>
                </CardTitle>
                <CardDescription>
                  Configure URLs canônicas para evitar conteúdo duplicado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.canonical_rules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {rule.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm">
                          <div><strong>Padrão:</strong> <span className="font-mono">{rule.pattern}</span></div>
                          <div><strong>Canônica:</strong> <span className="font-mono">{rule.canonical_url}</span></div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja remover esta regra?')) {
                            // deleteCanonicalRule(rule.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {settings.canonical_rules.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma regra canônica configurada ainda.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogType === 'redirect' && 'Novo Redirecionamento'}
                {dialogType === 'canonical' && 'Nova Regra Canônica'}
                {dialogType === 'sitemap' && 'Novo Sitemap'}
              </DialogTitle>
            </DialogHeader>

            {dialogType === 'redirect' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="from_path">De (URL origem)</Label>
                  <Input
                    id="from_path"
                    value={newRedirect.from_path}
                    onChange={(e) => setNewRedirect(prev => ({ ...prev, from_path: e.target.value }))}
                    placeholder="/pagina-antiga"
                  />
                </div>
                <div>
                  <Label htmlFor="to_path">Para (URL destino)</Label>
                  <Input
                    id="to_path"
                    value={newRedirect.to_path}
                    onChange={(e) => setNewRedirect(prev => ({ ...prev, to_path: e.target.value }))}
                    placeholder="/pagina-nova"
                  />
                </div>
                <div>
                  <Label htmlFor="status_code">Código de Status</Label>
                  <select
                    id="status_code"
                    value={newRedirect.status_code}
                    onChange={(e) => setNewRedirect(prev => ({ ...prev, status_code: parseInt(e.target.value) }))}
                    className="w-full p-2 border rounded"
                  >
                    <option value={301}>301 - Permanente</option>
                    <option value={302}>302 - Temporário</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="redirect_active"
                    checked={newRedirect.is_active}
                    onCheckedChange={(checked) => setNewRedirect(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="redirect_active">Ativo</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addRedirect}>
                    Adicionar
                  </Button>
                </div>
              </div>
            )}

            {dialogType === 'canonical' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pattern">Padrão de URL</Label>
                  <Input
                    id="pattern"
                    value={newCanonical.pattern}
                    onChange={(e) => setNewCanonical(prev => ({ ...prev, pattern: e.target.value }))}
                    placeholder="/categoria/*"
                  />
                </div>
                <div>
                  <Label htmlFor="canonical_url">URL Canônica</Label>
                  <Input
                    id="canonical_url"
                    value={newCanonical.canonical_url}
                    onChange={(e) => setNewCanonical(prev => ({ ...prev, canonical_url: e.target.value }))}
                    placeholder="/categoria/"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="canonical_active"
                    checked={newCanonical.is_active}
                    onCheckedChange={(checked) => setNewCanonical(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="canonical_active">Ativo</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addCanonicalRule}>
                    Adicionar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};