import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

interface ApplicationData {
  full_name: string;
  email: string;
  phone: string;
  age: number | null;
  date_of_birth: Date | null;
  nationality: string;
  languages: string[];
  height: string;
  measurements: string;
  dress_size: string;
  shoe_size: string;
  hair_color: string;
  eye_color: string;
  tattoos: string;
  piercings: string;
  modeling_experience: string;
  escort_experience: string;
  education: string;
  profession: string;
  interests: string[];
  instagram_handle: string;
  motivation: string;
  availability: string;
  location_preference: string;
}

const JoinUs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [formData, setFormData] = useState<ApplicationData>({
    full_name: "",
    email: "",
    phone: "",
    age: null,
    date_of_birth: null,
    nationality: "",
    languages: [],
    height: "",
    measurements: "",
    dress_size: "",
    shoe_size: "",
    hair_color: "",
    eye_color: "",
    tattoos: "",
    piercings: "",
    modeling_experience: "",
    escort_experience: "",
    education: "",
    profession: "",
    interests: [],
    instagram_handle: "",
    motivation: "",
    availability: "",
    location_preference: ""
  });

  const handleInputChange = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      languages: checked 
        ? [...prev.languages, language]
        : prev.languages.filter(l => l !== language)
    }));
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleFileUpload = (files: FileList | null, type: 'photos' | 'videos') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const maxSize = type === 'photos' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for photos, 50MB for videos
    
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o tamanho máximo permitido`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    if (type === 'photos') {
      setPhotos(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 photos
    } else {
      setVideos(prev => [...prev, ...validFiles].slice(0, 3)); // Max 3 videos
    }
  };

  const removeFile = (index: number, type: 'photos' | 'videos') => {
    if (type === 'photos') {
      setPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setVideos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const uploadFiles = async (files: File[], folder: string): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('model-applications')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('model-applications')
        .getPublicUrl(data.path);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload files
      const photoUrls = photos.length > 0 ? await uploadFiles(photos, 'photos') : [];
      const videoUrls = videos.length > 0 ? await uploadFiles(videos, 'videos') : [];

      // Submit application
      const { error } = await supabase
        .from('model_applications')
        .insert({
          ...formData,
          photos: photoUrls,
          videos: videoUrls
        });

      if (error) throw error;

      toast({
        title: "Candidatura enviada com sucesso!",
        description: "Entraremos em contato em breve.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Erro ao enviar candidatura",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const languages = ["Português", "English", "Español", "Français", "Italiano", "Deutsch"];
  const interests = ["Arte", "Música", "Literatura", "Viagens", "Gastronomia", "Fitness", "Moda", "Fotografia"];

  return (
    <>
      <SEO 
        title="Junte-se à Nossa Agência - Candidatura para Modelos"
        description="Faça parte da nossa agência de acompanhantes de luxo. Candidature-se agora e comece sua carreira como modelo de elite."
        keywords="candidatura modelo, agência acompanhantes, trabalhar como escort, modelo elite"
      />
      <Navigation />
      
      <main className="min-h-screen bg-background py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Junte-se à Nossa Agência
            </h1>
            <p className="text-xl text-muted-foreground">
              Faça parte de uma agência de prestígio e construa uma carreira de sucesso
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nome Completo *</Label>
                    <Input
                      id="full_name"
                      required
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      min="18"
                      max="45"
                      value={formData.age || ""}
                      onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                  <div>
                    <Label>Data de Nascimento</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.date_of_birth && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date_of_birth ? format(formData.date_of_birth, "dd/MM/yyyy") : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.date_of_birth || undefined}
                          onSelect={(date) => handleInputChange('date_of_birth', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nacionalidade</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Idiomas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {languages.map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={language}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                        />
                        <Label htmlFor={language} className="text-sm">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physical Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Físicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Altura</Label>
                    <Input
                      id="height"
                      placeholder="Ex: 1.70m"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="measurements">Medidas</Label>
                    <Input
                      id="measurements"
                      placeholder="Ex: 90-60-90"
                      value={formData.measurements}
                      onChange={(e) => handleInputChange('measurements', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dress_size">Tamanho do Vestido</Label>
                    <Select value={formData.dress_size} onValueChange={(value) => handleInputChange('dress_size', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shoe_size">Tamanho do Sapato</Label>
                    <Input
                      id="shoe_size"
                      placeholder="Ex: 37"
                      value={formData.shoe_size}
                      onChange={(e) => handleInputChange('shoe_size', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hair_color">Cor do Cabelo</Label>
                    <Input
                      id="hair_color"
                      value={formData.hair_color}
                      onChange={(e) => handleInputChange('hair_color', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eye_color">Cor dos Olhos</Label>
                    <Input
                      id="eye_color"
                      value={formData.eye_color}
                      onChange={(e) => handleInputChange('eye_color', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tattoos">Tatuagens</Label>
                    <Input
                      id="tattoos"
                      placeholder="Descreva se possui"
                      value={formData.tattoos}
                      onChange={(e) => handleInputChange('tattoos', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="piercings">Piercings</Label>
                    <Input
                      id="piercings"
                      placeholder="Descreva se possui"
                      value={formData.piercings}
                      onChange={(e) => handleInputChange('piercings', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience & Background */}
            <Card>
              <CardHeader>
                <CardTitle>Experiência e Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="modeling_experience">Experiência em Modelagem</Label>
                  <Textarea
                    id="modeling_experience"
                    placeholder="Descreva sua experiência anterior..."
                    value={formData.modeling_experience}
                    onChange={(e) => handleInputChange('modeling_experience', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="escort_experience">Experiência como Acompanhante</Label>
                  <Textarea
                    id="escort_experience"
                    placeholder="Descreva sua experiência anterior..."
                    value={formData.escort_experience}
                    onChange={(e) => handleInputChange('escort_experience', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">Educação</Label>
                    <Input
                      id="education"
                      placeholder="Nível de escolaridade"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Profissão Atual</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Interesses</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        />
                        <Label htmlFor={interest} className="text-sm">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="instagram_handle">Instagram</Label>
                  <Input
                    id="instagram_handle"
                    placeholder="@seu_instagram"
                    value={formData.instagram_handle}
                    onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Fotos e Vídeos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Fotos (máx. 10 - 5MB cada)</Label>
                  <div className="mt-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'photos')}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Clique para selecionar fotos
                        </p>
                      </div>
                    </Label>
                  </div>
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeFile(index, 'photos')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Vídeos (máx. 3 - 50MB cada)</Label>
                  <div className="mt-2">
                    <Input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e.target.files, 'videos')}
                      className="hidden"
                      id="video-upload"
                    />
                    <Label htmlFor="video-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Clique para selecionar vídeos
                        </p>
                      </div>
                    </Label>
                  </div>
                  {videos.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {videos.map((video, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{video.name}</span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(index, 'videos')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Application Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Candidatura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="motivation">Por que quer se juntar à nossa agência? *</Label>
                  <Textarea
                    id="motivation"
                    required
                    placeholder="Conte-nos sobre suas motivações..."
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Disponibilidade</Label>
                  <Textarea
                    id="availability"
                    placeholder="Quando está disponível para trabalhar?"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location_preference">Preferência de Localização</Label>
                  <Input
                    id="location_preference"
                    placeholder="Ex: Londres, viagens nacionais/internacionais"
                    value={formData.location_preference}
                    onChange={(e) => handleInputChange('location_preference', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Candidatura"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default JoinUs;