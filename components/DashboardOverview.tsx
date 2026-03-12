import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Users, TrendingUp, DollarSign, Star, MoreHorizontal, Calendar, MapPin, Eye } from 'lucide-react';

export function DashboardOverview() {
  const metrics = [
    {
      title: 'Adoption',
      value: '3200',
      subtitle: 'Joined',
      additional: '425 Pending',
      icon: Users,
      iconColor: 'text-red-500',
    },
    {
      title: 'Engagement',
      value: '1306',
      subtitle: 'Booked',
      additional: '51% Engaged',
      icon: TrendingUp,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Spend',
      value: '$3,807,857',
      subtitle: 'Total Spend',
      additional: '32359 Reservations',
      icon: DollarSign,
      iconColor: 'text-green-500',
    },
    {
      title: 'Reviews',
      value: '4.1/5',
      subtitle: 'Average Rating',
      additional: '1138 Reviews',
      icon: Star,
      iconColor: 'text-yellow-500',
    },
  ];

  const spendData = [
    { amount: '$760,715' },
    { amount: '$651,516' },
    { amount: '$391,109' },
    { amount: '$203,751' },
    { amount: '$197,135' },
  ];

  const topLocations = [
    {
      rank: 1,
      name: 'AT&T Hub @ San Ramon',
      reservations: 1901,
    },
    {
      rank: 2,
      name: 'Serendipity Labs - Dublin - Pleasanton',
      reservations: 1012,
    },
    {
      rank: 3,
      name: 'CENTRL Office - South Bay',
      reservations: 988,
    },
    {
      rank: 4,
      name: 'SynerQ Coworking',
      reservations: 641,
    },
    {
      rank: 5,
      name: 'Ironfire Workspaces - Bellflower',
      reservations: 656,
    },
  ];

  const tableData = [
    {
      rank: 1,
      name: 'PATRICK HENKEL',
      team: 'AT&T LS Management',
      reservations: 7,
      totalSpend: '$150,715',
    },
    {
      rank: 2,
      name: 'AMY JOHNSON',
      team: 'AT&T LS Management',
      reservations: 7,
      totalSpend: '$851,836',
    },
    {
      rank: 3,
      name: 'DONALD HUCKLEWORTH[Removed]',
      team: '',
      reservations: 1,
      totalSpend: '$391,509',
    },
    {
      rank: 4,
      name: 'KELLY SANDMANN',
      team: 'San Ramon',
      reservations: 451,
      totalSpend: '$363,781',
    },
    {
      rank: 5,
      name: 'Amanda Barker',
      team: 'RI Furnished | Bishop',
      reservations: 11,
      totalSpend: '$197,153',
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Blue Header Section */}
      <div className="bg-primary text-primary-foreground px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6" />
                <h1 className="text-2xl font-semibold">Dashboard</h1>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-3 inline-block">
                <h2 className="text-lg font-medium">Welcome back, David!</h2>
                <p className="text-primary-foreground/80 text-sm mt-1">
                  Your dashboard provides visibility to activity and spend at a glance.
                </p>
                <p className="text-primary-foreground/70 text-xs mt-1">
                  Last view: Activity, July 26th, 2025, 4:28 pm
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-2 font-medium"
            >
              <Calendar className="h-4 w-4 mr-2" />
              All Time
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="bg-white border border-border rounded-lg shadow-card relative hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        {metric.title}
                      </div>
                      <div className="text-3xl font-semibold text-foreground mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm font-medium text-foreground mb-1">
                        {metric.subtitle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.additional}
                      </div>
                    </div>
                    <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Grid - Activity Map and Total Spend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Map */}
          <Card className="bg-white border border-border rounded-lg shadow-card">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-medium text-foreground">Activity Map</h3>
            </div>
            <CardContent className="p-5">
              {/* Map Placeholder */}
              <div className="w-full h-48 bg-muted rounded-lg border border-border mb-4 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Interactive Map Component</p>
                  <p className="text-xs text-muted-foreground mt-1">Shows activity across locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card className="bg-white border border-border rounded-lg shadow-card">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-medium text-foreground">Top Locations</h3>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topLocations.map((location) => (
                  <div key={location.rank} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                          {location.rank}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {location.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {location.reservations.toLocaleString()} Reservations
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid - Total Spend and Most Engaged */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Spend */}
          <Card className="bg-white border border-border rounded-lg shadow-card">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-medium text-foreground">Total Spend</h3>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {spendData.map((item, index) => (
                  <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-foreground">
                        {item.amount}
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                        <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border bg-muted/20">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-white border border-border hover:bg-muted text-sm font-medium"
                >
                  <Eye className="h-3 w-3 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Most Engaged - spans 2 columns */}
          <Card className="lg:col-span-2 bg-white border border-border rounded-lg shadow-card">
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-medium text-foreground">Most Engaged</h3>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border">
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 px-5">
                      #
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                      Name
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                      Team
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 text-center">
                      Reservations
                    </TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 text-right">
                      Total Spend
                    </TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row) => (
                    <TableRow key={row.rank} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="py-4 px-5">
                        <span className="text-sm font-medium text-muted-foreground">
                          {row.rank}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm font-medium text-foreground">
                          {row.name}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-muted-foreground">
                          {row.team}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="text-sm font-medium text-foreground">
                          {row.reservations}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-sm font-semibold text-foreground">
                          {row.totalSpend}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}