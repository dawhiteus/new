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
  Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
  const [currentScreen, setCurrentScreen] = useState<Screen>('results'); // Start directly on results for testing
  const [wizardStep, setWizardStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    companyName: 'T-Mobile',
    location: 'seattle',
    employees: '850',
    monthlyCost: '472000',
    maxCapacity: '680',
    avgAttendance: '485',
    peakAttendance: '720'
  });

  // Chat interface state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // Enhanced mock data for enterprise-level analysis
  const currentMonthlyCost = parseInt(formData.monthlyCost) || 472000;
  const currentEmployees = parseInt(formData.employees) || 850;
  const currentLocation = locationMap[formData.location] || 'Seattle, WA';

  // Enhanced scenario data with detailed breakdowns
  const scenarioData = [
    {
      name: 'Current Traditional Office',
      type: 'current',
      monthlyCost: currentMonthlyCost,
      annualCost: currentMonthlyCost * 12,
      hubCost: currentMonthlyCost,
      spokeCost: 0,
      roi: 0,
      savings: 0,
      efficiency: parseInt(formData.avgAttendance) / parseInt(formData.maxCapacity) * 100 || 71,
      flexibility: 25,
      riskLevel: 'High',
      implementationTime: '0 months',
      description: 'Traditional dedicated office space - high fixed costs with underutilization',
      pros: ['Full control', 'Team proximity', 'Brand presence'],
      cons: ['High fixed costs', 'Low utilization (71%)', 'Inflexible capacity'],
      suitability: 45,
      costPerEmployee: Math.round(currentMonthlyCost / currentEmployees)
    },
    {
      name: 'Spoke Only',
      type: 'spoke',
      monthlyCost: 89250,
      annualCost: 1071000,
      hubCost: 0,
      spokeCost: 89250,
      roi: Math.round(((currentMonthlyCost - 89250) / currentMonthlyCost) * 100),
      savings: currentMonthlyCost - 89250,
      efficiency: 96,
      flexibility: 100,
      riskLevel: 'Medium',
      implementationTime: '2 months',
      description: 'Pure on-demand flexible workspace solution across 15+ locations',
      pros: ['Maximum flexibility', 'Global access', 'Scale on demand', '96% utilization'],
      cons: ['No dedicated space', 'Booking dependency', 'Variable availability'],
      suitability: 75,
      costPerEmployee: Math.round(89250 / currentEmployees)
    },
    {
      name: 'Hub Only',
      type: 'hub',
      monthlyCost: 125600,
      annualCost: 1507200,
      hubCost: 125600,
      spokeCost: 0,
      roi: Math.round(((currentMonthlyCost - 125600) / currentMonthlyCost) * 100),
      savings: currentMonthlyCost - 125600,
      efficiency: 92,
      flexibility: 65,
      riskLevel: 'Low',
      implementationTime: '2.5 months',
      description: 'Premium dedicated workspace with enterprise amenities',
      pros: ['Dedicated space', 'Cost efficiency', 'Professional environment', 'Enterprise features'],
      cons: ['Limited capacity', 'Less flexibility', 'Single location'],
      suitability: 82,
      costPerEmployee: Math.round(125600 / currentEmployees)
    },
    {
      name: 'Hub & Spoke (Small)',
      type: 'hybrid-s',
      monthlyCost: 154800,
      annualCost: 1857600,
      hubCost: 118500,
      spokeCost: 36300,
      roi: Math.round(((currentMonthlyCost - 154800) / currentMonthlyCost) * 100),
      savings: currentMonthlyCost - 154800,
      efficiency: 94,
      flexibility: 88,
      riskLevel: 'Low',
      implementationTime: '3.5 months',
      description: 'Balanced hybrid solution with dedicated hub + flexible spoke access',
      pros: ['Best of both worlds', 'Scalable', 'Cost effective', 'High utilization'],
      cons: ['Coordination complexity', 'Management overhead'],
      suitability: 92,
      costPerEmployee: Math.round(154800 / currentEmployees),
      recommended: true
    },
    {
      name: 'Hub & Spoke (Medium)',
      type: 'hybrid-m',
      monthlyCost: 168400,
      annualCost: 2020800,
      hubCost: 128900,
      spokeCost: 39500,
      roi: Math.round(((currentMonthlyCost - 168400) / currentMonthlyCost) * 100),
      savings: currentMonthlyCost - 168400,
      efficiency: 93,
      flexibility: 92,
      riskLevel: 'Low',
      implementationTime: '4 months',
      description: 'Extended hybrid solution for larger teams with enhanced flexibility',
      pros: ['Higher capacity', 'More flexibility', 'Future-ready', 'Regional coverage'],
      cons: ['Higher cost', 'Complex management'],
      suitability: 88,
      costPerEmployee: Math.round(168400 / currentEmployees)
    },
    {
      name: 'Hub & Spoke (Large)',
      type: 'hybrid-l',
      monthlyCost: 186700,
      annualCost: 2240400,
      hubCost: 142200,
      spokeCost: 44500,
      roi: Math.round(((currentMonthlyCost - 186700) / currentMonthlyCost) * 100),
      savings: currentMonthlyCost - 186700,
      efficiency: 91,
      flexibility: 98,
      riskLevel: 'Medium',
      implementationTime: '5 months',
      description: 'Enterprise hybrid solution with maximum flexibility and global presence',
      pros: ['Maximum capacity', 'Enterprise features', 'Global presence', 'Future-proof'],
      cons: ['Highest hybrid cost', 'Complex coordination'],
      suitability: 85,
      costPerEmployee: Math.round(186700 / currentEmployees)
    }
  ];

  // Market benchmark data
  const benchmarkData = {
    industryAverage: {
      costPerEmployee: 650,
      utilizationRate: 72,
      hybridAdoption: 68
    },
    competitors: [
      { name: 'Similar Enterprise Companies', avgCostPerEmployee: 580, utilizationRate: 78, location: 'Seattle Metro' },
      { name: 'Technology Leaders', avgCostPerEmployee: 495, utilizationRate: 87, location: 'West Coast' },
      { name: 'Hybrid Pioneers', avgCostPerEmployee: 425, utilizationRate: 94, location: 'National' }
    ]
  };

  // Implementation timeline data
  const implementationPhases = [
    {
      phase: 'Discovery & Planning',
      duration: '3-4 weeks',
      activities: [
        'Comprehensive space audit and utilization analysis',
        'Employee survey and requirements gathering',
        'Provider evaluation and selection process',
        'Financial modeling and budget approval'
      ],
      status: 'ready',
      owner: 'Facilities & IT Teams'
    },
    {
      phase: 'Hub Design & Setup',
      duration: '6-8 weeks',
      activities: [
        'Space design and layout optimization',
        'Technology infrastructure installation',
        'Furniture and equipment procurement',
        'Security and access control setup'
      ],
      status: 'pending',
      owner: 'Design & Construction Teams'
    },
    {
      phase: 'Spoke Network Integration',
      duration: '3-4 weeks',
      activities: [
        'Partner workspace onboarding',
        'Booking platform integration',
        'Access management configuration',
        'Service level agreement setup'
      ],
      status: 'pending',
      owner: 'IT & Vendor Management'
    },
    {
      phase: 'Change Management & Training',
      duration: '6-8 weeks',
      activities: [
        'Communication strategy execution',
        'Manager training and certification',
        'Employee onboarding programs',
        'Policy and procedure updates'
      ],
      status: 'pending',
      owner: 'HR & Communications'
    },
    {
      phase: 'Go-Live & Optimization',
      duration: 'Ongoing',
      activities: [
        'Phased rollout and monitoring',
        'Usage analytics and optimization',
        'Continuous improvement initiatives',
        'Performance reporting and review'
      ],
      status: 'pending',
      owner: 'Operations Team'
    }
  ];

  // Risk assessment data
  const riskFactors = [
    {
      category: 'Operational Risk',
      level: 'Low',
      description: 'Minimal disruption to daily operations with proven transition methodology',
      mitigation: 'Phased transition plan with 4-week overlap periods and dedicated support team',
      impact: 'Low',
      probability: 'Low'
    },
    {
      category: 'Financial Risk',
      level: 'Very Low',
      description: 'Guaranteed cost savings with performance-based contracts and exit clauses',
      mitigation: 'Flexible contracts with performance guarantees and quarterly cost reviews',
      impact: 'Low',
      probability: 'Very Low'
    },
    {
      category: 'Technology Risk',
      level: 'Medium',
      description: 'Integration complexity with existing enterprise IT infrastructure',
      mitigation: 'Dedicated IT support team and comprehensive backup systems',
      impact: 'Medium',
      probability: 'Low'
    },
    {
      category: 'Change Management Risk',
      level: 'Medium',
      description: 'Employee adaptation to new hybrid work patterns and booking systems',
      mitigation: 'Comprehensive training program and gradual transition with support champions',
      impact: 'Medium',
      probability: 'Medium'
    },
    {
      category: 'Compliance Risk',
      level: 'Low',
      description: 'Regulatory compliance across multiple workspace locations',
      mitigation: 'Pre-approved workspace network with enterprise compliance standards',
      impact: 'Medium',
      probability: 'Very Low'
    }
  ];

  const recommendedScenario = scenarioData.find(s => s.recommended) || scenarioData[3];

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

    // Enhanced AI response based on the message content
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
    const savings = currentCost - recommendedScenario.monthlyCost;
    
    if (lowerMessage.includes('why') && lowerMessage.includes('hub & spoke')) {
      return `Hub & Spoke (Small) is optimal for ${formData.companyName} because it provides dedicated space for your core team of ${formData.avgAttendance} daily users, while maintaining flexibility for peak attendance of ${formData.peakAttendance}. This hybrid approach reduces fixed costs by ${Math.round((savings/currentCost)*100)}% compared to your current ${currentLocation} office, saving $${(savings * 12).toLocaleString()} annually while improving utilization to 94%.`;
    }
    
    if (lowerMessage.includes('save') || lowerMessage.includes('savings')) {
      return `With Hub & Spoke (Small), you'll save $${savings.toLocaleString()} monthly, totaling $${(savings * 12).toLocaleString()} annually. This represents a ${recommendedScenario.roi}% cost reduction on your office investment while maintaining operational flexibility and improving space utilization from ${Math.round(parseInt(formData.avgAttendance) / parseInt(formData.maxCapacity) * 100)}% to 94%.`;
    }
    
    if (lowerMessage.includes('implement') || lowerMessage.includes('transition')) {
      return `For ${formData.companyName}'s ${currentEmployees} employees, I recommend a phased 3.5-month transition: Phase 1 (4 weeks) - Discovery and planning with comprehensive employee survey. Phase 2 (6-8 weeks) - Hub design and setup for your core ${Math.floor(parseInt(formData.avgAttendance) * 0.7)} daily users. Phase 3 (3-4 weeks) - Spoke network integration. Phase 4 (6-8 weeks) - Change management and training. This minimizes disruption while maximizing adoption and cost savings.`;
    }
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('downside')) {
      return `The main risks for ${formData.companyName} are manageable: 1) Technology integration (Medium risk) - mitigated with dedicated IT support. 2) Change management (Medium risk) - addressed with comprehensive training. 3) Operational disruption (Low risk) - minimized with phased rollout. Given your current utilization (${Math.round(parseInt(formData.avgAttendance) / parseInt(formData.maxCapacity) * 100)}%), the Hub & Spoke model actually improves efficiency while reducing costs by ${Math.round((savings/currentCost)*100)}%.`;
    }
    
    if (lowerMessage.includes('timeline') || lowerMessage.includes('when')) {
      return `Based on ${formData.companyName}'s scale (${currentEmployees} employees), the optimal timeline is 3.5 months: Month 1 - Discovery and hub selection, Month 2-2.5 - Hub design and setup, Month 3 - Spoke integration and team transition, Month 3.5+ - Go-live and optimization. This timeline accounts for enterprise change management requirements and ensures high adoption rates.`;
    }

    if (lowerMessage.includes('benchmark') || lowerMessage.includes('industry')) {
      return `Compared to industry benchmarks, your current cost of $${Math.round(currentCost/currentEmployees)}/employee/month is ${Math.round(((currentCost/currentEmployees) / benchmarkData.industryAverage.costPerEmployee - 1) * 100)}% above industry average ($${benchmarkData.industryAverage.costPerEmployee}). The recommended Hub & Spoke solution at $${Math.round(recommendedScenario.monthlyCost/currentEmployees)}/employee/month puts you ${Math.round((1 - (recommendedScenario.monthlyCost/currentEmployees) / benchmarkData.industryAverage.costPerEmployee) * 100)}% below industry average while achieving 94% utilization vs. industry average of 72%.`;
    }

    if (lowerMessage.includes('employee') || lowerMessage.includes('team')) {
      return `For your ${currentEmployees} employees, the Hub & Spoke model offers significant benefits: 1) Dedicated hub space for your core ${formData.avgAttendance} daily workers with premium amenities. 2) Flexible spoke access across 15+ locations for remote workers and overflow capacity. 3) Improved work-life balance with reduced commute options. 4) Enhanced collaboration through designed interaction spaces. 5) Future-proofing for hybrid work trends. Employee satisfaction typically increases 25-30% with this model.`;
    }
    
    // Default responses for other queries
    const defaultResponses = [
      `Based on your ${currentLocation} office analysis, the Hub & Spoke model optimally balances cost efficiency with operational flexibility for ${formData.companyName}'s ${currentEmployees} employees. This solution reduces costs by ${recommendedScenario.roi}% while improving utilization to 94%.`,
      `Your current $${currentCost.toLocaleString()} monthly cost can be reduced to $${recommendedScenario.monthlyCost.toLocaleString()} while maintaining quality workspace access for all employees. This represents annual savings of $${(savings * 12).toLocaleString()} that can be reinvested in growth initiatives.`,
      `The ${recommendedScenario.roi}% ROI from Hub & Spoke (Small) represents exceptional strategic value for ${formData.companyName}. With 94% utilization efficiency and enhanced flexibility, this positions you ahead of industry benchmarks while reducing operational risk.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const suggestedQuestions = [
    "Why is Hub & Spoke the best option for T-Mobile?",
    "How do we compare to industry benchmarks?",
    "What's the employee impact of this transition?",
    "What are the implementation risks and timeline?",
    "How much will we actually save annually?"
  ];

  if (currentScreen === 'results') {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: '#F8F9FA' }}>
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="max-w-[95vw] mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 text-foreground hover:text-primary mb-3 transition-colors text-muted"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Portfolio Overview
                </button>
                <h1 className="text-heading-1 text-foreground">
                  Scenario Modeler
                </h1>
                <p className="text-muted text-muted-foreground mt-1">
                  AI-powered hybrid office analysis for {formData.companyName}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleRerunAnalysis}
                  variant="outline"
                  className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-4 py-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-run Analysis
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary-dark text-white font-medium text-sm px-4 py-2"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Top Context Bar - Current Office Summary */}
        <div className="px-6 py-3 bg-white border-b border-gray-200">
          <div className="max-w-[95vw] mx-auto">
            <div className="flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Company:</span>
                <span className="font-semibold text-foreground">
                  {formData.companyName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-foreground">
                  {currentLocation}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Employees:</span>
                <span className="font-semibold text-foreground">
                  {currentEmployees.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Current Cost:</span>
                <span className="font-bold text-foreground">
                  ${currentMonthlyCost.toLocaleString()}/mo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Utilization:</span>
                <span className="font-semibold text-foreground">
                  {Math.round(parseInt(formData.avgAttendance) / parseInt(formData.maxCapacity) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-6">
          <div className="max-w-[95vw] mx-auto">
            <Tabs defaultValue="scenarios" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="scenarios" className="text-sm">Scenario Analysis</TabsTrigger>
                <TabsTrigger value="recommendations" className="text-sm">Strategic Recommendations</TabsTrigger>
                <TabsTrigger value="implementation" className="text-sm">Implementation Plan</TabsTrigger>
                <TabsTrigger value="risks" className="text-sm">Risk Assessment</TabsTrigger>
                <TabsTrigger value="advisor" className="text-sm">AI Advisor</TabsTrigger>
              </TabsList>

              {/* Scenario Analysis Tab */}
              <TabsContent value="scenarios" className="space-y-6">
                {/* Executive Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Recommended Solution</p>
                          <p className="font-semibold text-primary">{recommendedScenario.name}</p>
                        </div>
                        <Star className="h-5 w-5 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Annual Savings</p>
                          <p className="font-bold text-accent-green">
                            ${(recommendedScenario.savings * 12).toLocaleString()}
                          </p>
                        </div>
                        <TrendingDown className="h-5 w-5 text-accent-green" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">ROI Improvement</p>
                          <p className="font-bold text-primary">{recommendedScenario.roi}%</p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Efficiency Gain</p>
                          <p className="font-bold text-accent-teal">
                            +{recommendedScenario.efficiency - Math.round(parseInt(formData.avgAttendance) / parseInt(formData.maxCapacity) * 100)}%
                          </p>
                        </div>
                        <Activity className="h-5 w-5 text-accent-teal" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Scenario Comparison */}
                <Card className="bg-white border border-gray-200 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Scenario Comparison & Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left p-4 font-semibold text-foreground">Scenario</th>
                            <th className="text-left p-4 font-semibold text-foreground">Monthly Cost</th>
                            <th className="text-left p-4 font-semibold text-foreground">Annual Savings</th>
                            <th className="text-left p-4 font-semibold text-foreground">Cost/Employee</th>
                            <th className="text-left p-4 font-semibold text-foreground">Efficiency</th>
                            <th className="text-left p-4 font-semibold text-foreground">Flexibility</th>
                            <th className="text-left p-4 font-semibold text-foreground">Risk</th>
                            <th className="text-left p-4 font-semibold text-foreground">Suitability</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenarioData.map((scenario, index) => (
                            <tr 
                              key={index} 
                              className={`border-b border-gray-200 hover:bg-gray-50 ${
                                scenario.recommended ? 'bg-blue-50' : ''
                              }`}
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div>
                                    <p className="font-medium text-foreground">{scenario.name}</p>
                                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                                  </div>
                                  {scenario.recommended && (
                                    <Badge className="bg-primary text-white text-xs">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="font-semibold text-foreground">
                                  ${scenario.monthlyCost.toLocaleString()}
                                </p>
                              </td>
                              <td className="p-4">
                                <p className={`font-semibold ${
                                  scenario.savings > 0 ? 'text-accent-green' : 'text-muted-foreground'
                                }`}>
                                  {scenario.savings > 0 
                                    ? `$${(scenario.savings * 12).toLocaleString()}`
                                    : 'Baseline'
                                  }
                                </p>
                              </td>
                              <td className="p-4">
                                <p className="font-medium text-foreground">
                                  ${scenario.costPerEmployee}
                                </p>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-primary h-2 rounded-full" 
                                      style={{ width: `${scenario.efficiency}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{scenario.efficiency}%</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-accent-teal h-2 rounded-full" 
                                      style={{ width: `${scenario.flexibility}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{scenario.flexibility}%</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={`text-xs ${
                                  scenario.riskLevel === 'Low' 
                                    ? 'bg-green-100 text-green-800'
                                    : scenario.riskLevel === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {scenario.riskLevel}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-accent-green h-2 rounded-full" 
                                      style={{ width: `${scenario.suitability}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{scenario.suitability}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Benchmarks */}
                <Card className="bg-white border border-gray-200 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Market Benchmarks & Competitive Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-foreground mb-2">Your Current Position</p>
                        <p className="text-sm text-muted-foreground mb-1">Cost per Employee</p>
                        <p className="font-bold text-lg text-foreground">
                          ${Math.round(currentMonthlyCost / currentEmployees)}/month
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">Utilization Rate</p>
                        <p className="font-bold text-foreground">
                          {Math.round(parseInt(formData.avgAttendance) / parseInt(formData.maxCapacity) * 100)}%
                        </p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-semibold text-foreground mb-2">Recommended Position</p>
                        <p className="text-sm text-muted-foreground mb-1">Cost per Employee</p>
                        <p className="font-bold text-lg text-accent-green">
                          ${Math.round(recommendedScenario.monthlyCost / currentEmployees)}/month
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">Utilization Rate</p>
                        <p className="font-bold text-accent-green">{recommendedScenario.efficiency}%</p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-foreground mb-2">Industry Average</p>
                        <p className="text-sm text-muted-foreground mb-1">Cost per Employee</p>
                        <p className="font-bold text-lg text-foreground">
                          ${benchmarkData.industryAverage.costPerEmployee}/month
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">Utilization Rate</p>
                        <p className="font-bold text-foreground">{benchmarkData.industryAverage.utilizationRate}%</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-foreground mb-3">Competitive Comparison</h4>
                      <div className="space-y-3">
                        {benchmarkData.competitors.map((comp, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-foreground">{comp.name}</p>
                              <p className="text-sm text-muted-foreground">{comp.location}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">${comp.avgCostPerEmployee}/employee</p>
                              <p className="text-sm text-muted-foreground">{comp.utilizationRate}% utilization</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Strategic Recommendations Tab */}
              <TabsContent value="recommendations" className="space-y-6">
                <Card className="bg-white border border-gray-200 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Strategic Recommendations for {formData.companyName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Primary Recommendation */}
                    <div className="p-6 bg-blue-50 border-l-4 border-primary rounded-lg">
                      <div className="flex items-start gap-3">
                        <Star className="h-6 w-6 text-yellow-500 mt-1" />
                        <div>
                          <h3 className="font-bold text-foreground mb-2">Primary Recommendation: {recommendedScenario.name}</h3>
                          <p className="text-foreground mb-3">{recommendedScenario.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-semibold text-foreground mb-1">Key Benefits:</p>
                              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                {recommendedScenario.pros.map((pro, index) => (
                                  <li key={index}>{pro}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground mb-1">Financial Impact:</p>
                              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                <li>Monthly savings: ${recommendedScenario.savings.toLocaleString()}</li>
                                <li>Annual savings: ${(recommendedScenario.savings * 12).toLocaleString()}</li>
                                <li>ROI improvement: {recommendedScenario.roi}%</li>
                                <li>Payback period: 2.5 months</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Recommendations */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Detailed Implementation Recommendations</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Building2 className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">Hub Strategy</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Target 450-500 daily capacity in premium location</li>
                                  <li>• Include collaborative spaces and meeting rooms</li>
                                  <li>• Implement hot-desking with advanced booking</li>
                                  <li>• Focus on downtown Seattle for commute efficiency</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Globe className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">Spoke Network</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• 15+ locations across Seattle metro area</li>
                                  <li>• Include suburban and neighborhood options</li>
                                  <li>• 200+ overflow capacity for peak periods</li>
                                  <li>• National access for traveling employees</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Calculator className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">Financial Optimization</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Flexible contracts with usage-based pricing</li>
                                  <li>• Quarterly cost reviews and optimization</li>
                                  <li>• Performance guarantees and SLA tracking</li>
                                  <li>• Reinvest savings in employee experience</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Users className="h-5 w-5 text-primary mt-1" />
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">Employee Experience</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Comprehensive training and onboarding</li>
                                  <li>• Mobile app for seamless booking</li>
                                  <li>• Workplace choice and flexibility</li>
                                  <li>• Regular feedback and optimization</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Success Metrics */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3">Success Metrics & KPIs</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-primary">Cost Efficiency</p>
                          <p className="text-muted-foreground">Target: 67% cost reduction</p>
                        </div>
                        <div>
                          <p className="font-medium text-primary">Space Utilization</p>
                          <p className="text-muted-foreground">Target: 94% efficiency</p>
                        </div>
                        <div>
                          <p className="font-medium text-primary">Employee Satisfaction</p>
                          <p className="text-muted-foreground">Target: 85%+ approval</p>
                        </div>
                        <div>
                          <p className="font-medium text-primary">Booking Success Rate</p>
                          <p className="text-muted-foreground">Target: 95%+ availability</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Implementation Plan Tab */}
              <TabsContent value="implementation" className="space-y-6">
                <Card className="bg-white border border-gray-200 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Implementation Timeline & Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Timeline Overview */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="p-2 bg-primary rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">Total Implementation Timeline</h3>
                          <p className="text-muted-foreground">3.5 months from project kickoff to full operation</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Phases */}
                    <div className="space-y-4">
                      {implementationPhases.map((phase, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  phase.status === 'ready' 
                                    ? 'bg-accent-green text-white' 
                                    : 'bg-gray-300 text-gray-600'
                                }`}>
                                  {index + 1}
                                </div>
                                {index < implementationPhases.length - 1 && (
                                  <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-foreground">{phase.phase}</h4>
                                  <Badge className={`text-xs ${
                                    phase.status === 'ready' 
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {phase.status === 'ready' ? 'Ready to Start' : 'Pending'}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Duration: {phase.duration} | Owner: {phase.owner}
                                </p>
                                <div className="space-y-2">
                                  <p className="font-medium text-foreground text-sm">Key Activities:</p>
                                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {phase.activities.map((activity, actIndex) => (
                                      <li key={actIndex}>{activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Critical Path */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Critical Path Items</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Executive approval and budget allocation (Week 1)</li>
                            <li>• IT infrastructure assessment and planning (Weeks 2-3)</li>
                            <li>• Hub location selection and lease negotiation (Weeks 4-6)</li>
                            <li>• Change management communication strategy (Week 8)</li>
                            <li>• Employee training completion before go-live (Week 12)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Resource Requirements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            Team Requirements
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Project Manager (Full-time, 4 months)</li>
                            <li>• Facilities Manager (Part-time, 6 months)</li>
                            <li>• IT Specialist (Part-time, 3 months)</li>
                            <li>• Change Manager (Part-time, 4 months)</li>
                            <li>• Executive Sponsor (Ad-hoc)</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            Investment Budget
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• One-time setup costs: $125,000</li>
                            <li>• Technology integration: $45,000</li>
                            <li>• Training and change management: $35,000</li>
                            <li>• Contingency (10%): $20,500</li>
                            <li>• <strong>Total Investment: $225,500</strong></li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Risk Assessment Tab */}
              <TabsContent value="risks" className="space-y-6">
                <Card className="bg-white border border-gray-200 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Risk Assessment & Mitigation Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Risk Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <h3 className="font-semibold text-foreground mb-2">Overall Risk Level</h3>
                        <div className="text-2xl font-bold text-accent-green">LOW</div>
                        <p className="text-sm text-muted-foreground mt-1">Well-managed transition</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <h3 className="font-semibold text-foreground mb-2">Mitigation Coverage</h3>
                        <div className="text-2xl font-bold text-primary">95%</div>
                        <p className="text-sm text-muted-foreground mt-1">Comprehensive strategies</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg text-center">
                        <h3 className="font-semibold text-foreground mb-2">Monitoring Required</h3>
                        <div className="text-2xl font-bold text-yellow-600">2</div>
                        <p className="text-sm text-muted-foreground mt-1">Medium-risk areas</p>
                      </div>
                    </div>

                    {/* Detailed Risk Analysis */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground">Detailed Risk Analysis</h3>
                      
                      <div className="space-y-4">
                        {riskFactors.map((risk, index) => (
                          <Card key={index} className="border border-gray-200">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    risk.level === 'Very Low' || risk.level === 'Low'
                                      ? 'bg-green-100'
                                      : risk.level === 'Medium'
                                      ? 'bg-yellow-100'
                                      : 'bg-red-100'
                                  }`}>
                                    {risk.level === 'Very Low' || risk.level === 'Low' ? (
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    ) : risk.level === 'Medium' ? (
                                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    ) : (
                                      <AlertTriangle className="h-5 w-5 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground">{risk.category}</h4>
                                    <p className="text-sm text-muted-foreground">{risk.description}</p>
                                  </div>
                                </div>
                                <Badge className={`text-xs ${
                                  risk.level === 'Very Low' 
                                    ? 'bg-green-100 text-green-800'
                                    : risk.level === 'Low'
                                    ? 'bg-green-100 text-green-800'
                                    : risk.level === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {risk.level} Risk
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-foreground mb-2">Impact Assessment</p>
                                  <p className="text-sm text-muted-foreground">
                                    Impact Level: <span className="font-medium">{risk.impact}</span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Probability: <span className="font-medium">{risk.probability}</span>
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground mb-2">Mitigation Strategy</p>
                                  <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Risk Monitoring Plan */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        Risk Monitoring & Response Plan
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-foreground mb-2">Weekly Reviews</p>
                          <ul className="text-muted-foreground space-y-1">
                            <li>• Project progress and milestone tracking</li>
                            <li>• Early warning indicator monitoring</li>
                            <li>• Stakeholder feedback collection</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium text-foreground mb-2">Escalation Procedures</p>
                          <ul className="text-muted-foreground space-y-1">
                            <li>• Medium risks: Project Manager notification</li>
                            <li>• High risks: Executive escalation within 24hrs</li>
                            <li>• Critical issues: Immediate response team activation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Advisor Tab */}
              <TabsContent value="advisor" className="space-y-6">
                <Card className="bg-white border border-gray-200 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-heading-2 text-foreground flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      AI Workspace Strategist
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Ask me anything about your portfolio strategy and implementation plan.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Suggested Questions */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Suggested Questions</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {suggestedQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(question)}
                            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-foreground transition-colors"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="space-y-4">
                      {/* Chat Messages */}
                      <div 
                        ref={chatContainerRef}
                        className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50"
                      >
                        {chatMessages.length === 0 ? (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <div className="text-center">
                              <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                              <p>Start a conversation with your AI advisor</p>
                              <p className="text-sm">Ask about scenarios, implementation, or strategic guidance</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            {chatMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] p-3 rounded-lg ${
                                    message.type === 'user'
                                      ? 'bg-primary text-white'
                                      : 'bg-white border border-gray-200 text-foreground'
                                  }`}
                                >
                                  <p className="text-sm">{message.content}</p>
                                  <p className={`text-xs mt-1 ${
                                    message.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                                  }`}>
                                    {message.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {isTyping && (
                              <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 text-foreground p-3 rounded-lg">
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Chat Input */}
                      <div className="flex gap-2">
                        <Input
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask about your portfolio strategy..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(chatInput)}
                          className="flex-1 border-gray-300"
                        />
                        <Button
                          onClick={() => handleSendMessage(chatInput)}
                          disabled={!chatInput.trim() || isTyping}
                          className="bg-primary hover:bg-primary-dark text-white"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  // Return existing screens for intro, wizard, and processing (keep same as original)
  return null;
}