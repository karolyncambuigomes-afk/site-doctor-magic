import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ImageUpload';
import { GalleryUpload } from '@/components/GalleryUpload';
import { ModelGallery } from '@/components/ModelGallery';
import { PhotoSelector } from '@/components/PhotoSelector';
import { LazyImageEditor } from '@/components/LazyImageEditor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { characteristics } from '@/data/characteristics';
import { locations } from '@/data/locations';
import { X, Plus, Image as ImageIcon, AlertCircle, ExternalLink, Eye, Crown, Globe, Info } from 'lucide-react';

interface Model {
  id?: string;
  name: string;
  age: number | null;
  location: string | null;
  price: string | null;
  image: string | null;
  characteristics: string[] | null;
  services: string[] | null;
  availability: string | null;
  description: string | null;
  height: string | null;
  measurements: string | null;
  hair: string | null;
  eyes: string | null;
  nationality: string | null;
  interests: string[] | null;
  education: string | null;
  pricing: any;
  rating: number | null;
  reviews: number | null;
  members_only: boolean | null;
  face_visible: boolean | null;
  show_on_homepage?: boolean | null;
  homepage_order?: number | null;
  all_photos_public?: boolean | null;
}

interface ModelFormProps {
  model?: Model | null;
  onSave: () => void;
  onCancel: () => void;
}

const availabilityOptions = [
  { value: 'available', label: 'Disponível' },
  { value: 'busy', label: 'Ocupado' },
  { value: 'unavailable', label: 'Indisponível' }
];

const serviceOptions = [
  'Dinner Companion',
  'Event Escort',
  'Private Meetings',
  'Social Events',
  'Business Dinners', 
  'Travel Companion',
  'Cultural Events',
  'Dance Performances',
  'Art Exhibitions',
  'Luxury Events',
  'International Travel',
  'Corporate Functions'
];

export const ModelForm: React.FC<ModelFormProps> = ({ model, onSave, onCancel }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Model>({
    name: '',
    age: null,
    location: '',
    price: '',
    image: '',
    characteristics: [],
    services: [],
    availability: 'available',
    description: '',
    height: '',
    measurements: '',
    hair: '',
    eyes: '',
    nationality: '',
    interests: [],
    education: '',
    pricing: {
      oneHour: '',
      twoHours: '',
      threeHours: '',
      additionalHour: ''
    },
    rating: null,
    reviews: null,
    members_only: false,
    face_visible: true,
    show_on_homepage: false,
    homepage_order: null,
    all_photos_public: false
  });

  const [newService, setNewService] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [editingMainImage, setEditingMainImage] = useState(false);

  useEffect(() => {
    if (model) {
      setFormData({
        ...model,
        characteristics: model.characteristics || [],
        services: model.services || [],
        interests: model.interests || [],
        pricing: model.pricing || {
          oneHour: '',
          twoHours: '',
          threeHours: '',
          additionalHour: ''
        },
        members_only: model.members_only || false,
        face_visible: model.face_visible !== null ? model.face_visible : true,
        all_photos_public: model.all_photos_public || false
      });
    }
  }, [model]);

  const handleInputChange = (field: keyof Model, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePricingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const addCharacteristic = (characteristic: string) => {
    if (!formData.characteristics?.includes(characteristic)) {
      setFormData(prev => ({
        ...prev,
        characteristics: [...(prev.characteristics || []), characteristic]
      }));
    }
  };

  const removeCharacteristic = (characteristic: string) => {
    setFormData(prev => ({
      ...prev,
      characteristics: prev.characteristics?.filter(c => c !== characteristic) || []
    }));
  };

  const addService = (service: string) => {
    if (service && !formData.services?.includes(service)) {
      setFormData(prev => ({
        ...prev,
        services: [...(prev.services || []), service]
      }));
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services?.filter(s => s !== service) || []
    }));
  };

  const addInterest = () => {
    if (newInterest && !formData.interests?.includes(newInterest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...(prev.interests || []), newInterest]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests?.filter(i => i !== interest) || []
    }));
  };

  const handleMainImageEdited = async (blob: Blob) => {
    try {
      const fileName = `main-image-${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('model-images')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('model-images')
        .getPublicUrl(fileName);

      // Auto-sync model main image to local
      let finalImageUrl = publicUrl;
      try {
        const { data: syncData, error: syncError } = await supabase.functions.invoke('sync-image-to-local', {
          body: { 
            imageUrl: publicUrl,
            imageType: 'model-main',
            modelId: model?.id || 'new'
          }
        });

        if (syncError) {
          console.error('Model main image sync error:', syncError);
        } else if (syncData?.success) {
          console.log('✅ Model main image synced to local:', syncData.localPath);
          finalImageUrl = syncData.localPath;
        }
      } catch (syncError) {
        console.error('Model main image sync function error:', syncError);
      }

      handleInputChange('image', finalImageUrl);
      setEditingMainImage(false);
      
      toast({
        title: "Sucesso",
        description: finalImageUrl !== publicUrl ? "Foto principal atualizada e otimizada" : "Foto principal atualizada com sucesso",
      });
    } catch (error) {
      console.error('Error uploading edited image:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a imagem editada",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast({
        title: "Erro de Validação",
        description: "O nome da modelo é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const modelData = {
        name: formData.name,
        age: formData.age,
        location: formData.location,
        price: formData.price,
        image: formData.image,
        characteristics: formData.characteristics,
        services: formData.services,
        availability: formData.availability,
        description: formData.description,
        height: formData.height,
        measurements: formData.measurements,
        hair: formData.hair,
        eyes: formData.eyes,
        nationality: formData.nationality,
        interests: formData.interests,
        education: formData.education,
        pricing: formData.pricing,
        rating: formData.rating,
        reviews: formData.reviews,
        members_only: formData.members_only,
        face_visible: formData.face_visible,
        show_on_homepage: formData.show_on_homepage,
        homepage_order: formData.homepage_order,
        all_photos_public: formData.all_photos_public
      };

      if (model?.id) {
        // Update existing model
        const { error } = await supabase
          .from('models')
          .update(modelData)
          .eq('id', model.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Modelo atualizado com sucesso",
        });
      } else {
        // Create new model
        const { error } = await supabase
          .from('models')
          .insert([modelData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Model created successfully",
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving model:', error);
      toast({
        title: "Error",
        description: "Error saving model",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-1">
                Nome *
                <AlertCircle className="w-3 h-3 text-gray-500" />
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className={!formData.name.trim() ? 'border-gray-300 focus:border-gray-500' : ''}
              />
              {!formData.name.trim() && (
                <p className="text-xs text-gray-600 mt-1">Nome é obrigatório</p>
              )}
            </div>

            <div>
              <Label htmlFor="age">Idade</Label>
              <Input
                id="age"
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
              />
            </div>

            <div>
              <Label htmlFor="location">Localização</Label>
              <Select 
                value={formData.location || ''} 
                onValueChange={(value) => handleInputChange('location', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma localização" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="availability">Disponibilidade</Label>
              <Select
                value={formData.availability || ''}
                onValueChange={(value) => handleInputChange('availability', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>


        {/* Access & Privacy Configuration Card */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">⭐ Configurações de Acesso e Privacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-medium">Tipo de Acesso da Modelo:</Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="members-exclusive"
                    name="access-type"
                    checked={formData.members_only === true}
                    onChange={() => {
                      handleInputChange('members_only', true);
                      handleInputChange('all_photos_public', false);
                    }}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <Label htmlFor="members-exclusive" className="flex items-center space-x-2 cursor-pointer">
                    <Crown className="h-4 w-4 text-gray-600" />
                    <span>Esta modelo será <strong>EXCLUSIVA</strong> somente para membros</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="mixed-access"
                    name="access-type"
                    checked={formData.members_only === false && formData.all_photos_public === false}
                    onChange={() => {
                      handleInputChange('members_only', false);
                      handleInputChange('all_photos_public', false);
                    }}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <Label htmlFor="mixed-access" className="flex items-center space-x-2 cursor-pointer">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <span>Esta modelo terá fotos <strong>PÚBLICAS e EXCLUSIVAS</strong> para membros</span>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="all-public"
                    name="access-type"
                    checked={formData.all_photos_public === true}
                    onChange={() => {
                      handleInputChange('members_only', false);
                      handleInputChange('all_photos_public', true);
                    }}
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <Label htmlFor="all-public" className="flex items-center space-x-2 cursor-pointer">
                    <Globe className="h-4 w-4 text-gray-600" />
                    <span>Todas as fotos serão <strong>VISÍVEIS PARA TODOS</strong> (público e membros)</span>
                  </Label>
                </div>
              </div>
              
              {formData.members_only === false && formData.all_photos_public === false && (
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <Info className="h-4 w-4 inline mr-2" />
                    Com esta opção, você poderá definir individualmente quais fotos são públicas e quais são exclusivas para membros na seção de galeria.
                  </p>
                </div>
              )}
              
              {formData.members_only === true && (
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <Crown className="h-4 w-4 inline mr-2" />
                    Modelo exclusiva: todas as fotos serão visíveis apenas para membros.
                  </p>
                </div>
              )}
              
              {formData.all_photos_public === true && (
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <Globe className="h-4 w-4 inline mr-2" />
                    Todas as fotos desta modelo serão visíveis para visitantes públicos e membros.
                  </p>
                </div>
              )}
            </div>
            
          </CardContent>
        </Card>

        {/* Homepage Configuration Card */}
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              🏠 Homepage Carousel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
              <div className="space-y-1">
                <Label htmlFor="show-homepage" className="text-sm font-medium">
                  Mostrar na Homepage
                </Label>
                <p className="text-xs text-muted-foreground">
                  Esta modelo aparecerá no carousel da página inicial
                </p>
              </div>
              <Switch
                id="show-homepage"
                checked={formData.show_on_homepage || false}
                onCheckedChange={(checked) => handleInputChange('show_on_homepage', checked)}
              />
            </div>
            
            {formData.show_on_homepage && (
              <div>
                <Label htmlFor="homepage-order">Posição no Carousel</Label>
                <Input
                  id="homepage-order"
                  type="number"
                  value={formData.homepage_order || ''}
                  onChange={(e) => handleInputChange('homepage_order', e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="1, 2, 3... (deixe vazio para adicionar no final)"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Posição 1 será mostrada primeiro. Deixe vazio para adicionar no final.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Physical Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Físicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="height">Altura</Label>
              <Input
                id="height"
                value={formData.height || ''}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="ex: 1.70m"
              />
            </div>

            <div>
              <Label htmlFor="measurements">Medidas</Label>
              <Input
                id="measurements"
                value={formData.measurements || ''}
                onChange={(e) => handleInputChange('measurements', e.target.value)}
                placeholder="ex: 90-60-90"
              />
            </div>

            <div>
              <Label htmlFor="hair">Cabelo</Label>
              <Input
                id="hair"
                value={formData.hair || ''}
                onChange={(e) => handleInputChange('hair', e.target.value)}
                placeholder="ex: Loiro, Moreno"
              />
            </div>

            <div>
              <Label htmlFor="eyes">Olhos</Label>
              <Input
                id="eyes"
                value={formData.eyes || ''}
                onChange={(e) => handleInputChange('eyes', e.target.value)}
                placeholder="ex: Azul, Castanho"
              />
            </div>

            <div>
              <Label htmlFor="nationality">Nacionalidade</Label>
              <Input
                id="nationality"
                value={formData.nationality || ''}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="education">Educação</Label>
              <Input
                id="education"
                value={formData.education || ''}
                onChange={(e) => handleInputChange('education', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Gallery Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Management */}
        <Card className={`border-2 ${model?.id ? 'border-border bg-white' : 'border-border bg-white'}`}>
          <CardHeader className="bg-white">
            <CardTitle className={`flex items-center gap-2 ${model?.id ? 'text-foreground' : 'text-muted-foreground'}`}>
              <ImageIcon className="w-5 h-5" />
              Gerenciar Fotos
            </CardTitle>
            <p className={`text-sm ${model?.id ? 'text-foreground' : 'text-muted-foreground'}`}>
              {model?.id 
                ? "📸 Adicione, edite e organize as fotos da galeria" 
                : "⚠️ Salve primeiro as informações básicas para poder adicionar fotos"
              }
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {model?.id ? (
              <GalleryUpload modelId={model.id} model={formData} />
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg bg-muted">
                <div className="mb-4 text-4xl">🔒</div>
                <p className="mb-2 font-medium text-foreground">Galeria Bloqueada</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Primeiro salve as informações básicas e depois você poderá adicionar fotos à galeria
                </p>
                <Button 
                  type="submit" 
                  variant="default" 
                  className="mt-2 text-white"
                  disabled={!formData.name}
                >
                  {loading ? 'Saving...' : '💾 Save to Enable Gallery'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gallery Preview */}
        <Card className={`border-2 ${model?.id ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50'}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${model?.id ? 'text-gray-900' : 'text-muted-foreground'}`}>
              <Eye className="w-5 h-5" />
              Public Site Preview
            </CardTitle>
            <div className="flex items-center justify-between">
              <p className={`text-sm ${model?.id ? 'text-gray-700' : 'text-muted-foreground'}`}>
                {model?.id 
                  ? "🌟 Como a galeria aparece no site para os usuários" 
                  : "⏳ Disponível após salvar e adicionar fotos"
                }
              </p>
              {model?.id && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => window.open(`/models/${model.id}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Public Page
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {model?.id ? (
              <div className="border rounded-lg p-4 bg-white">
                <ModelGallery 
                  modelId={model.id}
                  mainImage={formData.image || undefined}
                  modelName={formData.name}
                />
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <div className="mb-4 text-4xl text-gray-400">👁️</div>
                <p className="mb-2 font-medium text-gray-500">Prévia Indisponível</p>
                <p className="text-sm text-gray-400">
                  A prévia da galeria será exibida aqui após salvar o modelo e adicionar fotos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Preços</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="price">Preço Base</Label>
            <Input
              id="price"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              placeholder="ex: £500/hour"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="oneHour">1 Hora</Label>
              <Input
                id="oneHour"
                value={formData.pricing?.oneHour || ''}
                onChange={(e) => handlePricingChange('oneHour', e.target.value)}
                placeholder="ex: £500"
              />
            </div>

            <div>
              <Label htmlFor="twoHours">2 Horas</Label>
              <Input
                id="twoHours"
                value={formData.pricing?.twoHours || ''}
                onChange={(e) => handlePricingChange('twoHours', e.target.value)}
                placeholder="ex: £900"
              />
            </div>

            <div>
              <Label htmlFor="threeHours">3 Horas</Label>
              <Input
                id="threeHours"
                value={formData.pricing?.threeHours || ''}
                onChange={(e) => handlePricingChange('threeHours', e.target.value)}
                placeholder="ex: £1300"
              />
            </div>

            <div>
              <Label htmlFor="additionalHour">Hora Adicional</Label>
              <Input
                id="additionalHour"
                value={formData.pricing?.additionalHour || ''}
                onChange={(e) => handlePricingChange('additionalHour', e.target.value)}
                placeholder="ex: £400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {characteristics.map((characteristic) => (
              <Button
                key={characteristic.id}
                type="button"
                variant={formData.characteristics?.includes(characteristic.name) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (formData.characteristics?.includes(characteristic.name)) {
                    removeCharacteristic(characteristic.name);
                  } else {
                    addCharacteristic(characteristic.name);
                  }
                }}
              >
                {characteristic.name}
              </Button>
            ))}
          </div>

          {formData.characteristics && formData.characteristics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <strong>Selected:</strong>
              {formData.characteristics.map((characteristic) => (
                <Badge key={characteristic} variant="default" className="gap-1">
                  {characteristic}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeCharacteristic(characteristic)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newService} onValueChange={setNewService}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={() => addService(newService)} className="text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.services && formData.services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.services.map((service) => (
                <Badge key={service} variant="default" className="gap-1">
                  {service}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeService(service)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle>Interesses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Digite um interesse"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterest();
                }
              }}
            />
            <Button type="button" onClick={addInterest} className="text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.interests && formData.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <Badge key={interest} variant="default" className="gap-1">
                  {interest}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeInterest(interest)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            placeholder="Detailed model description..."
          />
        </CardContent>
      </Card>

      {/* Rating and Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rating">Rating (0-5)</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating || ''}
              onChange={(e) => handleInputChange('rating', e.target.value ? parseFloat(e.target.value) : null)}
            />
          </div>

          <div>
            <Label htmlFor="reviews">Number of Reviews</Label>
            <Input
              id="reviews"
              type="number"
              value={formData.reviews || ''}
              onChange={(e) => handleInputChange('reviews', e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex flex-col gap-4">
        {!formData.name.trim() && (
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Required fields missing</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Preencha todos os campos marcados com (*) antes de salvar
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !formData.name.trim()}
            className={`${!formData.name.trim() ? 'opacity-50 cursor-not-allowed' : ''} text-white`}
          >
            {loading ? 'Salvando...' : model?.id ? 'Atualizar' : 'Criar'} Modelo
          </Button>
        </div>
      </div>

      {/* Image Editor for main photo */}
      {editingMainImage && formData.image && (
        <LazyImageEditor
          imageUrl={formData.image}
          isOpen={true}
          onClose={() => setEditingMainImage(false)}
          onSave={handleMainImageEdited}
          aspectRatio={3/4} // Portrait aspect ratio for main photos
        />
      )}
    </form>
  );
};