import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  Users, 
  DollarSign, 
  Calendar,
  CheckCircle,
  Loader2,
  BarChart3,
  TrendingUp,
  MapPin,
  Target,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  AlertTriangle,
  Clock,
  Shield,
  TrendingDown,
  Eye,
  FileText,
  Calculator,
  PieChart,
  LineChart,
  Globe,
  Settings,
  Briefcase,
  Award,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Zap,
  Activity,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface PortfolioManagerProps {
  onBack: () => void;
}

interface FormData {
  companyName: string;
  location: string;
  employees: string;
  monthlyCost: string;
  maxCapacity: string;
  avgAttendance: string;
  peakAttendance: string;
}

type Screen = 'intro' | 'wizard' | 'processing' | 'results';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function PortfolioManager({ onBack }: PortfolioManagerProps) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: 'Tel Tech Seattle Hub',
    location: 'seattle',
    employees: '850',
    monthlyCost: '472000',
    maxCapacity: '680',
    avgAttendance: '485',
    peakAttendance: '720'
  });

  // Inline editing state
  const [editingField, setEditingField] = useState<keyof FormData | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Chat interface state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Inline editing functions
  const startEditing = (field: keyof FormData) => {
    setEditingField(field);
    setEditingValue(formData[field]);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditingValue('');
  };

  const saveEdit = async () => {
    if (editingField && editingValue.trim()) {
      updateFormData(editingField, editingValue.trim());
      setEditingField(null);
      setEditingValue('');
      
      // Trigger a brief analysis indicator
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleNext = () => {
    if (wizardStep < 7) {
      setWizardStep(wizardStep + 1);
    } else {
      setCurrentScreen('processing');
      // Simulate processing delay
      setTimeout(() => {
        setCurrentScreen('results');
      }, 3000);
    }
  };

  const handleBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    } else {
      setCurrentScreen('intro');
    }
  };

  const handleRerunAnalysis = () => {
    setCurrentScreen('wizard');
    setWizardStep(1);
  };

  const locationMap: { [key: string]: string } = {
    'new-york': 'New York, NY',
    'san-francisco': 'San Francisco, CA',
    'chicago': 'Chicago, IL',
    'austin': 'Austin, TX',
    'boston': 'Boston, MA',
    'seattle': 'Seattle, WA',
    'denver': 'Denver, CO',
    'atlanta': 'Atlanta, GA'
  };

  // Chat functionality
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // Mock AI response based on the message content
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const currentCost = parseInt(formData.monthlyCost) || 472000;
    const savings = currentCost - 154800; // Hub & Spoke Small scenario
    
    if (lowerMessage.includes('why') && lowerMessage.includes('hub & spoke')) {
      return `Hub & Spoke (Small) is optimal for ${formData.companyName} because it provides dedicated space for your core team of ${formData.avgAttendance} daily users, while maintaining flexibility for peak attendance of ${formData.peakAttendance}. This hybrid approach reduces fixed costs by 70% compared to your current ${locationMap[formData.location] || 'San Francisco'} office.`;
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('savings')) {
      return `With Hub & Spoke (Small), you'll save $${savings.toLocaleString()} monthly, totaling $${(savings * 12).toLocaleString()} annually. This represents an 86% ROI on your office investment while maintaining operational flexibility.`;
    }
    
    if (lowerMessage.includes('implement') || lowerMessage.includes('transition')) {
      return `I recommend a phased transition: Start with a smaller Hub for your core ${Math.floor(parseInt(formData.avgAttendance) * 0.7)} daily users, then add Spoke locations for overflow. This minimizes disruption while maximizing cost savings for ${formData.companyName}.`;
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('downside')) {
      return `The main considerations are coordination complexity and potential commute changes. However, given your current utilization (${formData.avgAttendance}/${formData.maxCapacity} capacity), the Hub & Spoke model actually improves space efficiency while reducing costs by ${Math.round((savings/currentCost)*100)}%.`;
    }
    
    if (lowerMessage.includes('timeline') || lowerMessage.includes('when')) {
      return `Based on ${formData.companyName}'s profile, I'd suggest a 3-month transition timeline: Month 1 - Hub selection and setup, Month 2 - Team transition and Spoke partnerships, Month 3 - Full optimization. This allows for smooth change management.`;
    }
    
    // Default responses for other queries
    const defaultResponses = [
      `Based on your ${locationMap[formData.location] || 'San Francisco'} office analysis, the Hub & Spoke model optimally balances cost efficiency with operational flexibility for ${formData.companyName}.`,
      `Your current ${currentCost.toLocaleString()} monthly cost can be reduced to $154,800 while maintaining quality workspace access for all ${formData.employees} employees.`,
      `The 67% cost reduction from Hub & Spoke (Small) represents significant strategic value - annual savings of ${(savings * 12).toLocaleString()} can be reinvested in growth initiatives.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const suggestedQuestions = [
    "Why is Hub & Spoke optimal for Tel Tech's 850 employees?",
    "How much will we save annually with this transition?",
    "What are the implementation risks for our scale?",
    "How do we compare to other enterprise companies?",
    "What's the timeline for a 472K/month office transition?"
  ];

  // Mock data for results - exact values from specification
  const roiData = [
    { scenario: 'Spoke Only', hubCost: 0, spokeCost: 89250, roi: 81 },
    { scenario: 'Hub Only', hubCost: 125600, spokeCost: 0, roi: 73 },
    { scenario: 'Hub & Spoke\n(Small)', hubCost: 118500, spokeCost: 36300, roi: 67 },
    { scenario: 'Hub & Spoke\n(Medium)', hubCost: 128900, spokeCost: 39500, roi: 64 },
    { scenario: 'Hub & Spoke\n(Large)', hubCost: 142200, spokeCost: 44500, roi: 60 }
  ];

  const maxTotal = Math.max(...roiData.map(d => d.hubCost + d.spokeCost));
  const currentMonthlyCost = parseInt(formData.monthlyCost) || 472000;

  // EditableField component for inline editing
  const EditableField = ({ 
    field, 
    value, 
    displayValue, 
    icon: Icon, 
    label,
    type = 'text',
    isLocation = false 
  }: {
    field: keyof FormData;
    value: string;
    displayValue: string;
    icon: any;
    label: string;
    type?: 'text' | 'number';
    isLocation?: boolean;
  }) => {
    const isEditing = editingField === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-muted text-muted-foreground">{label}:</span>
          <div className="flex items-center gap-2">
            {isLocation ? (
              <Select 
                value={editingValue} 
                onValueChange={(newValue) => {
                  setEditingValue(newValue);
                  setTimeout(() => saveEdit(), 100);
                }}
              >
                <SelectTrigger className="w-40 h-7 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-york">New York, NY</SelectItem>
                  <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                  <SelectItem value="chicago">Chicago, IL</SelectItem>
                  <SelectItem value="austin">Austin, TX</SelectItem>
                  <SelectItem value="boston">Boston, MA</SelectItem>
                  <SelectItem value="seattle">Seattle, WA</SelectItem>
                  <SelectItem value="denver">Denver, CO</SelectItem>
                  <SelectItem value="atlanta">Atlanta, GA</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={type}
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={handleEditKeyPress}
                onBlur={saveEdit}
                className="w-32 h-7 text-sm px-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
                autoFocus
              />
            )}
            <button
              onClick={saveEdit}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Check className="h-3 w-3 text-accent-green" />
            </button>
            <button
              onClick={cancelEditing}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors group"
        onClick={() => startEditing(field)}
      >
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-muted text-muted-foreground">{label}:</span>
        <span className="font-semibold text-foreground text-body">
          {displayValue}
        </span>
        <Edit3 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
      </div>
    );
  };

  if (currentScreen === 'intro') {
    return (
      <div className="min-h-screen bg-white w-full">
        <div className="w-full px-12 py-12">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary mb-8 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio Overview
          </button>

          {/* Main Content */}
          <div className="text-center max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Portfolio Manager
              </h1>
              <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Hybrid Office Strategy Tool
              </h2>
              <p className="text-lg text-muted-foreground mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Model flexible office scenarios and see your ROI in minutes.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Scenario Modeling
                  </h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Compare Spoke, Hub, and hybrid combinations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    ROI Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Detailed cost breakdown and savings projections
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Strategic Recommendations
                  </h3>
                  <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Actionable insights for portfolio optimization
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={() => setCurrentScreen('wizard')}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3 text-base font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'wizard') {
    const progress = (wizardStep / 7) * 100;

    return (
      <div className="min-h-screen bg-white w-full">
        <div className="max-w-5xl mx-auto px-12 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Portfolio Assessment
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                Step {wizardStep} of 7
              </span>
              <Progress value={progress} className="w-48 h-2" />
            </div>
          </div>

          {/* Wizard Card */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-8">
              {wizardStep === 1 && (
                <div className="text-center space-y-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      What is the name of your company?
                    </h2>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      This will help us personalize your portfolio analysis
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Input
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className="text-center text-lg py-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="text-center space-y-6">
                  <MapPin className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      What's the location of the office we will be evaluating?
                    </h2>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Select the city where your current office is located
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                      <SelectTrigger className="text-center text-lg py-3">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-york">New York, NY</SelectItem>
                        <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                        <SelectItem value="chicago">Chicago, IL</SelectItem>
                        <SelectItem value="austin">Austin, TX</SelectItem>
                        <SelectItem value="boston">Boston, MA</SelectItem>
                        <SelectItem value="seattle">Seattle, WA</SelectItem>
                        <SelectItem value="denver">Denver, CO</SelectItem>
                        <SelectItem value="atlanta">Atlanta, GA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="text-center space-y-6">
                  <Users className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      How many employees are assigned to this office?
                    </h2>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Include all staff who have access to this workspace
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Input
                      type="number"
                      placeholder="Number of employees"
                      value={formData.employees}
                      onChange={(e) => updateFormData('employees', e.target.value)}
                      className="text-center text-lg py-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {wizardStep === 4 && (
                <div className="text-center space-y-6">
                  <DollarSign className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      What is your current monthly office cost?
                    </h2>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Include rent, utilities, and other recurring expenses
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lg text-muted-foreground">$</span>
                      <Input
                        type="number"
                        placeholder="Monthly cost"
                        value={formData.monthlyCost}
                        onChange={(e) => updateFormData('monthlyCost', e.target.value)}
                        className="text-center text-lg py-3 pl-8"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 5 && (
                <div className="text-center space-y-6">
                  <Building2 className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      What is the max daily capacity of this office?
                    </h2>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Maximum number of people who can work simultaneously
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Input
                      type="number"
                      placeholder="Max capacity"
                      value={formData.maxCapacity}
                      onChange={(e) => updateFormData('maxCapacity', e.target.value)}
                      className="text-center text-lg py-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {wizardStep === 6 && (
                <div className="text-center space-y-6">
                  <Calendar className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      What is the average daily attendance?
                    </h2>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Typical number of people in the office each day
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Input
                      type="number"
                      placeholder="Average attendance"
                      value={formData.avgAttendance}
                      onChange={(e) => updateFormData('avgAttendance', e.target.value)}
                      className="text-center text-lg py-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {wizardStep === 7 && (
                <div className="text-center space-y-6">
                  <TrendingUp className="h-12 w-12 text-primary mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      What is the peak weekly attendance?
                    </h2>
                    <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Highest number of people in the office during your busiest week
                    </p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <Input
                      type="number"
                      placeholder="Peak attendance"
                      value={formData.peakAttendance}
                      onChange={(e) => updateFormData('peakAttendance', e.target.value)}
                      className="text-center text-lg py-3"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="px-6"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary-dark text-white px-6"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {wizardStep === 7 ? 'Analyze Portfolio' : 'Next'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentScreen === 'processing') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center w-full">
        <div className="text-center max-w-4xl mx-auto px-12">
          <div className="mb-8">
            <Loader2 className="h-16 w-16 text-primary mx-auto animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Analyzing flexible office options...
            </h2>
            <p className="text-lg text-muted-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
              Spoke (on-demand), Hub (dedicated), and Hub & Spoke combinations.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-accent-green" />
              <span style={{ fontFamily: 'Inter, sans-serif' }}>Analyzing current office utilization</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-accent-green" />
              <span style={{ fontFamily: 'Inter, sans-serif' }}>Modeling hybrid workspace scenarios</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span style={{ fontFamily: 'Inter, sans-serif' }}>Calculating ROI projections</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Header */}
        <div className="px-12 py-6 border-b border-gray-200" style={{ backgroundColor: '#005B94' }}>
          <div className="max-w-[95vw] mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 mb-4 transition-colors px-0 hover:opacity-80 bg-transparent border-0"
                  style={{ 
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft className="h-4 w-4" style={{ color: '#FFFFFF' }} />
                  Back to Portfolio Overview
                </button>
                <h1 className="text-white" style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}>
                  Scenario Modeler
                </h1>
                <p className="text-gray-200 mt-1" style={{ fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                  AI-powered hybrid office analysis for {formData.companyName || 'your company'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleRerunAnalysis}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 font-medium px-4 py-2"
                  style={{ 
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    backgroundColor: 'transparent'
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" style={{ color: '#FFFFFF' }} />
                  Re-run Analysis
                </Button>
                <Button 
                  variant="outline"
                  className="hover:bg-white/20 border-white/20 font-medium px-4 py-2"
                  style={{ 
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Context Bar - Current Office Summary */}
        <div className="px-12 py-4 bg-white border-b border-gray-200">
          <div className="max-w-[95vw] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <EditableField
                  field="companyName"
                  value={formData.companyName}
                  displayValue={formData.companyName || 'Tel Tech Seattle Hub'}
                  icon={Building2}
                  label="Company"
                />
                <EditableField
                  field="location"
                  value={formData.location}
                  displayValue={locationMap[formData.location] || 'Seattle, WA'}
                  icon={MapPin}
                  label="Location"
                  isLocation={true}
                />
                <EditableField
                  field="employees"
                  value={formData.employees}
                  displayValue={formData.employees || '850'}
                  icon={Users}
                  label="Employees"
                  type="number"
                />
                <EditableField
                  field="monthlyCost"
                  value={formData.monthlyCost}
                  displayValue={`${parseInt(formData.monthlyCost || '472000').toLocaleString()}/mo`}
                  icon={DollarSign}
                  label="Current Cost"
                  type="number"
                />
                <EditableField
                  field="avgAttendance"
                  value={formData.avgAttendance}
                  displayValue={`${formData.avgAttendance || '485'}/${formData.maxCapacity || '680'}`}
                  icon={Calendar}
                  label="Avg Attendance"
                  type="number"
                />
              </div>
              <div className="flex items-center gap-3">
                {isAnalyzing && (
                  <div className="flex items-center gap-2 text-accent-orange">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted">
                      Updating analysis...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Three-Column Layout */}
        <div className="px-12 py-6">
          <div className="max-w-[95vw] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column - Chat Interface Only */}
              <div className="lg:col-span-3">
                <Card className="bg-white border border-gray-200 shadow-sm h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-heading-2 text-foreground">
                          LiquidIQ
                        </CardTitle>
                        <p className="text-muted text-muted-foreground">
                          Try me. I've got answers.
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full pt-0">
                    {/* Initial AI Messages */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-gray-100 rounded-2xl p-4 max-w-sm">
                        <p className="text-muted text-foreground">
                          I've analyzed your current office setup in {locationMap[formData.location] || 'San Francisco'}.
                        </p>
                      </div>
                      <div className="bg-gray-100 rounded-2xl p-4 max-w-sm">
                        <p className="text-muted text-foreground">
                          Here's how flexible models compare to your current ${currentMonthlyCost.toLocaleString()} office cost.
                        </p>
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="flex-1 flex flex-col border-t border-gray-200 pt-4">
                      {/* Chat Messages */}
                      <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 mb-4 pr-2 min-h-[300px]"
                      >
                        {chatMessages.length === 0 && (
                          <div className="text-center py-4">
                            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted text-muted-foreground mb-4">
                              Ask me about your portfolio strategy
                            </p>
                            
                            {/* Suggested Questions */}
                            <div className="space-y-2">
                              {suggestedQuestions.map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSendMessage(question)}
                                  className="block w-full text-left p-3 text-muted text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`mb-3 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] p-3 rounded-2xl ${
                                message.type === 'user'
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-foreground'
                              }`}
                            >
                              <p className={message.type === 'user' ? 'text-white' : 'text-muted'} style={{ fontFamily: 'Inter, sans-serif' }}>
                                {message.content}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {isTyping && (
                          <div className="flex justify-start mb-3">
                            <div className="bg-gray-100 p-3 rounded-2xl max-w-[85%]">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Ask about your portfolio strategy..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(chatInput);
                            }
                          }}
                          className="flex-1 text-muted bg-input-background border-border"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          disabled={isTyping}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSendMessage(chatInput)}
                          disabled={!chatInput.trim() || isTyping}
                          className="bg-primary hover:bg-primary-dark text-white px-3"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Chart and Analysis */}
              <div className="lg:col-span-5 space-y-6">
                {/* ROI Chart */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground">
                      Hybrid Portfolio Strategy
                    </CardTitle>
                    <p className="text-muted text-muted-foreground">
                      Monthly cost breakdown and ROI comparison vs. current office (${currentMonthlyCost.toLocaleString()})
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Chart */}
                    <div className="h-80 flex items-end justify-center gap-6 mb-8">
                      {roiData.map((item, index) => {
                        const total = item.hubCost + item.spokeCost;
                        const hubHeight = Math.max((item.hubCost / maxTotal) * 200, 0);
                        const spokeHeight = Math.max((item.spokeCost / maxTotal) * 200, 0);
                        
                        return (
                          <div key={index} className="flex flex-col items-center">
                            {/* ROI Label */}
                            <div className="mb-2 text-center">
                              <div className="font-bold text-lg text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                                +{item.roi}%
                              </div>
                              <div className="text-muted text-muted-foreground">
                                ROI
                              </div>
                            </div>
                            
                            {/* Stacked Bar */}
                            <div className="flex flex-col items-center">
                              <div className="w-12 flex flex-col-reverse border border-gray-200 rounded-t">
                                {/* Spoke costs (green) */}
                                {spokeHeight > 0 && (
                                  <div 
                                    className="w-full rounded-t"
                                    style={{ 
                                      height: `${spokeHeight}px`, 
                                      backgroundColor: '#A8E6A3' 
                                    }}
                                  ></div>
                                )}
                                {/* Hub costs (blue) */}
                                {hubHeight > 0 && (
                                  <div 
                                    className="w-full"
                                    style={{ 
                                      height: `${hubHeight}px`, 
                                      backgroundColor: '#A7C7E7' 
                                    }}
                                  ></div>
                                )}
                              </div>
                              
                              {/* Total Cost */}
                              <div className="mt-2 text-center">
                                <div className="font-semibold text-muted text-foreground">
                                  ${total.toLocaleString()}
                                </div>
                                <div className="text-muted text-muted-foreground whitespace-pre-line text-center text-xs">
                                  {item.scenario}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#A7C7E7' }}></div>
                        <span className="text-muted text-foreground">Hub Costs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#A8E6A3' }}></div>
                        <span className="text-muted text-foreground">Spoke Costs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Scenario Types */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground">
                      Scenario Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#A8E6A3' }}></div>
                      <div>
                        <h4 className="font-semibold text-muted text-foreground">Spoke</h4>
                        <p className="text-muted text-muted-foreground">
                          Employees use on-demand workspace booked by the hour/day.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: '#A7C7E7' }}></div>
                      <div>
                        <h4 className="font-semibold text-muted text-foreground">Hub</h4>
                        <p className="text-muted text-muted-foreground">
                          A dedicated private office shared by all employees.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-4 rounded" style={{ backgroundColor: '#A7C7E7' }}></div>
                        <div className="w-2 h-4 rounded" style={{ backgroundColor: '#A8E6A3' }}></div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted text-foreground">Hub & Spoke</h4>
                        <p className="text-muted text-muted-foreground">
                          Combination of Hub + on-demand Spokes for overflow.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Strategic Recommendations */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="bg-white border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground">
                      Strategic Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Highlighted Callout Panel */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-accent-green mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-green-800 text-muted">
                              Hub & Spoke (Small) offers the highest ROI at 86%
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-accent-green mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-green-800 text-muted">
                              Monthly savings of ${(currentMonthlyCost - 8600).toLocaleString()} compared to your current office
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-body text-foreground">
                            Optimal mix: 70% Hub capacity + 30% Spoke flexibility
                          </p>
                          <p className="text-muted text-muted-foreground">
                            Provides dedicated space while maintaining flexibility for peak periods
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-accent-orange mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-body text-foreground">
                            Annual savings potential: ${((currentMonthlyCost - 8600) * 12).toLocaleString()}
                          </p>
                          <p className="text-muted text-muted-foreground">
                            Reinvest savings in employee experience and technology upgrades
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Next Step CTA Area */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-3">
                        <Button 
                          className="bg-primary hover:bg-primary-dark text-white w-full font-medium text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Schedule Strategy Session
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Request Implementation Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}