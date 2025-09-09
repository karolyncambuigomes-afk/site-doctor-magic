import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { HomepageManager } from '@/components/HomepageManager';
import { SiteContentManager } from '@/components/SiteContentManager';
import { FAQManager } from '@/components/FAQManager';
import { GalleryManager } from '@/components/GalleryManager';
import { Home, FileText, HelpCircle, Image, Layout } from 'lucide-react';

export const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('homepage');

  return (
    <AdminLayout>
      <SEO 
        title="Gerenciar Conteúdo - Five London Admin"
        description="Gerencie todo o conteúdo do site"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Conteúdo</h1>
            <p className="text-muted-foreground">
              Configure e gerencie todo o conteúdo do site
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="homepage" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Homepage
            </TabsTrigger>
            <TabsTrigger value="site-content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Conteúdo Geral
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Galeria
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
          </TabsList>

          <TabsContent value="homepage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuração da Homepage</CardTitle>
                <CardDescription>
                  Gerencie o conteúdo e configurações da página inicial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HomepageManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="site-content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo Geral do Site</CardTitle>
                <CardDescription>
                  Configure textos, descrições e conteúdo geral das páginas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SiteContentManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Gerencie as perguntas e respostas mais comuns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FAQManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Imagens</CardTitle>
                <CardDescription>
                  Gerencie as imagens e galerias do site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GalleryManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Layout</CardTitle>
                  <CardDescription>
                    Configure a aparência geral do site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Cores do Tema</h4>
                      <p className="text-sm text-muted-foreground">
                        As cores são configuradas através do sistema de design no arquivo tailwind.config.ts
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Tipografia</h4>
                      <p className="text-sm text-muted-foreground">
                        As fontes são configuradas através do sistema de design
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Layout Responsivo</h4>
                      <p className="text-sm text-muted-foreground">
                        O site é otimizado para todos os dispositivos automaticamente
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Navegação</CardTitle>
                  <CardDescription>
                    Configure menus e navegação do site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Menu Principal</h4>
                      <p className="text-sm text-muted-foreground">
                        O menu principal é configurado no componente Navigation
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Footer</h4>
                      <p className="text-sm text-muted-foreground">
                        O rodapé é configurado no componente Footer
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Breadcrumbs</h4>
                      <p className="text-sm text-muted-foreground">
                        Navegação estrutural automática baseada nas rotas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};