import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, Eye, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHomepageContent } from '@/hooks/useHomepageContent';
import { ImageUpload } from '@/components/ImageUpload';
import { ImageReprocessor } from '@/components/ImageReprocessor';
import { BannerPreviewSimulator } from '@/components/BannerPreviewSimulator';

interface HomepageContent {
  hero_main: any;
  about_preview: any;
  services_preview: any;
}

export const HomepageManager: React.FC = () => {
  const [content, setContent] = useState<HomepageContent>({
    hero_main: null,
    about_preview: null,
    services_preview: null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();
  const { heroContent, updateHeroContent, loading: heroLoading } = useHomepageContent();

  // Local state for hero section editing
  const [heroFormData, setHeroFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    image_url_desktop: '',
    image_url_mobile: '',
    button_primary_text: '',
    button_primary_url: ''
  });

  // Update form data when hero content loads
  useEffect(() => {
    if (!heroLoading && heroContent) {
      setHeroFormData({
        title: heroContent.title || '',
        subtitle: heroContent.subtitle || '',
        content: heroContent.content || '',
        image_url: heroContent.image_url || '',
        image_url_desktop: heroContent.image_url_desktop || '',
        image_url_mobile: heroContent.image_url_mobile || '',
        button_primary_text: heroContent.button_primary_text || '',
        button_primary_url: heroContent.button_primary_url || ''
      });
    }
  }, [heroContent, heroLoading]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .in('section', ['homepage_hero_main', 'homepage_about_preview', 'homepage_services_preview']);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        const key = item.section.replace('homepage_', '');
        contentMap[key] = item;
      });

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar conteúdo da homepage",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (section: string, updates: any) => {
    setSaving(section);
    try {
      const { error } = await supabase
        .from('site_content')
        .update(updates)
        .eq('section', `homepage_${section}`);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conteúdo atualizado com sucesso!",
      });

      loadContent();
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conteúdo",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const updateField = (section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof HomepageContent],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar Homepage</h2>
        <p className="text-muted-foreground">
          Edite o conteúdo das principais seções da homepage
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">Sobre Preview</TabsTrigger>
          <TabsTrigger value="services">Serviços Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Principal</CardTitle>
              <CardDescription>
                Seção principal da homepage com título, subtítulo e descrição
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Live Preview Simulator */}
              <BannerPreviewSimulator
                desktopImage={heroFormData.image_url_desktop}
                mobileImage={heroFormData.image_url_mobile}
                fallbackImage={heroFormData.image_url}
                title={heroFormData.title}
                subtitle={heroFormData.subtitle}
              />

              {/* Text Content Preview */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Conteúdo Textual</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>Título:</strong> {heroFormData.title}</div>
                  <div><strong>Subtítulo:</strong> {heroFormData.subtitle}</div>
                  <div><strong>Descrição:</strong> {heroFormData.content?.substring(0, 100)}...</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-title">Título Principal</Label>
                <Input
                  id="hero-title"
                  value={heroFormData.title}
                  onChange={(e) => setHeroFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título principal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                <Input
                  id="hero-subtitle"
                  value={heroFormData.subtitle}
                  onChange={(e) => setHeroFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-content">Descrição Principal</Label>
                <Textarea
                  id="hero-content"
                  value={heroFormData.content}
                  onChange={(e) => setHeroFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Digite a descrição principal que aparece ao passar o mouse"
                  rows={4}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Desktop Banner */}
                <div className="space-y-3 p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <Label className="flex items-center gap-2 font-semibold text-blue-700">
                      <Upload className="h-4 w-4" />
                      Banner Desktop
                    </Label>
                  </div>
                  <ImageUpload
                    value={heroFormData.image_url_desktop}
                    onChange={(url) => {
                      console.log('🖥️ [DESKTOP BANNER] URL alterada para:', url);
                      console.log('🖥️ [DESKTOP BANNER] Campo específico: image_url_desktop');
                      setHeroFormData(prev => {
                        const updated = { ...prev, image_url_desktop: url };
                        console.log('🖥️ [DESKTOP BANNER] Estado atualizado:', updated);
                        return updated;
                      });
                    }}
                    placeholder="URL da imagem desktop ou faça upload"
                    label="Banner Desktop"
                  />
                  <p className="text-xs text-blue-600">
                    🖥️ <strong>Desktop:</strong> Imagem otimizada para telas grandes. Recomendamos proporção 16:9 (ex: 1920x1080).
                  </p>
                  
                  {/* Desktop Image Reprocessor */}
                  {/* Convert to WebP Button */}
                  {heroFormData.image_url_desktop && heroFormData.image_url_desktop.includes('supabase.co') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          toast({
                            title: "Processando",
                            description: "Convertendo banner para WebP otimizado..."
                          });
                          
                          const { data: fixData, error: fixError } = await supabase.functions
                            .invoke('fix-image-to-local', {
                              body: { 
                                imageUrl: heroFormData.image_url_desktop,
                                category: 'Hero/Banners',
                                itemId: 'homepage-hero-desktop',
                                tableName: 'site_content',
                                fieldName: 'image_url_local_desktop',
                                itemName: 'Homepage Hero Desktop',
                                altText: 'Elite London Escort Agency — luxury banner'
                              }
                            });

                          if (fixError) {
                            throw fixError;
                          }

                          if (fixData?.success) {
                            // Force reload after cache purge
                            setTimeout(() => {
                              window.location.reload();
                            }, 2000);
                            
                            toast({
                              title: "Sucesso",
                              description: "Banner convertido para WebP! Recarregando página..."
                            });
                          }
                        } catch (error) {
                          console.error('Fix error:', error);
                          toast({
                            title: "Erro",
                            description: "Erro ao converter banner",
                            variant: "destructive"
                          });
                        }
                      }}
                      className="w-full"
                    >
                      🔧 Converter para WebP Local
                    </Button>
                  )}
                  {heroFormData.image_url_desktop && (
                    <div className="text-xs p-2 bg-green-100 text-green-700 rounded border border-green-200">
                      ✅ Imagem desktop configurada: {heroFormData.image_url_desktop.substring(0, 50)}...
                    </div>
                  )}
                  {/* Preview Desktop */}
                  {heroFormData.image_url_desktop && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-xs text-blue-600 mb-1">Preview Desktop:</div>
                      <img 
                        src={heroFormData.image_url_desktop} 
                        alt="Preview desktop" 
                        className="w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          console.error('❌ [DESKTOP BANNER] Erro ao carregar preview:', heroFormData.image_url_desktop);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Mobile Banner */}
                <div className="space-y-3 p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <Label className="flex items-center gap-2 font-semibold text-green-700">
                      <Upload className="h-4 w-4" />
                      Banner Mobile
                    </Label>
                  </div>
                  <ImageUpload
                    value={heroFormData.image_url_mobile}
                    onChange={(url) => {
                      console.log('📱 [MOBILE BANNER] URL alterada para:', url);
                      console.log('📱 [MOBILE BANNER] Campo específico: image_url_mobile');
                      setHeroFormData(prev => {
                        const updated = { ...prev, image_url_mobile: url };
                        console.log('📱 [MOBILE BANNER] Estado atualizado:', updated);
                        return updated;
                      });
                    }}
                    placeholder="URL da imagem mobile ou faça upload"
                    label="Banner Mobile"
                  />
                  <p className="text-xs text-green-600">
                    📱 <strong>Mobile:</strong> Imagem otimizada para celulares. Recomendamos proporção vertical (ex: 768x1024).
                  </p>
                  
                  {/* Mobile Image Reprocessor */}
                  <ImageReprocessor
                    currentImageUrl={heroFormData.image_url_mobile}
                    onImageReprocessed={(localUrl) => {
                      setHeroFormData(prev => ({
                        ...prev,
                        image_url_local_mobile: localUrl
                      }));
                    }}
                    section="homepage_hero_mobile"
                    disabled={!heroFormData.image_url_mobile}
                  />
                  {heroFormData.image_url_mobile && (
                    <div className="text-xs p-2 bg-green-100 text-green-700 rounded border border-green-200">
                      ✅ Imagem mobile configurada: {heroFormData.image_url_mobile.substring(0, 50)}...
                    </div>
                  )}
                  {/* Preview Mobile */}
                  {heroFormData.image_url_mobile && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <div className="text-xs text-green-600 mb-1">Preview Mobile:</div>
                      <img 
                        src={heroFormData.image_url_mobile} 
                        alt="Preview mobile" 
                        className="w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          console.error('❌ [MOBILE BANNER] Erro ao carregar preview:', heroFormData.image_url_mobile);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Fallback Banner */}
              <div className="space-y-2 p-4 border rounded-lg bg-gray-50">
                <Label className="flex items-center gap-2 text-gray-700">
                  <Upload className="h-4 w-4" />
                  Banner Geral (Fallback)
                </Label>
                <ImageUpload
                  value={heroFormData.image_url}
                  onChange={(url) => {
                    console.log('Fallback banner changed to:', url);
                    setHeroFormData(prev => ({ ...prev, image_url: url }));
                  }}
                  placeholder="URL da imagem geral ou faça upload"
                  label="Banner Geral"
                />
                <p className="text-xs text-gray-600">
                  🔄 Imagem de fallback usada quando não há imagens específicas para desktop ou mobile.
                </p>
                
                {/* Fallback Image Reprocessor */}
                <ImageReprocessor
                  currentImageUrl={heroFormData.image_url}
                  onImageReprocessed={(localUrl) => {
                    setHeroFormData(prev => ({
                      ...prev,
                      image_url_local_fallback: localUrl
                    }));
                  }}
                  section="homepage_hero_main"
                  disabled={!heroFormData.image_url}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-button-text">Texto do Botão Principal</Label>
                  <Input
                    id="hero-button-text"
                    value={heroFormData.button_primary_text}
                    onChange={(e) => setHeroFormData(prev => ({ ...prev, button_primary_text: e.target.value }))}
                    placeholder="Ex: View Models"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-button-url">URL do Botão Principal</Label>
                  <Input
                    id="hero-button-url"
                    value={heroFormData.button_primary_url}
                    onChange={(e) => setHeroFormData(prev => ({ ...prev, button_primary_url: e.target.value }))}
                    placeholder="Ex: /models"
                  />
                </div>
              </div>

              {/* Enhanced Debug Panel */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-yellow-700 mb-3">🔧 Debug & Validation Info</summary>
                  <div className="text-xs space-y-2 text-yellow-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-semibold mb-1">Estado Atual:</div>
                        <div><strong>Desktop:</strong> {heroFormData.image_url_desktop ? `✅ ${heroFormData.image_url_desktop.substring(0, 30)}...` : '❌ Vazio'}</div>
                        <div><strong>Mobile:</strong> {heroFormData.image_url_mobile ? `✅ ${heroFormData.image_url_mobile.substring(0, 30)}...` : '❌ Vazio'}</div>
                        <div><strong>Fallback:</strong> {heroFormData.image_url ? `✅ ${heroFormData.image_url.substring(0, 30)}...` : '❌ Vazio'}</div>
                      </div>
                      <div>
                        <div className="font-semibold mb-1">Validação:</div>
                        <div className={heroFormData.image_url_desktop ? 'text-green-600' : 'text-red-600'}>
                          🖥️ Desktop: {heroFormData.image_url_desktop ? 'Válido' : 'Necessário'}
                        </div>
                        <div className={heroFormData.image_url_mobile ? 'text-green-600' : 'text-orange-600'}>
                          📱 Mobile: {heroFormData.image_url_mobile ? 'Válido' : 'Recomendado'}
                        </div>
                        <div className={heroFormData.image_url ? 'text-green-600' : 'text-red-600'}>
                          🔄 Fallback: {heroFormData.image_url ? 'Válido' : 'Necessário'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-white rounded border">
                      <div className="font-semibold mb-1">Simulação de Exibição:</div>
                      <div>📱 <strong>No Mobile será exibido:</strong> {heroFormData.image_url_mobile || heroFormData.image_url || 'Imagem padrão'}</div>
                      <div>🖥️ <strong>No Desktop será exibido:</strong> {heroFormData.image_url_desktop || heroFormData.image_url || 'Imagem padrão'}</div>
                    </div>
                  </div>
                </details>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    console.log('🚀 [SAVE] Iniciando salvamento com dados:', heroFormData);
                    console.log('🚀 [SAVE] Desktop URL:', heroFormData.image_url_desktop);
                    console.log('🚀 [SAVE] Mobile URL:', heroFormData.image_url_mobile);
                    console.log('🚀 [SAVE] Fallback URL:', heroFormData.image_url);
                    
                    setSaving('hero_main');
                    
                    // Validação antes de salvar
                    if (!heroFormData.image_url_desktop && !heroFormData.image_url_mobile && !heroFormData.image_url) {
                      toast({
                        title: "Aviso",
                        description: "Configure pelo menos uma imagem (desktop, mobile ou fallback)",
                        variant: "destructive",
                      });
                      setSaving(null);
                      return;
                    }
                    
                    const success = await updateHeroContent(heroFormData);
                    if (success) {
                      console.log('✅ [SAVE] Dados salvos com sucesso');
                      toast({
                        title: "Sucesso",
                        description: `Configuração salva! Desktop: ${heroFormData.image_url_desktop ? '✅' : '❌'} | Mobile: ${heroFormData.image_url_mobile ? '✅' : '❌'}`,
                      });
                    } else {
                      console.error('❌ [SAVE] Falha ao salvar dados');
                    }
                    setSaving(null);
                  }}
                  disabled={saving === 'hero_main' || heroLoading}
                  className="flex-1"
                >
                {saving === 'hero_main' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Configuração de Banners
              </Button>
              <Button 
                onClick={async () => {
                  const { processBannerComplete } = await import('@/utils/bannerProcessor');
                  await processBannerComplete();
                  toast({
                    title: "Sucesso",
                    description: "Cache do banner atualizado com sucesso!",
                  });
                }}
                variant="outline"
                className="whitespace-nowrap"
              >
                Atualizar Cache
              </Button>
            </div>

              <div className="text-xs text-muted-foreground p-3 bg-blue-50 rounded border">
                <strong>💡 Dica:</strong> As alterações aqui afetam diretamente a seção principal da homepage. 
                Vá para a página inicial para ver as mudanças em tempo real.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Seção Sobre</CardTitle>
              <CardDescription>
                Prévia da seção sobre exibida na homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Título</Label>
                <Input
                  id="about-title"
                  value={content.about_preview?.title || ''}
                  onChange={(e) => updateField('about_preview', 'title', e.target.value)}
                  placeholder="Digite o título da seção sobre"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about-subtitle">Subtítulo</Label>
                <Input
                  id="about-subtitle"
                  value={content.about_preview?.subtitle || ''}
                  onChange={(e) => updateField('about_preview', 'subtitle', e.target.value)}
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about-content">Descrição</Label>
                <Textarea
                  id="about-content"
                  value={content.about_preview?.content || ''}
                  onChange={(e) => updateField('about_preview', 'content', e.target.value)}
                  placeholder="Digite a descrição da seção sobre"
                  rows={4}
                />
              </div>

              <Button
                onClick={() => updateContent('about_preview', {
                  title: content.about_preview?.title,
                  subtitle: content.about_preview?.subtitle,
                  content: content.about_preview?.content,
                  updated_at: new Date().toISOString()
                })}
                disabled={saving === 'about_preview'}
              >
                {saving === 'about_preview' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Sobre Preview
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Preview da Seção Serviços</CardTitle>
              <CardDescription>
                Prévia da seção serviços exibida na homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="services-title">Título</Label>
                <Input
                  id="services-title"
                  value={content.services_preview?.title || ''}
                  onChange={(e) => updateField('services_preview', 'title', e.target.value)}
                  placeholder="Digite o título da seção serviços"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services-subtitle">Subtítulo</Label>
                <Input
                  id="services-subtitle"
                  value={content.services_preview?.subtitle || ''}
                  onChange={(e) => updateField('services_preview', 'subtitle', e.target.value)}
                  placeholder="Digite o subtítulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="services-content">Descrição</Label>
                <Textarea
                  id="services-content"
                  value={content.services_preview?.content || ''}
                  onChange={(e) => updateField('services_preview', 'content', e.target.value)}
                  placeholder="Digite a descrição da seção serviços"
                  rows={4}
                />
              </div>

              <Button
                onClick={() => updateContent('services_preview', {
                  title: content.services_preview?.title,
                  subtitle: content.services_preview?.subtitle,
                  content: content.services_preview?.content,
                  updated_at: new Date().toISOString()
                })}
                disabled={saving === 'services_preview'}
              >
                {saving === 'services_preview' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Serviços Preview
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};