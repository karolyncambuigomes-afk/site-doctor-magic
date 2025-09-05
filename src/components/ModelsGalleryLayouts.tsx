import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useModels, Model } from '@/hooks/useModels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Grid, List, MapPin, Star, Clock } from 'lucide-react';

interface ModelsGalleryProps {
  layoutStyle: 'minimal' | 'elegant' | 'modern';
}

export const ModelsGallery: React.FC<ModelsGalleryProps> = ({ layoutStyle = 'minimal' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { models, loading, error } = useModels();

  const locations = useMemo(() => {
    return Array.from(new Set(models.map(model => model.location).filter(Boolean)));
  }, [models]);

  const filteredAndSortedModels = useMemo(() => {
    if (!models.length) return [];
    
    let filtered = models.filter(model => {
      const matchesSearch = model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = filterAvailability === 'all' || model.availability === filterAvailability;
      const matchesLocation = filterLocation === 'all' || model.location === filterLocation;
      
      return matchesSearch && matchesAvailability && matchesLocation;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'age':
          return (a.age || 0) - (b.age || 0);
        case 'price':
          return parseInt((a.price || '').replace(/[£,/hour]/g, '') || '0') - parseInt((b.price || '').replace(/[£,/hour]/g, '') || '0');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  }, [models, searchTerm, sortBy, filterAvailability, filterLocation]);

  const availableCount = models.filter(model => model.availability === 'available').length;

  // Minimal Layout Component
  const MinimalModelCard = ({ model }: { model: Model }) => (
    <Link to={`/models/${model.id}`} className="group block">
      <div className="relative overflow-hidden bg-black aspect-[3/4] rounded-none">
        <img 
          src={model.image} 
          alt={model.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Minimal Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl font-light tracking-wide mb-1">{model.name}</h3>
          <p className="text-sm text-white/80 mb-2">{model.location}</p>
          <div className="w-12 h-[1px] bg-white/40"></div>
        </div>
      </div>
    </Link>
  );

  // Elegant Layout Component  
  const ElegantModelCard = ({ model }: { model: Model }) => (
    <Link to={`/models/${model.id}`} className="group block">
      <div className="relative overflow-hidden aspect-[3/4] rounded-lg bg-muted">
        <img 
          src={model.image} 
          alt={model.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Elegant Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {model.availability === 'available' ? 'Available' : 'Busy'}
            </Badge>
          </div>
          <h3 className="text-xl font-medium mb-1">{model.name}</h3>
          <div className="flex items-center gap-4 text-sm text-white/80 mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {model.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {model.rating}
            </span>
          </div>
          <p className="text-white/70 text-sm line-clamp-2">{model.description}</p>
        </div>
      </div>
    </Link>
  );

  // Modern Layout Component
  const ModernModelCard = ({ model }: { model: Model }) => (
    <div className="group relative">
      <Link to={`/models/${model.id}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] rounded-2xl bg-muted">
          <img 
            src={model.image} 
            alt={model.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Modern Info Card */}
        <div className="absolute -bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 border border-border/50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-medium text-foreground">{model.name}</h3>
              <p className="text-sm text-muted-foreground">{model.location}</p>
            </div>
            <Badge variant={model.availability === 'available' ? 'default' : 'secondary'} className="text-xs">
              {model.availability}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star className="w-3 h-3 fill-current text-primary" />
              {model.rating}
            </span>
            <span className="font-medium text-foreground">{model.price}</span>
          </div>
        </div>
      </Link>
    </div>
  );

  const renderModelCard = (model: Model) => {
    switch (layoutStyle) {
      case 'minimal':
        return <MinimalModelCard key={model.id} model={model} />;
      case 'elegant':
        return <ElegantModelCard key={model.id} model={model} />;
      case 'modern':
        return <ModernModelCard key={model.id} model={model} />;
      default:
        return <MinimalModelCard key={model.id} model={model} />;
    }
  };

  const getContainerStyle = () => {
    switch (layoutStyle) {
      case 'minimal':
        return 'min-h-screen bg-black text-white';
      case 'elegant':
        return 'min-h-screen bg-gradient-to-b from-muted/30 to-background';
      case 'modern':
        return 'min-h-screen bg-background';
      default:
        return 'min-h-screen bg-background';
    }
  };

  const getHeaderStyle = () => {
    switch (layoutStyle) {
      case 'minimal':
        return 'text-center mb-16 pt-32';
      case 'elegant':
        return 'text-center mb-12 pt-32';
      case 'modern':
        return 'text-center mb-12 pt-32';
      default:
        return 'text-center mb-12 pt-32';
    }
  };

  return (
    <div className={getContainerStyle()}>
      <Navigation />
      
      <main>
        {/* Header */}
        <div className={getHeaderStyle()}>
          <div className="container-width">
            <h1 className={`heading-xl mb-6 ${layoutStyle === 'minimal' ? 'text-white font-light tracking-wide' : ''}`}>
              {layoutStyle === 'minimal' ? 'Our Models' : 'Our Exclusive Models'}
            </h1>
            <p className={`body-lg max-w-2xl mx-auto mb-8 ${
              layoutStyle === 'minimal' ? 'text-white/80' : 'text-muted-foreground'
            }`}>
              Discover our carefully selected collection of sophisticated companions
            </p>
            
            {layoutStyle !== 'minimal' && (
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20">
                  {availableCount} Available Now
                </Badge>
                <Badge variant="outline">
                  {models.length} Total Models
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="section-padding">
          <div className="container-width">
            <div className="mb-8 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    layoutStyle === 'minimal' ? 'text-white/60' : 'text-muted-foreground'
                  }`} />
                  <Input
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${
                      layoutStyle === 'minimal' 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' 
                        : ''
                    }`}
                  />
                </div>
                
                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="age">Age</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Models Grid */}
            {filteredAndSortedModels.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 lg:grid-cols-2'
              } ${layoutStyle === 'modern' ? 'gap-8' : ''}`}>
                {filteredAndSortedModels.map(renderModelCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className={`text-lg mb-4 ${
                  layoutStyle === 'minimal' ? 'text-white/80' : 'text-muted-foreground'
                }`}>
                  No models found matching your criteria
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterAvailability('all');
                    setFilterLocation('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};