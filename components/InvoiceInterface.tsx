import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Search, Filter, Download, DollarSign, TrendingUp, Plus, FileText } from 'lucide-react';

const mockInvoices = [
  {
    id: 1,
    vendor: 'WeWork',
    linkedLicense: 'Tel Tech Hub Seattle',
    location: 'Seattle, WA',
    amount: 15000,
    dueDate: '2025-01-01',
    paymentStatus: 'paid',
    invoiceDate: '2024-12-01',
    invoiceNumber: 'WW-2024-1201',
    category: 'LiquidSpace',
  },
  {
    id: 2,
    vendor: 'Tel Tech Office',
    linkedLicense: 'Tel Tech Development Center',
    location: 'Austin, TX',
    amount: 9600,
    dueDate: '2025-01-15',
    paymentStatus: 'pending',
    invoiceDate: '2024-12-15',
    invoiceNumber: 'CF-2024-1215',
    category: 'External',
  },
  {
    id: 3,
    vendor: 'Tel Tech Workspace',
    linkedLicense: 'Tel Tech Financial Hub',
    location: 'New York, NY',
    amount: 42500,
    dueDate: '2024-12-31',
    paymentStatus: 'overdue',
    invoiceDate: '2024-11-30',
    invoiceNumber: 'TT-2024-1130',
    category: 'LiquidSpace',
  },
];

const forecastData = [
  { month: 'Jan', predicted: 287500 },
  { month: 'Feb', predicted: 292000 },
  { month: 'Mar', predicted: 298500 },
  { month: 'Apr', predicted: 285000 },
  { month: 'May', predicted: 290000 },
  { month: 'Jun', predicted: 295500 },
];

export function InvoiceInterface() {
  const [invoices] = useState(mockInvoices);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.linkedLicense.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#28A745' }}
          >
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#FFA500' }}
          >
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#dc3545' }}
          >
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#6B7280' }}
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

  const totalOutstanding = invoices.filter(i => i.paymentStatus !== 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter(i => i.paymentStatus === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = invoices.filter(i => i.paymentStatus === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Blue Header Section */}
      <div className="bg-primary text-primary-foreground px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6" />
                <h1 
                  className="text-white"
                  style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}
                >
                  Invoice Management
                </h1>
              </div>
              <p 
                className="text-primary-foreground/90" 
                style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}
              >
                Consolidated invoicing and financial reporting across your workspace portfolio
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-2"
                style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-2"
                style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" style={{ color: '#6b7280' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  {formatCurrency(totalOutstanding)}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Outstanding
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" style={{ color: '#28A745' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#28A745', fontFamily: 'Inter, sans-serif' }}>
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Paid
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" style={{ color: '#dc3545' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#dc3545', fontFamily: 'Inter, sans-serif' }}>
                  {formatCurrency(overdueAmount)}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Overdue
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" style={{ color: '#6b7280' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  {formatCurrency(287500)}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Forecast
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Forecasting */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <CardTitle 
              className="flex items-center gap-2" 
              style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1.3, color: '#374151', fontFamily: 'Inter, sans-serif' }}
            >
              <TrendingUp className="h-5 w-5" />
              Spend Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-6 gap-4">
              {forecastData.map((month, index) => (
                <div key={index} className="text-center p-4 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="mb-2" style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                    {month.month}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    {formatCurrency(month.predicted)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Table */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1.3, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Invoice Register
              </CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64 h-9 bg-white border rounded"
                    style={{ borderColor: '#e5e7eb', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8f9fa' }}>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Invoice #
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Vendor
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    License
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Amount
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Due Date
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice, index) => (
                  <TableRow 
                    key={invoice.id} 
                    className={`border-b transition-colors hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <TableCell className="py-4 px-6">
                      <span 
                        className="font-mono" 
                        style={{ fontSize: '14px', fontWeight: 400, color: '#374151', fontFamily: 'monospace' }}
                      >
                        {invoice.invoiceNumber}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <p style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {invoice.vendor}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif', marginBottom: '4px' }}>
                          {invoice.linkedLicense}
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                          {invoice.location}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <p style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {formatCurrency(invoice.amount)}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <p style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      {getStatusBadge(invoice.paymentStatus)}
                    </TableCell>
                    <TableCell className="py-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-3 rounded border hover:bg-gray-50"
                        style={{ borderColor: '#e5e7eb', color: '#374151', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}