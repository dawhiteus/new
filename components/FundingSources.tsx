import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { MoreHorizontal, Plus, CreditCard, Building, DollarSign, Edit, Trash2, Wallet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { FundingSourceModal } from './FundingSourceModal';

interface FundingSource {
  id: string;
  name: string;
  type: 'Direct Billing' | 'Corporate Card' | 'Budget Allocation' | 'Purchase Order' | 'Marketplace Account';
  status: 'Active' | 'Inactive' | 'Pending';
  associatedLicenses: number;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType?: string;
}

interface FundingSourceFormData {
  name: string;
  type: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
}

const mockFundingSources: FundingSource[] = [
  {
    id: '1',
    name: 'Dallas Expansion 1',
    type: 'Direct Billing',
    status: 'Active',
    associatedLicenses: 3,
    bankName: 'Bank of America',
    accountNumber: '5483980',
    routingNumber: '5483980',
    accountType: 'Business Checking'
  },
  {
    id: '2',
    name: 'Seattle Operations',
    type: 'Corporate Card',
    status: 'Active',
    associatedLicenses: 7,
    bankName: 'Chase Bank',
    accountNumber: '7829456',
    routingNumber: '7829456',
    accountType: 'Business Checking'
  },
  {
    id: '3',
    name: 'Chicago Remote Hub',
    type: 'Budget Allocation',
    status: 'Active',
    associatedLicenses: 12,
    bankName: 'Wells Fargo',
    accountNumber: '3847291',
    routingNumber: '3847291',
    accountType: 'Business Savings'
  },
  {
    id: '4',
    name: 'London Office Setup',
    type: 'Purchase Order',
    status: 'Pending',
    associatedLicenses: 5,
    bankName: 'Citibank',
    accountNumber: '9274638',
    routingNumber: '9274638',
    accountType: 'Business Checking'
  },
  {
    id: '5',
    name: 'Legacy NYC Account',
    type: 'Direct Billing',
    status: 'Inactive',
    associatedLicenses: 0,
    bankName: 'TD Bank',
    accountNumber: '1847395',
    routingNumber: '1847395',
    accountType: 'Business Checking'
  }
];

interface FundingSourcesProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

export function FundingSources({
  onAIAssistantOpen = () => {},
  isAIDrawerOpen = false
}: FundingSourcesProps) {
  const [fundingSources, setFundingSources] = useState<FundingSource[]>(mockFundingSources);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<FundingSource | null>(null);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600 text-white';
      case 'Pending':
        return 'bg-orange-500 text-white';
      case 'Inactive':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Corporate Card':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'Budget Allocation':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'Purchase Order':
        return <Building className="w-4 h-4 text-purple-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleAddFundingSource = () => {
    setEditingSource(null);
    setIsModalOpen(true);
  };

  const handleEditFundingSource = (source: FundingSource) => {
    setEditingSource(source);
    setIsModalOpen(true);
  };

  const handleDeleteFundingSource = (sourceId: string) => {
    setFundingSources(prev => prev.filter(source => source.id !== sourceId));
  };

  const handleSaveFundingSource = (formData: FundingSourceFormData) => {
    if (editingSource) {
      // Update existing source
      setFundingSources(prev => prev.map(source => 
        source.id === editingSource.id 
          ? {
              ...source,
              name: formData.name,
              type: formData.type as FundingSource['type'],
              bankName: formData.bankName,
              accountNumber: formData.accountNumber,
              routingNumber: formData.routingNumber,
              accountType: formData.accountType,
            }
          : source
      ));
    } else {
      // Add new source
      const newSource: FundingSource = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type as FundingSource['type'],
        status: 'Active',
        associatedLicenses: 0,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        routingNumber: formData.routingNumber,
        accountType: formData.accountType,
      };
      setFundingSources(prev => [...prev, newSource]);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <PageHeader
        icon={<Wallet className="h-6 w-6" />}
        title="Funding Sources"
        subtitle="Manage the funding sources used to pay for workspace licenses."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
      >
        <Button 
          onClick={handleAddFundingSource}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Funding Source
        </Button>
      </PageHeader>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <Card 
          className="bg-white border-0 shadow-card"
          style={{ borderRadius: '12px' }}
        >
          <CardContent className="p-0">
            {/* Funding Sources Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow 
                    className="border-b bg-gray-50"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <TableHead 
                      className="text-left py-4 px-6"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Funding Source Name
                    </TableHead>
                    <TableHead 
                      className="text-left py-4 px-6"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Type
                    </TableHead>
                    <TableHead 
                      className="text-left py-4 px-6"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Status
                    </TableHead>
                    <TableHead 
                      className="text-left py-4 px-6"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Associated Licenses
                    </TableHead>
                    <TableHead 
                      className="text-left py-4 px-6"
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fundingSources.map((source, index) => (
                    <TableRow 
                      key={source.id}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index % 2 === 1 ? 'bg-gray-25' : ''
                      }`}
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      <TableCell 
                        className="py-4 px-6"
                        style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {source.name}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(source.type)}
                          <span 
                            style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                          >
                            {source.type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge 
                          className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadgeStyle(source.status)}`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {source.status}
                        </Badge>
                      </TableCell>
                      <TableCell 
                        className="py-4 px-6"
                        style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                      >
                        {source.associatedLicenses} Licenses
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                              <MoreHorizontal className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => handleEditFundingSource(source)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFundingSource(source.id)}
                              className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Empty State for No Funding Sources */}
            {fundingSources.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 
                  className="mb-2"
                  style={{ fontSize: '22px', fontWeight: 600, fontFamily: 'Inter, sans-serif', color: '#374151' }}
                >
                  No Funding Sources
                </h3>
                <p 
                  className="mb-4"
                  style={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Inter, sans-serif', color: '#6B7280' }}
                >
                  Set up your first funding source to manage workspace license payments.
                </p>
                <Button 
                  onClick={handleAddFundingSource}
                  className="bg-primary hover:bg-primary-dark text-primary-foreground"
                  style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif', backgroundColor: '#005B94' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funding Source
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Funding Source Modal */}
      <FundingSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFundingSource}
        initialData={editingSource ? {
          name: editingSource.name,
          type: editingSource.type.toLowerCase().replace(' ', '-'),
          bankName: editingSource.bankName || '',
          accountNumber: editingSource.accountNumber || '',
          routingNumber: editingSource.routingNumber || '',
          accountType: editingSource.accountType?.toLowerCase().replace(' ', '-') || '',
        } : undefined}
        isEditing={!!editingSource}
      />
    </div>
  );
}