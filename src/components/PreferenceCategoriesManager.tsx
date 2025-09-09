import React, { useState } from 'react';
import { usePreferenceCategories, PreferenceCategory } from '@/hooks/usePreferenceCategories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const PreferenceCategoriesManager: React.FC = () => {
  const { categories, loading, updateCategory, createCategory, deleteCategory } = usePreferenceCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    path: '',
    image_url: '',
    image_alt: '',
    order_index: 0,
    is_active: true
  });

  const [editData, setEditData] = useState<Partial<PreferenceCategory>>({});

  const handleEdit = (category: PreferenceCategory) => {
    setEditingId(category.id);
    setEditData(category);
  };

  const handleSave = async (categoryId: string) => {
    setSaving(categoryId);
    const success = await updateCategory(categoryId, editData);
    if (success) {
      setEditingId(null);
      setEditData({});
    }
    setSaving(null);
  };

  const handleCreate = async () => {
    if (!newCategory.name || !newCategory.path || !newCategory.image_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving('creating');
    const success = await createCategory(newCategory);
    if (success) {
      setIsCreating(false);
      setNewCategory({
        name: '',
        path: '',
        image_url: '',
        image_alt: '',
        order_index: 0,
        is_active: true
      });
    }
    setSaving(null);
  };

  const handleDelete = async (categoryId: string) => {
    setSaving(categoryId);
    await deleteCategory(categoryId);
    setSaving(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
    setIsCreating(false);
    setNewCategory({
      name: '',
      path: '',
      image_url: '',
      image_alt: '',
      order_index: 0,
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Preference Categories Manager</h2>
        <Button 
          onClick={() => setIsCreating(true)} 
          className="flex items-center gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-name">Name *</Label>
                <Input
                  id="new-name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Category name"
                />
              </div>
              <div>
                <Label htmlFor="new-path">Path *</Label>
                <Input
                  id="new-path"
                  value={newCategory.path}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/characteristics/category-name"
                />
              </div>
              <div>
                <Label htmlFor="new-alt">Image Alt Text</Label>
                <Input
                  id="new-alt"
                  value={newCategory.image_alt}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, image_alt: e.target.value }))}
                  placeholder="Alt text for accessibility"
                />
              </div>
              <div>
                <Label htmlFor="new-order">Order Index</Label>
                <Input
                  id="new-order"
                  type="number"
                  value={newCategory.order_index}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            <div>
              <Label>Category Image *</Label>
              <ImageUpload
                value={newCategory.image_url}
                onChange={(url) => setNewCategory(prev => ({ ...prev, image_url: url }))}
                label="Upload category image"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleCreate}
                disabled={saving === 'creating'}
                className="flex items-center gap-2"
              >
                {saving === 'creating' ? <LoadingSpinner /> : <Save className="h-4 w-4" />}
                Create Category
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  {category.name}
                  <span className="text-sm text-muted-foreground">
                    (Order: {category.order_index})
                  </span>
                </CardTitle>
                <div className="flex gap-2">
                  {editingId === category.id ? (
                    <>
                      <Button 
                        size="sm"
                        onClick={() => handleSave(category.id)}
                        disabled={saving === category.id}
                        className="flex items-center gap-1"
                      >
                        {saving === category.id ? <LoadingSpinner /> : <Save className="h-3 w-3" />}
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleCancel}
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            disabled={saving === category.id}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{category.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(category.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === category.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`name-${category.id}`}>Name</Label>
                      <Input
                        id={`name-${category.id}`}
                        value={editData.name || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`path-${category.id}`}>Path</Label>
                      <Input
                        id={`path-${category.id}`}
                        value={editData.path || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, path: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`alt-${category.id}`}>Image Alt Text</Label>
                      <Input
                        id={`alt-${category.id}`}
                        value={editData.image_alt || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, image_alt: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`order-${category.id}`}>Order Index</Label>
                      <Input
                        id={`order-${category.id}`}
                        type="number"
                        value={editData.order_index || 0}
                        onChange={(e) => setEditData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Category Image</Label>
                    <ImageUpload
                      value={editData.image_url || ''}
                      onChange={(url) => setEditData(prev => ({ ...prev, image_url: url }))}
                      label="Update category image"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="w-24 h-32 flex-shrink-0">
                    <img 
                      src={category.image_url} 
                      alt={category.image_alt || category.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p><strong>Path:</strong> {category.path}</p>
                    <p><strong>Alt Text:</strong> {category.image_alt || 'Not set'}</p>
                    <p><strong>Status:</strong> {category.is_active ? 'Active' : 'Inactive'}</p>
                    <p><strong>Created:</strong> {new Date(category.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};