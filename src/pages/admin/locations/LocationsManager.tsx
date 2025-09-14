import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocationsManager as OriginalLocationsManager } from '@/components/LocationsManager';
import { MapPin, Globe, Search } from 'lucide-react';

export const LocationsManager: React.FC = () => {
  return (
    <AdminLayout>
      <SEO 
        title="Gerenciar Localizações - Five London Admin"
        description="Gerencie localizações e configurações geográficas"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Localizações</h1>
            <p className="text-muted-foreground">
              Configure localizações e configurações geográficas do site
            </p>
          </div>
        </div>

        <Tabs defaultValue="locations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localizações
            </TabsTrigger>
            <TabsTrigger value="geo-targeting" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Geo-Targeting
            </TabsTrigger>
            <TabsTrigger value="local-seo" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              SEO Local
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Localizações</CardTitle>
                <CardDescription>
                  Configure as localizações onde os serviços estão disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OriginalLocationsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geo-targeting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Geo-Targeting</CardTitle>
                <CardDescription>
                  Configure conteúdo específico por região geográfica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Detecção de Localização</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      O sistema detecta automaticamente a localização do usuário e adapta o conteúdo
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Conteúdo Regionalizado</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Diferentes regiões podem ter conteúdo personalizado baseado na localização
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Configurações por Área</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium">Central London</h5>
                        <p className="text-sm text-muted-foreground">
                          Zona 1 - Cobertura principal
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium">Greater London</h5>
                        <p className="text-sm text-muted-foreground">
                          Zonas 2-6 - Cobertura estendida
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium">Home Counties</h5>
                        <p className="text-sm text-muted-foreground">
                          Áreas metropolitanas
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h5 className="font-medium">UK Wide</h5>
                        <p className="text-sm text-muted-foreground">
                          Serviços especiais
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local-seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO Local</CardTitle>
                <CardDescription>
                  Otimizações específicas para busca local
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Schema Local Business</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Dados estruturados configurados para:
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• LocalBusiness schema</li>
                        <li>• Informações de contato</li>
                        <li>• Horários de funcionamento</li>
                        <li>• Área de cobertura geográfica</li>
                        <li>• Avaliações e ratings</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Google My Business</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Integração e otimização:
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• Perfil de negócio verificado</li>
                        <li>• Informações consistentes</li>
                        <li>• Posts regulares</li>
                        <li>• Gestão de avaliações</li>
                        <li>• Fotos e mídia atualizada</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Citações Locais</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Diretórios e citações importantes:
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• Yelp Business</li>
                        <li>• Yellow Pages UK</li>
                        <li>• Foursquare</li>
                        <li>• Bing Places</li>
                        <li>• Apple Maps Connect</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Keywords Locais</h4>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Palavras-chave geo-específicas:
                      </p>
                      <ul className="text-sm space-y-1">
                        <li>• "escort london"</li>
                        <li>• "companions central london"</li>
                        <li>• "luxury services mayfair"</li>
                        <li>• "elite companions kensington"</li>
                        <li>• "premium services canary wharf"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};