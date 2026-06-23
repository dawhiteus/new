import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CreditCard, Download, MoreHorizontal, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import svgPaths from '../imports/svg-crj3s6oq46';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PaymentActionsDropdown } from './PaymentActionsDropdown';
import { PaymentDetailsModal } from './PaymentDetailsModal';
import { AssignOwnerModal } from './AssignOwnerModal';
import { LicenseDetailModal } from './LicenseDetailModal';

interface VenuePayment {
  id: number;
  city: string;
  type: string;
  address: string;
  operator: string;
  amountDue: number;
  dueDate: string;
  paymentMethod: string;
  licenseId: string;
  status: 'paid' | 'due_soon' | 'overdue';
  paymentInfo: string;
}

const mockPayments: VenuePayment[] = [
  {
    id: 1,
    city: 'Bellevue',
    type: 'Headquarters Campus',
    address: 'Tel Tech Campus, 12920 SE 38th St',
    operator: 'Tel Tech Corporation',
    amountDue: 5850000,
    dueDate: '2025-03-31',
    paymentMethod: 'Quarterly Wire Transfer',
    licenseId: 'HQ-2022-001',
    status: 'due_soon',
    paymentInfo: 'Quarterly Campus Payment'
  },
  {
    id: 2,
    city: 'Atlanta',
    type: 'Regional Hub',
    address: 'Tel Tech Regional Center, 3424 Peachtree Rd NE',
    operator: 'Tel Tech Corporation',
    amountDue: 2055000,
    dueDate: '2025-02-01',
    paymentMethod: 'Monthly ACH Auto-Pay',
    licenseId: 'REG-2022-045',
    status: 'overdue',
    paymentInfo: 'Monthly Regional Hub Payment'
  },
  {
    id: 3,
    city: 'New York',
    type: 'Engineering Center',
    address: 'Tel Tech NYC, 101 Avenue of the Americas',
    operator: 'Tel Tech Corporation',
    amountDue: 1455000,
    dueDate: '2025-01-15',
    paymentMethod: 'Monthly Auto-Pay',
    licenseId: 'ENG-2023-012',
    status: 'paid',
    paymentInfo: 'Monthly Engineering Center Payment'
  },
  {
    id: 4,
    city: 'Seattle',
    type: 'Partnership Hub',
    address: 'Tel Tech Partnership Center, 15010 NE 36th St',
    operator: 'Tel Tech Corporation',
    amountDue: 1194000,
    dueDate: '2025-02-28',
    paymentMethod: 'Quarterly Invoice',
    licenseId: 'PART-2023-008',
    status: 'due_soon',
    paymentInfo: 'Quarterly Partnership Payment'
  },
  {
    id: 5,
    city: 'London',
    type: 'Global Finance Center',
    address: 'Canary Wharf, Level 39, One Canada Square',
    operator: 'Level39 Financial District',
    amountDue: 2760000,
    dueDate: '2025-01-31',
    paymentMethod: 'Monthly Sterling Transfer',
    licenseId: 'FIN-2022-020',
    status: 'overdue',
    paymentInfo: 'Monthly Finance Center Payment'
  },
  {
    id: 6,
    city: 'Dallas',
    type: 'Innovation Lab',
    address: 'Deep Ellum Innovation District, 2600 Commerce St',
    operator: 'Dallas Innovation Alliance',
    amountDue: 1188000,
    dueDate: '2025-06-30',
    paymentMethod: 'Bi-Annual Transfer',
    licenseId: 'LAB-2023-034',
    status: 'paid',
    paymentInfo: 'Bi-Annual Lab Payment'
  },
  {
    id: 7,
    city: 'Toronto',
    type: 'North America Regional',
    address: 'Financial District, 181 Bay St, Suite 4400',
    operator: 'Brookfield Properties',
    amountDue: 890000,
    dueDate: '2025-02-15',
    paymentMethod: 'Monthly CAD Transfer',
    licenseId: 'NA-2023-067',
    status: 'due_soon',
    paymentInfo: 'Monthly Regional Payment'
  },
  {
    id: 8,
    city: 'Dublin',
    type: 'EMEA Headquarters',
    address: 'Dublin Financial Centre, Custom House Quay',
    operator: 'IFSC Development Authority',
    amountDue: 1650000,
    dueDate: '2025-03-15',
    paymentMethod: 'Monthly EUR Transfer',
    licenseId: 'EMEA-2023-089',
    status: 'due_soon',
    paymentInfo: 'Monthly EMEA HQ Payment'
  }
];

interface PaymentManagementProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function PaymentManagement({
  onAIAssistantOpen = () => {},
  isAIDrawerOpen = false
}: PaymentManagementProps) {
  const [payments] = useState<VenuePayment[]>(mockPayments);
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [termEndFilter, setTermEndFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<VenuePayment | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesCity = cityFilter === 'all' || payment.city.toLowerCase().includes(cityFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || payment.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesOperator = operatorFilter === 'all' || payment.operator.toLowerCase().includes(operatorFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesCity && matchesType && matchesOperator && matchesStatus;
  });

  // Calculate metrics
  const totalAmountDue = payments.reduce((sum, payment) => sum + payment.amountDue, 0);
  const totalPaidThisCycle = payments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amountDue, 0);
  const overduePayments = payments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amountDue, 0);

  // Pie chart data
  const paidCount = payments.filter(p => p.status === 'paid').length;
  const dueSoonCount = payments.filter(p => p.status === 'due_soon').length;
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  const pieChartData = [
    { name: 'Paid', value: paidCount, color: '#28A745' },
    { name: 'Due Soon', value: dueSoonCount + overdueCount, color: '#FFA500' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 border-0" 
            style={{ backgroundColor: '#28A745', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Paid
          </Badge>
        );
      case 'due_soon':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 border-0" 
            style={{ backgroundColor: '#FFA500', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Due Soon
          </Badge>
        );
      case 'overdue':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 border-0" 
            style={{ backgroundColor: '#DC3545', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 border-0" 
            style={{ backgroundColor: '#6B7280', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
          >
            Unknown
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Payment action handlers
  const handleViewDetails = (payment: VenuePayment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  const handleAssignUser = (payment: VenuePayment) => {
    setSelectedPayment(payment);
    setShowAssignModal(true);
  };

  const handleInitiatePayment = (payment: VenuePayment) => {
    // Navigate to License Details modal for payment initiation
    setSelectedPayment(payment);
    setShowLicenseModal(true);
  };

  const handleAssignOwner = (email: string) => {
    console.log('Assigned payment to:', email);
    // In a real app, this would update the payment assignment
  };

  const handlePaymentInitiation = (paymentData: { paymentMethod: string; paidBy: string }) => {
    console.log('Payment initiated:', paymentData);
    // In a real app, this would process the payment
    // For now, we'll just close the modal and potentially update the payment status
  };

  const handleCloseLicenseModal = () => {
    setShowLicenseModal(false);
    setSelectedPayment(null);
  };

  const handleSaveLicense = (licenseData: any) => {
    console.log('License data saved:', licenseData);
    handleCloseLicenseModal();
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Blue Header */}
      <div 
        className="px-6 py-8"
        style={{ backgroundColor: '#005B94', color: '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-6 w-6" />
                <h1 
                  style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#FFFFFF', lineHeight: '1.2' }}
                >
                  Venue Payments
                </h1>
              </div>
              <p 
                style={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.5' }}
              >
                View and manage all upcoming workspace payment obligations in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Card 
          className="bg-white border-0 shadow-card"
          style={{ borderRadius: '12px' }}
        >
          <CardContent className="p-6">
            {/* Summary Cards Section */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Amount Due */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border-0 shadow-card p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted text-xs font-medium uppercase tracking-wide mb-2">
                          Total Amount Due
                        </p>
                        <div className="text-2xl font-bold text-foreground leading-none mb-1">
                          {formatCurrency(totalAmountDue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Across all venues
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Paid (This Cycle) */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border-0 shadow-card p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted text-xs font-medium uppercase tracking-wide mb-2">
                          Total Paid
                        </p>
                        <div className="text-2xl font-bold text-foreground leading-none mb-1">
                          {formatCurrency(totalPaidThisCycle)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This billing cycle
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overdue Payments */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border-0 shadow-card p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-destructive rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted text-xs font-medium uppercase tracking-wide mb-2">
                          Overdue Payments
                        </p>
                        <div className="text-2xl font-bold text-foreground leading-none mb-1">
                          {formatCurrency(overduePayments)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Requires immediate attention
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl border-0 shadow-card p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted text-xs font-medium uppercase tracking-wide mb-3">
                          Payment Status
                        </p>
                        
                        {/* Pie Chart and Legend */}
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieChartData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={0}
                                  outerRadius={32}
                                  paddingAngle={2}
                                  dataKey="value"
                                  stroke="#ffffff"
                                  strokeWidth={2}
                                >
                                  {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                              <span className="text-xs text-foreground font-medium">
                                {paidCount} Paid
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
                              <span className="text-xs text-foreground font-medium">
                                {dueSoonCount + overdueCount} Due
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      <SelectItem value="seattle">Seattle</SelectItem>
                      <SelectItem value="austin">Austin</SelectItem>
                      <SelectItem value="newyork">New York</SelectItem>
                      <SelectItem value="sanfrancisco">San Francisco</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                      <SelectItem value="denver">Denver</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="flex">Flex (Hourly)</SelectItem>
                      <SelectItem value="dedicated-external">Dedicated (External)</SelectItem>
                      <SelectItem value="dedicated-liquidspace">Dedicated (LiquidSpace)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={operatorFilter} onValueChange={setOperatorFilter}>
                    <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Operators</SelectItem>
                      <SelectItem value="wework">WeWork</SelectItem>
                      <SelectItem value="regus">Regus</SelectItem>
                      <SelectItem value="spaces">Spaces</SelectItem>
                      <SelectItem value="cloudflare">Cloudflare Office</SelectItem>
                      <SelectItem value="ifs">IFS Workspace</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={termEndFilter} onValueChange={setTermEndFilter}>
                    <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue placeholder="Term End" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Terms</SelectItem>
                      <SelectItem value="30days">30 days</SelectItem>
                      <SelectItem value="90days">90 days</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="due_soon">Due Soon</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="text-white px-4 py-2 rounded-md h-9 flex items-center gap-2"
                  style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                >
                  <Download className="h-4 w-4" />
                  Export Invoices
                </Button>
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow 
                    className="border-b"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      City
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Type
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Address
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Operator
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Amount Due
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Due Date
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Payment Method
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      License ID
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Status
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Payment Info
                    </TableHead>
                    <TableHead 
                      className="text-left py-3 px-4"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment, index) => (
                    <TableRow 
                      key={payment.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {payment.city}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {payment.type}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {payment.address}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {payment.operator}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {formatCurrency(payment.amountDue)}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {formatDate(payment.dueDate)}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {payment.paymentMethod}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {payment.licenseId}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell 
                        className="py-4 px-4"
                        style={{ fontSize: '14px', fontWeight: 400, color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
                      >
                        {payment.paymentInfo}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <PaymentActionsDropdown
                          payment={payment}
                          onViewDetails={handleViewDetails}
                          onAssignUser={handleAssignUser}
                          onInitiatePayment={handleInitiatePayment}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Details Modal */}
      <PaymentDetailsModal
        isOpen={showPaymentDetails}
        onClose={() => {
          setShowPaymentDetails(false);
          setSelectedPayment(null);
        }}
        onInitiatePayment={handlePaymentInitiation}
        payment={selectedPayment}
      />

      {/* Assign Owner Modal */}
      <AssignOwnerModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedPayment(null);
        }}
        onAssign={handleAssignOwner}
        taskName={
          selectedPayment 
            ? `Payment for ${selectedPayment.address}`
            : undefined
        }
      />

      {/* License Detail Modal for Payment Initiation */}
      <LicenseDetailModal
        isOpen={showLicenseModal}
        onClose={handleCloseLicenseModal}
        onSave={handleSaveLicense}
        licenseData={selectedPayment ? {
          id: selectedPayment.id,
          city: selectedPayment.city,
          type: selectedPayment.type,
          address: selectedPayment.address,
          operator: selectedPayment.operator,
          status: selectedPayment.status === 'paid' ? 'Active' : 'Payment Due',
          cost: selectedPayment.amountDue,
          startDate: '2024-01-01',
          endDate: selectedPayment.dueDate,
          name: `${selectedPayment.city} - ${selectedPayment.type}`,
          property: selectedPayment.operator,
          location: selectedPayment.city,
          monthlyRent: selectedPayment.amountDue,
          squareFootage: 5000,
          renewalStatus: 'Active'
        } : null}
      />
    </div>
  );
}