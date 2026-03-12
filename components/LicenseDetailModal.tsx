import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { X, Calendar, Clock, CheckCircle, FileText } from 'lucide-react';

interface LicenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (licenseData: any) => void;
  licenseData: any;
}

export function LicenseDetailModal({ isOpen, onClose, onSave, licenseData }: LicenseDetailModalProps) {
  const [formData, setFormData] = useState({
    licenseName: licenseData?.licenseName || 'Hays Office Park - Suite 420',
    vendor: licenseData?.vendor || 'Hays Office Properties',
    city: licenseData?.city || 'Minneapolis',
    workplaceType: licenseData?.workplaceType || 'Dedicated License',
    monthlyCost: licenseData?.monthlyCost || '7,200',
    annualizedCost: licenseData?.annualizedCost || '86,400',
    contractType: licenseData?.contractType || 'Fixed Term License',
    termStart: licenseData?.termStart || '2024-01-31',
    termEnd: licenseData?.termEnd || '2025-02-01',
    renewalOption: licenseData?.renewalOption || 'Auto-Renewal with 30-day notice',
    terminationRights: licenseData?.terminationRights || 'Either party with 90-day notice',
    securityDeposit: licenseData?.securityDeposit || '14,400',
    primaryContact: licenseData?.primaryContact || 'Sarah Johnson',
    contactEmail: licenseData?.contactEmail || 'sarah@haysoffice.com',
    status: licenseData?.status || 'Active',
    owner: licenseData?.owner || 'Jennifer Li',
    notes: licenseData?.notes || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!max-w-[1600px] !w-[96vw] sm:!max-w-[1600px] md:!max-w-[1600px] lg:!max-w-[1600px] xl:!max-w-[1600px] h-[90vh] flex flex-col p-0 bg-white rounded-2xl shadow-xl"
        style={{ maxWidth: '1600px', width: '96vw' }}
      >
        <DialogDescription className="sr-only">
          License details command center with tabbed interface
        </DialogDescription>
        
        {/* Header with blue background */}
        <div className="bg-primary text-primary-foreground px-8 py-6 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-heading-1 font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>License Details</DialogTitle>
              <p className="text-primary-foreground/80 text-sm font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>Last updated Aug 15 by jli@techco.com</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                {licenseData?.status || 'Active'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClose()}
                className="text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-full bg-white flex-1 flex flex-col min-h-0">
          
          <Tabs defaultValue="overview" className="w-full flex-1 flex flex-col min-h-0">
            <div className="px-10 pt-8 pb-4 flex-shrink-0">
              <TabsList className="grid grid-cols-4 gap-2 bg-white border border-gray-200 rounded-lg p-1 h-12">
                <TabsTrigger 
                  value="overview"
                  className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white h-10"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="timeline"
                  className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white h-10"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Timeline
                </TabsTrigger>
                <TabsTrigger 
                  value="payments"
                  className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white h-10"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Payments
                </TabsTrigger>
                <TabsTrigger 
                  value="documents"
                  className="text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-white h-10"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Documents
                </TabsTrigger>
              </TabsList>
            </div>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="flex-1 overflow-y-auto px-10 pb-8">
              <div className="space-y-8">
                {/* Basic Information */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <h3 className="text-heading-2 text-foreground font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Name
                        </Label>
                        <Input
                          value={formData.licenseName}
                          onChange={(e) => handleInputChange('licenseName', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Vendor/Provider
                        </Label>
                        <Input
                          value={formData.vendor}
                          onChange={(e) => handleInputChange('vendor', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          City
                        </Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Workplace Type
                        </Label>
                        <Select value={formData.workplaceType} onValueChange={(value) => handleInputChange('workplaceType', value)}>
                          <SelectTrigger className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body h-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dedicated License" style={{ fontFamily: 'Inter, sans-serif' }}>Dedicated License</SelectItem>
                            <SelectItem value="Flexible License" style={{ fontFamily: 'Inter, sans-serif' }}>Flexible License</SelectItem>
                            <SelectItem value="Hot Desk License" style={{ fontFamily: 'Inter, sans-serif' }}>Hot Desk License</SelectItem>
                            <SelectItem value="Meeting Room License" style={{ fontFamily: 'Inter, sans-serif' }}>Meeting Room License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Status
                        </Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body h-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active" style={{ fontFamily: 'Inter, sans-serif' }}>Active</SelectItem>
                            <SelectItem value="Pending" style={{ fontFamily: 'Inter, sans-serif' }}>Pending</SelectItem>
                            <SelectItem value="Expired" style={{ fontFamily: 'Inter, sans-serif' }}>Expired</SelectItem>
                            <SelectItem value="Cancelled" style={{ fontFamily: 'Inter, sans-serif' }}>Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Owner
                        </Label>
                        <Input
                          value={formData.owner}
                          onChange={(e) => handleInputChange('owner', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Information */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <h3 className="text-heading-2 text-foreground font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Financial Information
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Monthly Cost ($)
                        </Label>
                        <Input
                          value={formData.monthlyCost}
                          onChange={(e) => handleInputChange('monthlyCost', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Annualized Cost ($)
                        </Label>
                        <Input
                          value={formData.annualizedCost}
                          onChange={(e) => handleInputChange('annualizedCost', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Security Deposit ($)
                        </Label>
                        <Input
                          value={formData.securityDeposit}
                          onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contract Details */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <h3 className="text-heading-2 text-foreground font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Contract Details
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Contract Type
                        </Label>
                        <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
                          <SelectTrigger className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body h-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fixed Term License" style={{ fontFamily: 'Inter, sans-serif' }}>Fixed Term License</SelectItem>
                            <SelectItem value="Month-to-Month License" style={{ fontFamily: 'Inter, sans-serif' }}>Month-to-Month License</SelectItem>
                            <SelectItem value="Annual License" style={{ fontFamily: 'Inter, sans-serif' }}>Annual License</SelectItem>
                            <SelectItem value="Multi-Year License" style={{ fontFamily: 'Inter, sans-serif' }}>Multi-Year License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Renewal Option
                        </Label>
                        <Select value={formData.renewalOption} onValueChange={(value) => handleInputChange('renewalOption', value)}>
                          <SelectTrigger className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body h-10" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Auto-Renewal with 30-day notice" style={{ fontFamily: 'Inter, sans-serif' }}>Auto-Renewal with 30-day notice</SelectItem>
                            <SelectItem value="Auto-Renewal with 60-day notice" style={{ fontFamily: 'Inter, sans-serif' }}>Auto-Renewal with 60-day notice</SelectItem>
                            <SelectItem value="Auto-Renewal with 90-day notice" style={{ fontFamily: 'Inter, sans-serif' }}>Auto-Renewal with 90-day notice</SelectItem>
                            <SelectItem value="Manual Renewal Required" style={{ fontFamily: 'Inter, sans-serif' }}>Manual Renewal Required</SelectItem>
                            <SelectItem value="No Renewal Option" style={{ fontFamily: 'Inter, sans-serif' }}>No Renewal Option</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Term Start Date
                        </Label>
                        <Input
                          type="date"
                          value={formData.termStart}
                          onChange={(e) => handleInputChange('termStart', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Term End Date
                        </Label>
                        <Input
                          type="date"
                          value={formData.termEnd}
                          onChange={(e) => handleInputChange('termEnd', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Termination Rights
                        </Label>
                        <Input
                          value={formData.terminationRights}
                          onChange={(e) => handleInputChange('terminationRights', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                          placeholder="e.g., Either party with 90-day notice"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <h3 className="text-heading-2 text-foreground font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Primary Contact Name
                        </Label>
                        <Input
                          value={formData.primaryContact}
                          onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Contact Email
                        </Label>
                        <Input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <h3 className="text-heading-2 text-foreground font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Notes & Comments
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-table-header text-primary font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Additional Notes
                      </Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="bg-input-background border-gray-300 focus:border-primary focus:ring-primary text-body min-h-[120px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                        placeholder="Add any additional notes or comments about this license..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TIMELINE TAB */}
            <TabsContent value="timeline" className="flex-1 overflow-y-auto px-10 pb-8">
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="h-6 w-6 text-primary" />
                    <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      License Lifecycle Timeline
                    </h3>
                  </div>
                  
                  {/* Timeline Container */}
                  <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {/* Timeline Events */}
                    <div className="space-y-6">
                      {/* 📘 License Lifecycle Milestones */}
                      
                      {/* License Created */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-primary rounded-full">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              License Created
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Dec 15, 2023
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            When the record was added to the system
                          </p>
                        </div>
                      </div>

                      {/* Contract Signed */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-green rounded-full">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Contract Signed
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Jan 1, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Date of execution by both parties
                          </p>
                        </div>
                      </div>
                      
                      {/* Term Start */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-teal rounded-full">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Term Start
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Jan 31, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Access or service begins
                          </p>
                        </div>
                      </div>
                      
                      {/* Payment Start */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-primary rounded-full">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Payment Start
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 1, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            First payment cycle begins
                          </p>
                        </div>
                      </div>

                      {/* 💸 Payment Milestones */}
                      
                      {/* First Payment Received */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-green rounded-full">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              First Payment Received
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 5, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Initial payment successfully processed
                          </p>
                        </div>
                      </div>

                      {/* 🔁 Key Operational Triggers */}
                      
                      {/* Mid-Term Review Scheduled */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-orange rounded-full">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Mid-Term Review Scheduled
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Aug 15, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Date set for assessing space utilization or value
                          </p>
                        </div>
                      </div>

                      {/* Most Recent Payment */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-green rounded-full">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Most Recent Payment
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Jan 1, 2025
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Latest monthly payment received
                          </p>
                        </div>
                      </div>

                      {/* Scenario Planning Started */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-teal rounded-full">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Scenario Planning Started
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Oct 1, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Initiation of scenario (renew, resize, relocate, terminate)
                          </p>
                        </div>
                      </div>

                      {/* ⏰ Notice & Renewal Events */}
                      
                      {/* Notice Deadline */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-orange rounded-full">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Notice Deadline
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Nov 3, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Last date to send notice to terminate or change
                          </p>
                        </div>
                      </div>

                      {/* Scenario Decision Finalized */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-green rounded-full">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Scenario Decision Finalized
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Nov 15, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Internal decision reached
                          </p>
                        </div>
                      </div>

                      {/* Auto-Renewal Trigger */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-primary rounded-full">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Auto-Renewal Trigger
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Dec 3, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Date auto-renew activates unless stopped
                          </p>
                        </div>
                      </div>

                      {/* Renewal Submitted */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-green rounded-full">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Renewal Submitted
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Dec 15, 2024
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Date renewal or renegotiation was officially initiated
                          </p>
                        </div>
                      </div>

                      {/* Term End */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-orange rounded-full">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Term End
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 1, 2025
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Scheduled license expiration
                          </p>
                        </div>
                      </div>

                      {/* Final Payment Due */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-orange rounded-full">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Final Payment Due
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 1, 2025
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Optional if license is ending
                          </p>
                        </div>
                      </div>

                      {/* 🧾 Post-Term Milestones */}

                      {/* Move-Out / Deactivation */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gray-400 rounded-full">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Move-Out / Deactivation
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 3, 2025
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Space access terminated and deactivation completed
                          </p>
                        </div>
                      </div>

                      {/* Security Deposit Returned */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-accent-green rounded-full">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Security Deposit Returned
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 15, 2025
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Security deposit processed and returned to client
                          </p>
                        </div>
                      </div>

                      {/* License Archived */}
                      <div className="relative flex items-start gap-6">
                        <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-gray-500 rounded-full">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                              License Archived
                            </h4>
                            <span className="text-muted font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 28, 2025
                            </span>
                          </div>
                          <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            License record archived and moved to historical data
                          </p>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PAYMENTS TAB */}
            <TabsContent value="payments" className="flex-1 overflow-y-auto px-10 pb-8">
              <div className="space-y-8">
                {/* Payment Summary */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Payment Summary
                      </h3>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-muted text-sm font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Total Paid</p>
                        <p className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>$86,400</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-muted text-sm font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Outstanding Balance</p>
                        <p className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>$0.00</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-muted text-sm font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Next Payment</p>
                        <p className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Feb 1, 2025</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-muted text-sm font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Payment Status</p>
                        <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                          Current
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment History */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <h3 className="text-heading-2 text-foreground font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Payment History
                    </h3>
                    <div className="overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-table-header font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Date
                            </th>
                            <th className="text-left py-3 px-4 text-table-header font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 text-table-header font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Method
                            </th>
                            <th className="text-left py-3 px-4 text-table-header font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Reference
                            </th>
                            <th className="text-left py-3 px-4 text-table-header font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Jan 1, 2025</td>
                            <td className="py-3 px-4 text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>$7,200.00</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>ACH Transfer</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>TXN-2025-001</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                                Completed
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Dec 1, 2024</td>
                            <td className="py-3 px-4 text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>$7,200.00</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>ACH Transfer</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>TXN-2024-012</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                                Completed
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Nov 1, 2024</td>
                            <td className="py-3 px-4 text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>$7,200.00</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>ACH Transfer</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>TXN-2024-011</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                                Completed
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Oct 1, 2024</td>
                            <td className="py-3 px-4 text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>$7,200.00</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>ACH Transfer</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>TXN-2024-010</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                                Completed
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Sep 1, 2024</td>
                            <td className="py-3 px-4 text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>$7,200.00</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>ACH Transfer</td>
                            <td className="py-3 px-4 text-body" style={{ fontFamily: 'Inter, sans-serif' }}>TXN-2024-009</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                                Completed
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Showing 5 of 12 payments
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-4 py-2 rounded-md"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        View All Payments
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Settings */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <h3 className="text-heading-2 text-foreground font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Payment Settings
                    </h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-table-header text-primary font-semibold mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Payment Method
                          </Label>
                          <p className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>ACH Transfer - Account ending in 4567</p>
                        </div>
                        <div>
                          <Label className="text-table-header text-primary font-semibold mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Billing Frequency
                          </Label>
                          <p className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Monthly - 1st of each month</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-table-header text-primary font-semibold mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Auto-Pay Status
                          </Label>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-accent-green text-white text-xs font-medium px-3 py-1 rounded-full">
                              Enabled
                            </Badge>
                            <span className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>Active since Jan 1, 2024</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-table-header text-primary font-semibold mb-2 block" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Billing Contact
                          </Label>
                          <p className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>finance@techco.com</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* DOCUMENTS TAB */}
            <TabsContent value="documents" className="flex-1 overflow-y-auto px-10 pb-8">
              <div className="space-y-8">
                {/* Upload Area */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-heading-2 text-foreground font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Upload Documents
                      </h3>
                      <p className="text-muted mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Drag and drop files here, or click to browse
                      </p>
                      <Button 
                        className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium text-sm px-6 py-2 rounded-md"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Choose Files
                      </Button>
                      <p className="text-muted text-xs mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Supports PDF, DOC, DOCX files up to 10MB
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Document Library */}
                <Card className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-primary" />
                        <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Document Library
                        </h3>
                      </div>
                      <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                        7 documents total
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {/* License Agreement */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Hays Office Park - License Agreement.pdf
                            </h4>
                            <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              2.4 MB • Uploaded Jan 1, 2024
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Download
                        </Button>
                      </div>

                      {/* Amendment */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent-orange/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-accent-orange" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Amendment 1 - Rate Adjustment.pdf
                            </h4>
                            <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              850 KB • Uploaded Jul 15, 2024
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Download
                        </Button>
                      </div>

                      {/* Insurance */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-accent-green" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Insurance Certificate 2024.pdf
                            </h4>
                            <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              1.2 MB • Uploaded Dec 1, 2023
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Download
                        </Button>
                      </div>

                      {/* Security Deposit */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-accent-teal" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Security Deposit Receipt.pdf
                            </h4>
                            <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              425 KB • Uploaded Jan 5, 2024
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Download
                        </Button>
                      </div>

                      {/* Floor Plan */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Suite 420 Floor Plan.pdf
                            </h4>
                            <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              3.1 MB • Uploaded Dec 20, 2023
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Download
                        </Button>
                      </div>

                      {/* Parking Agreement */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Parking Space Agreement.pdf
                            </h4>
                            <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              680 KB • Uploaded Jan 10, 2024
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Download
                        </Button>
                      </div>

                      {/* Building Rules */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="text-body font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Building Rules and Regulations.pdf
                            </h4>
                            <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              1.8 MB • Uploaded Dec 15, 2023
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-1 rounded-md"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action buttons */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-10 py-6">
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-white border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-6 py-2 rounded-md"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium text-sm px-6 py-2 rounded-md"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Save Changes
              </Button>
            </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}