import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
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
  Send,
  User
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface WorkspaceComparisonModalProps {
  onBack: () => void;
  selectedSpace: any;
  currentLicenseId?: string;
}

export function WorkspaceComparisonModal({ 
  onBack, 
  selectedSpace,
  currentLicenseId = "license_5483980"
}: WorkspaceComparisonModalProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{id: number, type: 'user' | 'ai', message: string, timestamp: Date}>>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

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

  // Map the selected space to our comparison format
  const alternativeWorkspace = {
    id: selectedSpace.id,
    name: selectedSpace.name,
    address: selectedSpace.address || selectedSpace.location,
    type: selectedSpace.type,
    monthlyPrice: selectedSpace.price * 70, // Estimate monthly cost (price per desk * typical desk count)
    pricePerDesk: selectedSpace.price,
    size: "10,800 sq ft", // Mock data
    capacity: selectedSpace.capacity || "70 desks",
    termLength: "12 months", // Mock data
    endDate: "2026-06-30", // Mock data
    rating: selectedSpace.rating || 4.7,
    utilization: 85, // Mock data
    image: selectedSpace.image,
    amenities: selectedSpace.amenities || ["Ultra-Fast WiFi", "Premium Kitchen", "Covered Parking", "Executive Meeting Rooms", "Concierge Service"],
    risks: ["Suburban location", "Newer provider"],
    highlights: ["22% cost savings", "Higher employee satisfaction", "Flexible terms"]
  };

  // Strategic comparison metrics data
  const comparisonMetrics = [
    {
      category: "Cost per Desk",
      current: 2400,
      alternative: alternativeWorkspace.pricePerDesk,
      difference: Math.round(((alternativeWorkspace.pricePerDesk - 2400) / 2400) * 100)
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
      alternative: alternativeWorkspace.rating,
      difference: Math.round(((alternativeWorkspace.rating - 4.2) / 4.2) * 100)
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

  // Scripted conversation responses
  const chatResponses: {[key: string]: string} = {
    "How will this affect our annual budget?": `Based on current cost benchmarks, this alternative saves $${annualSavings.toLocaleString()} per year compared to your existing office.`,
    "What's the ROI timeline for this change?": "You would break even in less than 3 months, with ongoing savings compounding over your 12-month term.",
    "How does this impact employee satisfaction?": "Survey data suggests employees prefer locations with better amenities and transit access. This site scores +1.5★ higher than your current office, likely improving satisfaction and retention.",
    "Is this a good fit for distributed teams?": "Yes, this location offers 85% utilization rates and flexible terms that work well for hybrid teams. The enhanced meeting room technology supports distributed collaboration.",
    "What's the risk if we switch now?": "The primary risks are transition logistics and employee adaptation. However, the flexible 12-month terms reduce long-term commitment risk compared to your current 24-month lease."
  };

  // Initialize conversation with AI system message
  React.useEffect(() => {
    if (chatMessages.length === 0) {
      const systemMessage = {
        id: 1,
        type: 'ai' as const,
        message: `This workspace reduces your monthly cost by $${costSavings.toLocaleString()} while improving flexibility and amenities. Ask me anything about this comparison.`,
        timestamp: new Date()
      };
      setChatMessages([systemMessage]);
    }
  }, [costSavings]);

  // Handle sending a message
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      message: message.trim(),
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = chatResponses[message.trim()] || 
        "I can help you analyze this workspace comparison. Try asking about budget impact, employee satisfaction, or implementation timeline.";
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai' as const,
        message: aiResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // CTA Button Handlers
  const handleAddToPortfolio = () => {
    setActionType('portfolio');
    setShowSuccessDialog(true);
    console.log('Adding alternative workspace to portfolio plan:', alternativeWorkspace.name);
  };

  const handleRequestImplementation = () => {
    setActionType('implementation');
    setShowSuccessDialog(true);
    console.log('Requesting implementation plan for workspace:', alternativeWorkspace.name);
  };

  const handleScheduleSession = () => {
    setActionType('session');
    setShowSuccessDialog(true);
    console.log('Scheduling strategy session for workspace comparison');
  };

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    handleSendMessage(prompt);
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
          {isAlternative && costSavings > 0 && (
            <div className="flex gap-2">
              <Badge 
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: '#28A745',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                -${Math.round(costSavings/1000)}K Cost
              </Badge>
              {alternativeWorkspace.rating > currentWorkspace.rating && (
                <Badge 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: '#FFA500',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  +{(alternativeWorkspace.rating - currentWorkspace.rating).toFixed(1)}★ Rating
                </Badge>
              )}
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
    <div className="w-full h-full">
      {/* Modal Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/10 p-1 rounded-md"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 
                style={{ 
                  color: '#FFFFFF', 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 600
                }}
              >
                VS: Workspace Comparison
              </h2>
              <p 
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Evaluate savings, fit, and flexibility vs. your current lease
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium gap-2"
            style={{
              fontSize: '12px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
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
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  LiquidIQ Insight
                </CardTitle>
                <p 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Workspace analysis and recommendations
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    This workspace {costSavings > 0 ? `reduces your monthly cost by <strong>$${costSavings.toLocaleString()}</strong>` : 'offers enhanced amenities'} while improving employee amenities and term flexibility. Based on recent usage patterns, it offers a better fit for hybrid attendance with <strong>higher utilization rates</strong> and <strong>enhanced flexibility</strong>. {costSavings > 0 && `The annual savings of <strong>$${annualSavings.toLocaleString()}</strong> could be reinvested in employee experience initiatives.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Explore with LiquidIQ Section */}
            <div className="space-y-4">
              <div>
                <h4 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Explore with LiquidIQ
                </h4>
                <p 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif',
                    marginTop: '4px'
                  }}
                >
                  Smart questions you can ask about this workspace
                </p>
              </div>

              {/* Suggested Prompts */}
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

              {/* Chat Messages Area */}
              <div 
                className="border rounded-lg p-4 space-y-4 bg-white"
                style={{ 
                  borderColor: '#E5E7EB',
                  height: '300px',
                  overflow: 'hidden'
                }}
              >
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.type === 'user' ? 'bg-gray-200' : 'bg-primary'
                            }`}
                            style={{
                              backgroundColor: message.type === 'user' ? '#E5E7EB' : '#005B94'
                            }}
                          >
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 text-gray-600" />
                            ) : (
                              <span className="text-white text-xs font-semibold">AI</span>
                            )}
                          </div>
                          
                          {/* Message Bubble */}
                          <div 
                            className={`px-4 py-3 rounded-2xl ${
                              message.type === 'user' 
                                ? 'bg-gray-100 text-gray-900' 
                                : 'bg-primary text-white'
                            }`}
                            style={{
                              backgroundColor: message.type === 'user' ? '#F3F4F6' : '#005B94'
                            }}
                          >
                            <p 
                              style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                fontFamily: 'Inter, sans-serif',
                                lineHeight: 1.5,
                                margin: 0
                              }}
                            >
                              {message.message}
                            </p>
                            <div 
                              className={`text-xs mt-1 ${
                                message.type === 'user' ? 'text-gray-500' : 'text-white/70'
                              }`}
                              style={{
                                fontSize: '11px',
                                fontFamily: 'Inter, sans-serif'
                              }}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: '#005B94' }}
                          >
                            <span className="text-white text-xs font-semibold">AI</span>
                          </div>
                          <div 
                            className="px-4 py-3 rounded-2xl bg-primary text-white"
                            style={{ backgroundColor: '#005B94' }}
                          >
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask LiquidIQ about this workspace..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(inputMessage);
                    }
                  }}
                  className="flex-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <Button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim()}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Success!
              </DialogTitle>
              <DialogDescription>
                {actionType === 'portfolio' && "Alternative workspace has been added to your portfolio plan for review."}
                {actionType === 'implementation' && "Implementation plan request has been submitted. Our team will contact you within 24 hours."}
                {actionType === 'session' && "Strategy session has been scheduled. You'll receive a calendar invite shortly."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button onClick={() => setShowSuccessDialog(false)}>
                Got it
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Card className="bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: '#E3F2FD' }}
              >
                <Plus className="h-6 w-6" style={{ color: '#005B94' }} />
              </div>
              <div>
                <h3 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Add to Portfolio
                </h3>
                <p 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Include in your workspace portfolio plan
                </p>
              </div>
              <Button 
                onClick={handleAddToPortfolio}
                className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Add Workspace
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: '#E3F2FD' }}
              >
                <FileText className="h-6 w-6" style={{ color: '#005B94' }} />
              </div>
              <div>
                <h3 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Request Implementation
                </h3>
                <p 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Get a detailed transition plan
                </p>
              </div>
              <Button 
                onClick={handleRequestImplementation}
                variant="outline"
                className="w-full border-gray-300 text-foreground hover:bg-gray-50"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Request Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: '#E3F2FD' }}
              >
                <Video className="h-6 w-6" style={{ color: '#005B94' }} />
              </div>
              <div>
                <h3 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Schedule Strategy Session
                </h3>
                <p 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif' 
                  }}
                >
                  Talk with our space experts
                </p>
              </div>
              <Button 
                onClick={handleScheduleSession}
                variant="outline"
                className="w-full border-gray-300 text-foreground hover:bg-gray-50"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Schedule Call
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}