import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { 
  ArrowLeft, 
  Download, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Building, 
  Wifi, 
  Coffee, 
  Car, 
  Shield,
  TrendingUp,
  TrendingDown,
  BarChart3,
  MessageSquare,
  Plus,
  FileText,
  Video,
  CheckCircle,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

interface WorkspaceComparisonProps {
  onBack: () => void;
  currentLicenseId?: string;
  alternativeLicenseId?: string;
  onViewChange?: (view: string) => void;
}

export function WorkspaceComparison({ 
  onBack, 
  currentLicenseId = "license_5483980", 
  alternativeLicenseId = "workspace_98134",
  onViewChange 
}: WorkspaceComparisonProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>('');

  // Mock data for current workspace
  const currentWorkspace = {
    id: currentLicenseId,
    name: "WeWork Downtown Atlanta",
    address: "180 Peachtree Street NW, Atlanta, GA 30303",
    type: "Office Suite",
    monthlyPrice: 156000,
    pricePerDesk: 2400,
    size: "12,500 sq ft",
    capacity: "65 desks",
    termLength: "24 months",
    endDate: "2025-12-31",
    rating: 4.2,
    utilization: 78,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
    amenities: ["High-Speed WiFi", "Kitchen", "Parking", "Meeting Rooms", "24/7 Access"],
    risks: ["High cost per desk", "Long-term commitment"],
    highlights: ["Prime downtown location", "Established workspace"]
  };

  // Mock data for alternative workspace
  const alternativeWorkspace = {
    id: alternativeLicenseId,
    name: "Spaces Buckhead Business District",
    address: "3340 Peachtree Road NE, Atlanta, GA 30326",
    type: "Team Office",
    monthlyPrice: 98000,
    pricePerDesk: 1400,
    size: "10,800 sq ft",
    capacity: "70 desks",
    termLength: "12 months",
    endDate: "2026-06-30",
    rating: 4.7,
    utilization: 85,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=250&fit=crop",
    amenities: ["Ultra-Fast WiFi", "Premium Kitchen", "Covered Parking", "Executive Meeting Rooms", "Concierge Service"],
    risks: ["Suburban location", "Newer provider"],
    highlights: ["22% cost savings", "Higher employee satisfaction", "Flexible terms"]
  };

  // Strategic comparison metrics data
  const comparisonMetrics = [
    {
      category: "Cost per Desk",
      current: 2400,
      alternative: 1400,
      difference: -42
    },
    {
      category: "Utilization Match",
      current: 78,
      alternative: 85,
      difference: 9
    },
    {
      category: "Term Flexibility",
      current: 24,
      alternative: 12,
      difference: 50
    },
    {
      category: "Experience Rating",
      current: 4.2,
      alternative: 4.7,
      difference: 12
    }
  ];

  const conversationalPrompts = [
    "How will this affect our annual budget?",
    "Is this a good fit for distributed teams?",
    "What's the risk if we switch now?",
    "How does this impact employee satisfaction?",
    "What's the ROI timeline for this change?"
  ];

  const costSavings = currentWorkspace.monthlyPrice - alternativeWorkspace.monthlyPrice;
  const annualSavings = costSavings * 12;

  // CTA Button Handlers
  const handleAddToPortfolio = () => {
    setActionType('portfolio');
    setShowSuccessDialog(true);
    // In a real app, this would add the workspace to a portfolio plan
    console.log('Adding alternative workspace to portfolio plan:', alternativeWorkspace.name);
  };

  const handleRequestImplementation = () => {
    setActionType('implementation');
    setShowSuccessDialog(true);
    // In a real app, this would create an implementation request
    console.log('Requesting implementation plan for workspace:', alternativeWorkspace.name);
  };

  const handleScheduleSession = () => {
    setActionType('session');
    setShowSuccessDialog(true);
    // In a real app, this would open a calendar booking system
    console.log('Scheduling strategy session for workspace comparison');
  };

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    // In a real app, this would send the prompt to an AI service
    console.log('Selected prompt:', prompt);
  };

  const renderWorkspaceCard = (workspace: any, isAlternative = false) => (
    <Card className="bg-white rounded-xl shadow-sm border-0 h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle 
            style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#374151', 
              fontFamily: 'Inter, sans-serif' 
            }}
          >
            {isAlternative ? 'Alternative Workspace' : 'Current Workspace'}
          </CardTitle>
          {isAlternative && (
            <div className="flex gap-2">
              <Badge 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: '#28A745',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                -22% Cost
              </Badge>
              <Badge 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: '#FFA500',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                +1.5★ Rating
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workspace Image */}
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={workspace.image} 
            alt={workspace.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-full">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                {workspace.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-3">
          <div>
            <h3 
              style={{ 
                fontSize: '20px', 
                fontWeight: 600, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              {workspace.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 400, 
                  color: '#6B7280', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                {workspace.address}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: '#005B94' }} />
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Monthly Cost
                </span>
              </div>
              <div 
                style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#374151', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                ${workspace.monthlyPrice.toLocaleString()}
              </div>
              <div 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 400, 
                  color: '#6B7280', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                ${workspace.pricePerDesk}/desk
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" style={{ color: '#005B94' }} />
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Size & Type
                </span>
              </div>
              <div 
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#374151', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                {workspace.size}
              </div>
              <Badge 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: '#005B94',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {workspace.type}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" style={{ color: '#005B94' }} />
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Capacity
                </span>
              </div>
              <div 
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#374151', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                {workspace.capacity}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={workspace.utilization} className="h-2 flex-1" />
                <span 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  {workspace.utilization}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" style={{ color: '#005B94' }} />
                <span 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Term Length
                </span>
              </div>
              <div 
                style={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  color: '#374151', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                {workspace.termLength}
              </div>
              <div 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 400, 
                  color: '#6B7280', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                Ends {workspace.endDate}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <span 
              style={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              Key Amenities
            </span>
            <div className="flex flex-wrap gap-2">
              {workspace.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded">
                  {amenity.includes('WiFi') && <Wifi className="h-3 w-3" />}
                  {amenity.includes('Kitchen') && <Coffee className="h-3 w-3" />}
                  {amenity.includes('Parking') && <Car className="h-3 w-3" />}
                  {!amenity.includes('WiFi') && !amenity.includes('Kitchen') && !amenity.includes('Parking') && <Shield className="h-3 w-3" />}
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 400, 
                      color: '#6B7280', 
                      fontFamily: 'Inter, sans-serif' 
                    }}
                  >
                    {amenity}
                  </span>
                </div>
              ))}
              {workspace.amenities.length > 3 && (
                <span 
                  className="text-xs px-2 py-1 bg-gray-100 rounded"
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  +{workspace.amenities.length - 3} More
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-white hover:bg-white/10 p-2 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 
                  className="mb-2"
                  style={{ 
                    color: '#FFFFFF', 
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '28px',
                    fontWeight: 700
                  }}
                >
                  Workspace Comparison
                </h1>
                <p 
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Evaluate a potential replacement for your current office license
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium gap-2"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Download className="h-4 w-4" />
                Export Comparison
              </Button>
            </div>
          </div>

          {/* Key Tags/Inputs */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                COMPANY:
              </span>
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#FFFFFF', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                Tel Tech
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                LOCATION:
              </span>
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#FFFFFF', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                Atlanta, GA
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                CURRENT:
              </span>
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#FFFFFF', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                {currentLicenseId}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
              <span 
                style={{ 
                  fontSize: '12px', 
                  fontWeight: 500, 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                ALTERNATIVE:
              </span>
              <span 
                style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: '#FFFFFF', 
                  fontFamily: 'Inter, sans-serif' 
                }}
              >
                {alternativeLicenseId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-8">
          {/* Side-by-Side Comparison Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderWorkspaceCard(currentWorkspace)}
            {renderWorkspaceCard(alternativeWorkspace, true)}
          </div>

          {/* LiquidIQ Insight Panel */}
          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#E3F2FD' }}
                >
                  <MessageSquare className="h-5 w-5" style={{ color: '#005B94' }} />
                </div>
                <div>
                  <CardTitle 
                    style={{ 
                      fontSize: '20px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif' 
                    }}
                  >
                    LiquidIQ Insight Panel
                  </CardTitle>
                  <p 
                    style={{ 
                      fontSize: '14px', 
                      fontWeight: 400, 
                      color: '#6B7280', 
                      fontFamily: 'Inter, sans-serif' 
                    }}
                  >
                    AI-powered workspace analysis and recommendations
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Summary */}
              <div className="p-6 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <div className="flex items-start gap-4">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: '#005B94' }}
                  >
                    <span className="text-white text-sm font-semibold">AI</span>
                  </div>
                  <div className="flex-1">
                    <p 
                      style={{ 
                        fontSize: '16px', 
                        fontWeight: 400, 
                        color: '#374151', 
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.6
                      }}
                    >
                      This workspace reduces your monthly cost by <strong>${costSavings.toLocaleString()}</strong> while improving employee amenities and term flexibility. Based on recent usage patterns, it offers a better fit for hybrid attendance with <strong>higher utilization rates</strong> and <strong>enhanced flexibility</strong>. The annual savings of <strong>${annualSavings.toLocaleString()}</strong> could be reinvested in employee experience initiatives.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversational Prompts */}
              <div className="space-y-3">
                <h4 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Ask LiquidIQ about this comparison:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {conversationalPrompts.map((prompt, idx) => (
                    <Button
                      key={idx}
                      variant={selectedPrompt === prompt ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePromptClick(prompt)}
                      className="text-sm rounded-full"
                      style={{
                        fontSize: '13px',
                        fontWeight: 400,
                        fontFamily: 'Inter, sans-serif',
                        ...(selectedPrompt === prompt ? {
                          backgroundColor: '#005B94',
                          color: '#FFFFFF'
                        } : {
                          borderColor: '#E5E7EB',
                          color: '#374151'
                        })
                      }}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strategic Comparison Metrics */}
          <Card className="bg-white rounded-xl shadow-sm border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6" style={{ color: '#005B94' }} />
                <CardTitle 
                  style={{ 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Strategic Comparison Metrics
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {comparisonMetrics.map((metric, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="text-center">
                      <h4 
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif' 
                        }}
                      >
                        {metric.category}
                      </h4>
                    </div>
                    
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Current', value: metric.current, fill: '#E5E7EB' },
                          { name: 'Alternative', value: metric.alternative, fill: '#005B94' }
                        ]}>
                          <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                          />
                          <YAxis hide />
                          <Bar dataKey="value" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {metric.difference > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span 
                          className={`text-sm font-medium ${
                            metric.difference > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {metric.difference > 0 ? '+' : ''}{Math.abs(metric.difference)}%
                        </span>
                      </div>
                      <div 
                        style={{ 
                          fontSize: '12px', 
                          fontWeight: 400, 
                          color: '#6B7280', 
                          fontFamily: 'Inter, sans-serif' 
                        }}
                      >
                        {metric.difference > 0 ? 'Improvement' : 'Reduction'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action Buttons */}
          <div className="flex items-center justify-center gap-4 py-8">
            <Button 
              variant="outline"
              onClick={handleAddToPortfolio}
              className="font-medium gap-2 rounded-md border-gray-300 text-foreground hover:bg-gray-50"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                padding: '12px 24px'
              }}
            >
              <Plus className="h-4 w-4" />
              Add to Portfolio Plan
            </Button>
            <Button 
              variant="outline"
              onClick={handleRequestImplementation}
              className="font-medium gap-2 rounded-md border-gray-300 text-foreground hover:bg-gray-50"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                padding: '12px 24px'
              }}
            >
              <FileText className="h-4 w-4" />
              Request Implementation Plan
            </Button>
            <Button 
              onClick={handleScheduleSession}
              className="font-medium gap-2 rounded-md bg-primary hover:bg-primary-dark text-primary-foreground"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                padding: '12px 24px'
              }}
            >
              <Video className="h-4 w-4" />
              Schedule Strategy Session
            </Button>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle 
              style={{ 
                fontSize: '18px', 
                fontWeight: 600, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif' 
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#28A745' }}
                >
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <span>
                  {actionType === 'portfolio' && 'Added to Portfolio Plan'}
                  {actionType === 'implementation' && 'Implementation Request Sent'}
                  {actionType === 'session' && 'Strategy Session Requested'}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription 
              style={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.5
              }}
            >
              {actionType === 'portfolio' && 
                `${alternativeWorkspace.name} has been added to your portfolio plan. You can review and modify your selection in the Portfolio Manager.`
              }
              {actionType === 'implementation' && 
                'Your implementation request has been submitted. Our team will contact you within 24 hours with a detailed plan and timeline.'
              }
              {actionType === 'session' && 
                'Your strategy session request has been received. A LiquidSpace strategist will reach out to schedule a consultation within 2 business days.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline"
              onClick={() => setShowSuccessDialog(false)}
              className="font-medium rounded-md border-gray-300 text-foreground hover:bg-gray-50"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Close
            </Button>
            {actionType === 'portfolio' && (
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false);
                  onViewChange?.('portfolio-manager');
                }}
                className="font-medium rounded-md bg-primary hover:bg-primary-dark text-primary-foreground"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                View Portfolio Plan
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}