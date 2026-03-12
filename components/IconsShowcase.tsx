import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  // Navigation & Layout Icons
  LayoutDashboard,
  FileText,
  CreditCard,
  DollarSign,
  CheckSquare,
  Receipt,
  Bell,
  PieChart,
  Menu,
  X,
  Layers,
  Palette,
  Code,
  Boxes,
  
  // Action Icons
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  Search,
  Filter,
  Copy,
  Share,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  
  // Data & Content Icons
  Building2,
  Users,
  Calendar,
  MapPin,
  Star,
  BookOpen,
  Database,
  Folder,
  Archive,
  
  // Status & Feedback Icons
  Check,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Clock,
  
  // Navigation & Interaction Icons
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MoreHorizontal,
  MoreVertical,
  
  // Communication Icons
  Mail,
  Phone,
  MessageSquare,
  Send
} from 'lucide-react';

export function IconsShowcase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const copyIconCode = (iconName: string, iconComponent: string) => {
    const code = `import { ${iconName} } from 'lucide-react';\n\n<${iconName} className="h-4 w-4" />`;
    navigator.clipboard.writeText(code);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  const iconCategories = [
    {
      category: "Navigation & Layout",
      description: "Icons for navigation, dashboard sections, and layout elements",
      icons: [
        { name: "LayoutDashboard", component: LayoutDashboard, usage: "Dashboard navigation item" },
        { name: "FileText", component: FileText, usage: "License documents, file management" },
        { name: "CreditCard", component: CreditCard, usage: "Payment methods, billing" },
        { name: "DollarSign", component: DollarSign, usage: "Financial data, cost information" },
        { name: "CheckSquare", component: CheckSquare, usage: "Tasks, completion status" },
        { name: "Receipt", component: Receipt, usage: "Invoices, payment receipts" },
        { name: "Bell", component: Bell, usage: "Notifications, alerts" },
        { name: "PieChart", component: PieChart, usage: "Analytics, reporting" },
        { name: "Menu", component: Menu, usage: "Mobile menu toggle" },
        { name: "X", component: X, usage: "Close modals, remove items" },
        { name: "Layers", component: Layers, usage: "Empty states, stacked content" },
        { name: "Palette", component: Palette, usage: "Design tools, style guide" },
        { name: "Code", component: Code, usage: "Developer tools, code examples" },
        { name: "Boxes", component: Boxes, usage: "Components, modular content" }
      ]
    },
    {
      category: "Actions & Controls",
      description: "Interactive elements and user actions",
      icons: [
        { name: "Plus", component: Plus, usage: "Add new items, create actions" },
        { name: "Edit", component: Edit, usage: "Edit existing items" },
        { name: "Trash2", component: Trash2, usage: "Delete, remove items" },
        { name: "Download", component: Download, usage: "Export data, download files" },
        { name: "Upload", component: Upload, usage: "Import data, file uploads" },
        { name: "Settings", component: Settings, usage: "Configuration, preferences" },
        { name: "Search", component: Search, usage: "Search functionality" },
        { name: "Filter", component: Filter, usage: "Filter controls" },
        { name: "Copy", component: Copy, usage: "Copy to clipboard" },
        { name: "Share", component: Share, usage: "Share content" },
        { name: "Eye", component: Eye, usage: "View details, show content" },
        { name: "EyeOff", component: EyeOff, usage: "Hide content" },
        { name: "Save", component: Save, usage: "Save changes" },
        { name: "RefreshCw", component: RefreshCw, usage: "Refresh, reload data" }
      ]
    },
    {
      category: "Data & Content",
      description: "Icons representing data types and content organization",
      icons: [
        { name: "Building2", component: Building2, usage: "Locations, properties, venues" },
        { name: "Users", component: Users, usage: "Team members, people" },
        { name: "Calendar", component: Calendar, usage: "Dates, scheduling" },
        { name: "MapPin", component: MapPin, usage: "Locations, addresses" },
        { name: "Star", component: Star, usage: "Ratings, favorites" },
        { name: "BookOpen", component: BookOpen, usage: "Documentation, guides" },
        { name: "Database", component: Database, usage: "Data storage, records" },
        { name: "Folder", component: Folder, usage: "File organization" },
        { name: "Archive", component: Archive, usage: "Archived items" }
      ]
    },
    {
      category: "Status & Feedback",
      description: "Status indicators and user feedback",
      icons: [
        { name: "Check", component: Check, usage: "Success states, completion" },
        { name: "CheckCircle", component: CheckCircle, usage: "Completed status, success alerts" },
        { name: "AlertTriangle", component: AlertTriangle, usage: "Warning states, caution" },
        { name: "Info", component: Info, usage: "Information alerts, help" },
        { name: "XCircle", component: XCircle, usage: "Error states, failed actions" },
        { name: "Clock", component: Clock, usage: "Pending states, time-related" }
      ]
    },
    {
      category: "Navigation & Interaction",
      description: "Directional and interactive navigation elements",
      icons: [
        { name: "ChevronDown", component: ChevronDown, usage: "Dropdown indicators, expand" },
        { name: "ChevronUp", component: ChevronUp, usage: "Collapse, minimize" },
        { name: "ChevronLeft", component: ChevronLeft, usage: "Previous, back navigation" },
        { name: "ChevronRight", component: ChevronRight, usage: "Next, forward navigation" },
        { name: "ArrowLeft", component: ArrowLeft, usage: "Strong back navigation" },
        { name: "ArrowRight", component: ArrowRight, usage: "Strong forward navigation" },
        { name: "ExternalLink", component: ExternalLink, usage: "External links, new windows" },
        { name: "MoreHorizontal", component: MoreHorizontal, usage: "Action menus, more options" },
        { name: "MoreVertical", component: MoreVertical, usage: "Vertical action menus" }
      ]
    },
    {
      category: "Communication",
      description: "Communication and contact-related icons",
      icons: [
        { name: "Mail", component: Mail, usage: "Email addresses, contact" },
        { name: "Phone", component: Phone, usage: "Phone numbers, calls" },
        { name: "MessageSquare", component: MessageSquare, usage: "Messages, chat" },
        { name: "Send", component: Send, usage: "Send actions, submit" }
      ]
    }
  ];

  const filteredCategories = iconCategories.map(category => ({
    ...category,
    icons: category.icons.filter(icon => 
      searchTerm === '' ||
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.usage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.icons.length > 0);

  const IconCard = ({ icon, category }: { icon: any, category: string }) => {
    const IconComponent = icon.component;
    
    return (
      <Card className="bg-white rounded-xl shadow-card border-0 hover:shadow-card-hover transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Icon Preview */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Icon Info */}
            <div className="text-center space-y-2">
              <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {icon.name}
              </h3>
              <p className="text-muted text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                {icon.usage}
              </p>
            </div>

            {/* Size Examples */}
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="text-center">
                <IconComponent className="h-3 w-3 text-muted mx-auto mb-1" />
                <span className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>12px</span>
              </div>
              <div className="text-center">
                <IconComponent className="h-4 w-4 text-foreground mx-auto mb-1" />
                <span className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>16px</span>
              </div>
              <div className="text-center">
                <IconComponent className="h-5 w-5 text-primary mx-auto mb-1" />
                <span className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>20px</span>
              </div>
              <div className="text-center">
                <IconComponent className="h-6 w-6 text-accent-green mx-auto mb-1" />
                <span className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>24px</span>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-gray-900 rounded-lg p-3">
              <pre className="text-xs text-gray-100 text-center" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>
                {`<${icon.name} className="h-4 w-4" />`}
              </pre>
            </div>

            {/* Copy Button */}
            <Button
              size="sm"
              variant="outline"
              className="w-full border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-3 py-2 rounded-md"
              style={{ fontFamily: 'Inter, sans-serif' }}
              onClick={() => copyIconCode(icon.name, icon.component.name)}
            >
              {copiedIcon === icon.name ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const getContentHeight = () => {
    switch (screenSize) {
      case 'mobile':
        return 'calc(100vh - 280px)'; // Account for header + search
      case 'tablet':
        return 'calc(100vh - 300px)';
      default:
        return 'calc(100vh - 320px)';
    }
  };

  const getPadding = () => {
    return screenSize === 'mobile' ? '16px' : screenSize === 'tablet' ? '20px' : '24px';
  };

  const getGridColumns = () => {
    switch (screenSize) {
      case 'mobile':
        return 'repeat(auto-fill, minmax(280px, 1fr))';
      case 'tablet':
        return 'repeat(auto-fill, minmax(300px, 1fr))';
      default:
        return 'repeat(auto-fill, minmax(320px, 1fr))';
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-8 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                Icons & Illustrations
              </h1>
              <p className="text-primary-foreground/90 text-base font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                Complete collection of Lucide React icons used throughout LiquidSpace
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/10 text-white border-white/20 text-sm font-medium px-3 py-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                {iconCategories.reduce((total, category) => total + category.icons.length, 0)} Icons
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-8 py-6 flex-shrink-0">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search icons by name or usage..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full overflow-hidden" style={{ minHeight: 0 }}>
        <div 
          className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative h-full"
          style={{ 
            height: getContentHeight(),
            padding: `0 ${getPadding()}`,
            minHeight: 0 // Important for flexbox scrolling
          }}
        >
          {/* Scroll hint gradient at top */}
          <div 
            className="absolute top-0 left-0 right-0 h-6 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(248,249,250,0.95), transparent)',
              display: filteredCategories.length > 0 ? 'block' : 'none'
            }}
          />

          {/* Content */}
          <div 
            className="space-y-12"
            style={{
              paddingTop: '16px', // Account for gradient
              paddingBottom: '24px' // Extra space at bottom for better UX
            }}
          >
            {filteredCategories.map((category) => (
              <div key={category.category} className="space-y-6">
                {/* Category Header */}
                <div className="border-l-4 border-primary pl-6">
                  <h2 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {category.category}
                  </h2>
                  <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {category.description}
                  </p>
                  <Badge className="bg-secondary text-foreground border-border text-xs font-medium px-2 py-1 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {category.icons.length} icon{category.icons.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Icons Grid */}
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: getGridColumns(),
                    gap: screenSize === 'mobile' ? '16px' : '20px',
                    width: '100%'
                  }}
                >
                  {category.icons.map((icon) => (
                    <IconCard key={icon.name} icon={icon} category={category.category} />
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-heading-2 text-foreground font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No icons found
                </h3>
                <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Try adjusting your search terms or browse all categories.
                </p>
              </div>
            )}

            {/* Usage Guidelines */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <Card className="bg-white rounded-xl shadow-card border-0">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="h-6 w-6 text-primary" />
                    <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Icon Usage Guidelines
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Standard Sizes
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Settings className="h-3 w-3 text-muted" />
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>h-3 w-3</code>
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Small (12px) - Inline with text</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Settings className="h-4 w-4 text-foreground" />
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>h-4 w-4</code>
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Default (16px) - Buttons, controls</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Settings className="h-5 w-5 text-primary" />
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>h-5 w-5</code>
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Medium (20px) - Navigation, headers</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Settings className="h-6 w-6 text-accent-green" />
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded" style={{ fontFamily: 'Monaco, Menlo, monospace' }}>h-6 w-6</code>
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Large (24px) - Featured elements</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Color Usage
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Primary blue for active/interactive states</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-accent-green" />
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Green for success and completed states</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-accent-orange" />
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Orange for warnings and pending states</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Red for errors and destructive actions</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>Gray for neutral and disabled states</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Code className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-semibold text-blue-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Implementation Best Practices
                        </h5>
                        <p className="text-sm text-blue-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Always use semantic icon choices that match user expectations. Maintain consistent sizing within interface sections, and ensure sufficient color contrast for accessibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Scroll hint gradient at bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(to top, rgba(248,249,250,0.95), transparent)',
              display: filteredCategories.length > 0 ? 'block' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}