import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Receipt, 
  AlertTriangle, 
  BarChart3, 
  Building2,
  Search,
  Star,
  BookOpen,
  Plus,
  Upload,
  Settings,
  Database,
  Folder
} from 'lucide-react';

export function EmptyStatesShowcase() {
  const emptyStates = [
    {
      category: "License Management",
      states: [
        {
          title: "License Tracker - No Licenses",
          icon: <FileText className="h-12 w-12 text-gray-400" />,
          heading: "No licenses found",
          message: "You haven't added any licenses yet. Start by uploading your first license agreement.",
          primaryAction: { label: "Upload License", icon: <Upload className="h-4 w-4" /> },
          secondaryAction: { label: "Import from CSV", icon: <FileText className="h-4 w-4" /> }
        },
        {
          title: "License Search Results",
          icon: <Search className="h-12 w-12 text-gray-400" />,
          heading: "No matching licenses",
          message: "We couldn't find any licenses matching your search criteria. Try adjusting your filters or search terms.",
          primaryAction: { label: "Clear Filters", icon: null }
        }
      ]
    },
    {
      category: "Task Management",
      states: [
        {
          title: "Tasks - No Tasks",
          icon: <Calendar className="h-12 w-12 text-gray-400" />,
          heading: "No tasks assigned",
          message: "You don't have any tasks at the moment. Tasks will appear here when they're assigned to you or when license actions require attention.",
          primaryAction: null
        },
        {
          title: "Task Search Results",
          icon: <Search className="h-12 w-12 text-gray-400" />,
          heading: "No matching tasks",
          message: "No tasks match your current filters. Try adjusting your search criteria or date range.",
          primaryAction: { label: "Clear Filters", icon: null }
        }
      ]
    },
    {
      category: "Financial Management",
      states: [
        {
          title: "Funding Sources - No Sources",
          icon: <DollarSign className="h-12 w-12 text-gray-400" />,
          heading: "No funding sources configured",
          message: "Set up your first funding source to track budget allocations and spending across your workspace portfolio.",
          primaryAction: { label: "Add Funding Source", icon: <Plus className="h-4 w-4" /> }
        },
        {
          title: "Payment Management - No Payments",
          icon: <CreditCard className="h-12 w-12 text-gray-400" />,
          heading: "No payment records",
          message: "Payment history will appear here once you start processing venue payments and license fees.",
          primaryAction: { label: "Record Payment", icon: <Plus className="h-4 w-4" /> }
        },
        {
          title: "Invoices - No Invoices",
          icon: <Receipt className="h-12 w-12 text-gray-400" />,
          heading: "No invoices generated",
          message: "Invoice records and real-time billing information will be displayed here as they're created.",
          primaryAction: { label: "Create Invoice", icon: <Plus className="h-4 w-4" /> }
        }
      ]
    },
    {
      category: "Analytics & Reporting",
      states: [
        {
          title: "Dashboard - No Data",
          icon: <BarChart3 className="h-12 w-12 text-gray-400" />,
          heading: "No analytics data available",
          message: "Once you start adding licenses and recording activities, analytics and insights will appear on your dashboard.",
          primaryAction: { label: "Upload First License", icon: <Upload className="h-4 w-4" /> }
        },
        {
          title: "Portfolio Overview - No Properties",
          icon: <Building2 className="h-12 w-12 text-gray-400" />,
          heading: "No properties in portfolio",
          message: "Your workspace portfolio is empty. Add properties and licenses to start tracking your real estate footprint.",
          primaryAction: { label: "Add Property", icon: <Plus className="h-4 w-4" /> }
        }
      ]
    },
    {
      category: "Activity Tracking",
      states: [
        {
          title: "Searches - No Activity",
          icon: <Search className="h-12 w-12 text-gray-400" />,
          heading: "No search activity",
          message: "Employee search activity and workspace discovery metrics will be displayed here once tracking begins.",
          primaryAction: null
        },
        {
          title: "Reservations - No Bookings",
          icon: <Calendar className="h-12 w-12 text-gray-400" />,
          heading: "No reservations recorded",
          message: "Workspace reservation data and booking analytics will appear here as employees make bookings.",
          primaryAction: null
        },
        {
          title: "Reviews - No Feedback",
          icon: <Star className="h-12 w-12 text-gray-400" />,
          heading: "No reviews submitted",
          message: "Employee feedback and venue reviews will be displayed here once reviews start coming in.",
          primaryAction: null
        }
      ]
    },

    {
      category: "Document Management",
      states: [
        {
          title: "Document Library - No Documents",
          icon: <Folder className="h-12 w-12 text-gray-400" />,
          heading: "No documents uploaded",
          message: "License agreements, contracts, and supporting documents will be stored and organized here.",
          primaryAction: { label: "Upload Document", icon: <Upload className="h-4 w-4" /> }
        }
      ]
    },

  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-1 font-bold mb-2" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                Empty States Reference
              </h1>
              <p className="text-primary-foreground/90 text-base font-normal" style={{ fontFamily: 'Inter, sans-serif' }}>
                Developer reference for implementing consistent empty states across all modules
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium text-sm px-4 py-2 rounded-md"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Guidelines
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {emptyStates.map((category) => (
          <div key={category.category} className="space-y-6">
            {/* Category Header */}
            <div className="border-l-4 border-primary pl-6">
              <h2 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {category.category}
              </h2>
              <p className="text-muted mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Empty state designs for {category.category.toLowerCase()} modules
              </p>
            </div>

            {/* Empty States Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.states.map((state, index) => (
                <Card key={index} className="bg-white rounded-xl shadow-card border-0">
                  <CardContent className="p-8">
                    {/* State Title */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                      <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {state.title}
                      </h3>
                    </div>

                    {/* Empty State Design */}
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="mb-4 flex justify-center">
                        {state.icon}
                      </div>
                      
                      <h4 className="text-heading-2 text-foreground font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {state.heading}
                      </h4>
                      
                      <p className="text-muted max-w-md mx-auto mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {state.message}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {state.primaryAction && (
                          <Button 
                            className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium text-sm px-6 py-2 rounded-md"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {state.primaryAction.icon && <span className="mr-2">{state.primaryAction.icon}</span>}
                            {state.primaryAction.label}
                          </Button>
                        )}
                        
                        {state.secondaryAction && (
                          <Button 
                            variant="outline"
                            className="border-gray-300 text-foreground hover:bg-gray-50 font-medium text-sm px-6 py-2 rounded-md"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {state.secondaryAction.icon && <span className="mr-2">{state.secondaryAction.icon}</span>}
                            {state.secondaryAction.label}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Implementation Notes */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-semibold text-foreground mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Implementation Notes
                            </h5>
                            <p className="text-xs text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Use consistent spacing (p-8), gray-400 icons (h-12 w-12), and maintain the same button styling across all empty states.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Design Guidelines */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Card className="bg-white rounded-xl shadow-card border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="h-6 w-6 text-primary" />
                <h3 className="text-heading-2 text-foreground font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Empty State Design Guidelines
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Visual Elements
                  </h4>
                  <ul className="space-y-2 text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Use gray-400 (#9CA3AF) for empty state icons</li>
                    <li>• Icons should be 48px × 48px (h-12 w-12)</li>
                    <li>• Center all content with proper spacing</li>
                    <li>• Use gray-50 (#F9FAFB) background for empty state containers</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-body font-semibold text-foreground" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Content Structure
                  </h4>
                  <ul className="space-y-2 text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <li>• Clear, descriptive heading (text-heading-2)</li>
                    <li>• Helpful explanation message (text-muted)</li>
                    <li>• Primary action button when appropriate</li>
                    <li>• Optional secondary action for alternatives</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-semibold text-yellow-800 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Consistency Note
                    </h5>
                    <p className="text-sm text-yellow-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Always maintain consistent spacing, typography, and button styling across all empty states to ensure a cohesive user experience.
                    </p>
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