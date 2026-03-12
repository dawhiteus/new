import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  MoreHorizontal,
  Eye,
  Edit3,
  Download,
  Trash2,
  UserPlus,
  DollarSign,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Share2,
  Settings,
  Filter,
  RefreshCw,
  Archive,
  Bell,
  Info,
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  Receipt,
  PieChart,
  Layers,
  Palette,
  Code,
  Boxes,
  Sparkles,
  TestTube,
  Building2,
  Users,
  LogOut,
  User,
  HelpCircle,
  ChevronDown,
  Search,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  ExternalLink,
  Clock,
  MapPin,
  Home,
  Menu
} from 'lucide-react';

export function MenuAssetsShowcase() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Menu className="h-8 w-8" />
            <div>
              <h1 className="text-heading-1" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                Menu Assets Reference
              </h1>
              <p className="text-primary-foreground/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                Static visual reference for all menu components and dropdowns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="space-y-12">
          
          {/* Action Dropdowns Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Table Action Dropdowns
              </h2>
              <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                Three-dot menu dropdowns used in table rows and cards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* License Actions Dropdown */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <FileText className="h-5 w-5 text-primary" />
                    License Actions
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">LicenseActionsDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Edit3 className="h-4 w-4" />
                      Edit License
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Download className="h-4 w-4" />
                      Download Contract
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <UserPlus className="h-4 w-4" />
                      Assign Owner
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Trash2 className="h-4 w-4" />
                      Delete License
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Actions Dropdown */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Actions
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">PaymentActionsDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-accent-green hover:bg-accent-green/10 rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <DollarSign className="h-4 w-4" />
                      Initiate Payment
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Download className="h-4 w-4" />
                      Download Invoice
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <CheckCircle className="h-4 w-4" />
                      Mark as Paid
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Bell className="h-4 w-4" />
                      Set Reminder
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Task Actions Dropdown */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <CheckSquare className="h-5 w-5 text-primary" />
                    Task Actions
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">TaskActionDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <FileText className="h-4 w-4" />
                      View License
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Receipt className="h-4 w-4" />
                      Pay Invoice
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <UserPlus className="h-4 w-4" />
                      Assign Owner
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-accent-green hover:bg-accent-green/10 rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <CheckCircle className="h-4 w-4" />
                      Mark Complete
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <AlertCircle className="h-4 w-4" />
                      Set Priority
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* High Impact Renewals Actions */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Building2 className="h-5 w-5 text-primary" />
                    High Impact Renewals
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">HighImpactRenewalsActionsDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <FileText className="h-4 w-4" />
                      View License
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Receipt className="h-4 w-4" />
                      Pay Invoice
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <UserPlus className="h-4 w-4" />
                      Assign Owner
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Calendar className="h-4 w-4" />
                      Schedule Review
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Download className="h-4 w-4" />
                      Export Data
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Renewals Actions */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Clock className="h-5 w-5 text-primary" />
                    Upcoming Renewals
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">UpcomingRenewalsActionsDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <FileText className="h-4 w-4" />
                      View License
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Receipt className="h-4 w-4" />
                      Pay Invoice
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <UserPlus className="h-4 w-4" />
                      Assign Owner
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Calendar className="h-4 w-4" />
                      Extend Deadline
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Edit3 className="h-4 w-4" />
                      Add Notes
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Task Overview Actions */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <PieChart className="h-5 w-5 text-primary" />
                    Task Overview Actions
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">TaskOverviewActionsDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <button className="w-full text-left px-3 py-2 text-sm text-accent-green hover:bg-accent-green/10 rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <CheckCircle className="h-4 w-4" />
                      Mark All Complete
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Users className="h-4 w-4" />
                      Bulk Assign
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Download className="h-4 w-4" />
                      Export Tasks
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Filter className="h-4 w-4" />
                      Filter by Priority
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Archive className="h-4 w-4" />
                      Archive Completed
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Navigation Menus Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Navigation Menus
              </h2>
              <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                Primary navigation and user account menus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Main Sidebar Navigation */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Main Sidebar
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">Sidebar Component</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg p-4 w-full">
                    {/* License Management Section */}
                    <div className="mb-6">
                      <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        License Management
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <LayoutDashboard className="h-4 w-4" />
                          Portfolio Overview
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <FileText className="h-4 w-4" />
                          License Tracker
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <CreditCard className="h-4 w-4" />
                          Payments Dashboard
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <CheckSquare className="h-4 w-4" />
                          Tasks
                        </div>
                      </div>
                    </div>

                    {/* Developer Tools Section */}
                    <div>
                      <div className="text-xs font-semibold text-muted uppercase tracking-wide mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Developer Tools
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <Palette className="h-4 w-4" />
                          Style Guide
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <Boxes className="h-4 w-4" />
                          Component Library
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <Menu className="h-4 w-4" />
                          Menu Assets
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Profile Menu */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <User className="h-5 w-5 text-primary" />
                    User Profile Menu
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">ProfileDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <div className="px-3 py-2 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>John Doe</div>
                          <div className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>john.doe@company.com</div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <User className="h-4 w-4" />
                      View Profile
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Settings className="h-4 w-4" />
                      Account Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <CreditCard className="h-4 w-4" />
                      Billing
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Menu */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Bell className="h-5 w-5 text-primary" />
                    Notification Menu
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">NotificationDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <div className="px-3 py-2 border-b border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Notifications</span>
                        <Badge className="bg-primary text-primary-foreground text-xs">3</Badge>
                      </div>
                    </div>
                    <div className="px-3 py-2 hover:bg-muted transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent-orange rounded-full mt-2"></div>
                        <div>
                          <div className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>License Renewal Due</div>
                          <div className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>San Francisco Office expires in 30 days</div>
                          <div className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>2 hours ago</div>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-2 hover:bg-muted transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-accent-green rounded-full mt-2"></div>
                        <div>
                          <div className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Payment Processed</div>
                          <div className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>$25,000 payment completed</div>
                          <div className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>1 day ago</div>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Eye className="h-4 w-4" />
                      View All Notifications
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Settings className="h-4 w-4" />
                      Notification Settings
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Filter & Sort Menus */}
          <div className="space-y-6">
            <div>
              <h2 className="text-heading-2 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Filter & Sort Menus
              </h2>
              <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                Data manipulation and view control dropdowns
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Filter Menu */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Filter className="h-5 w-5 text-primary" />
                    Filter Menu
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">FilterDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <div className="px-3 py-2 border-b border-border">
                      <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Filter Options</span>
                    </div>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <CheckCircle className="h-4 w-4 text-accent-green" />
                      Active Licenses
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <AlertCircle className="h-4 w-4 text-accent-orange" />
                      Expiring Soon
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <XCircle className="h-4 w-4 text-destructive" />
                      Expired
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <MapPin className="h-4 w-4" />
                      By Location
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Calendar className="h-4 w-4" />
                      Date Range
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-muted hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <RefreshCw className="h-4 w-4" />
                      Clear All Filters
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Sort Menu */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <SortAsc className="h-5 w-5 text-primary" />
                    Sort Menu
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">SortDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <div className="px-3 py-2 border-b border-border">
                      <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Sort By</span>
                    </div>
                    <button className="w-full text-left px-3 py-2 text-sm text-primary bg-primary/10 rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <SortAsc className="h-4 w-4" />
                      Name (A-Z)
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <SortDesc className="h-4 w-4" />
                      Name (Z-A)
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Calendar className="h-4 w-4" />
                      Date (Newest)
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Calendar className="h-4 w-4" />
                      Date (Oldest)
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <DollarSign className="h-4 w-4" />
                      Amount (High to Low)
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <DollarSign className="h-4 w-4" />
                      Amount (Low to High)
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* View Options Menu */}
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Grid3X3 className="h-5 w-5 text-primary" />
                    View Options
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">ViewOptionsDropdown</Badge>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border border-border rounded-lg shadow-lg p-1 w-full">
                    <div className="px-3 py-2 border-b border-border">
                      <span className="text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>Display Options</span>
                    </div>
                    <button className="w-full text-left px-3 py-2 text-sm text-primary bg-primary/10 rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <List className="h-4 w-4" />
                      List View
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Grid3X3 className="h-4 w-4" />
                      Grid View
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Boxes className="h-4 w-4" />
                      Card View
                    </button>
                    <Separator className="my-1" />
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Settings className="h-4 w-4" />
                      Customize Columns
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <Download className="h-4 w-4" />
                      Export View
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Design Guidelines Section */}
          <Card className="bg-white rounded-xl shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-heading-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Menu Design Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Visual Properties
                  </h3>
                  <ul className="space-y-2 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Background: White (#FFFFFF)</li>
                    <li>• Border: 1px solid #E5E7EB</li>
                    <li>• Border Radius: 8px</li>
                    <li>• Shadow: 0 4px 6px rgba(0,0,0,0.1)</li>
                    <li>• Z-index: 50 for overlays</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Typography
                  </h3>
                  <ul className="space-y-2 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Font: Inter, 14px</li>
                    <li>• Weight: Medium (500)</li>
                    <li>• Line Height: 1.4</li>
                    <li>• Text Color: #374151</li>
                    <li>• Icon Size: 16px</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Interaction States
                  </h3>
                  <ul className="space-y-2 text-sm text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Hover: #F8F9FA background</li>
                    <li>• Active: #005B94 primary color</li>
                    <li>• Destructive: #DC3545 color</li>
                    <li>• Success: #28A745 color</li>
                    <li>• Transition: 150ms ease</li>
                  </ul>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Implementation Notes
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>For Developers:</strong> All menus use consistent padding (4px container, 12px horizontal, 8px vertical for items), 
                    proper ARIA labels for accessibility, and keyboard navigation support. Destructive actions should always be separated 
                    with a divider and use the destructive color palette.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}