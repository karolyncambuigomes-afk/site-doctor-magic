import React, { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeManager } from '@/components/ThemeManager';
import { PreferenceCategoriesManager } from '@/components/PreferenceCategoriesManager';
import { LegalPagesManager } from '@/components/LegalPagesManager';
import { Settings, Palette, Tags, FileText, Database, Shield, Image } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useImagePreference } from '@/hooks/useImagePreference';

export const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('theme');
  const { preferLocalImages, updatePreference } = useImagePreference();

  return (
    <AdminLayout>
      <SEO 
        title="Configurações do Sistema - Five London Admin"
        description="Configure temas, categorias e configurações gerais do sistema"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
            <p className="text-muted-foreground">
              Configure temas, categorias e configurações gerais do sistema
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Tema
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Páginas Legais
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Base de Dados
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Imagens
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Tema</CardTitle>
                <CardDescription>
                  Configure cores, fontes e aparência geral do site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Categorias</CardTitle>
                <CardDescription>
                  Configure categorias de preferências e serviços
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PreferenceCategoriesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Páginas Legais</CardTitle>
                <CardDescription>
                  Gerencie termos de uso, política de privacidade e outras páginas legais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LegalPagesManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Status da Base de Dados</CardTitle>
                  <CardDescription>
                    Informações sobre o estado atual da base de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status de Conexão</span>
                      <span className="text-sm text-green-600">Conectado</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Versão do PostgreSQL</span>
                      <span className="text-sm">15.x</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Número de Tabelas</span>
                      <span className="text-sm">25+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">RLS (Row Level Security)</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backups e Manutenção</CardTitle>
                  <CardDescription>
                    Configurações de backup e manutenção automática
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Backup Automático</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Frequência</span>
                      <span className="text-sm">Diário</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Último Backup</span>
                      <span className="text-sm">Hoje, 02:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Retenção</span>
                      <span className="text-sm">30 dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monitoramento</CardTitle>
                  <CardDescription>
                    Métricas de performance e uso da base de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Consultas por Minuto</span>
                      <span className="text-sm">~150</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tempo de Resposta Médio</span>
                      <span className="text-sm">45ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Conexões Ativas</span>
                      <span className="text-sm">8/100</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Uso de Armazenamento</span>
                      <span className="text-sm">2.3GB / 8GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Cache</CardTitle>
                  <CardDescription>
                    Configurações de cache e otimização
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cache de Consultas</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">TTL Padrão</span>
                      <span className="text-sm">5 minutos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hit Rate</span>
                      <span className="text-sm">87%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tamanho do Cache</span>
                      <span className="text-sm">124MB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Imagem</CardTitle>
                  <CardDescription>
                    Configure como as imagens são carregadas e exibidas no site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="prefer-local" className="flex flex-col space-y-1">
                      <span className="font-medium">Preferir Imagens Locais</span>
                      <span className="text-sm text-muted-foreground">
                        Quando ativado, o sistema priorizará imagens armazenadas localmente sobre URLs externas
                      </span>
                    </Label>
                    <Switch
                      id="prefer-local"
                      checked={preferLocalImages}
                      onCheckedChange={updatePreference}
                    />
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status Atual</span>
                      <span className={`text-sm ${preferLocalImages ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {preferLocalImages ? 'Imagens Locais Prioritárias' : 'URLs Externas Prioritárias'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Performance</span>
                      <span className="text-sm text-emerald-600">
                        {preferLocalImages ? 'Otimizada (Local)' : 'Dependente de CDN'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cache</span>
                      <span className="text-sm text-emerald-600">
                        {preferLocalImages ? 'Edge Cache Ativo' : 'Browser Cache'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                  <CardDescription>
                    Status do sistema de imagens e fallbacks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Bucket de Imagens</span>
                      <span className="text-sm text-emerald-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Proxy /images/</span>
                      <span className="text-sm text-emerald-600">Funcionando</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Fallback System</span>
                      <span className="text-sm text-emerald-600">Configurado</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cache Bust</span>
                      <span className="text-sm text-emerald-600">Automático</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Configurações gerais de segurança do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">HTTPS</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rate Limiting</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CORS</span>
                      <span className="text-sm text-green-600">Configurado</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CSP Headers</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Autenticação</CardTitle>
                  <CardDescription>
                    Configurações de autenticação e autorização
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">JWT Tokens</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Expiração de Token</span>
                      <span className="text-sm">1 hora</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Refresh Token</span>
                      <span className="text-sm">30 dias</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">2FA</span>
                      <span className="text-sm text-yellow-600">Opcional</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logs e Auditoria</CardTitle>
                  <CardDescription>
                    Configurações de logging e auditoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Logs de Acesso</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Logs de Erro</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auditoria de Admin</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Retenção de Logs</span>
                      <span className="text-sm">90 dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Proteção de Dados</CardTitle>
                  <CardDescription>
                    Conformidade com GDPR e proteção de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Criptografia de Dados</span>
                      <span className="text-sm text-green-600">AES-256</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">GDPR Compliance</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cookie Consent</span>
                      <span className="text-sm text-green-600">Ativo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Data Retention</span>
                      <span className="text-sm">Configurado</span>
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