import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  X, 
  Upload,
  FileText,
  Calendar,
  CreditCard,
  Building2,
  MapPin,
  DollarSign,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Users,
  Home,
  Star,
  Wifi,
  Car,
  Coffee,
  Briefcase,
  Monitor,
  Bell
} from 'lucide-react';

export function ModalsShowcase() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Monitor className="h-8 w-8" />
            <div>
              <h1 className="text-heading-1" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                Modal Components Reference
              </h1>
              <p className="text-primary-foreground/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                Static visual reference for all modal dialogs and their states
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-12">
          
          {/* Introduction */}
          <Card className="bg-white rounded-xl shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-heading-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Modal Dialog Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                This page showcases all modal components used throughout the LiquidSpace Workplace Manager. 
                Each modal is displayed in its open state with different variations and states shown separately.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary" style={{ fontFamily: 'Inter, sans-serif' }}>
                    8
                  </div>
                  <div className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Modal Types
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-accent-green" style={{ fontFamily: 'Inter, sans-serif' }}>
                    15
                  </div>
                  <div className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Modal States
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-accent-orange" style={{ fontFamily: 'Inter, sans-serif' }}>
                    6
                  </div>
                  <div className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Form Modals
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Detail Modal - Full Scale */}
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                License Details Modal - Full Scale
              </h2>
              <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                Complete license management interface across all four tabs
              </p>
            </div>

            {/* Overview Tab */}
            <Card className="bg-white rounded-xl shadow-card border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <FileText className="h-5 w-5 text-primary" />
                    License Details - Overview Tab
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">LicenseDetailModal - Overview</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-border rounded-xl shadow-lg max-w-5xl mx-auto">
                  {/* Modal Header - Blue Background */}
                  <div className="bg-primary px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Details
                        </h2>
                        <p className="text-primary-foreground/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Last updated Aug 16 by jli@liquidtech.com
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-accent-green text-white px-3 py-1 text-sm font-medium">
                          Active
                        </Badge>
                        <button className="p-2 hover:bg-primary-dark rounded-lg transition-colors">
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-white px-6 border-b border-border">
                    <div className="flex gap-8">
                      <button className="px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg -mb-px" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Overview
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Timeline
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Payments
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Documents
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-8">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            License Name
                          </label>
                          <Input 
                            value="Hays Office Park - Suite 420"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Vendor/Provider
                          </label>
                          <Input 
                            value="Hays Office Properties"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            City
                          </label>
                          <Input 
                            value="Minneapolis"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Workplace Type
                          </label>
                          <Input 
                            value="Dedicated License"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Status
                          </label>
                          <Input 
                            value="Active"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            License Owner
                          </label>
                          <Input 
                            value="Jennifer Li"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Financial Information
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Monthly Cost ($)
                          </label>
                          <Input 
                            value="7,200"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Annualized Cost ($)
                          </label>
                          <Input 
                            value="86,400"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Security Deposit ($)
                          </label>
                          <Input 
                            value="14,400"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Contract Details
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Contract Type
                          </label>
                          <Input 
                            value="Fixed Term License"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Renewal Option
                          </label>
                          <Input 
                            value="Auto-Renewal with 30-day notice"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Term Start
                          </label>
                          <Input 
                            value="2024-01-31"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Term End
                          </label>
                          <Input 
                            value="2025-02-01"
                            readOnly
                            className="bg-muted border-border"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                    <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Cancel
                    </Button>
                    <Button className="bg-primary text-primary-foreground font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Tab */}
            <Card className="bg-white rounded-xl shadow-card border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Clock className="h-5 w-5 text-primary" />
                    License Details - Timeline Tab
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">LicenseDetailModal - Timeline</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-border rounded-xl shadow-lg max-w-5xl mx-auto">
                  {/* Modal Header - Blue Background */}
                  <div className="bg-primary px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Details
                        </h2>
                        <p className="text-primary-foreground/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Last updated Aug 16 by jli@liquidtech.com
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-accent-green text-white px-3 py-1 text-sm font-medium">
                          Active
                        </Badge>
                        <button className="p-2 hover:bg-primary-dark rounded-lg transition-colors">
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-white px-6 border-b border-border">
                    <div className="flex gap-8">
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Overview
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg -mb-px" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Timeline
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Payments
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Documents
                      </button>
                    </div>
                  </div>

                  {/* Timeline Content */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Timeline Entry */}
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-accent-green rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              License Activated
                            </h4>
                            <span className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Jan 31, 2024
                            </span>
                          </div>
                          <p className="text-muted text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            License agreement signed and activated by Jennifer Li
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              First Payment Processed
                            </h4>
                            <span className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 1, 2024
                            </span>
                          </div>
                          <p className="text-muted text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Monthly payment of $7,200 processed successfully
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-accent-orange rounded-full flex items-center justify-center">
                          <Bell className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Renewal Reminder Set
                            </h4>
                            <span className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Aug 15, 2024
                            </span>
                          </div>
                          <p className="text-muted text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            90-day renewal reminder scheduled for Nov 1, 2024
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Contract Expiration
                            </h4>
                            <span className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Feb 1, 2025
                            </span>
                          </div>
                          <p className="text-muted text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            License expires - renewal decision required
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                    <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payments Tab */}
            <Card className="bg-white rounded-xl shadow-card border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <CreditCard className="h-5 w-5 text-primary" />
                    License Details - Payments Tab
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">LicenseDetailModal - Payments</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-border rounded-xl shadow-lg max-w-5xl mx-auto">
                  {/* Modal Header - Blue Background */}
                  <div className="bg-primary px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Details
                        </h2>
                        <p className="text-primary-foreground/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Last updated Aug 16 by jli@liquidtech.com
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-accent-green text-white px-3 py-1 text-sm font-medium">
                          Active
                        </Badge>
                        <button className="p-2 hover:bg-primary-dark rounded-lg transition-colors">
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-white px-6 border-b border-border">
                    <div className="flex gap-8">
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Overview
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Timeline
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg -mb-px" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Payments
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Documents
                      </button>
                    </div>
                  </div>

                  {/* Payments Content */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Payment Summary */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium text-sm text-muted mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Total Paid
                          </h4>
                          <p className="text-2xl font-bold text-accent-green" style={{ fontFamily: 'Inter, sans-serif' }}>
                            $50,400
                          </p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium text-sm text-muted mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Next Payment
                          </h4>
                          <p className="text-2xl font-bold text-accent-orange" style={{ fontFamily: 'Inter, sans-serif' }}>
                            $7,200
                          </p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium text-sm text-muted mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Due Date
                          </h4>
                          <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Feb 1
                          </p>
                        </div>
                      </div>

                      {/* Payment History Table */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Payment History
                        </h3>
                        <div className="border border-border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted">
                              <tr>
                                <th className="text-table-header text-left py-3 px-4">Date</th>
                                <th className="text-table-header text-left py-3 px-4">Amount</th>
                                <th className="text-table-header text-left py-3 px-4">Status</th>
                                <th className="text-table-header text-left py-3 px-4">Method</th>
                                <th className="text-table-header text-left py-3 px-4">Reference</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4 text-body">Jan 1, 2025</td>
                                <td className="py-3 px-4 text-body font-medium">$7,200</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-accent-green text-white text-xs">Paid</Badge>
                                </td>
                                <td className="py-3 px-4 text-body">Bank Transfer</td>
                                <td className="py-3 px-4 text-body font-mono text-sm">TXN-240101-001</td>
                              </tr>
                              <tr className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4 text-body">Dec 1, 2024</td>
                                <td className="py-3 px-4 text-body font-medium">$7,200</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-accent-green text-white text-xs">Paid</Badge>
                                </td>
                                <td className="py-3 px-4 text-body">Bank Transfer</td>
                                <td className="py-3 px-4 text-body font-mono text-sm">TXN-241201-001</td>
                              </tr>
                              <tr className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4 text-body">Nov 1, 2024</td>
                                <td className="py-3 px-4 text-body font-medium">$7,200</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-accent-green text-white text-xs">Paid</Badge>
                                </td>
                                <td className="py-3 px-4 text-body">Bank Transfer</td>
                                <td className="py-3 px-4 text-body font-mono text-sm">TXN-241101-001</td>
                              </tr>
                              <tr className="hover:bg-muted/50">
                                <td className="py-3 px-4 text-body">Feb 1, 2025</td>
                                <td className="py-3 px-4 text-body font-medium">$7,200</td>
                                <td className="py-3 px-4">
                                  <Badge className="bg-accent-orange text-white text-xs">Due Soon</Badge>
                                </td>
                                <td className="py-3 px-4 text-muted">-</td>
                                <td className="py-3 px-4 text-muted">-</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                    <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Export History
                    </Button>
                    <Button className="bg-accent-green text-white font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Tab */}
            <Card className="bg-white rounded-xl shadow-card border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <FileText className="h-5 w-5 text-primary" />
                    License Details - Documents Tab
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">LicenseDetailModal - Documents</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white border border-border rounded-xl shadow-lg max-w-5xl mx-auto">
                  {/* Modal Header - Blue Background */}
                  <div className="bg-primary px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Details
                        </h2>
                        <p className="text-primary-foreground/80 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Last updated Aug 16 by jli@liquidtech.com
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-accent-green text-white px-3 py-1 text-sm font-medium">
                          Active
                        </Badge>
                        <button className="p-2 hover:bg-primary-dark rounded-lg transition-colors">
                          <X className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="bg-white px-6 border-b border-border">
                    <div className="flex gap-8">
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Overview
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Timeline
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-muted hover:text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Payments
                      </button>
                      <button className="px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg -mb-px" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Documents
                      </button>
                    </div>
                  </div>

                  {/* Documents Content */}
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-muted mx-auto mb-4" />
                        <h4 className="text-lg font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Upload Documents
                        </h4>
                        <p className="text-muted text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Drag and drop files here, or click to browse
                        </p>
                        <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Choose Files
                        </Button>
                      </div>

                      {/* Document List */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Associated Documents
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  License Agreement - Hays Office Park.pdf
                                </h4>
                                <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  2.4 MB • Uploaded Jan 31, 2024
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Floor Plan - Suite 420.pdf
                                </h4>
                                <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  1.8 MB • Uploaded Feb 1, 2024
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <h4 className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Insurance Certificate.pdf
                                </h4>
                                <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  956 KB • Uploaded Feb 15, 2024
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
                    <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Payment Details Modal Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Payment Details Modal
              </h2>
              <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                Payment information display and processing interface
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Payment Details - Due State */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Due State
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">PaymentDetailsModal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-xl shadow-lg p-6 max-w-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-accent-orange" />
                        <div>
                          <h3 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Payment Details
                          </h3>
                          <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            New York • Monthly Rent
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Status and Amount */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-accent-orange" />
                        <div>
                          <Badge className="bg-accent-orange text-white mb-2">Due Soon</Badge>
                          <p className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Due February 15, 2025
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                          $25,000.00
                        </p>
                        <p className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Amount Due
                        </p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Property Address
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted" />
                            <p className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>
                              123 Manhattan Plaza, Floor 15
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Operator
                          </label>
                          <p className="text-body mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Manhattan Workspace Solutions
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            License ID
                          </label>
                          <p className="text-body mt-1 font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                            LIC-2024-001
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Payment Method
                          </label>
                          <div className="mt-1">
                            <Select value="">
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="corporate-card">Corporate Credit Card</SelectItem>
                                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                <SelectItem value="check">Company Check</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Paid By
                        </label>
                        <div className="mt-1">
                          <Select value="">
                            <SelectTrigger>
                              <SelectValue placeholder="Select responsible person" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jennifer-li">Jennifer Li</SelectItem>
                              <SelectItem value="michael-chen">Michael Chen</SelectItem>
                              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                      <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </Button>
                      <Button className="bg-accent-green text-white font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Initiate Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details - Paid State */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <CheckCircle className="h-5 w-5 text-accent-green" />
                      Payment Completed State
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">PaymentDetailsModal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-xl shadow-lg p-6 max-w-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-accent-green" />
                        <div>
                          <h3 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Payment Completed
                          </h3>
                          <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Chicago • Monthly Rent
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Status and Amount */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-accent-green/10 rounded-lg border border-accent-green/20">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent-green" />
                        <div>
                          <Badge className="bg-accent-green text-white mb-2">Paid</Badge>
                          <p className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Paid on January 10, 2025
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                          $18,500.00
                        </p>
                        <p className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Amount Paid
                        </p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Payment Method
                          </label>
                          <p className="text-body mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Corporate Credit Card
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Paid By
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-4 w-4 text-muted" />
                            <p className="text-body" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Jennifer Li
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Transaction ID
                          </label>
                          <p className="text-body mt-1 font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                            TXN-20250110-4829
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Confirmation
                          </label>
                          <p className="text-body mt-1 font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                            CONF-891247
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                      <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>
                      <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Upload License Modal Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Upload License Modal
              </h2>
              <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                File upload interface with form fields and progress states
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Upload License - Initial State */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Upload className="h-5 w-5 text-primary" />
                      Upload License - Initial
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">UploadLicenseModal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-xl shadow-lg p-6 max-w-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Upload className="h-6 w-6 text-primary" />
                        <div>
                          <h3 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Upload New License
                          </h3>
                          <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Add a new workplace license to your portfolio
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6">
                      <Upload className="h-12 w-12 text-muted mx-auto mb-4" />
                      <h4 className="text-lg font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Upload License Document
                      </h4>
                      <p className="text-muted text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Drag and drop your file here, or click to browse
                      </p>
                      <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Choose File
                      </Button>
                      <p className="text-xs text-muted mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Supported formats: PDF, DOC, DOCX (Max 10MB)
                      </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Name
                        </Label>
                        <Input 
                          placeholder="Enter license name"
                          readOnly
                          className="mt-1"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Property Name
                          </Label>
                          <Input 
                            placeholder="Property name"
                            readOnly
                            className="mt-1"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Location
                          </Label>
                          <Input 
                            placeholder="City, State"
                            readOnly
                            className="mt-1"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Start Date
                          </Label>
                          <Input 
                            type="date"
                            readOnly
                            className="mt-1"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                            End Date
                          </Label>
                          <Input 
                            type="date"
                            readOnly
                            className="mt-1"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          License Type
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select license type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dedicated">Dedicated License</SelectItem>
                            <SelectItem value="flexible">Flexible License</SelectItem>
                            <SelectItem value="hot-desk">Hot Desk License</SelectItem>
                            <SelectItem value="meeting-room">Meeting Room License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                      <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Cancel
                      </Button>
                      <Button className="bg-primary text-primary-foreground font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload License
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upload License - Progress State */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Clock className="h-5 w-5 text-accent-orange" />
                      Upload License - Progress
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">UploadLicenseModal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-xl shadow-lg p-6 max-w-2xl">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-accent-orange" />
                        <div>
                          <h3 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Uploading License
                          </h3>
                          <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Please wait while we process your file
                          </p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Progress Section */}
                    <div className="border border-border rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                            chicago-office-license.pdf
                          </p>
                          <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            2.4 MB • Uploading...
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span style={{ fontFamily: 'Inter, sans-serif' }}>Upload Progress</span>
                          <span style={{ fontFamily: 'Inter, sans-serif' }}>73%</span>
                        </div>
                        <Progress value={73} className="h-2" />
                      </div>
                    </div>

                    {/* Processing Steps */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent-green" />
                        <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          File validation complete
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-accent-green" />
                        <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Document analysis in progress
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted animate-spin" />
                        <span className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Extracting license details...
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full border-2 border-muted"></div>
                        <span className="text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Creating license record
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                      <Button variant="outline" className="font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Cancel Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Additional Modals Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Additional Modals
              </h2>
              <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                Other modal dialogs used throughout the application
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              
              {/* Assign Owner Modal */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Users className="h-5 w-5 text-primary" />
                      Assign Owner
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">AssignOwnerModal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-xl shadow-lg p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Assign Owner
                        </h3>
                      </div>
                      <button className="p-1 hover:bg-muted rounded">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-muted text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Select a team member to assign ownership of this license
                    </p>

                    {/* User Selection */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 p-3 border border-primary rounded-lg bg-primary/5">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">JL</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Jennifer Li
                          </p>
                          <p className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Real Estate Manager
                          </p>
                        </div>
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                      </div>

                      <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">MC</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Michael Chen
                          </p>
                          <p className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Facilities Director
                          </p>
                        </div>
                        <div className="w-4 h-4 border-2 border-border rounded-full"></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Cancel
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary">
                        Assign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Spaces Modal */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Building2 className="h-5 w-5 text-primary" />
                      Alternative Spaces
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">AlternativeSpacesModal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-xl shadow-lg p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Alternative Spaces
                        </h3>
                      </div>
                      <button className="p-1 hover:bg-muted rounded">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-muted text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Available alternatives in Chicago area
                    </p>

                    {/* Space Options */}
                    <div className="space-y-3 mb-4">
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              WeWork Chicago Loop
                            </h4>
                            <p className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              0.3 miles away
                            </p>
                          </div>
                          <Badge className="bg-accent-green text-white text-xs">Available</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>15 desks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Wifi className="h-3 w-3" />
                            <span>High-speed WiFi</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Coffee className="h-3 w-3" />
                            <span>Kitchen</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            $850/month per desk
                          </span>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Regus Financial District
                            </h4>
                            <p className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              0.7 miles away
                            </p>
                          </div>
                          <Badge className="bg-accent-orange text-white text-xs">Limited</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted mb-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>8 desks</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            <span>Parking</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            <span>Meeting rooms</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            $720/month per desk
                          </span>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Close
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary">
                        Contact Broker
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Funding Source Modal */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <DollarSign className="h-5 w-5 text-primary" />
                      Add Funding Source
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">FundingSourceModal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-xl shadow-lg p-6">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Add Funding Source
                        </h3>
                      </div>
                      <button className="p-1 hover:bg-muted rounded">
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-muted text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Configure a new funding source for workplace expenses
                    </p>

                    {/* Form Fields */}
                    <div className="space-y-4 mb-4">
                      <div>
                        <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Source Name
                        </Label>
                        <Input 
                          placeholder="e.g., Q1 Facilities Budget"
                          readOnly
                          className="mt-1"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Budget Amount
                        </Label>
                        <Input 
                          placeholder="$500,000"
                          readOnly
                          className="mt-1"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Department
                        </Label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facilities">Facilities</SelectItem>
                            <SelectItem value="hr">Human Resources</SelectItem>
                            <SelectItem value="operations">Operations</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Cost Center
                        </Label>
                        <Input 
                          placeholder="CC-2024-FAC-001"
                          readOnly
                          className="mt-1"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Cancel
                      </Button>
                      <Button size="sm" className="flex-1 bg-primary">
                        Add Source
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Design Guidelines Section */}
          <Card className="bg-white rounded-xl shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-heading-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Modal Design Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Layout Properties
                  </h3>
                  <ul className="space-y-2 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Max Width: 600px (standard), 800px (large)</li>
                    <li>• Padding: 24px internal padding</li>
                    <li>• Border Radius: 12px</li>
                    <li>• Shadow: Elevated shadow for depth</li>
                    <li>• Background: White (#FFFFFF)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Header Design
                  </h3>
                  <ul className="space-y-2 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Title: Inter Semibold, 20px</li>
                    <li>• Icon: 24px, primary color</li>
                    <li>• Close button: 16px icon, hover state</li>
                    <li>• Subtitle: 14px, muted color</li>
                    <li>• Bottom border: Light gray separator</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Action Buttons
                  </h3>
                  <ul className="space-y-2 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Primary: Blue background, white text</li>
                    <li>• Secondary: Outline style, gray border</li>
                    <li>• Destructive: Red background for danger</li>
                    <li>• Spacing: 12px gap between buttons</li>
                    <li>• Alignment: Right-aligned in footer</li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Modal States & Interactions
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>Implementation Notes:</strong> All modals use consistent backdrop overlay (rgba(0,0,0,0.5)), 
                    center positioning, and keyboard accessibility (ESC to close). Form modals include validation states 
                    and loading indicators for async operations. File upload modals show progress indicators and support 
                    drag-and-drop interactions.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Content Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Form Modals</h4>
                    <ul className="space-y-1 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <li>• Clear field labels and validation</li>
                      <li>• Logical tab order for accessibility</li>
                      <li>• Required field indicators (*)</li>
                      <li>• Inline error messages</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Information Modals</h4>
                    <ul className="space-y-1 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <li>• Scannable content layout</li>
                      <li>• Status badges for quick reference</li>
                      <li>• Tabbed interface for complex data</li>
                      <li>• Action buttons grouped logically</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}