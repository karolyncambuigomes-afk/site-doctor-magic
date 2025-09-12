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
  birth_year?: string; // For non-admin users
  nationality: string;
  languages: string[];
  other_language?: string;
  height: string;
  measurements: string;
  dress_size: string;
  hair_color: string;
  eye_color: string;
  tattoos: string;
  piercings: string;
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
        .from('model_applications_secure')
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
        title: "Error loading applications",
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
        title: "Status updated",
        description: `Application ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully.`
      });

      loadApplications();
      setSelectedApplication(null);
    } catch (error: any) {
      toast({
        title: "Error updating status",
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
        location: application.location_preference || "London",
        height: application.height,
        measurements: application.measurements,
        hair: application.hair_color,
        eyes: application.eye_color,
        nationality: application.nationality,
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
          caption: `Photo ${index + 1}`
        }));

        const { error: galleryError } = await supabase
          .from('model_gallery')
          .insert(galleryPhotos);

        if (galleryError) throw galleryError;
      }

      // Update application status to approved
      await updateApplicationStatus(application.id, 'approved', 'Application approved and converted to model profile.');

      toast({
        title: "Model created successfully!",
        description: `${application.full_name} has been converted to an active model.`
      });

    } catch (error: any) {
      toast({
        title: "Error creating model",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      reviewing: { label: "Under Review", variant: "default" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "destructive" as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return <div className="p-6">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Model Applications</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🔒 Enhanced Security
            </Badge>
            <span>All sensitive data is encrypted and masked for additional protection</span>
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewing">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No applications found.</p>
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
                        {application.age} years old
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
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Application - {application.full_name}</DialogTitle>
                        </DialogHeader>
                        
                        {selectedApplication && (
                          <Tabs defaultValue="personal" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                              <TabsTrigger value="personal">Personal</TabsTrigger>
                              <TabsTrigger value="physical">Physical</TabsTrigger>
                              <TabsTrigger value="experience">Interests</TabsTrigger>
                              <TabsTrigger value="media">Media</TabsTrigger>
                              <TabsTrigger value="admin">Admin</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="personal" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <Label>Full Name</Label>
                                   <p className="font-medium">{selectedApplication.full_name}</p>
                                 </div>
                                 <div>
                                   <Label>Email</Label>
                                   <p>{selectedApplication.email}</p>
                                 </div>
                                 <div>
                                   <Label>Phone</Label>
                                   <p>{selectedApplication.phone || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Age</Label>
                                   <p>{selectedApplication.age}</p>
                                 </div>
                                  <div>
                                    <Label>Date of Birth</Label>
                                    <p>{selectedApplication.date_of_birth ? format(new Date(selectedApplication.date_of_birth), "dd/MM/yyyy") : selectedApplication.birth_year || "Private"}</p>
                                  </div>
                                 <div>
                                   <Label>Nationality</Label>
                                   <p>{selectedApplication.nationality}</p>
                                 </div>
                                 <div className="col-span-2">
                                   <Label>Languages</Label>
                                   <p>{selectedApplication.languages.join(", ") || "Not provided"}</p>
                                   {selectedApplication.other_language && (
                                     <p className="text-sm text-muted-foreground mt-1">
                                       <strong>Other language:</strong> {selectedApplication.other_language}
                                     </p>
                                   )}
                                 </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="physical" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <Label>Height</Label>
                                   <p>{selectedApplication.height || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Measurements</Label>
                                   <p>{selectedApplication.measurements || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Dress Size</Label>
                                   <p>{selectedApplication.dress_size || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Hair Color</Label>
                                   <p>{selectedApplication.hair_color || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Eye Color</Label>
                                   <p>{selectedApplication.eye_color || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Tattoos</Label>
                                   <p>{selectedApplication.tattoos || "None"}</p>
                                 </div>
                                 <div>
                                   <Label>Piercings</Label>
                                   <p>{selectedApplication.piercings || "None"}</p>
                                 </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="experience" className="space-y-4">
                              <div className="space-y-4">
                                 <div>
                                   <Label>Interests</Label>
                                   <p>{selectedApplication.interests.join(", ") || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Instagram</Label>
                                   <p>{selectedApplication.instagram_handle || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Motivation</Label>
                                   <p className="whitespace-pre-wrap">{selectedApplication.motivation}</p>
                                 </div>
                                 <div>
                                   <Label>Availability</Label>
                                   <p className="whitespace-pre-wrap">{selectedApplication.availability || "Not provided"}</p>
                                 </div>
                                 <div>
                                   <Label>Location Preference</Label>
                                   <p>{selectedApplication.location_preference || "Not provided"}</p>
                                 </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="media" className="space-y-4">
                               <div>
                                 <Label>Photos ({selectedApplication.photos.length})</Label>
                                 {selectedApplication.photos[0]?.includes('admin access required') ? (
                                   <div className="p-4 bg-muted rounded-lg text-center">
                                     <p className="text-muted-foreground">{selectedApplication.photos[0]}</p>
                                   </div>
                                 ) : (
                                   <div className="grid grid-cols-3 gap-2 mt-2">
                                     {selectedApplication.photos.map((photo, index) => (
                                       <img
                                         key={index}
                                         src={photo}
                                         alt={`Photo ${index + 1}`}
                                         className="w-full h-32 object-cover rounded cursor-pointer"
                                         onClick={() => window.open(photo, '_blank')}
                                       />
                                     ))}
                                   </div>
                                 )}
                               </div>
                              
                               {selectedApplication.videos.length > 0 && (
                                 <div>
                                   <Label>Videos ({selectedApplication.videos.length})</Label>
                                   {selectedApplication.videos[0]?.includes('admin access required') ? (
                                     <div className="p-4 bg-muted rounded-lg text-center">
                                       <p className="text-muted-foreground">{selectedApplication.videos[0]}</p>
                                     </div>
                                   ) : (
                                     <div className="space-y-2 mt-2">
                                       {selectedApplication.videos.map((video, index) => (
                                         <div key={index} className="flex items-center justify-between p-2 border rounded">
                                           <span>Video {index + 1}</span>
                                           <Button size="sm" onClick={() => window.open(video, '_blank')}>
                                             <Download className="h-4 w-4 mr-2" />
                                             Download
                                           </Button>
                                         </div>
                                       ))}
                                     </div>
                                   )}
                                 </div>
                               )}
                            </TabsContent>
                            
                            <TabsContent value="admin" className="space-y-4">
                              <div className="space-y-4">
                                <div>
                                  <Label>Current Status</Label>
                                  <div className="mt-2">
                                    {getStatusBadge(selectedApplication.status)}
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="admin-notes">Admin Notes</Label>
                                  <Textarea
                                    id="admin-notes"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add observations about this application..."
                                    defaultValue={selectedApplication.admin_notes || ""}
                                  />
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewing', adminNotes)}
                                    variant="outline"
                                  >
                                    Mark as Under Review
                                  </Button>
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'approved', adminNotes)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected', adminNotes)}
                                    variant="destructive"
                                  >
                                    Reject
                                  </Button>
                                  {selectedApplication.status === 'approved' && (
                                    <Button
                                      onClick={() => convertToModel(selectedApplication)}
                                      variant="default"
                                    >
                                      Convert to Model
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

export { ModelApplicationManager };
export default ModelApplicationManager;