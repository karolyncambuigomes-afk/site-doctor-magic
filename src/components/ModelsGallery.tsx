import React, { useState, useMemo } from 'react';
import { ModelCard } from '@/components/ModelCard';
import { models, Model } from '@/data/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List } from 'lucide-react';

export const ModelsGallery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const locations = useMemo(() => {
    return Array.from(new Set(models.map(model => model.location)));
  }, []);

  const filteredAndSortedModels = useMemo(() => {
    let filtered = models.filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           model.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAvailability = filterAvailability === 'all' || model.availability === filterAvailability;
      const matchesLocation = filterLocation === 'all' || model.location === filterLocation;
      
      return matchesSearch && matchesAvailability && matchesLocation;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return a.age - b.age;
        case 'price':
          return parseInt(a.price.replace(/[£,/hour]/g, '')) - parseInt(b.price.replace(/[£,/hour]/g, ''));
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [searchTerm, sortBy, filterAvailability, filterLocation]);

  const availableCount = models.filter(model => model.availability === 'available').length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Our Exclusive Models</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our carefully selected collection of sophisticated companions, 
          each offering elegance, intelligence, and exceptional service.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20">
            {availableCount} Available Now
          </Badge>
          <Badge variant="outline">
            {models.length} Total Models
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
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
        
        {/* Active Filters */}
        {(searchTerm || filterAvailability !== 'all' || filterLocation !== 'all') && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
                Search: "{searchTerm}" ×
              </Badge>
            )}
            {filterAvailability !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterAvailability('all')}>
                {filterAvailability} ×
              </Badge>
            )}
            {filterLocation !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setFilterLocation('all')}>
                {filterLocation} ×
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterAvailability('all');
                setFilterLocation('all');
              }}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAndSortedModels.length} of {models.length} models
        </p>
      </div>

      {/* Models Grid */}
      {filteredAndSortedModels.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {filteredAndSortedModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">No models found matching your criteria</p>
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
  );
};