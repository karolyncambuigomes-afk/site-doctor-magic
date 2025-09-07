import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Eye, Download, User, Calendar, MapPin, Star, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ModelApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  age: number;
  date_of_birth: string;
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
  photos: string[];
  videos: string[];
  motivation: string;
  availability: string;
  location_preference: string;
  status: string;
  admin_notes: string;
  reviewed_by: string;
  reviewed_at: string;
  created_at: string;
  updated_at: string;
}

const ModelApplicationManager = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<ModelApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<ModelApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      let query = supabase
        .from('model_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar candidaturas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [statusFilter]);

  const updateApplicationStatus = async (id: string, status: string, notes?: string) => {
    try {
      const updateData: any = {
        status,
        reviewed_at: new Date().toISOString()
      };

      if (notes !== undefined) {
        updateData.admin_notes = notes;
      }

      const { error } = await supabase
        .from('model_applications')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Candidatura ${status === 'approved' ? 'aprovada' : status === 'rejected' ? 'rejeitada' : 'atualizada'} com sucesso.`
      });

      loadApplications();
      setSelectedApplication(null);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const convertToModel = async (application: ModelApplication) => {
    try {
      // Create model from application data
      const modelData = {
        name: application.full_name,
        age: application.age,
        location: application.location_preference || "Londres",
        height: application.height,
        measurements: application.measurements,
        hair: application.hair_color,
        eyes: application.eye_color,
        nationality: application.nationality,
        education: application.education,
        interests: application.interests,
        description: application.motivation,
        image: application.photos[0] || null, // Use first photo as main image
        services: [], // To be configured later
        characteristics: [], // To be configured later
        availability: application.availability,
        price: "£300/hour", // Default price
        rating: 5.0,
        reviews: 0
      };

      const { data: model, error: modelError } = await supabase
        .from('models')
        .insert(modelData)
        .select()
        .single();

      if (modelError) throw modelError;

      // Add photos to model gallery
      if (application.photos.length > 1) {
        const galleryPhotos = application.photos.slice(1).map((photo, index) => ({
          model_id: model.id,
          image_url: photo,
          order_index: index,
          caption: `Foto ${index + 1}`
        }));

        const { error: galleryError } = await supabase
          .from('model_gallery')
          .insert(galleryPhotos);

        if (galleryError) throw galleryError;
      }

      // Update application status to approved
      await updateApplicationStatus(application.id, 'approved', 'Candidatura aprovada e convertida em perfil de modelo.');

      toast({
        title: "Modelo criado com sucesso!",
        description: `${application.full_name} foi convertida em modelo ativo.`
      });

    } catch (error: any) {
      toast({
        title: "Erro ao criar modelo",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      reviewing: { label: "Em Análise", variant: "default" as const },
      approved: { label: "Aprovada", variant: "default" as const },
      rejected: { label: "Rejeitada", variant: "destructive" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="p-6">Carregando candidaturas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Candidaturas de Modelos</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="reviewing">Em Análise</SelectItem>
            <SelectItem value="approved">Aprovadas</SelectItem>
            <SelectItem value="rejected">Rejeitadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Nenhuma candidatura encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg">{application.full_name}</h4>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {application.age} anos
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {application.nationality}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(application.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                    </div>
                    <p className="text-sm">{application.email}</p>
                    {application.instagram_handle && (
                      <p className="text-sm text-muted-foreground">Instagram: {application.instagram_handle}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Candidatura - {application.full_name}</DialogTitle>
                        </DialogHeader>
                        
                        {selectedApplication && (
                          <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                              <TabsTrigger value="personal">Pessoal</TabsTrigger>
                              <TabsTrigger value="physical">Físico</TabsTrigger>
                              <TabsTrigger value="experience">Experiência</TabsTrigger>
                              <TabsTrigger value="media">Mídia</TabsTrigger>
                              <TabsTrigger value="admin">Admin</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="personal" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Nome Completo</Label>
                                  <p className="font-medium">{selectedApplication.full_name}</p>
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <p>{selectedApplication.email}</p>
                                </div>
                                <div>
                                  <Label>Telefone</Label>
                                  <p>{selectedApplication.phone || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Idade</Label>
                                  <p>{selectedApplication.age}</p>
                                </div>
                                <div>
                                  <Label>Data de Nascimento</Label>
                                  <p>{selectedApplication.date_of_birth ? format(new Date(selectedApplication.date_of_birth), "dd/MM/yyyy") : "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Nacionalidade</Label>
                                  <p>{selectedApplication.nationality}</p>
                                </div>
                                <div className="col-span-2">
                                  <Label>Idiomas</Label>
                                  <p>{selectedApplication.languages.join(", ") || "Não informado"}</p>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="physical" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Altura</Label>
                                  <p>{selectedApplication.height || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Medidas</Label>
                                  <p>{selectedApplication.measurements || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Tamanho do Vestido</Label>
                                  <p>{selectedApplication.dress_size || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Tamanho do Sapato</Label>
                                  <p>{selectedApplication.shoe_size || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Cor do Cabelo</Label>
                                  <p>{selectedApplication.hair_color || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Cor dos Olhos</Label>
                                  <p>{selectedApplication.eye_color || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Tatuagens</Label>
                                  <p>{selectedApplication.tattoos || "Nenhuma"}</p>
                                </div>
                                <div>
                                  <Label>Piercings</Label>
                                  <p>{selectedApplication.piercings || "Nenhum"}</p>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="experience" className="space-y-4">
                              <div className="space-y-4">
                                <div>
                                  <Label>Experiência em Modelagem</Label>
                                  <p className="whitespace-pre-wrap">{selectedApplication.modeling_experience || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Experiência como Acompanhante</Label>
                                  <p className="whitespace-pre-wrap">{selectedApplication.escort_experience || "Não informado"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Educação</Label>
                                    <p>{selectedApplication.education || "Não informado"}</p>
                                  </div>
                                  <div>
                                    <Label>Profissão</Label>
                                    <p>{selectedApplication.profession || "Não informado"}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label>Interesses</Label>
                                  <p>{selectedApplication.interests.join(", ") || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Instagram</Label>
                                  <p>{selectedApplication.instagram_handle || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Motivação</Label>
                                  <p className="whitespace-pre-wrap">{selectedApplication.motivation}</p>
                                </div>
                                <div>
                                  <Label>Disponibilidade</Label>
                                  <p className="whitespace-pre-wrap">{selectedApplication.availability || "Não informado"}</p>
                                </div>
                                <div>
                                  <Label>Preferência de Localização</Label>
                                  <p>{selectedApplication.location_preference || "Não informado"}</p>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="media" className="space-y-4">
                              <div>
                                <Label>Fotos ({selectedApplication.photos.length})</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {selectedApplication.photos.map((photo, index) => (
                                    <img
                                      key={index}
                                      src={photo}
                                      alt={`Foto ${index + 1}`}
                                      className="w-full h-32 object-cover rounded cursor-pointer"
                                      onClick={() => window.open(photo, '_blank')}
                                    />
                                  ))}
                                </div>
                              </div>
                              
                              {selectedApplication.videos.length > 0 && (
                                <div>
                                  <Label>Vídeos ({selectedApplication.videos.length})</Label>
                                  <div className="space-y-2 mt-2">
                                    {selectedApplication.videos.map((video, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span>Vídeo {index + 1}</span>
                                        <Button size="sm" onClick={() => window.open(video, '_blank')}>
                                          <Download className="h-4 w-4 mr-2" />
                                          Baixar
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="admin" className="space-y-4">
                              <div className="space-y-4">
                                <div>
                                  <Label>Status Atual</Label>
                                  <div className="mt-2">
                                    {getStatusBadge(selectedApplication.status)}
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="admin-notes">Notas da Administração</Label>
                                  <Textarea
                                    id="admin-notes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Adicione observações sobre esta candidatura..."
                                    defaultValue={selectedApplication.admin_notes || ""}
                                  />
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewing', adminNotes)}
                                    variant="outline"
                                  >
                                    Marcar como Em Análise
                                  </Button>
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', adminNotes)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Aprovar
                                  </Button>
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', adminNotes)}
                                    variant="destructive"
                                  >
                                    Rejeitar
                                  </Button>
                                  {selectedApplication.status === 'approved' && (
                                    <Button
                                      onClick={() => convertToModel(selectedApplication)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Converter em Modelo
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ModelApplicationManager;