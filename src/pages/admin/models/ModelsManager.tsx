import React, { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SEOPreviewCard } from '@/components/seo/SEOPreviewCard';
import { SEOScoreIndicator } from '@/components/seo/SEOScoreIndicator';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Target,
  Save,
  RefreshCw,
  Star
} from 'lucide-react';

interface Model {
  id: string;
  name: string;
  location: string;
  age: number;
  price: string;
  image: string;
  characteristics: string[];
  services: string[];
  availability: string;
  description: string;
  members_only: boolean;
  face_visible: boolean;
  created_at: string;
}

export const ModelsManagerContent: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Error loading models:', error);
      toast({
        title: "Error",
        description: "Failed to load models",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveModel = async (modelData: Partial<Model>) => {
    try {
      if (editingModel?.id) {
        // Update existing model
        const { error } = await supabase
          .from('models')
          .update(modelData)
          .eq('id', editingModel.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Model updated successfully"
        });
      } else {
        // Create new model
        const { error } = await supabase
          .from('models')
          .insert([modelData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Model created successfully"
        });
      }

      setIsDialogOpen(false);
      setEditingModel(null);
      loadModels();
    } catch (error) {
      console.error('Error saving model:', error);
      toast({
        title: "Error",
        description: "Failed to save model",
        variant: "destructive"
      });
    }
  };

  const handleDeleteModel = async (modelId: string) => {
    if (!confirm('Are you sure you want to delete this model?')) return;

    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', modelId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Model deleted successfully"
      });
      
      loadModels();
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: "Error",
        description: "Failed to delete model",
        variant: "destructive"
      });
    }
  };

  const filteredModels = models.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="luxury-heading-xl mb-2 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Models Management
          </h1>
          <p className="text-muted-foreground">
            Manage model profiles with SEO optimization for search visibility.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingModel(null)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Model
            </Button>
          </DialogTrigger>
          <ModelDialog 
            model={editingModel} 
            onSave={handleSaveModel}
            onClose={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Models</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredModels.length} of {models.length} models
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models Table */}
      <Card>
        <CardHeader>
          <CardTitle>Models</CardTitle>
          <CardDescription>
            Manage your model profiles and their SEO settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {model.image && (
                        <img 
                          src={model.image} 
                          alt={model.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      )}
                      {model.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{model.location}</Badge>
                  </TableCell>
                  <TableCell>{model.age}</TableCell>
                  <TableCell>{model.price}</TableCell>
                  <TableCell>
                    <Badge variant={model.availability ? "default" : "secondary"}>
                      {model.availability || "Not Set"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={model.members_only ? "destructive" : "secondary"}>
                        {model.members_only ? "Members Only" : "Public"}
                      </Badge>
                      {!model.face_visible && (
                        <Badge variant="outline" className="text-xs">
                          Face Hidden
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(model.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingModel(model);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteModel(model.id)}
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
  );
};

export const ModelsManager: React.FC = () => {
  return (
    <>
      <SEO 
        title="Models Management - Admin"
        description="Manage models with SEO optimization"
        noIndex={true}
      />
      <ModelsManagerContent />
    </>
  );
};

const ModelDialog: React.FC<{
  model: Model | null;
  onSave: (data: Partial<Model>) => void;
  onClose: () => void;
}> = ({ model, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    age: 25,
    price: '',
    image: '',
    characteristics: [],
    services: [],
    availability: '',
    description: '',
    members_only: false,
    face_visible: true
  });

  useEffect(() => {
    if (model) {
      setFormData({
        name: model.name || '',
        location: model.location || '',
        age: model.age || 25,
        price: model.price || '',
        image: model.image || '',
        characteristics: model.characteristics || [],
        services: model.services || [],
        availability: model.availability || '',
        description: model.description || '',
        members_only: model.members_only || false,
        face_visible: model.face_visible ?? true
      });
    }
  }, [model]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Generate SEO preview data
  const seoTitle = `${formData.name} - Luxury Companion in ${formData.location || 'London'}`;
  const seoDescription = `Meet ${formData.name}, an elegant companion available in ${formData.location || 'London'}. Professional escort services.`;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {model ? 'Edit Model' : 'Add New Model'}
        </DialogTitle>
        <DialogDescription>
          Create and optimize model profiles for maximum search visibility.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="seo">SEO Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Model name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Mayfair, London"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 25 }))}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="£500/hour"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  placeholder="Available"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Model description for SEO"
                rows={6}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <SEOScoreIndicator
                  title={seoTitle}
                  description={seoDescription}
                  keywords={formData.characteristics}
                  content={formData.description}
                  url={`/models/${formData.name.toLowerCase().replace(/\s+/g, '-')}`}
                />
              </div>
              
              <div className="space-y-4">
                <SEOPreviewCard
                  title={seoTitle}
                  description={seoDescription}
                  url={`https://fivelondon.com/models/${formData.name.toLowerCase().replace(/\s+/g, '-')}`}
                  type="google"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="members_only"
                  checked={formData.members_only}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, members_only: checked }))}
                />
                <Label htmlFor="members_only">Members Only</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="face_visible"
                  checked={formData.face_visible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, face_visible: checked }))}
                />
                <Label htmlFor="face_visible">Face Visible</Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {model ? 'Update Model' : 'Create Model'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};