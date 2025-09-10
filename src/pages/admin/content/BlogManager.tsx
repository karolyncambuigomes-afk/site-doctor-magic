import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/ImageUpload';
import { BlogMigrationManager } from '@/components/BlogMigrationManager';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Target,
  Globe,
  Save,
  RefreshCw,
  Upload
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  meta_description: string;
  seo_keywords: string;
  service_keywords: string[];
  is_published: boolean;
  read_time: number;
  created_at: string;
}

export const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePost = async (postData: Partial<BlogPost>) => {
    try {
      if (editingPost?.id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post updated successfully"
        });
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Blog post created successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingPost(null);
      loadBlogPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive"
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully"
      });
      
      loadBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
    }
  };

  const calculateSEOScore = (post: BlogPost) => {
    let score = 0;
    if (post.title && post.title.length >= 30 && post.title.length <= 60) score += 25;
    if (post.meta_description && post.meta_description.length >= 120 && post.meta_description.length <= 160) score += 25;
    if (post.seo_keywords && post.seo_keywords.length > 0) score += 25;
    if (post.excerpt && post.excerpt.length >= 120) score += 25;
    return score;
  };

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
        title="Blog Management - Admin"
        description="Manage blog posts and SEO optimization"
        noIndex={true}
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="luxury-heading-xl mb-2 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Blog Management
            </h1>
            <p className="text-muted-foreground">
              Create and manage blog posts with advanced SEO optimization.
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPost(null)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Blog Post
              </Button>
            </DialogTrigger>
            <BlogPostDialog 
              post={editingPost} 
              onSave={handleSavePost}
              onClose={() => setIsDialogOpen(false)}
            />
          </Dialog>
        </div>

        {/* Migration Manager */}
        <BlogMigrationManager />

        {/* Blog Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>
              Manage your blog posts with SEO optimization insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SEO Score</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{post.title}</p>
                        <p className="text-sm text-muted-foreground">{post.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.is_published ? "default" : "secondary"}>
                        {post.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getSEOScoreColor(calculateSEOScore(post))}`}>
                        {calculateSEOScore(post)}/100
                      </span>
                    </TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPost(post);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

const BlogPostDialog: React.FC<{
  post: BlogPost | null;
  onSave: (data: Partial<BlogPost>) => void;
  onClose: () => void;
}> = ({ post, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image: '',
    meta_description: '',
    seo_keywords: '',
    service_keywords: [],
    is_published: false,
    read_time: 5
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        author: post.author || '',
        category: post.category || '',
        image: post.image || '',
        meta_description: post.meta_description || '',
        seo_keywords: post.seo_keywords || '',
        service_keywords: post.service_keywords || [],
        is_published: post.is_published || false,
        read_time: post.read_time || 5
      });
    } else {
      // Reset form for new post
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: '',
        category: '',
        image: '',
        meta_description: '',
        seo_keywords: '',
        service_keywords: [],
        is_published: false,
        read_time: 5
      });
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </DialogTitle>
        <DialogDescription>
          Create and optimize your blog post for maximum SEO impact.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Blog post title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="blog-post-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of the blog post"
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Post Image
              </Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData(prev => ({ ...prev, image: url }))}
                placeholder="Post image URL or upload file"
                label=""
              />
              <p className="text-xs text-muted-foreground">
                This image will be displayed as the featured image for the blog post. High resolution images recommended.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Full blog post content"
                rows={10}
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                placeholder="SEO meta description"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Length: {formData.meta_description.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_keywords">SEO Keywords</Label>
              <Input
                id="seo_keywords"
                value={formData.seo_keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, seo_keywords: e.target.value }))}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Blog category"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Post
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};