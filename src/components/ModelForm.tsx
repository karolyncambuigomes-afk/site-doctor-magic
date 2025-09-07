import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ImageUpload';
import { GalleryUpload } from '@/components/GalleryUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { characteristics } from '@/data/characteristics';
import { locations } from '@/data/locations';
import { X, Plus } from 'lucide-react';

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
    reviews: null
  });

  const [newService, setNewService] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);

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
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        reviews: formData.reviews
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
          title: "Sucesso",
          description: "Modelo criado com sucesso",
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving model:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar modelo",
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
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
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

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Foto Principal</CardTitle>
          <p className="text-sm text-muted-foreground">Esta será a foto de perfil que aparece na lista de modelos</p>
        </CardHeader>
        <CardContent>
          <ImageUpload
            value={formData.image || ''}
            onChange={(url) => handleInputChange('image', url)}
            label="Foto de Perfil"
            placeholder="URL da foto principal ou faça upload"
          />
        </CardContent>
      </Card>

      {/* Gallery Management */}
      <Card>
        <CardHeader>
          <CardTitle>Galeria de Fotos</CardTitle>
          <p className="text-sm text-muted-foreground">
            {model?.id 
              ? "Adicione fotos extras que aparecerão na página de detalhes da modelo" 
              : "Salve primeiro as informações básicas para poder adicionar fotos à galeria"
            }
          </p>
        </CardHeader>
        <CardContent>
          {model?.id ? (
            <GalleryUpload modelId={model.id} />
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
              <p className="mb-2 font-medium">Galeria indisponível</p>
              <p className="text-sm text-muted-foreground">
                Primeiro salve as informações básicas e depois você poderá adicionar fotos à galeria
              </p>
              <Button 
                type="submit" 
                variant="outline" 
                className="mt-4"
                disabled={!formData.name}
              >
                {loading ? 'Salvando...' : 'Salvar para Habilitar Galeria'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

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
              <strong>Selecionadas:</strong>
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
          <CardTitle>Serviços</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select value={newService} onValueChange={setNewService}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={() => addService(newService)}>
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
            <Button type="button" onClick={addInterest}>
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
            placeholder="Descrição detalhada da modelo..."
          />
        </CardContent>
      </Card>

      {/* Rating and Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Avaliações</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rating">Nota (0-5)</Label>
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
            <Label htmlFor="reviews">Número de Avaliações</Label>
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
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : model?.id ? 'Atualizar' : 'Criar'} Modelo
        </Button>
      </div>
    </form>
  );
};