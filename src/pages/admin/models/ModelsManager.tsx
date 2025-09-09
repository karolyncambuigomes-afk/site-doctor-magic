import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  RefreshCw
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
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
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
            Manage model profiles with complete form, gallery, and SEO optimization.
          </p>
        </div>
        
        <Button 
          onClick={() => navigate('/admin/models/new')} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Modelo
        </Button>
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
            Manage your model profiles with complete information, gallery and SEO settings.
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
                        onClick={() => navigate(`/admin/models/edit/${model.id}`)}
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
        description="Manage models with complete form and SEO optimization"
        noIndex={true}
      />
      <ModelsManagerContent />
    </>
  );
};