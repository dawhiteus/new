import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Calendar, Download, Star, MapPin, X, ChevronDown, MoreHorizontal, Users, Building2 } from 'lucide-react';

export function StyleGuideShowcase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Blue Header Section */}
      <div className="text-white px-6 py-8" style={{ backgroundColor: '#005B94' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white mb-2" style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'Inter, sans-serif', lineHeight: 1.2 }}>
                Workplace Manager Style Guide
              </h1>
              <p className="text-white/90" style={{ fontSize: '16px', fontWeight: 400, fontFamily: 'Inter, sans-serif' }}>
                Official design system for workplace manager analytics dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="all-teams">
                <SelectTrigger className="w-40 h-9 bg-white/10 border-white/20 text-white rounded-md" style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-teams">All Teams</SelectItem>
                  <SelectItem value="design">Design Team</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-md px-4 py-2"
                style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
        {/* Color Palette */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <CardTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Color Palette
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="mb-4" style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Primary & UI Colors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#005B94', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Primary Blue</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#005B94</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#003F66', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Dark Blue</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#003F66</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#f8f9fa', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Light Gray Background</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#F8F9FA</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#e5e7eb', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Medium Gray</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#E5E7EB</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4" style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Accent Colors
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#28A745', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Accent Green</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#28A745</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#FFA500', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Accent Orange</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#FFA500</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#00B8C4', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Accent Teal</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#00B8C4</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4" style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Text Colors
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#374151', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Dark Gray Text</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#374151</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-full h-16 rounded-lg border" style={{ backgroundColor: '#6B7280', borderColor: '#e5e7eb' }}></div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Muted Gray Text</div>
                      <div style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>#6B7280</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Scale */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <CardTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Typography Scale
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-6">
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.2, marginBottom: '8px' }}>
                  Heading 1 - Inter Bold 28px
                </h1>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  Used for page titles and primary headings
                </p>
              </div>
              
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.3, marginBottom: '8px' }}>
                  Heading 2 - Inter Semibold 22px
                </h2>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  Used for section titles and card headers
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, marginBottom: '8px' }}>
                  Body Text - Inter Regular 16px
                </p>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  Used for primary content, form inputs, and table data
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, marginBottom: '8px' }}>
                  Muted Text - Inter Regular 14px
                </p>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  Used for secondary information and metadata
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', lineHeight: 1.4, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  TABLE HEADER - INTER SEMIBOLD 14PX
                </p>
                <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                  Used for column headers and form labels
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Badge System */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <CardTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Status Badge System
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h4 className="mb-4" style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Status Badges - Rounded Pill Style
              </h4>
              <div className="flex flex-wrap gap-3">
                <Badge 
                  className="text-white rounded-full px-3 py-1" 
                  style={{ backgroundColor: '#28A745', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                >
                  Completed
                </Badge>
                <Badge 
                  className="text-white rounded-full px-3 py-1" 
                  style={{ backgroundColor: '#005B94', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                >
                  Active
                </Badge>
                <Badge 
                  className="text-white rounded-full px-3 py-1" 
                  style={{ backgroundColor: '#6B7280', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                >
                  Deleted
                </Badge>
                <Badge 
                  className="text-white rounded-full px-3 py-1" 
                  style={{ backgroundColor: '#FFA500', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                >
                  Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Data Table */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <CardTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Data Table with Striped Rows
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Controls */}
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8f9fa' }}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>Show</span>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-16 h-8 bg-white rounded border" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>entries</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Input 
                  type="text"
                  placeholder="Search"
                  className="w-64 h-8 bg-white border rounded"
                  style={{ borderColor: '#e5e7eb', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
                />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      className="text-white border-0 rounded px-4 py-2 h-8"
                      style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                      <ChevronDown className="h-3 w-3 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>CSV</DropdownMenuItem>
                    <DropdownMenuItem style={{ fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8f9fa' }}>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Member
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Location
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: '08/29/2025', member: 'Ricardo Mendoza', status: 'active', location: 'Gilroy, CA', stripe: false },
                  { date: '08/28/2025', member: 'JOHAN WERNER', status: 'completed', location: 'Loveland, CO', stripe: true },
                  { date: '08/27/2025', member: 'PERLA HIZON', status: 'deleted', location: 'San Ramon, CA', stripe: false },
                  { date: '08/26/2025', member: 'AARON AYALA', status: 'pending', location: 'Reno, NV', stripe: true }
                ].map((reservation, index) => (
                  <TableRow 
                    key={index} 
                    className={`border-b transition-colors hover:bg-gray-50 ${reservation.stripe ? 'bg-gray-50' : 'bg-white'}`}
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <TableCell className="py-3 px-6">
                      <div style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {reservation.date}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {reservation.member}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {reservation.status === 'active' && (
                        <Badge 
                          className="text-white rounded-full px-3 py-1" 
                          style={{ backgroundColor: '#005B94', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                        >
                          Active
                        </Badge>
                      )}
                      {reservation.status === 'completed' && (
                        <Badge 
                          className="text-white rounded-full px-3 py-1" 
                          style={{ backgroundColor: '#28A745', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                        >
                          Completed
                        </Badge>
                      )}
                      {reservation.status === 'deleted' && (
                        <Badge 
                          className="text-white rounded-full px-3 py-1" 
                          style={{ backgroundColor: '#6B7280', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                        >
                          Deleted
                        </Badge>
                      )}
                      {reservation.status === 'pending' && (
                        <Badge 
                          className="text-white rounded-full px-3 py-1" 
                          style={{ backgroundColor: '#FFA500', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <div style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {reservation.location}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreHorizontal className="h-4 w-4" style={{ color: '#6B7280' }} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Button Examples */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <CardTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Button Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="mb-4" style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Primary & Secondary Buttons
                </h4>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="text-white px-4 py-2 rounded-md"
                    style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                  >
                    Primary Button
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-4 py-2 rounded-md border"
                    style={{ borderColor: '#e5e7eb', color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                  >
                    Outline Button
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="px-4 py-2 rounded-md hover:bg-gray-100"
                    style={{ color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Icon Button
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Example */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <CardTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Navigation Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2 max-w-xs">
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white"
                style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Users className="h-5 w-5" />
                <span>Active Item</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Building2 className="h-5 w-5" />
                <span>Inactive Item</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Calendar className="h-5 w-5" />
                <span>Another Item</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}