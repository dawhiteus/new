import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { 
  Building2, 
  DollarSign, 
  TrendingDown, 
  Target,
  AlertTriangle,
  FileText,
  BarChart3,
  Calendar,
  CheckSquare,
  MapPin,
  Users,
  TrendingUp,
  Activity,
  MoreHorizontal,
  UserCheck,
  Clock,
  PieChart as PieChartIcon,
  ArrowRight,
  Lightbulb,
  Map,
  Settings,
  Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { HighImpactRenewalsActionsDropdown } from './HighImpactRenewalsActionsDropdown';
import { TaskOverviewActionsDropdown } from './TaskOverviewActionsDropdown';
import { UpcomingRenewalsActionsDropdown } from './UpcomingRenewalsActionsDropdown';
import { LicenseDetailModal } from './LicenseDetailModal';
import { PaymentDetailsModal } from './PaymentDetailsModal';
import { AssignOwnerModal } from './AssignOwnerModal';
import { PageHeader } from './PageHeader';

type ViewType = 'dashboard' | 'portfolio' | 'licenses' | 'tasks' | 'funding' | 'payments' | 'invoices' | 'alerts' | 'portfolio-manager';

interface PortfolioOverviewProps {
  onViewChange: (view: ViewType) => void;
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

// Enhanced enterprise-scale data with realistic scenarios
const leaseCompositionData = [
  { name: 'Traditional Lease', value: 62, color: '#005B94' },
  { name: 'Dedicate (LS)', value: 28, color: '#80C7FF' },
  { name: 'Flex (LS)', value: 10, color: '#B3D9FF' }
];

const portfolioCompositionData = [
  { name: 'Traditional Lease', value: 62, color: '#005B94' },
  { name: 'Dedicate (LS)', value: 28, color: '#80C7FF' },
  { name: 'Flex (LS)', value: 10, color: '#B3D9FF' }
];

// Top cost drivers with realistic enterprise amounts ($K per month)
const topCostDrivers = [
  { city: 'Manhattan (Midtown)', cost: 2840 },
  { city: 'San Francisco (SOMA)', cost: 2650 },
  { city: 'London (Canary Wharf)', cost: 1850 },
  { city: 'Seattle (Belltown)', cost: 1420 },
  { city: 'Austin (Downtown)', cost: 890 },
  { city: 'Chicago (Loop)', cost: 760 }
];

// High-impact renewals with realistic enterprise scenarios
const highImpactRenewals = [
  { 
    location: 'Tel Tech Headquarters Campus', 
    city: 'Bellevue',
    date: 'Mar 31, 2025', 
    sqft: '485K sq ft',
    monthlyRent: 1950000,
    hasOutstandingInvoice: false, 
    hasRenewedDocument: false,
    priority: 'Critical',
    type: 'Headquarters Renewal'
  },
  { 
    location: 'Tel Tech Regional Hub', 
    city: 'Atlanta',
    date: 'May 15, 2025', 
    sqft: '180K sq ft',
    monthlyRent: 685000,
    hasOutstandingInvoice: true, 
    hasRenewedDocument: false,
    priority: 'High',
    type: 'Regional Hub'
  },
  { 
    location: 'Tel Tech East Coast Operations', 
    city: 'New York',
    date: 'Jul 1, 2025', 
    sqft: '95K sq ft',
    monthlyRent: 485000,
    hasOutstandingInvoice: false, 
    hasRenewedDocument: true,
    priority: 'Medium',
    type: 'Engineering Center'
  },
  { 
    location: 'Tel Tech Partnership Hub', 
    city: 'Seattle',
    date: 'Aug 30, 2025', 
    sqft: '125K sq ft',
    monthlyRent: 398000,
    hasOutstandingInvoice: false, 
    hasRenewedDocument: false,
    priority: 'High',
    type: 'Partnership Office'
  },
  { 
    location: 'Tel Tech Global Finance Center', 
    city: 'London',
    date: 'Oct 31, 2025', 
    sqft: '200K sq ft',
    monthlyRent: 920000,
    hasOutstandingInvoice: true, 
    hasRenewedDocument: false,
    priority: 'Critical',
    type: 'Financial Services Hub'
  },
  { 
    location: 'Tel Tech Innovation Lab', 
    city: 'Dallas',
    date: 'Dec 15, 2025', 
    sqft: '68K sq ft',
    monthlyRent: 198000,
    hasOutstandingInvoice: false, 
    hasRenewedDocument: true,
    priority: 'Medium',
    type: 'R&D Facility'
  }
];

// Enhanced regional data with realistic enterprise footprint
const regionalData = [
  { city: 'New York/NJ Metro', licenses: 47, sqft: 1850000, totalSpend: 84500000, employeeCount: 12800, avgCostPerSqFt: 45.68 },
  { city: 'San Francisco Bay Area', licenses: 38, sqft: 1650000, totalSpend: 78900000, employeeCount: 11200, avgCostPerSqFt: 47.82 },
  { city: 'London/Southeast UK', licenses: 31, sqft: 980000, totalSpend: 52400000, employeeCount: 6800, avgCostPerSqFt: 53.47 },
  { city: 'Seattle/Bellevue', licenses: 28, sqft: 1240000, totalSpend: 48600000, employeeCount: 8900, avgCostPerSqFt: 39.19 },
  { city: 'Chicago/Midwest', licenses: 24, sqft: 785000, totalSpend: 28900000, employeeCount: 5400, avgCostPerSqFt: 36.82 },
  { city: 'Austin/Central TX', licenses: 18, sqft: 650000, totalSpend: 19800000, employeeCount: 4200, avgCostPerSqFt: 30.46 },
  { city: 'Atlanta/Southeast', licenses: 22, sqft: 890000, totalSpend: 31200000, employeeCount: 6100, avgCostPerSqFt: 35.06 },
  { city: 'Toronto/GTA', licenses: 15, sqft: 420000, totalSpend: 15800000, employeeCount: 2800, avgCostPerSqFt: 37.62 }
];

// Enhanced task summary with enterprise scenarios
const taskSummaryData = {
  myTasks: 12,
  overdueTasks: 3,
  tasks: [
    {
      type: 'Compliance Audit',
      trigger: 'Due Sept 30 - Fire Safety Certificate',
      badgeStyle: 'urgent',
      priority: 'Critical',
      assignedTo: 'Sarah Chen, Facilities'
    },
    {
      type: 'Cost Optimization', 
      trigger: 'Market Rate Review - 8 locations above benchmark',
      badgeStyle: 'opportunity',
      priority: 'High',
      assignedTo: 'Michael Torres, Finance'
    },
    {
      type: 'Contract Negotiation',
      trigger: 'Q1 2025 Renewals - 5 locations, $2.8M annual',
      badgeStyle: 'action',
      priority: 'High',
      assignedTo: 'David Kim, Legal'
    },
    {
      type: 'Space Planning',
      trigger: 'Hybrid Work Assessment - 15% underutilization',
      badgeStyle: 'analysis',
      priority: 'Medium',
      assignedTo: 'Emma Rodriguez, HR'
    }
  ]
};

// Realistic renewal timeline data showing enterprise patterns (in thousands of sq ft)
const renewalTimelineData = [
  { month: 'Jan', undecided: 180, renewed: 420, expired: 85, totalValue: 28500000 },
  { month: 'Feb', undecided: 95, renewed: 285, expired: 42, totalValue: 18900000 },
  { month: 'Mar', undecided: 485, renewed: 320, expired: 68, totalValue: 89400000 }, // Tel Tech HQ
  { month: 'Apr', undecided: 125, renewed: 380, expired: 55, totalValue: 24800000 },
  { month: 'May', undecided: 180, renewed: 285, expired: 45, totalValue: 42600000 }, // Tel Tech Regional Hub
  { month: 'Jun', undecided: 220, renewed: 450, expired: 92, totalValue: 38200000 },
  { month: 'Jul', undecided: 95, renewed: 485, expired: 38, totalValue: 52800000 }, // Tel Tech East Coast
  { month: 'Aug', undecided: 125, renewed: 398, expired: 65, totalValue: 31200000 }, // Tel Tech Partnership
  { month: 'Sep', undecided: 185, renewed: 295, expired: 48, totalValue: 25400000 },
  { month: 'Oct', undecided: 200, renewed: 920, expired: 125, totalValue: 78600000 }, // Tel Tech Finance Center
  { month: 'Nov', undecided: 140, renewed: 265, expired: 58, totalValue: 22800000 },
  { month: 'Dec', undecided: 68, renewed: 198, expired: 35, totalValue: 18900000 } // Tel Tech Innovation Lab
];

// Enhanced enterprise expiring licenses with realistic scenarios
const expiringLicensesPreview = [
  { 
    name: 'Tel Tech Engineering Campus', 
    location: 'Bellevue, WA', 
    expirationDate: 'Mar 31, 2025', 
    sqft: 485000, 
    monthlyRent: 1950000,
    status: 'Under Negotiation',
    hasPendingInvoice: false,
    hasRenewalDocument: false,
    priority: 'Critical',
    marketPosition: '8% below market',
    occupancyRate: '94%'
  },
  { 
    name: 'Tel Tech Regional Hub', 
    location: 'Atlanta, GA', 
    expirationDate: 'May 15, 2025', 
    sqft: 180000, 
    monthlyRent: 685000,
    status: 'Renewal Notice Sent',
    hasPendingInvoice: true,
    hasRenewalDocument: false,
    priority: 'High',
    marketPosition: '12% above market',
    occupancyRate: '87%'
  },
  { 
    name: 'Tel Tech East Coast Operations', 
    location: 'New York, NY', 
    expirationDate: 'Jul 1, 2025', 
    sqft: 95000, 
    monthlyRent: 485000,
    status: 'Renewed',
    hasPendingInvoice: false,
    hasRenewalDocument: true,
    priority: 'Medium',
    marketPosition: '3% below market',
    occupancyRate: '91%'
  },
  { 
    name: 'Tel Tech Partnership Center', 
    location: 'Seattle, WA', 
    expirationDate: 'Aug 30, 2025', 
    sqft: 125000, 
    monthlyRent: 398000,
    status: 'Evaluation Phase',
    hasPendingInvoice: false,
    hasRenewalDocument: false,
    priority: 'High',
    marketPosition: '15% below market',
    occupancyRate: '76%'
  },
  { 
    name: 'Tel Tech Global Finance Center', 
    location: 'London, UK', 
    expirationDate: 'Oct 31, 2025', 
    sqft: 200000, 
    monthlyRent: 920000,
    status: 'Pre-Negotiation',
    hasPendingInvoice: true,
    hasRenewalDocument: false,
    priority: 'Critical',
    marketPosition: '5% above market',
    occupancyRate: '98%'
  }
];

// Legend items for the renewal timeline chart
const renewalLegendItems = [
  { color: '#0056D2', label: 'Undecided', description: 'No action taken yet' },
  { color: '#27AE60', label: 'Renewed', description: 'License confirmed' },
  { color: '#7B7B7B', label: 'Expired', description: 'License lapsed' }
];

// Strategic planning tools data - exact content from screenshot
const strategicTools = [
  {
    icon: TrendingUp,
    title: 'LiquidIQ',
    description: 'Instant answers from your real estate data',
    color: '#005B94'
  },
  {
    icon: Building2,
    title: 'Hub Locator',
    description: 'Find optimal locations for team collaboration and cost savings',
    color: '#28A745'
  },
  {
    icon: BarChart3,
    title: 'Scenario Modeler',
    description: 'Model flexible office scenarios and see your ROI in minutes',
    color: '#FFA500'
  }
];

export function PortfolioOverview({ 
  onViewChange, 
  onAIAssistantOpen = () => {}, 
  isAIDrawerOpen = false 
}: PortfolioOverviewProps) {

  const [renewalTimeframe, setRenewalTimeframe] = useState('12-months');
  
  // Modal states
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatSquareFeet = (sqft: number) => {
    if (sqft >= 1000) {
      return `${(sqft / 1000).toFixed(0)}K`;
    }
    return sqft.toLocaleString();
  };

  // Calculate renewal metrics with realistic enterprise data
  const totalLicensesExpiring90Days = 18; 
  const totalSqFtExpiring = renewalTimelineData.reduce((sum, month) => sum + month.undecided + month.renewed + month.expired, 0);
  const portfolioExpiringPercentage = 28; 
  const totalPortfolioValue = renewalTimelineData.reduce((sum, month) => sum + month.totalValue, 0);
  const averageRenewalValue = totalPortfolioValue / 12;

  // Handle renewal actions with modal integration
  const handleRenewalAction = (action: string, renewal: any) => {
    console.log(`High Impact Renewal action: ${action} for ${renewal.location}`);
    setSelectedRenewal(renewal);
    
    switch (action) {
      case 'view-license':
        setShowLicenseModal(true);
        break;
      case 'upload-updated-license':
        console.log(`Opening upload modal for ${renewal.location}`);
        // Here you would open an upload modal - not implemented in this update
        break;
      case 'pay-invoice':
        setShowInvoiceModal(true);
        break;
      case 'assign-owner':
        setShowAssignModal(true);
        break;
      default:
        console.log(`Unknown action: ${action}`);
    }
  };

  // Modal handlers
  const handleCloseLicenseModal = () => {
    setShowLicenseModal(false);
    setSelectedRenewal(null);
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setSelectedRenewal(null);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedRenewal(null);
  };

  const handleSaveLicense = (licenseData: any) => {
    console.log('License data saved:', licenseData);
    handleCloseLicenseModal();
  };

  const handleInitiatePayment = (paymentData: { paymentMethod: string; paidBy: string }) => {
    console.log('Payment initiated:', paymentData);
    handleCloseInvoiceModal();
  };

  const handleAssignOwner = (email: string) => {
    if (selectedRenewal) {
      // Determine context and provide appropriate logging
      let context = 'renewal';
      let itemName = selectedRenewal.location;
      
      if (selectedRenewal.isTaskContext) {
        context = 'task';
        itemName = selectedRenewal.type || 'task';
      } else if (selectedRenewal.isUpcomingRenewalContext) {
        context = 'upcoming renewal';
        itemName = selectedRenewal.name;
      }
      
      console.log(`Assigned ${context} "${itemName}" to:`, email);
    }
    handleCloseAssignModal();
  };

  // Handle task actions with analytics logging and modal integration
  const handleTaskAction = (action: string, task: any) => {
    // Log interaction for analytics
    console.log(`Task action: ${action} for task: ${task.type} - ${task.trigger}`);
    
    // Create a mock task data object for modal compatibility
    const taskAsRenewal = {
      location: task.type === 'Operational' ? 'New York' : 'San Francisco', // Mock location based on task type
      date: 'Aug 15', // Mock date from task trigger
      hasOutstandingInvoice: task.trigger.toLowerCase().includes('payment') || task.trigger.toLowerCase().includes('invoice'),
      hasRenewedDocument: false,
      // Add task context for better modal handling
      type: task.type,
      trigger: task.trigger,
      isTaskContext: true
    };
    
    switch (action) {
      case 'mark-complete':
        console.log(`Marking task as complete: ${task.type}`);
        // Here you would update task status and potentially remove from list
        break;
      case 'assign-owner':
        console.log(`Opening assignee picker for task: ${task.type}`);
        setSelectedRenewal(taskAsRenewal); // Use task data formatted for modal
        setShowAssignModal(true);
        break;
      case 'view-license':
        console.log(`Opening license details for task: ${task.type}`);
        setSelectedRenewal(taskAsRenewal); // Use task data formatted for modal
        setShowLicenseModal(true);
        break;
      case 'pay-invoice':
        console.log(`Opening invoice payment for task: ${task.type}`);
        setSelectedRenewal(taskAsRenewal); // Use task data formatted for modal
        setShowInvoiceModal(true);
        break;
      case 'upload-document':
        console.log(`Opening document upload for task: ${task.type}`);
        // Here you would open file upload flow - not implemented in this update
        break;
      default:
        console.log(`Unknown task action: ${action}`);
    }
  };

  // Handle upcoming renewals actions with analytics logging and modal integration
  const handleUpcomingRenewalAction = (action: string, license: any) => {
    // Log interaction for analytics
    console.log(`Upcoming renewal action: ${action} for license: ${license.name} - ${license.location}`);
    
    // Create a renewal-compatible object from license data for modal integration
    const licenseAsRenewal = {
      location: license.location.split(',')[0], // Extract city from "City, State" format
      date: license.expirationDate.split(',')[0], // Extract date from "Month Day, Year" format
      hasOutstandingInvoice: license.hasPendingInvoice || false,
      hasRenewedDocument: license.hasRenewalDocument || false,
      // Add license context for better modal handling
      name: license.name,
      status: license.status,
      sqft: license.sqft,
      fullLocation: license.location,
      fullExpirationDate: license.expirationDate,
      isUpcomingRenewalContext: true
    };
    
    setSelectedRenewal(licenseAsRenewal);
    
    switch (action) {
      case 'view-license':
        console.log(`Opening license detail view for ${license.name}`);
        setShowLicenseModal(true);
        break;
      case 'upload-updated-license':
        console.log(`Opening upload modal for renewed contract: ${license.name}`);
        // Here you would open modal to upload a renewed contract - not implemented in this update
        break;
      case 'pay-invoice':
        console.log(`Opening payment modal for invoice: ${license.name}`);
        setShowInvoiceModal(true);
        break;
      case 'assign-owner':
        console.log(`Opening assign owner dropdown for: ${license.name}`);
        setShowAssignModal(true);
        break;
      default:
        console.log(`Unknown upcoming renewal action: ${action}`);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md" style={{ borderColor: '#E5E7EB' }}>
          <p style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            color: '#374151', 
            fontFamily: 'Inter, sans-serif',
            marginBottom: '8px'
          }}>
            {label} 2025
          </p>
          <p style={{ 
            fontSize: '12px', 
            fontWeight: 400, 
            color: '#6B7280', 
            fontFamily: 'Inter, sans-serif',
            marginBottom: '8px'
          }}>
            Total: {formatSquareFeet(total)} sq ft
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 400, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif'
              }}>
                {entry.name}: {formatSquareFeet(entry.value)} sq ft
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      <PageHeader
        icon={<Building2 className="h-6 w-6" />}
        title="Portfolio Dashboard"
        subtitle="Enterprise real estate portfolio spanning 223 locations across 8 countries • $472M annual spend • 58,400 employees"
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* First Row - Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Annual Real Estate Spend */}
          <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '8px'
              }}>
                Annual Real Estate Spend
              </div>
              
              <div className="flex items-end justify-between">
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  lineHeight: 1.0, 
                  color: '#005B94', 
                  fontFamily: 'Inter, sans-serif'
                }}>
                  $472M
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" style={{ color: '#28A745' }} />
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    color: '#28A745', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    -12% YoY
                  </span>
                </div>
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                marginTop: '4px'
              }}>
                $22.3M savings vs. 2023 through portfolio optimization
              </div>
            </CardContent>
          </Card>

          {/* Global Portfolio Summary */}
          <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '8px'
              }}>
                Global Portfolio
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaseCompositionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={30}
                          innerRadius={18}
                          paddingAngle={2}
                          dataKey="value"
                          strokeWidth={1}
                          stroke="#ffffff"
                        >
                          {leaseCompositionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ 
                        fontSize: '18px', 
                        fontWeight: 700, 
                        color: '#374151', 
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      223
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: '#005B94' }} 
                    />
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 400, 
                      color: '#6B7280', 
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Traditional (138 locations)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: '#80C7FF' }} 
                    />
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 400, 
                      color: '#6B7280', 
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Flexible (62 locations)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: '#B3D9FF' }} 
                    />
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 400, 
                      color: '#6B7280', 
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      On-Demand (23 locations)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Performance */}
          <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '8px'
              }}>
                Market Performance
              </div>
              
              <div className="flex items-end gap-2" style={{ marginBottom: '8px' }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  lineHeight: 1.0, 
                  color: '#28A745', 
                  fontFamily: 'Inter, sans-serif'
                }}>
                  7.2%
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 500, 
                  lineHeight: 1.0, 
                  color: '#6B7280', 
                  fontFamily: 'Inter, sans-serif'
                }}>
                  below market
                </div>
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif', 
                lineHeight: 1.3
              }}>
                Portfolio-wide average vs. comparable market rates • 186 locations analyzed
              </div>
            </CardContent>
          </Card>

          {/* Space Utilization */}
          <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '8px'
              }}>
                Space Utilization
              </div>
              
              <div className="flex items-end gap-2" style={{ marginBottom: '8px' }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  lineHeight: 1.0, 
                  color: '#FFA500', 
                  fontFamily: 'Inter, sans-serif'
                }}>
                  73%
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" style={{ color: '#28A745' }} />
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: 500, 
                    color: '#28A745', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    +8% vs Q2
                  </span>
                </div>
              </div>
              
              <div style={{ 
                fontSize: '12px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif', 
                lineHeight: 1.3
              }}>
                Post-hybrid optimization • 15 locations identified for consolidation
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Regional Breakdown - Spans 2 columns with View All Licenses link */}
          <Card className="rounded-xl border-0 p-6 lg:col-span-2" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '16px'
              }}>
                Regional Breakdown
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        City
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Licenses
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Sq Ft
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Total Spend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionalData.map((row, index) => (
                      <tr 
                        key={index} 
                        className={`border-b transition-colors hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                        style={{ borderColor: '#E5E7EB' }}
                      >
                        <td 
                          className="py-4 px-4"
                          style={{ 
                            fontSize: '16px', 
                            fontWeight: 400, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {row.city}
                        </td>
                        <td 
                          className="text-left py-4 px-4"
                          style={{ 
                            fontSize: '16px', 
                            fontWeight: 400, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {row.licenses}
                        </td>
                        <td 
                          className="text-left py-4 px-4"
                          style={{ 
                            fontSize: '16px', 
                            fontWeight: 400, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {row.sqft.toLocaleString()}
                        </td>
                        <td 
                          className="text-left py-4 px-4"
                          style={{ 
                            fontSize: '16px', 
                            fontWeight: 500, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          ${row.totalSpend.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All Licenses Link */}
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium hover:bg-transparent p-0 flex items-center gap-1"
                  style={{ 
                    color: '#005B94',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => onViewChange('licenses')}
                >
                  View All Licenses <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* High Impact Renewals with View All Renewals link */}
          <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FEF2E8' }}
                >
                  <AlertTriangle className="h-5 w-5" style={{ color: '#FFA500' }} />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    High Impact Renewals
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Upcoming expiration dates
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {highImpactRenewals.map((renewal, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg border-l-4 transition-colors hover:bg-gray-50" 
                    style={{ 
                      backgroundColor: '#F8F9FA', 
                      borderLeftColor: index < 2 ? '#FFA500' : '#28A745' 
                    }}
                  >
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {renewal.location}
                    </span>
                    <div className="flex items-center gap-2">
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#6B7280', 
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {renewal.date}
                      </span>
                      <HighImpactRenewalsActionsDropdown 
                        renewal={renewal}
                        onAction={handleRenewalAction}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* View All Renewals Link */}
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium hover:bg-transparent p-0 flex items-center gap-1"
                  style={{ 
                    color: '#005B94',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => onViewChange('licenses')}
                >
                  View All Renewals <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row - Cost per Employee and Task Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FFF3E0' }}
                >
                  <Users className="h-5 w-5" style={{ color: '#FFA500' }} />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Cost per Employee
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Per person spending
                  </div>
                </div>
              </div>
              
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 700, 
                lineHeight: 1.2, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '16px'
              }}>
                $8,200
              </div>
              
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 600, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '12px'
              }}>
                Top Cost Drivers
              </div>
              
              <div className="space-y-2">
                {topCostDrivers.map((driver, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 rounded-lg" 
                    style={{ backgroundColor: '#F8F9FA' }}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: '#6B7280' }} />
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 400, 
                        color: '#374151', 
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {driver.city}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      ${driver.cost}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Task Summary - Updated with TaskOverviewActionsDropdown and left-aligned View All Tasks link */}
          <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
            <CardContent className="p-0">
              {/* Summary Cards Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* My Tasks */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
                  <div className="flex items-center justify-center mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#90CAF9' }}
                    >
                      <UserCheck className="h-5 w-5" style={{ color: '#005B94' }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif',
                      marginBottom: '4px'
                    }}>
                      My Tasks
                    </div>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: 700, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.0,
                      marginBottom: '4px'
                    }}>
                      {taskSummaryData.myTasks}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      fontWeight: 400, 
                      color: '#6B7280', 
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      assigned to you
                    </div>
                  </div>
                </div>

                {/* Overdue Tasks */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFEBEE' }}>
                  <div className="flex items-center justify-center mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#FFAB91' }}
                    >
                      <AlertTriangle className="h-5 w-5" style={{ color: '#F57C00' }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: 500, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif',
                      marginBottom: '4px'
                    }}>
                      Overdue Tasks
                    </div>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: 700, 
                      color: '#374151', 
                      fontFamily: 'Inter, sans-serif',
                      lineHeight: 1.0,
                      marginBottom: '4px'
                    }}>
                      {taskSummaryData.overdueTasks}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                      <th 
                        className="text-left py-3 px-2"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Type
                      </th>
                      <th 
                        className="text-left py-3 px-2"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Trigger
                      </th>
                      <th 
                        className="text-left py-3 px-2"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskSummaryData.tasks.map((task, index) => (
                      <tr 
                        key={index} 
                        className="border-b transition-colors hover:bg-gray-50" 
                        style={{ borderColor: '#E5E7EB' }}
                      >
                        <td className="py-3 px-2">
                          <Badge 
                            className="px-3 py-1 text-xs font-medium rounded-full"
                            style={{ 
                              backgroundColor: task.badgeStyle === 'dark' ? '#374151' : '#E5E7EB',
                              color: task.badgeStyle === 'dark' ? '#FFFFFF' : '#374151',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {task.type}
                          </Badge>
                        </td>
                        <td 
                          className="py-3 px-2"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {task.trigger}
                        </td>
                        <td className="py-3 px-2">
                          <TaskOverviewActionsDropdown 
                            task={task}
                            onAction={handleTaskAction}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All Tasks Link - Now left-aligned and with arrow */}
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium hover:bg-transparent p-0 flex items-center gap-1"
                  style={{ 
                    color: '#005B94',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => onViewChange('tasks')}
                >
                  View All Tasks <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fourth Row - Renewal Timeline (Updated Summary Cards) */}
        <Card className="rounded-xl border-0 p-6" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
          <CardContent className="p-0">
            {/* Header with Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#E8F4F8' }}
              >
                <Calendar className="h-5 w-5" style={{ color: '#005B94' }} />
              </div>
              <div>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: '#374151', 
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Renewal Timeline
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: 400, 
                  color: '#6B7280', 
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Lease expiration schedule
                </div>
              </div>
            </div>

            {/* Updated Top Summary Cards - Clean Minimal Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Licenses Expiring (90 Days) */}
              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FFA500' }}
                >
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 700, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.0,
                    marginBottom: '4px'
                  }}>
                    {totalLicensesExpiring90Days}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Licenses Expiring (90 Days)
                  </div>
                </div>
              </div>

              {/* Total Sq Ft Expiring */}
              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#005B94' }}
                >
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 700, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.0,
                    marginBottom: '4px'
                  }}>
                    {formatSquareFeet(totalSqFtExpiring)}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Total Sq Ft Expiring
                  </div>
                </div>
              </div>

              {/* % of Portfolio Expiring */}
              <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#28A745' }}
                >
                  <PieChartIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 700, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.0,
                    marginBottom: '4px'
                  }}>
                    {portfolioExpiringPercentage}%
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    % of Portfolio Expiring (12 mo)
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming License Expirations Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Upcoming License Expirations
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: 400, 
                    color: '#6B7280', 
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Visualize expiring licenses across your portfolio.
                  </div>
                </div>
                
                <Select value={renewalTimeframe} onValueChange={setRenewalTimeframe}>
                  <SelectTrigger 
                    className="w-32 h-9 border border-border rounded-lg"
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5E7EB'
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12-months">12 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="3-months">3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-6 mb-4">
                {renewalLegendItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex items-center gap-2">
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: '#374151', 
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {item.label}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: 400, 
                        color: '#6B7280', 
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {item.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={renewalTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ 
                      fontSize: 12, 
                      fill: '#6B7280', 
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ 
                      fontSize: 12, 
                      fill: '#6B7280', 
                      fontFamily: 'Inter, sans-serif'
                    }}
                    tickFormatter={(value) => `${formatSquareFeet(value)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="undecided" stackId="a" fill="#0056D2" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="renewed" stackId="a" fill="#27AE60" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="expired" stackId="a" fill="#7B7B7B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Upcoming Renewals Table Section with New Actions Dropdown */}
            <div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 600, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '12px'
              }}>
                Upcoming Renewals
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#E5E7EB' }}>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        License Name
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Location
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Expiration Date
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Sq Ft
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Status
                      </th>
                      <th 
                        className="text-left py-3 px-4"
                        style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#374151', 
                          fontFamily: 'Inter, sans-serif', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em'
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringLicensesPreview.map((license, index) => (
                      <tr 
                        key={index} 
                        className={`border-b transition-colors hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                        style={{ borderColor: '#E5E7EB' }}
                      >
                        <td 
                          className="py-4 px-4"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 500, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {license.name}
                        </td>
                        <td 
                          className="py-4 px-4"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {license.location}
                        </td>
                        <td 
                          className="py-4 px-4"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {license.expirationDate}
                        </td>
                        <td 
                          className="py-4 px-4"
                          style={{ 
                            fontSize: '14px', 
                            fontWeight: 400, 
                            color: '#374151', 
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          {license.sqft.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              license.status === 'Renewed' 
                                ? 'text-white' 
                                : 'text-white'
                            }`}
                            style={{ 
                              backgroundColor: license.status === 'Renewed' ? '#27AE60' : '#0056D2',
                              fontFamily: 'Inter, sans-serif'
                            }}
                          >
                            {license.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <UpcomingRenewalsActionsDropdown 
                            license={license}
                            onAction={handleUpcomingRenewalAction}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All Renewals Link */}
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  className="text-sm font-medium hover:bg-transparent p-0 flex items-center gap-1"
                  style={{ 
                    color: '#005B94',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onClick={() => onViewChange('licenses')}
                >
                  View All Renewals <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strategic Planning Promo Bar - Exact Match to Screenshot */}
        <div className="rounded-xl px-6 py-6" style={{ backgroundColor: '#E8EDF5' }}>
          <div className="text-center">
            {/* Simple Lightbulb Icon */}
            <div className="flex justify-center mb-4">
              <Lightbulb className="h-6 w-6" style={{ color: '#005B94' }} />
            </div>

            {/* Main Heading */}
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 600, 
              color: '#374151', 
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px',
              lineHeight: 1.2
            }}>
              AI-Powered Workplace Strategy
            </h2>

            {/* Subtitle */}
            <p style={{ 
              fontSize: '14px', 
              fontWeight: 400, 
              color: '#6B7280', 
              fontFamily: 'Inter, sans-serif',
              marginBottom: '24px',
              lineHeight: 1.4
            }}>
              Model flexible office scenarios, optimize costs, and make data-driven portfolio decisions with our AI strategist.
            </p>

            {/* Three Cards in Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {strategicTools.map((tool, index) => (
                <button
                  key={index}
                  className="p-4 rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors w-full text-left" 
                  style={{ backgroundColor: '#FFFFFF' }}
                  onClick={() => {
                    if (tool.title === 'Scenario Modeler') {
                      onViewChange('portfolio-manager');
                    }
                  }}
                  disabled={tool.title !== 'Scenario Modeler'}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${tool.color}15` }}
                    >
                      <tool.icon className="h-4 w-4" style={{ color: tool.color }} />
                    </div>
                    
                    <div className="text-left">
                      <div style={{ 
                        fontSize: '16px', 
                        fontWeight: 600, 
                        color: '#374151', 
                        fontFamily: 'Inter, sans-serif',
                        marginBottom: '4px'
                      }}>
                        {tool.title}
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: 400, 
                        color: '#6B7280', 
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1.3
                      }}>
                        {tool.description}
                      </div>
                    </div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4" style={{ color: '#9CA3AF' }} />
                </button>
              ))}
            </div>

            {/* Main CTA Button - Centered */}
            <div className="flex justify-center">
              <Button 
                className="px-6 py-2 text-white rounded-lg flex items-center gap-2"
                style={{ 
                  backgroundColor: '#005B94', 
                  fontSize: '14px', 
                  fontWeight: 500, 
                  fontFamily: 'Inter, sans-serif'
                }}
                onClick={() => onViewChange('portfolio-manager')}
              >
                <Sparkles className="h-4 w-4" />
                Launch Scenario Modeler
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* High Impact Renewals Modals */}
      {selectedRenewal && (
        <>
          {/* License Detail Modal */}
          <LicenseDetailModal
            isOpen={showLicenseModal}
            onClose={handleCloseLicenseModal}
            onSave={handleSaveLicense}
            licenseData={{
              id: 1, // Mock ID
              city: selectedRenewal.location,
              type: selectedRenewal.isTaskContext 
                ? selectedRenewal.type 
                : selectedRenewal.isUpcomingRenewalContext 
                  ? 'Dedicated' 
                  : 'Dedicated',
              address: selectedRenewal.isUpcomingRenewalContext 
                ? selectedRenewal.fullLocation 
                : `${selectedRenewal.location} Office Complex`,
              operator: `${selectedRenewal.location} Property Management`,
              status: selectedRenewal.isTaskContext 
                ? (selectedRenewal.trigger.includes('Due') ? 'Action Required' : 'Active')
                : selectedRenewal.isUpcomingRenewalContext 
                  ? selectedRenewal.status
                  : (selectedRenewal.hasRenewedDocument ? 'Active' : 'Renewal Required'),
              cost: 25000, // Mock cost
              startDate: '2024-01-01',
              endDate: selectedRenewal.isUpcomingRenewalContext 
                ? selectedRenewal.fullExpirationDate 
                : selectedRenewal.date + ', 2025',
              name: selectedRenewal.isTaskContext 
                ? `${selectedRenewal.type} - ${selectedRenewal.location} Office`
                : selectedRenewal.isUpcomingRenewalContext 
                  ? selectedRenewal.name
                  : `${selectedRenewal.location} Office`,
              property: `${selectedRenewal.location} Property Management`,
              location: selectedRenewal.isUpcomingRenewalContext 
                ? selectedRenewal.fullLocation 
                : selectedRenewal.location,
              monthlyRent: 25000, // Mock monthly rent
              squareFootage: selectedRenewal.isUpcomingRenewalContext 
                ? selectedRenewal.sqft 
                : 15000, // Mock square footage
              renewalStatus: selectedRenewal.isTaskContext 
                ? 'Task Related' 
                : selectedRenewal.isUpcomingRenewalContext 
                  ? selectedRenewal.status
                  : (selectedRenewal.hasRenewedDocument ? 'Renewed' : 'Pending')
            }}
          />

          {/* Payment Details Modal (for Invoice) */}
          <PaymentDetailsModal
            isOpen={showInvoiceModal}
            onClose={handleCloseInvoiceModal}
            onInitiatePayment={handleInitiatePayment}
            payment={{
              id: 1, // Mock ID
              city: selectedRenewal.location,
              type: selectedRenewal.isTaskContext 
                ? `${selectedRenewal.type} Payment` 
                : selectedRenewal.isUpcomingRenewalContext 
                  ? `${selectedRenewal.name} Invoice`
                  : 'Dedicated Renewal',
              address: selectedRenewal.isUpcomingRenewalContext 
                ? selectedRenewal.fullLocation 
                : `${selectedRenewal.location} Office Complex`,
              operator: `${selectedRenewal.location} Property Management`,
              amountDue: selectedRenewal.isUpcomingRenewalContext 
                ? Math.round(selectedRenewal.sqft * 35) // Mock calculation based on sqft
                : 30000, // Mock amount
              dueDate: selectedRenewal.isTaskContext 
                ? selectedRenewal.trigger.includes('Due') ? selectedRenewal.trigger.split('Due ')[1] : selectedRenewal.date + ', 2025'
                : selectedRenewal.isUpcomingRenewalContext 
                  ? selectedRenewal.fullExpirationDate
                  : selectedRenewal.date + ', 2025',
              paymentMethod: 'ACH Transfer',
              licenseId: `LIC-${selectedRenewal.location.toUpperCase()}-001`,
              status: selectedRenewal.hasOutstandingInvoice || selectedRenewal.isTaskContext || selectedRenewal.isUpcomingRenewalContext ? 'due_soon' : 'paid',
              paymentInfo: selectedRenewal.isTaskContext 
                ? `${selectedRenewal.type} - ${selectedRenewal.trigger}` 
                : selectedRenewal.isUpcomingRenewalContext 
                  ? `${selectedRenewal.name} - Renewal Payment`
                  : 'Renewal Payment'
            }}
          />

          {/* Assign Owner Modal */}
          <AssignOwnerModal
            isOpen={showAssignModal}
            onClose={handleCloseAssignModal}
            onAssign={handleAssignOwner}
            taskName={
              selectedRenewal.isTaskContext 
                ? `Task Assignment - ${selectedRenewal.type || 'General Task'}`
                : selectedRenewal.isUpcomingRenewalContext 
                  ? `${selectedRenewal.name} - ${selectedRenewal.fullLocation} (Expires ${selectedRenewal.fullExpirationDate})`
                  : `${selectedRenewal.location} Renewal (Due ${selectedRenewal.date})`
            }
          />
        </>
      )}
    </div>
  );
}