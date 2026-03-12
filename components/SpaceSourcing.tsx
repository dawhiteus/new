import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';
import { 
  Search, 
  MapPin, 
  Star,
  Trash2,
  Plus,
  Eye,
  Building2,
  Globe,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Space {
  id: string;
  name: string;
  operator: string;
  location: string;
  city: string;
  size: number;
  price: number;
  workspaceType: string;
  amenities: string[];
  source: 'liquidspace' | 'external';
}

interface SpaceSourcingProps {
  dealId?: string;
  dealName?: string;
}

export function SpaceSourcing({ dealId, dealName }: SpaceSourcingProps) {
  const [activeTab, setActiveTab] = useState('search');
  const [collection, setCollection] = useState<Space[]>([]);
  
  // Search form state
  const [location, setLocation] = useState('New York');
  const [minSize, setMinSize] = useState('4000');
  const [maxSize, setMaxSize] = useState('6000');
  const [workspaceType, setWorkspaceType] = useState('Dedicated Desk');
  const [maxBudget, setMaxBudget] = useState('60000');
  const [startDate, setStartDate] = useState('');
  const [termDate, setTermDate] = useState('');
  const [capacity, setCapacity] = useState('50');

  const [searchResults, setSearchResults] = useState<Space[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults: Space[] = [
        {
          id: '1',
          name: 'WeWork Times Square',
          operator: 'WeWork',
          location: 'Times Square',
          city: 'New York',
          size: 5000,
          price: 55000,
          workspaceType: 'Dedicated Desk',
          amenities: ['High-Speed WiFi', 'Conference Rooms', 'Kitchen', 'Mail Service'],
          source: 'liquidspace'
        },
        {
          id: '2',
          name: 'Industrious Flatiron',
          operator: 'Industrious',
          location: 'Flatiron District',
          city: 'New York',
          size: 4500,
          price: 52000,
          workspaceType: 'Dedicated Desk',
          amenities: ['High-Speed WiFi', 'Conference Rooms', 'Wellness Room'],
          source: 'liquidspace'
        },
        {
          id: '3',
          name: 'The Farm SoHo',
          operator: 'The Farm',
          location: 'SoHo',
          city: 'New York',
          size: 5500,
          price: 58000,
          workspaceType: 'Private Office',
          amenities: ['High-Speed WiFi', 'Event Space', 'Kitchen', 'Outdoor Terrace'],
          source: 'liquidspace'
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const addToCollection = (space: Space) => {
    if (!collection.some(s => s.id === space.id)) {
      setCollection([...collection, space]);
    }
  };

  const removeFromCollection = (spaceId: string) => {
    setCollection(collection.filter(s => s.id !== spaceId));
  };

  return (
    <div className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-100 mb-6">
          <TabsTrigger 
            value="search"
            style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Search Spaces
          </TabsTrigger>
          <TabsTrigger 
            value="collection"
            style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Collection ({collection.length})
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="mt-0">
          <Card className="bg-white rounded-xl border" style={{ borderColor: '#E5E7EB' }}>
            <CardContent className="p-6">
              {/* Row 1: Location, Min Size, Max Size, Workspace Type, Max Budget */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Location
                  </Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Min Size (sq ft)
                  </Label>
                  <Input
                    type="number"
                    value={minSize}
                    onChange={(e) => setMinSize(e.target.value)}
                    className="mt-1 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Max Size (sq ft)
                  </Label>
                  <Input
                    type="number"
                    value={maxSize}
                    onChange={(e) => setMaxSize(e.target.value)}
                    className="mt-1 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Workspace Type
                  </Label>
                  <Select value={workspaceType} onValueChange={setWorkspaceType}>
                    <SelectTrigger className="mt-1 border-gray-300" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hot Desk">Hot Desk</SelectItem>
                      <SelectItem value="Dedicated Desk">Dedicated Desk</SelectItem>
                      <SelectItem value="Private Office">Private Office</SelectItem>
                      <SelectItem value="Team Suite">Team Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Max Budget ($/mo)
                  </Label>
                  <Input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="mt-1 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>

              {/* Row 2: Start Date, Term Date, Capacity, Google, CoStar, Search */}
              <div className="grid grid-cols-6 gap-4">
                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                    placeholder="mm/dd/yyyy"
                  />
                </div>

                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Term Date
                  </Label>
                  <Input
                    type="date"
                    value={termDate}
                    onChange={(e) => setTermDate(e.target.value)}
                    className="mt-1 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                    placeholder="mm/dd/yyyy"
                  />
                </div>

                <div>
                  <Label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    Capacity
                  </Label>
                  <Input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="mt-1 border-gray-300"
                    style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300"
                    style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Google
                  </Button>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300"
                    style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    CoStar
                  </Button>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="w-full text-white"
                    style={{ 
                      backgroundColor: '#005B94',
                      fontSize: '14px', 
                      fontWeight: 500, 
                      fontFamily: 'Inter, sans-serif' 
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search LiquidSpace
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {isSearching && (
            <div className="mt-6 text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" style={{ borderColor: '#005B94' }}></div>
              <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif', marginTop: '12px' }}>
                Searching spaces...
              </p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  {searchResults.length} space{searchResults.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div className="space-y-4">
                {searchResults.map((space) => (
                  <Card 
                    key={space.id} 
                    className="bg-white border hover:shadow-md transition-shadow"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                              {space.name}
                            </span>
                            <Badge 
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              style={{ fontSize: '11px', fontWeight: 500 }}
                            >
                              {space.operator}
                            </Badge>
                            {space.source === 'liquidspace' && (
                              <Badge 
                                className="px-2 py-1 rounded"
                                style={{ 
                                  backgroundColor: '#005B94', 
                                  color: 'white',
                                  fontSize: '10px', 
                                  fontWeight: 600 
                                }}
                              >
                                LiquidSpace
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2" style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                              <MapPin className="h-3 w-3" />
                              {space.location}, {space.city}
                            </div>
                            <span className="text-gray-400">•</span>
                            <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                              {space.size.toLocaleString()} sq ft
                            </span>
                            <span className="text-gray-400">•</span>
                            <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                              {space.workspaceType}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            {space.amenities.map((amenity, idx) => (
                              <Badge 
                                key={idx}
                                className="bg-blue-50 text-blue-700 px-2 py-1 rounded"
                                style={{ fontSize: '11px', fontWeight: 500 }}
                              >
                                {amenity}
                              </Badge>
                            ))}
                          </div>

                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                            ${space.price.toLocaleString()}/mo
                            <span style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>
                              {' '}(${(space.price / space.size).toFixed(2)}/sq ft)
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            className="border-gray-300"
                            style={{ 
                              fontSize: '14px', 
                              fontWeight: 500, 
                              fontFamily: 'Inter, sans-serif' 
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            onClick={() => addToCollection(space)}
                            disabled={collection.some(s => s.id === space.id)}
                            className="text-white"
                            style={{ 
                              backgroundColor: collection.some(s => s.id === space.id) ? '#6B7280' : '#005B94',
                              fontSize: '14px', 
                              fontWeight: 500, 
                              fontFamily: 'Inter, sans-serif' 
                            }}
                          >
                            {collection.some(s => s.id === space.id) ? (
                              <>
                                <Star className="h-4 w-4 mr-2 fill-current" />
                                Added
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Add to Collection
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Collection Tab */}
        <TabsContent value="collection" className="mt-0">
          {collection.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto mb-4" style={{ color: '#E5E7EB' }} />
              <p style={{ fontSize: '16px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                No spaces in your collection yet
              </p>
              <p style={{ fontSize: '14px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', marginTop: '8px' }}>
                Add spaces from search results to build your collection
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {collection.map((space) => (
                <Card 
                  key={space.id} 
                  className="bg-white border"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ fontSize: '18px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                            {space.name}
                          </span>
                          <Badge 
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            style={{ fontSize: '11px', fontWeight: 500 }}
                          >
                            {space.operator}
                          </Badge>
                          {space.source === 'liquidspace' && (
                            <Badge 
                              className="px-2 py-1 rounded"
                              style={{ 
                                backgroundColor: '#005B94', 
                                color: 'white',
                                fontSize: '10px', 
                                fontWeight: 600 
                              }}
                            >
                              LiquidSpace
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2" style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                            <MapPin className="h-3 w-3" />
                            {space.location}, {space.city}
                          </div>
                          <span className="text-gray-400">•</span>
                          <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                            {space.size.toLocaleString()} sq ft
                          </span>
                          <span className="text-gray-400">•</span>
                          <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                            {space.workspaceType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {space.amenities.map((amenity, idx) => (
                            <Badge 
                              key={idx}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded"
                              style={{ fontSize: '11px', fontWeight: 500 }}
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                          ${space.price.toLocaleString()}/mo
                          <span style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280' }}>
                            {' '}(${(space.price / space.size).toFixed(2)}/sq ft)
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          className="border-gray-300"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 500, 
                            fontFamily: 'Inter, sans-serif' 
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => removeFromCollection(space.id)}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 500, 
                            fontFamily: 'Inter, sans-serif' 
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
