import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  Image, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Search,
  Globe,
  Target
} from 'lucide-react';

interface DashboardStats {
  totalModels: number;
  pendingApplications: number;
  publishedBlogs: number;
  totalUsers: number;
  seoScore: number;
  recentActivity: any[];
}

export const AdminDashboard: React.FC = () => {
  console.log('📊 AdminDashboard rendering');
  const [stats, setStats] = useState<DashboardStats>({
    totalModels: 0,
    pendingApplications: 0,
    publishedBlogs: 0,
    totalUsers: 0,
    seoScore: 85,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const results = await Promise.allSettled([
        supabase.from('models').select('id'),
        supabase.from('model_applications').select('id').eq('status', 'pending'),
        supabase.from('blog_posts').select('id').eq('is_published', true),
        supabase.from('profiles').select('id'),
      ]);

      const safeLength = (res: PromiseSettledResult<any>) => {
        if (res.status !== 'fulfilled') return 0;
        const { data, error } = res.value || {};
        if (error) {
          console.warn('Dashboard stat fetch error:', error);
          return 0;
        }
        return Array.isArray(data) ? data.length : 0;
      };

      setStats({
        totalModels: safeLength(results[0]),
        pendingApplications: safeLength(results[1]),
        publishedBlogs: safeLength(results[2]),
        totalUsers: safeLength(results[3]),
        seoScore: 85,
        recentActivity: [],
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error loading dashboard',
        description: 'Failed to load dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, trend, color = "default" }: any) => (
    <Card className="transition-smooth hover:shadow-elegant">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${
          color === 'success' ? 'text-green-600' :
          color === 'warning' ? 'text-yellow-600' :
          color === 'danger' ? 'text-red-600' :
          'text-muted-foreground'
        }`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-xs text-green-600">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <SEO 
        title="Admin Dashboard - Five London"
        description="Admin panel for managing Five London website"
        noIndex={true}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="luxury-heading-xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Five London admin panel. Manage your content, SEO, and users.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Models"
            value={stats.totalModels}
            icon={Users}
            description="Active models"
            color="default"
          />
          <StatCard
            title="Pending Applications"
            value={stats.pendingApplications}
            icon={Clock}
            description="Awaiting review"
            color={stats.pendingApplications > 0 ? "warning" : "success"}
          />
          <StatCard
            title="Published Blogs"
            value={stats.publishedBlogs}
            icon={FileText}
            description="Live blog posts"
            color="default"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            description="Registered users"
            color="default"
          />
        </div>

        {/* SEO Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Overview
              </CardTitle>
              <CardDescription>
                Current SEO health and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall SEO Score</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {stats.seoScore}/100
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Meta Tags
                  </span>
                  <span className="text-green-600">Optimized</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Structured Data
                  </span>
                  <span className="text-green-600">Active</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    Page Speed
                  </span>
                  <span className="text-yellow-600">Needs Attention</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common admin tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-accent transition-smooth">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">New Blog Post</span>
                </button>
                
                <button className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-accent transition-smooth">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Add Model</span>
                </button>
                
                <button className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-accent transition-smooth">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">SEO Audit</span>
                </button>
                
                <button className="flex items-center gap-2 p-3 text-left border rounded-lg hover:bg-accent transition-smooth">
                  <Image className="h-4 w-4" />
                  <span className="text-sm">Gallery</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity to display</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};