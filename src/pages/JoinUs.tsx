import { useState } from "react";
import { useSafeNavigate } from '@/hooks/useSafeRouter';
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
  other_language: string;
  height: string;
  measurements: string;
  dress_size: string;
  hair_color: string;
  eye_color: string;
  tattoos: string;
  piercings: string;
  interests: string[];
  instagram_handle: string;
  motivation: string;
  availability: string;
  location_preference: string;
}

const JoinUs = () => {
  const navigate = useSafeNavigate();
  const { toast } = useToast();
  
  // Safety check for navigate function
  if (!navigate) {
    console.warn('JoinUs: useNavigate returned undefined');
  }
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
    other_language: "",
    height: "",
    measurements: "",
    dress_size: "",
    hair_color: "",
    eye_color: "",
    tattoos: "",
    piercings: "",
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
    const maxSize = type === 'photos' ? 10 * 1024 * 1024 : 50 * 1024 * 1024; // 10MB for photos, 50MB for videos
    
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds maximum allowed size`,
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
        title: "Application submitted successfully!",
        description: "We will contact you soon.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error submitting application",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const languages = ["Portuguese", "English", "Spanish", "French", "Italian", "German", "Russian", "Other Language"];
  const interests = ["Art", "Music", "Literature", "Travel", "Gastronomy", "Fitness", "Fashion", "Photography"];

  return (
    <>
      <SEO 
        title="Join Our Agency - Model Application"
        description="Be part of our luxury escort agency. Apply now and start your career as an elite model."
        keywords="model application, escort agency, work as escort, elite model"
      />
      <Navigation />
      
      <main className="pt-16">
        {/* Elegant Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-background to-background/95">
          <div className="absolute inset-0 bg-[url('/images/london-gala-event.jpg')] bg-cover bg-center bg-no-repeat opacity-15"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="luxury-heading-xl mb-4 text-foreground font-light tracking-wide leading-tight">
                Join Our Agency
              </h1>
              <p className="luxury-body-lg mb-6 text-muted-foreground">
                Be part of a prestigious agency and build a successful career
              </p>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-width">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">

              <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
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
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
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
                    <Label>Date of Birth</Label>
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
                          {formData.date_of_birth ? format(formData.date_of_birth, "dd/MM/yyyy") : "Select date"}
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
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Languages</Label>
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
                  {formData.languages.includes("Other Language") && (
                    <div className="mt-3">
                      <Label htmlFor="other_language">Specify the language</Label>
                      <Input
                        id="other_language"
                        placeholder="Enter the language..."
                        value={formData.other_language}
                        onChange={(e) => handleInputChange('other_language', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Physical Information */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      placeholder="Ex: 1.70m"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="measurements">Measurements</Label>
                    <Input
                      id="measurements"
                      placeholder="Ex: 90-60-90"
                      value={formData.measurements}
                      onChange={(e) => handleInputChange('measurements', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dress_size">Dress Size</Label>
                    <Select value={formData.dress_size} onValueChange={(value) => handleInputChange('dress_size', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                    <Label htmlFor="hair_color">Hair Color</Label>
                    <Input
                      id="hair_color"
                      value={formData.hair_color}
                      onChange={(e) => handleInputChange('hair_color', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eye_color">Eye Color</Label>
                    <Input
                      id="eye_color"
                      value={formData.eye_color}
                      onChange={(e) => handleInputChange('eye_color', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tattoos">Tattoos</Label>
                    <Input
                      id="tattoos"
                      placeholder="Describe if you have any"
                      value={formData.tattoos}
                      onChange={(e) => handleInputChange('tattoos', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="piercings">Piercings</Label>
                    <Input
                      id="piercings"
                      placeholder="Describe if you have any"
                      value={formData.piercings}
                      onChange={(e) => handleInputChange('piercings', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Photos and Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Photos (max. 10 - 5MB each)</Label>
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
                          Click to select photos
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
                  <Label>Videos (max. 3 - 50MB each)</Label>
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
                          Click to select videos
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
                <CardTitle>Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="motivation">Why do you want to join our agency? *</Label>
                  <Textarea
                    id="motivation"
                    required
                    placeholder="Tell us about your motivations..."
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Textarea
                    id="availability"
                    placeholder="When are you available to work?"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location_preference">Location Preference</Label>
                  <Input
                    id="location_preference"
                    placeholder="Ex: London, national/international travel"
                    value={formData.location_preference}
                    onChange={(e) => handleInputChange('location_preference', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default JoinUs;