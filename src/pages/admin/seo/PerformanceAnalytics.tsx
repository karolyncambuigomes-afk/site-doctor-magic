import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Eye, Search, Clock, Smartphone, Monitor, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PagePerformance {
  url: string;
  title: string;
  seo_score: number;
  meta_title_length: number;
  meta_description_length: number;
  keywords_count: number;
  content_score: number;
  performance_score: number;
  last_updated: string;
}

interface SEOMetrics {
  total_pages: number;
  avg_seo_score: number;
  pages_with_issues: number;
  pages_optimized: number;
  meta_tags_coverage: number;
  structured_data_coverage: number;
}

const mockPerformanceData = [
  { date: '2024-01-01', seo_score: 75, performance: 82, accessibility: 90 },
  { date: '2024-01-08', seo_score: 78, performance: 85, accessibility: 88 },
  { date: '2024-01-15', seo_score: 82, performance: 88, accessibility: 92 },
  { date: '2024-01-22', seo_score: 85, performance: 90, accessibility: 94 },
  { date: '2024-01-29', seo_score: 88, performance: 92, accessibility: 96 }
];

const mockPageData = [
  { page: '/', visits: 1250, avg_position: 5.2, ctr: 8.5 },
  { page: '/modelos', visits: 980, avg_position: 3.8, ctr: 12.3 },
  { page: '/servicos', visits: 750, avg_position: 7.1, ctr: 6.8 },
  { page: '/sobre', visits: 420, avg_position: 15.2, ctr: 4.2 },
  { page: '/contato', visits: 320, avg_position: 9.8, ctr: 7.1 }
];

export const PerformanceAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    total_pages: 0,
    avg_seo_score: 0,
    pages_with_issues: 0,
    pages_optimized: 0,
    meta_tags_coverage: 0,
    structured_data_coverage: 0
  });
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Carregar métricas de SEO
      const { data: seoData } = await supabase
        .from('page_seo')
        .select('*');

      const { data: structuredData } = await supabase
        .from('structured_data')
        .select('*');

      // Calcular métricas
      const totalPages = seoData?.length || 0;
      const avgScore = seoData?.reduce((acc, page) => {
        const score = calculatePageSEOScore(page);
        return acc + score;
      }, 0) / totalPages || 0;

      const pagesWithIssues = seoData?.filter(page => calculatePageSEOScore(page) < 70).length || 0;
      const pagesOptimized = seoData?.filter(page => calculatePageSEOScore(page) >= 80).length || 0;
      
      setMetrics({
        total_pages: totalPages,
        avg_seo_score: Math.round(avgScore),
        pages_with_issues: pagesWithIssues,
        pages_optimized: pagesOptimized,
        meta_tags_coverage: totalPages > 0 ? Math.round((totalPages / totalPages) * 100) : 0,
        structured_data_coverage: totalPages > 0 ? Math.round((structuredData?.length || 0) / totalPages * 100) : 0
      });

      // Preparar dados de performance por página
      const performanceData = seoData?.map(page => ({
        url: page.page_path,
        title: page.page_title || page.page_path,
        seo_score: calculatePageSEOScore(page),
        meta_title_length: page.meta_title?.length || 0,
        meta_description_length: page.meta_description?.length || 0,
        keywords_count: page.keywords?.length || 0,
        content_score: Math.random() * 40 + 60, // Mock data
        performance_score: Math.random() * 30 + 70, // Mock data
        last_updated: page.updated_at
      })) || [];

      setPagePerformance(performanceData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados de analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePageSEOScore = (page: any): number => {
    let score = 0;
    
    // Meta title (30 pontos)
    if (page.meta_title) {
      if (page.meta_title.length >= 30 && page.meta_title.length <= 60) {
        score += 30;
      } else if (page.meta_title.length > 0) {
        score += 15;
      }
    }
    
    // Meta description (25 pontos)
    if (page.meta_description) {
      if (page.meta_description.length >= 120 && page.meta_description.length <= 160) {
        score += 25;
      } else if (page.meta_description.length > 0) {
        score += 12;
      }
    }
    
    // Keywords (20 pontos)
    if (page.keywords && page.keywords.length > 0) {
      if (page.keywords.length >= 3 && page.keywords.length <= 10) {
        score += 20;
      } else {
        score += 10;
      }
    }
    
    // Social media tags (15 pontos)
    if (page.og_title || page.twitter_title) score += 8;
    if (page.og_description || page.twitter_description) score += 7;
    
    // URL structure (10 pontos)
    if (page.page_path && page.page_path.length > 0 && !page.page_path.includes('?')) {
      score += 10;
    }
    
    return Math.min(score, 100);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
    toast({
      title: "Atualizado",
      description: "Dados de performance atualizados com sucesso!"
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
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
        title="Performance Analytics - Five London Admin"
        description="Analytics e métricas de performance SEO"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
            <p className="text-muted-foreground">
              Métricas detalhadas de SEO e performance do site
            </p>
          </div>
          
          <Button onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Métricas Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score SEO Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avg_seo_score}%</div>
              <p className="text-xs text-muted-foreground">
                +2.5% vs mês anterior
              </p>
              <Progress value={metrics.avg_seo_score} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Páginas Otimizadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pages_optimized}</div>
              <p className="text-xs text-muted-foreground">
                de {metrics.total_pages} páginas
              </p>
              <Progress value={(metrics.pages_optimized / metrics.total_pages) * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Páginas com Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pages_with_issues}</div>
              <p className="text-xs text-muted-foreground">
                precisam de atenção
              </p>
              <Progress 
                value={(metrics.pages_with_issues / metrics.total_pages) * 100} 
                className="mt-2" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cobertura Meta Tags</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.meta_tags_coverage}%</div>
              <p className="text-xs text-muted-foreground">
                das páginas configuradas
              </p>
              <Progress value={metrics.meta_tags_coverage} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="pages">Por Página</TabsTrigger>
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance ao Longo do Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="seo_score" stroke="#8884d8" name="SEO Score" />
                      <Line type="monotone" dataKey="performance" stroke="#82ca9d" name="Performance" />
                      <Line type="monotone" dataKey="accessibility" stroke="#ffc658" name="Accessibility" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Páginas por Tráfego</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockPageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="page" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="visits" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Página</CardTitle>
                <CardDescription>
                  Análise detalhada de cada página do site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pagePerformance.map((page) => (
                    <div key={page.url} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{page.url}</Badge>
                          <h3 className="font-semibold">{page.title}</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">SEO Score:</span>
                            <span className={`ml-2 font-semibold ${getScoreColor(page.seo_score)}`}>
                              {page.seo_score}%
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Meta Title:</span>
                            <span className="ml-2">{page.meta_title_length} chars</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Meta Desc:</span>
                            <span className="ml-2">{page.meta_description_length} chars</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Keywords:</span>
                            <span className="ml-2">{page.keywords_count}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-16 h-8 rounded flex items-center justify-center text-xs font-bold ${getScoreBg(page.seo_score)} ${getScoreColor(page.seo_score)}`}>
                          {page.seo_score}%
                        </div>
                      </div>
                    </div>
                  ))}

                  {pagePerformance.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      Nenhuma página encontrada para análise.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tendência de Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>escort london</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">+15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>luxury companions</span>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm">+8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>premium services</span>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        <span className="text-sm">-3%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dispositivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Mobile</span>
                      </div>
                      <span className="text-sm font-semibold">68%</span>
                    </div>
                    <Progress value={68} />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <span>Desktop</span>
                      </div>
                      <span className="text-sm font-semibold">32%</span>
                    </div>
                    <Progress value={32} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Issues Encontradas</CardTitle>
                <CardDescription>
                  Problemas que precisam de atenção imediata
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pagePerformance
                    .filter(page => page.seo_score < 70)
                    .map((page) => (
                      <div key={page.url} className="flex items-start gap-3 p-4 border rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{page.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{page.url}</p>
                          <div className="space-y-1 text-sm">
                            {page.meta_title_length === 0 && (
                              <div className="text-red-600">• Meta title ausente</div>
                            )}
                            {page.meta_title_length > 60 && (
                              <div className="text-yellow-600">• Meta title muito longo ({page.meta_title_length} chars)</div>
                            )}
                            {page.meta_description_length === 0 && (
                              <div className="text-red-600">• Meta description ausente</div>
                            )}
                            {page.meta_description_length > 160 && (
                              <div className="text-yellow-600">• Meta description muito longa ({page.meta_description_length} chars)</div>
                            )}
                            {page.keywords_count === 0 && (
                              <div className="text-yellow-600">• Nenhuma palavra-chave definida</div>
                            )}
                          </div>
                        </div>
                        <Badge variant="destructive">{page.seo_score}%</Badge>
                      </div>
                    ))}

                  {pagePerformance.filter(page => page.seo_score < 70).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      Nenhuma issue crítica encontrada!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};