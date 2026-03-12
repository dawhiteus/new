import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExternalLink, MoreHorizontal, Star, ChevronUp, ChevronDown, TrendingUp, BarChart3, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlternativeSpacesModalProps } from './types/workspace-types';
import { WorkspaceComparisonModal } from './WorkspaceComparisonModal';

export function AlternativeSpacesModal({
  isOpen,
  onClose,
  licenseName,
  spaces,
  onViewFullCollection
}: AlternativeSpacesModalProps) {
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showMarketInsights, setShowMarketInsights] = useState(false);
  const [currentView, setCurrentView] = useState<'collections' | 'comparison'>('collections');
  const [selectedSpace, setSelectedSpace] = useState<any>(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatPrice = (price: number, unit: string) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K/${unit}`;
    }
    return `${price.toLocaleString()}/${unit}`;
  };

  const getBookingModeDisplay = (space: any) => {
    if (space.isAvailable === false) {
      return 'Offline with Lease';
    }
    return space.bookingMode || 'Available Now – Online';
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  // Market pricing data for Atlanta
  const officeSuiteData = [
    { priceRange: '$200-300', count: 8, price: 250 },
    { priceRange: '$300-400', count: 15, price: 350 },
    { priceRange: '$400-500', count: 23, price: 450 },
    { priceRange: '$500-600', count: 31, price: 550 },
    { priceRange: '$600-700', count: 18, price: 650 },
    { priceRange: '$700-800', count: 12, price: 750 },
    { priceRange: '$800-900', count: 6, price: 850 },
  ];

  const teamOfficeData = [
    { priceRange: '$150-250', count: 12, price: 200 },
    { priceRange: '$250-350', count: 25, price: 300 },
    { priceRange: '$350-450', count: 38, price: 400 },
    { priceRange: '$450-550', count: 45, price: 500 },
    { priceRange: '$550-650', count: 32, price: 600 },
    { priceRange: '$650-750', count: 18, price: 700 },
    { priceRange: '$750-850', count: 8, price: 800 },
  ];

  const privateOfficeData = [
    { priceRange: '$100-150', count: 18, price: 125 },
    { priceRange: '$150-200', count: 32, price: 175 },
    { priceRange: '$200-250', count: 45, price: 225 },
    { priceRange: '$250-300', count: 38, price: 275 },
    { priceRange: '$300-350', count: 25, price: 325 },
    { priceRange: '$350-400', count: 15, price: 375 },
    { priceRange: '$400-450', count: 8, price: 425 },
  ];

  const renderHistogramChart = (data: any[], title: string, referenceValue: number, referenceLabel: string, chartColor: string, iconColor: string) => (
    <Card className="bg-white rounded-xl shadow-sm border-0">
      <CardHeader className="pb-4">
        <CardTitle 
          className="flex items-center gap-2"
          style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#374151', 
            fontFamily: 'Inter, sans-serif' 
          }}
        >
          <BarChart3 className="h-4 w-4" style={{ color: iconColor }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis 
                dataKey="priceRange" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: '#6B7280', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: '#6B7280', 
                  fontFamily: 'Inter, sans-serif' 
                }}
                label={{ 
                  value: 'Number of Workspaces', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { 
                    textAnchor: 'middle', 
                    fontSize: '12px', 
                    fill: '#6B7280', 
                    fontFamily: 'Inter, sans-serif' 
                  }
                }}
              />
              <Bar 
                dataKey="count" 
                fill={chartColor} 
                radius={[2, 2, 0, 0]}
              />
              <ReferenceLine 
                x={referenceValue} 
                stroke="#FFA500" 
                strokeDasharray="4 4" 
                strokeWidth={2}
                label={{ 
                  value: referenceLabel, 
                  position: 'topRight',
                  style: { 
                    fontSize: '10px', 
                    fill: '#FFA500', 
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-center">
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 400, 
              color: '#6B7280', 
              fontFamily: 'Inter, sans-serif' 
            }}
          >
            Price per unit capacity (monthly)
          </span>
        </div>
      </CardContent>
    </Card>
  );

  // Handle view reset when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentView('collections');
      setSelectedSpace(null);
    }
  }, [isOpen]);

  // If we're in comparison view, render the comparison modal
  if (currentView === 'comparison' && selectedSpace) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="!max-w-[1600px] !w-[96vw] sm:!max-w-[1600px] md:!max-w-[1600px] lg:!max-w-[1600px] xl:!max-w-[1600px] overflow-hidden bg-white border-0 rounded-xl flex flex-col p-6"
          style={{ 
            fontFamily: 'Inter, sans-serif',
            boxShadow: 'var(--shadow-md)',
            maxWidth: '1600px', 
            width: '96vw',
            maxHeight: '90vh',
            height: '90vh'
          }}
        >
          <DialogDescription className="sr-only">
            Workspace comparison view showing detailed analysis and recommendations
          </DialogDescription>
          <WorkspaceComparisonModal
            onBack={() => setCurrentView('collections')}
            selectedSpace={selectedSpace}
            currentLicenseId="license_5483980"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-[1600px] !w-[96vw] sm:!max-w-[1600px] md:!max-w-[1600px] lg:!max-w-[1600px] xl:!max-w-[1600px] overflow-hidden bg-white border-0 rounded-xl flex flex-col p-0"
        style={{ 
          fontFamily: 'Inter, sans-serif',
          boxShadow: 'var(--shadow-md)',
          maxWidth: '1600px', 
          width: '96vw',
          maxHeight: '90vh',
          height: '90vh'
        }}
      >
        {/* Blue Header Section */}
        <div className="bg-primary text-primary-foreground px-8 py-6 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle 
                className="text-heading-1 mb-2"
                style={{ 
                  color: '#FFFFFF', 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '28px',
                  fontWeight: 700
                }}
              >
                Alternative Spaces for {licenseName}
              </DialogTitle>
              <DialogDescription 
                className="text-primary-foreground/80"
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Recommended workspace alternatives based on your requirements
              </DialogDescription>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div 
          className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-white"
          style={{ 
            minHeight: 0
          }}
        >
          <Table>
            <TableHeader>
              <TableRow 
                className="border-b bg-gray-50 hover:bg-gray-50"
                style={{ borderColor: '#E5E7EB' }}
              >
                <TableHead 
                  className="py-4 px-6 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('name')}
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <div className="flex items-center">
                    Workspace Name
                    {renderSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 px-4"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Address
                </TableHead>
                <TableHead 
                  className="py-4 px-4"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Workspace Type
                </TableHead>
                <TableHead 
                  className="py-4 px-4"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Capacity
                </TableHead>
                <TableHead 
                  className="py-4 px-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('price')}
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <div className="flex items-center">
                    Price
                    {renderSortIcon('price')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 px-4"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Booking Mode
                </TableHead>
                <TableHead 
                  className="py-4 px-4"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Amenities
                </TableHead>
                <TableHead 
                  className="py-4 px-4 w-12"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.map((space, index) => (
                <TableRow 
                  key={space.id}
                  className={`border-b hover:bg-gray-50 transition-colors ${
                    index % 2 === 1 ? 'bg-gray-25' : ''
                  }`}
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <TableCell className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={space.image} 
                        alt={space.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        style={{ flexShrink: 0 }}
                      />
                      <div className="min-w-0">
                        <div 
                          className="font-medium text-foreground truncate"
                          style={{ 
                            fontSize: '16px', 
                            fontWeight: 500, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif' 
                          }}
                        >
                          {space.name}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span 
                            style={{ 
                              fontSize: '12px', 
                              fontWeight: 400, 
                              color: '#6B7280', 
                              fontFamily: 'Inter, sans-serif' 
                            }}
                          >
                            {space.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div>
                      <div 
                        style={{ 
                          fontSize: '16px', 
                          fontWeight: 400, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif' 
                        }}
                      >
                        {space.address || space.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Badge 
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: '#005B94',
                        color: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {space.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <span 
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 400, 
                        color: '#374151', 
                        fontFamily: 'Inter, sans-serif' 
                      }}
                    >
                      {space.capacity || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div>
                      <div 
                        className="font-medium"
                        style={{ 
                          fontSize: '16px', 
                          fontWeight: 500, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif' 
                        }}
                      >
                        {formatPrice(space.price, space.priceUnit)}
                      </div>
                      <div 
                        style={{ 
                          fontSize: '12px', 
                          fontWeight: 400, 
                          color: '#6B7280', 
                          fontFamily: 'Inter, sans-serif' 
                        }}
                      >
                        12 months avg. term
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <Badge 
                      className="text-xs font-medium px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: getBookingModeDisplay(space).includes('Online') ? '#28A745' : '#FFA500',
                        color: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {getBookingModeDisplay(space).includes('Online') ? 'Available Now' : 'Offline with Lease'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(space.amenities || ['WiFi', 'Kitchen']).slice(0, 2).map((amenity, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 400, 
                            color: '#6B7280', 
                            fontFamily: 'Inter, sans-serif' 
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                      {(space.amenities || []).length > 2 && (
                        <span 
                          className="text-xs px-2 py-1 bg-gray-100 rounded"
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 400, 
                            color: '#6B7280', 
                            fontFamily: 'Inter, sans-serif' 
                          }}
                        >
                          +{(space.amenities || []).length - 2} More
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-8 w-8 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          Add to Shortlist
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          Request Quote
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 cursor-pointer border-t pt-2 mt-1"
                          onClick={() => {
                            setSelectedSpace(space);
                            setCurrentView('comparison');
                          }}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <div 
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: '#E3F2FD' }}
                            >
                              <span className="text-xs font-medium" style={{ color: '#005B94' }}>vs</span>
                            </div>
                            Compare to Current Location
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Market Pricing Section */}
        <div className="border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-6 py-4">
            <Button
              variant="ghost"
              onClick={() => setShowMarketInsights(!showMarketInsights)}
              className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#E3F2FD' }}
                >
                  <TrendingUp className="h-4 w-4" style={{ color: '#005B94' }} />
                </div>
                <div className="text-left">
                  <div 
                    style={{ 
                      fontSize: '16px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif' 
                    }}
                  >
                    Atlanta Market Prices
                  </div>
                  <div 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 400, 
                      color: '#6B7280', 
                      fontFamily: 'Inter, sans-serif' 
                    }}
                  >
                    Compare workspace prices to local market trends
                  </div>
                </div>
              </div>
              {showMarketInsights ? 
                <ChevronUp className="h-5 w-5" style={{ color: '#6B7280' }} /> : 
                <ChevronDown className="h-5 w-5" style={{ color: '#6B7280' }} />
              }
            </Button>
          </div>

          {showMarketInsights && (
            <div className="px-6 pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {renderHistogramChart(
                  officeSuiteData,
                  "Office Suite Workspaces",
                  440.12,
                  "5 Offices – 66 Desks: $440.12",
                  "#005B94", // Primary Blue (chart-1)
                  "#005B94"
                )}
                {renderHistogramChart(
                  teamOfficeData,
                  "Team Office Workspaces", 
                  365.50,
                  "87 Desks: $365.50",
                  "#28A745", // Accent Green (chart-2)
                  "#28A745"
                )}
                {renderHistogramChart(
                  privateOfficeData,
                  "Private Office Workspaces",
                  290.25,
                  "10 Desks: $290.25",
                  "#FFA500", // Accent Orange (chart-3)
                  "#FFA500"
                )}
              </div>
              
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: '#005B94' }}
                  >
                    <span className="text-white text-xs font-medium">i</span>
                  </div>
                  <div>
                    <div 
                      className="mb-2"
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: '#374151', 
                        fontFamily: 'Inter, sans-serif' 
                      }}
                    >
                      Market Analysis Summary
                    </div>
                    <div 
                      style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#6B7280', 
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.5
                      }}
                    >
                      Based on 500+ active workspace listings in Atlanta. 
                      Orange dashed lines show your current workspace specifications for comparison. 
                      Most competitive pricing occurs in the $350-550 range for team offices and $200-300 for private offices.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter 
          className="border-t flex-shrink-0 px-6 py-4"
          style={{ 
            borderColor: '#E5E7EB'
          }}
        >
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="flex items-center">
              <span 
                className="text-muted"
                style={{ 
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                Showing {spaces.length} alternative workspace{spaces.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="font-medium rounded-md border-gray-300 text-foreground hover:bg-gray-50"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  padding: '8px 16px'
                }}
              >
                Close
              </Button>
              <Button 
                onClick={onViewFullCollection}
                className="font-medium gap-2 rounded-md bg-primary hover:bg-primary-dark text-primary-foreground"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  padding: '8px 24px'
                }}
              >
                View Full Collection
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}