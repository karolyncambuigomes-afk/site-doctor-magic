import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Save, X, GripVertical } from 'lucide-react';
import { useFAQs, FAQ } from '@/hooks/useFAQs';

interface FAQFormData {
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
}

export const FAQManager = () => {
  const { faqs, loading, createFAQ, updateFAQ, deleteFAQ, fetchAllFAQs } = useFAQs();

  // Filter out GEO FAQs to show only database FAQs for management
  const databaseFAQs = faqs.filter(faq => !faq.id.startsWith('geo-'));
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState<FAQFormData>({
    question: '',
    answer: '',
    order_index: 0,
    is_active: true
  });

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index,
      is_active: faq.is_active
    });
    setShowNewForm(false);
  };

  const handleNew = () => {
    setEditingFAQ(null);
    setFormData({
      question: '',
      answer: '',
      order_index: databaseFAQs.length + 1,
      is_active: true
    });
    setShowNewForm(true);
  };

  const handleCancel = () => {
    setEditingFAQ(null);
    setShowNewForm(false);
    setFormData({
      question: '',
      answer: '',
      order_index: 0,
      is_active: true
    });
  };

  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      return;
    }

    if (editingFAQ) {
      // Update existing FAQ
      await updateFAQ(editingFAQ.id, formData);
    } else {
      // Create new FAQ
      await createFAQ(formData);
    }

    handleCancel();
  };

  const handleDelete = async (id: string) => {
    await deleteFAQ(id);
  };

  const handleInputChange = (field: keyof FAQFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading FAQs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">FAQ Management</h2>
          <p className="text-muted-foreground">Manage frequently asked questions for your website</p>
        </div>
        <Button onClick={handleNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>

      {/* New/Edit Form */}
      {(showNewForm || editingFAQ) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingFAQ ? 'Edit FAQ' : 'New FAQ'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                  placeholder="Display order"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => handleInputChange('question', e.target.value)}
                placeholder="Enter the question"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                placeholder="Enter the answer"
                rows={6}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQs List */}
      <Card>
        <CardHeader>
          <CardTitle>Current FAQs ({databaseFAQs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {databaseFAQs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No FAQs found. Create your first FAQ to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {databaseFAQs.map((faq) => (
                <Card key={faq.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            Order: {faq.order_index}
                          </Badge>
                          <Badge variant={faq.is_active ? "default" : "secondary"} className="text-xs">
                            {faq.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">{faq.question}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(faq)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="flex items-center gap-1">
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the FAQ.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(faq.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.filter(faq => faq.is_active).map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left font-medium hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};