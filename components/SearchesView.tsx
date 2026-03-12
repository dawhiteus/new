import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Download, MapPin, Clock, TrendingUp } from 'lucide-react';

export function SearchesView() {
  const searches = [
    {
      id: 1,
      user: 'Patrick Henkel',
      searchQuery: 'conference room san francisco',
      location: 'San Francisco, CA',
      timestamp: '2025-08-15 14:32',
      results: 24,
      clicked: 3,
      booked: 1,
    },
    {
      id: 2,
      user: 'Amy Johnson',
      searchQuery: 'private office dublin',
      location: 'Dublin, CA',
      timestamp: '2025-08-15 11:15',
      results: 8,
      clicked: 2,
      booked: 0,
    },
    {
      id: 3,
      user: 'Kelly Sandmann',
      searchQuery: 'meeting space 10 people',
      location: 'San Ramon, CA',
      timestamp: '2025-08-14 16:45',
      results: 15,
      clicked: 5,
      booked: 2,
    },
    {
      id: 4,
      user: 'Amanda Barker',
      searchQuery: 'hot desk flexible',
      location: 'Belmont, CA',
      timestamp: '2025-08-14 09:20',
      results: 32,
      clicked: 8,
      booked: 0,
    },
  ];

  const topSearches = [
    { query: 'conference room', count: 127 },
    { query: 'private office', count: 89 },
    { query: 'meeting space', count: 76 },
    { query: 'hot desk', count: 54 },
    { query: 'event space', count: 43 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">Searches</h1>
        <p className="text-sm text-muted-foreground">
          Analyze search behavior and popular queries across your organization
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Total Searches
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  1,247
                </div>
                <div className="text-xs text-muted-foreground">
                  +12% from last week
                </div>
              </div>
              <Search className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Click Rate
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  24.3%
                </div>
                <div className="text-xs text-muted-foreground">
                  +3.2% from last week
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Conversion Rate
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  8.7%
                </div>
                <div className="text-xs text-muted-foreground">
                  +1.1% from last week
                </div>
              </div>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border rounded-lg shadow-card">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Avg Results
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">
                  18.2
                </div>
                <div className="text-xs text-muted-foreground">
                  Per search query
                </div>
              </div>
              <Search className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Search Queries */}
        <Card className="bg-white border border-border rounded-lg shadow-card">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-medium text-foreground">Top Search Queries</h3>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {topSearches.map((search, index) => (
                <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground">
                        {index + 1}
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {search.query}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground">
                      {search.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Search Activity - spans 2 columns */}
        <Card className="lg:col-span-2 bg-white border border-border rounded-lg shadow-card">
          <div className="p-5 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">Recent Search Activity</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-white border border-border hover:bg-muted rounded-lg font-medium">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="bg-white border border-border hover:bg-muted rounded-lg font-medium">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 px-5">
                    User
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                    Search Query
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3">
                    Location
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 text-center">
                    Results
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 text-center">
                    Clicked
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wide py-3 text-center">
                    Booked
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searches.map((search) => (
                  <TableRow key={search.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="py-4 px-5">
                      <div className="text-sm font-medium text-foreground">
                        {search.user}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {search.timestamp}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-foreground font-mono bg-muted/50 px-2 py-1 rounded text-xs max-w-[200px] truncate">
                        {search.searchQuery}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <div className="text-sm text-foreground">
                          {search.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span className="text-sm font-medium text-foreground">
                        {search.results}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span className="text-sm font-medium text-foreground">
                        {search.clicked}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span className={`text-sm font-medium ${search.booked > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {search.booked}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}