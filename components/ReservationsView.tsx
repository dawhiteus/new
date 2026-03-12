import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronDown, Download, MoreHorizontal } from 'lucide-react';

export function ReservationsView() {
  const [activeTab, setActiveTab] = useState('on-demand');
  const [showEntries, setShowEntries] = useState('10');

  // Chart data matching the pattern from your image
  const chartData = [
    {
      month: 'Aug 2024',
      totalSpend: 45000,
      onDemandSpend: 25000,
      dedicatedSpend: 20000,
      onDemandReservations: 85,
      dedicatedReservations: 45,
    },
    {
      month: 'Sep 2024',
      totalSpend: 52000,
      onDemandSpend: 30000,
      dedicatedSpend: 22000,
      onDemandReservations: 95,
      dedicatedReservations: 50,
    },
    {
      month: 'Oct 2024',
      totalSpend: 48000,
      onDemandSpend: 28000,
      dedicatedSpend: 20000,
      onDemandReservations: 90,
      dedicatedReservations: 45,
    },
    {
      month: 'Nov 2024',
      totalSpend: 44000,
      onDemandSpend: 26000,
      dedicatedSpend: 18000,
      onDemandReservations: 80,
      dedicatedReservations: 40,
    },
    {
      month: 'Dec 2024',
      totalSpend: 38000,
      onDemandSpend: 22000,
      dedicatedSpend: 16000,
      onDemandReservations: 70,
      dedicatedReservations: 35,
    },
    {
      month: 'Jan 2025',
      totalSpend: 50000,
      onDemandSpend: 29000,
      dedicatedSpend: 21000,
      onDemandReservations: 88,
      dedicatedReservations: 48,
    },
    {
      month: 'Feb 2025',
      totalSpend: 55000,
      onDemandSpend: 32000,
      dedicatedSpend: 23000,
      onDemandReservations: 100,
      dedicatedReservations: 55,
    },
    {
      month: 'Mar 2025',
      totalSpend: 58000,
      onDemandSpend: 34000,
      dedicatedSpend: 24000,
      onDemandReservations: 110,
      dedicatedReservations: 58,
    },
    {
      month: 'Apr 2025',
      totalSpend: 62000,
      onDemandSpend: 36000,
      dedicatedSpend: 26000,
      onDemandReservations: 120,
      dedicatedReservations: 62,
    },
    {
      month: 'May 2025',
      totalSpend: 58000,
      onDemandSpend: 33000,
      dedicatedSpend: 25000,
      onDemandReservations: 105,
      dedicatedReservations: 58,
    },
    {
      month: 'Jun 2025',
      totalSpend: 65000,
      onDemandSpend: 38000,
      dedicatedSpend: 27000,
      onDemandReservations: 125,
      dedicatedReservations: 65,
    },
    {
      month: 'Jul 2025',
      totalSpend: 70000,
      onDemandSpend: 41000,
      dedicatedSpend: 29000,
      onDemandReservations: 135,
      dedicatedReservations: 70,
    },
    {
      month: 'Aug 2025',
      totalSpend: 72000,
      onDemandSpend: 42000,
      dedicatedSpend: 30000,
      onDemandReservations: 140,
      dedicatedReservations: 72,
    },
  ];

  // Table data for On-Demand reservations
  const reservationsData = [
    {
      date: '08/29/2025',
      member: 'AARON AYALA',
      team: 'San Ramon',
      location: 'Reno, NV',
      venue: 'Pacific Workspaces - Reno',
      space: 'Meeting Space',
      cost: '$0',
      status: 'deleted',
    },
    {
      date: '08/29/2025',
      member: 'Ricardo Mendoza',
      team: 'AT&T General',
      location: 'Gilroy, CA',
      venue: 'SynerQ Coworking',
      space: 'Office',
      cost: '$100',
      status: 'future',
    },
    {
      date: '08/29/2025',
      member: 'Ricardo Mendoza',
      team: 'AT&T General',
      location: 'Gilroy, CA',
      venue: 'SynerQ Coworking',
      space: 'Desk',
      cost: '$35',
      status: 'future',
    },
    {
      date: '08/28/2025',
      member: 'Ricardo Mendoza',
      team: 'AT&T General',
      location: 'Gilroy, CA',
      venue: 'SynerQ Coworking',
      space: 'Office',
      cost: '$100',
      status: 'future',
    },
    {
      date: '08/28/2025',
      member: 'Ricardo Mendoza',
      team: 'AT&T General',
      location: 'Gilroy, CA',
      venue: 'SynerQ Coworking',
      space: 'Desk',
      cost: '$35',
      status: 'future',
    },
    {
      date: '08/28/2025',
      member: 'JOHAN WERNER',
      team: 'AT&T General',
      location: 'Loveland, CO',
      venue: 'desk chair',
      space: 'Meeting Space',
      cost: '$200',
      status: 'future',
    },
    {
      date: '08/27/2025',
      member: 'Ricardo Mendoza',
      team: 'AT&T General',
      location: 'Gilroy, CA',
      venue: 'SynerQ Coworking',
      space: 'Office',
      cost: '$100',
      status: 'future',
    },
    {
      date: '08/27/2025',
      member: 'Ricardo Mendoza',
      team: 'AT&T General',
      location: 'Gilroy, CA',
      venue: 'SynerQ Coworking',
      space: 'Desk',
      cost: '$35',
      status: 'future',
    },
    {
      date: '08/27/2025',
      member: 'PERLA HIZON',
      team: 'San Ramon',
      location: 'San Ramon, CA',
      venue: 'AT&T Hub @ San Ramon',
      space: 'Desk',
      cost: '$0',
      status: 'deleted',
    },
    {
      date: '08/27/2025',
      member: 'Ricardo Mendoza',
      team: 'AT&T General',
      location: 'Sunnyvale, CA',
      venue: 'Star Space',
      space: 'Office',
      cost: '$300',
      status: 'future',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      deleted: {
        className: 'bg-gray-100 text-gray-700 hover:bg-gray-100 border border-gray-300',
        label: 'Deleted'
      },
      future: {
        className: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100 border border-cyan-300',
        label: 'Future'
      },
      confirmed: {
        className: 'bg-green-100 text-green-700 hover:bg-green-100 border border-green-300',
        label: 'Confirmed'
      },
      completed: {
        className: 'bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-300',
        label: 'Completed'
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.future;
    
    return (
      <Badge className={`text-xs font-medium px-2 py-1 rounded-md ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  // Summary statistics
  const summaryStats = {
    totalReservations: 117,
    totalBookers: 14,
    totalTeams: 5,
    totalCities: 10,
    totalVenues: 10,
    totalSpend: '$14,829.50'
  };

  const currentMonth = 'July 2025';
  const monthlyStats = {
    onDemandSpend: '$119893',
    dedicatedSpend: '$0',
    onDemandReservations: 154,
    dedicatedReservations: 7
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Blue Header Section */}
      <div className="bg-primary text-primary-foreground px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white mb-2">Reservations</h1>
              <p className="text-primary-foreground/80 text-sm font-normal">
                Track and report on reservation activity across your teams.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="all-teams">
                <SelectTrigger className="w-40 h-9 bg-white/10 border-white/20 text-white rounded-md text-sm hover:bg-white/20 font-medium">
                  <SelectValue placeholder="All Teams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-teams">All Teams</SelectItem>
                  <SelectItem value="san-ramon">San Ramon</SelectItem>
                  <SelectItem value="att-general">AT&T General</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-md px-4 py-2 text-sm font-medium"
              >
                <Calendar className="h-4 w-4 mr-2" />
                August 1, 2025 – August 31, 2025
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Chart Section */}
        <Card className="bg-white border border-border rounded-lg shadow-card mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chart */}
              <div className="lg:col-span-3">
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                      <XAxis 
                        dataKey="month" 
                        stroke="#6c757d"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="#6c757d"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right"
                        stroke="#6c757d"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e9ecef',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalSpend" fill="#28a745" name="Total Spend" />
                      <Bar yAxisId="left" dataKey="onDemandSpend" fill="#3b82f6" name="On-Demand Spend" />
                      <Bar yAxisId="left" dataKey="dedicatedSpend" fill="#6c757d" name="Dedicated Spend" />
                      <Line yAxisId="right" type="monotone" dataKey="onDemandReservations" stroke="#ffc107" strokeWidth={2} name="On-Demand Reservations" />
                      <Line yAxisId="right" type="monotone" dataKey="dedicatedReservations" stroke="#dc3545" strokeWidth={2} name="Dedicated Reservations" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Stats */}
              <div className="space-y-4">
                <div className="text-lg font-medium text-foreground mb-4">{currentMonth}</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      ON-DEMAND SPEND
                    </div>
                    <div className="text-xl font-semibold text-foreground">
                      {monthlyStats.onDemandSpend}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      DEDICATED SPEND
                    </div>
                    <div className="text-xl font-semibold text-foreground">
                      {monthlyStats.dedicatedSpend}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      ON-DEMAND RESERVATIONS
                    </div>
                    <div className="text-xl font-semibold text-foreground">
                      {monthlyStats.onDemandReservations}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      DEDICATED RESERVATIONS
                    </div>
                    <div className="text-xl font-semibold text-foreground">
                      {monthlyStats.dedicatedReservations}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Table Section */}
        <Card className="bg-white border border-border rounded-lg shadow-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border">
              <div className="px-6 pt-4">
                <TabsList className="h-10 bg-transparent p-0 space-x-8">
                  <TabsTrigger 
                    value="on-demand"
                    className="bg-transparent px-0 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm font-medium data-[state=active]:text-primary"
                  >
                    On-Demand
                  </TabsTrigger>
                  <TabsTrigger 
                    value="dedicated"
                    className="bg-transparent px-0 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm font-medium data-[state=active]:text-primary"
                  >
                    Dedicated
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reports"
                    className="bg-transparent px-0 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm font-medium data-[state=active]:text-primary"
                  >
                    Reports
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Controls */}
              <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground font-medium">Show</span>
                    <Select value={showEntries} onValueChange={setShowEntries}>
                      <SelectTrigger className="w-16 h-8 bg-input-background border border-border rounded text-sm font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-sm text-foreground font-medium">entries</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="text"
                    placeholder="Search"
                    className="px-3 py-1.5 text-sm border border-border rounded bg-input-background focus:ring-2 focus:ring-primary focus:border-primary outline-none font-normal"
                  />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-white border-primary rounded text-sm font-medium"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download CSV
                        <ChevronDown className="h-3 w-3 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem className="text-sm font-medium">CSV</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm font-medium">Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <TabsContent value="on-demand" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border">
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 px-6">
                        Date
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                        Member
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                        Team
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                        Location
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                        Venue
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                        Space
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 text-right">
                        Cost
                      </TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 text-center">
                        Status
                      </TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservationsData.map((reservation, index) => (
                      <TableRow key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <TableCell className="py-3 px-6">
                          <div className="text-sm font-medium text-foreground">
                            {reservation.date}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-sm font-medium text-foreground">
                            {reservation.member}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-sm font-normal text-foreground">
                            {reservation.team}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-sm font-normal text-foreground">
                            {reservation.location}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-sm text-primary hover:underline cursor-pointer font-normal">
                            {reservation.venue}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-sm font-normal text-foreground">
                            {reservation.space}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span className="text-sm font-medium text-foreground">
                            {reservation.cost}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-center">
                          {getStatusBadge(reservation.status)}
                        </TableCell>
                        <TableCell className="py-3">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary and Pagination */}
              <div className="px-6 py-4 border-t border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-foreground">
                    <span className="font-medium">{summaryStats.totalReservations} Reservations</span>
                    <span className="font-medium">{summaryStats.totalBookers} Bookers</span>
                    <span className="font-medium">{summaryStats.totalTeams} Teams</span>
                    <span className="font-medium">{summaryStats.totalCities} Cities</span>
                    <span className="font-medium">{summaryStats.totalVenues} Venues</span>
                    <span className="font-semibold">{summaryStats.totalSpend} Spend</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-normal">Showing 1 to 10 of {summaryStats.totalReservations} entries</span>
                    <div className="flex items-center gap-1 ml-4">
                      <Button variant="outline" size="sm" className="px-2 py-1 h-8 text-sm font-medium">
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="px-3 py-1 h-8 text-sm bg-primary text-white border-primary font-medium">
                        1
                      </Button>
                      <Button variant="outline" size="sm" className="px-3 py-1 h-8 text-sm font-medium">
                        2
                      </Button>
                      <Button variant="outline" size="sm" className="px-3 py-1 h-8 text-sm font-medium">
                        3
                      </Button>
                      <Button variant="outline" size="sm" className="px-3 py-1 h-8 text-sm font-medium">
                        4
                      </Button>
                      <span className="px-2 text-sm text-muted-foreground font-normal">...</span>
                      <Button variant="outline" size="sm" className="px-3 py-1 h-8 text-sm font-medium">
                        12
                      </Button>
                      <Button variant="outline" size="sm" className="px-2 py-1 h-8 text-sm font-medium">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dedicated" className="mt-0">
              <div className="p-6 text-center py-12">
                <div className="text-sm text-muted-foreground font-normal">No dedicated reservations found</div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <div className="p-6 text-center py-12">
                <div className="text-sm text-muted-foreground font-normal">Reports coming soon</div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}