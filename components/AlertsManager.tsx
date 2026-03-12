import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { AlertTriangle, Calendar, Settings, Bell, Download, MapPin, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const mockAlerts = [
  {
    id: 1,
    type: 'critical',
    title: 'Tel Tech Hub Seattle',
    description: 'License expires in 14 days',
    location: 'Seattle, WA',
    provider: 'Tel Tech Hub',
    daysLeft: 14,
    createdAt: '2024-12-20',
    status: 'active',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Tel Tech Office Austin',
    description: 'License expires in 45 days',
    location: 'Austin, TX',
    provider: 'Tel Tech Office',
    daysLeft: 45,
    createdAt: '2024-12-15',
    status: 'active',
  },
  {
    id: 3,
    type: 'info',
    title: 'Tel Tech Workspace NYC',
    description: 'Renewal reminder (90 days)',
    location: 'New York, NY',
    provider: 'Tel Tech Workspace',
    daysLeft: 92,
    createdAt: '2024-12-10',
    status: 'acknowledged',
  },
];

export function AlertsManager() {
  const [alerts] = useState(mockAlerts);
  const [filterType, setFilterType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const filteredAlerts = alerts.filter(alert => 
    filterType === 'all' || alert.type === filterType
  );

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#dc3545' }}
          >
            Critical
          </Badge>
        );
      case 'warning':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#FFA500' }}
          >
            Warning
          </Badge>
        );
      case 'info':
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#005B94' }}
          >
            Info
          </Badge>
        );
      default:
        return (
          <Badge 
            className="text-white rounded-full px-3 py-1 text-xs font-medium border-0" 
            style={{ backgroundColor: '#6B7280' }}
          >
            Unknown
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Blue Header Section */}
      <div className="bg-primary text-primary-foreground px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bell className="h-6 w-6" />
                <h1 
                  className="text-white"
                  style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}
                >
                  Alerts & Notifications
                </h1>
              </div>
              <p 
                className="text-primary-foreground/90" 
                style={{ fontSize: '16px', fontWeight: 400, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}
              >
                Monitor license alerts and critical conditions across your portfolio
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowSettings(true)} 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-2"
                style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg px-4 py-2"
                style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" style={{ color: '#dc3545' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#dc3545', fontFamily: 'Inter, sans-serif' }}>
                  {alerts.filter(a => a.type === 'critical').length}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Critical
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" style={{ color: '#FFA500' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#FFA500', fontFamily: 'Inter, sans-serif' }}>
                  {alerts.filter(a => a.type === 'warning').length}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Warning
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-5 w-5" style={{ color: '#005B94' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#005B94', fontFamily: 'Inter, sans-serif' }}>
                  {alerts.filter(a => a.type === 'info').length}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Info
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5" style={{ color: '#6b7280' }} />
                <span style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1.2, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  {alerts.filter(a => a.daysLeft <= 30).length}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                Expiring Soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Table */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center justify-between">
              <CardTitle style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1.3, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                Active Alerts
              </CardTitle>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8f9fa' }}>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Alert
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Location
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Provider
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Days Left
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status
                  </TableHead>
                  <TableHead className="py-4" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert, index) => (
                  <TableRow 
                    key={alert.id} 
                    className={`border-b transition-colors hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p style={{ fontSize: '16px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                            {alert.title}
                          </p>
                          {getAlertBadge(alert.type)}
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                          {alert.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" style={{ color: '#6b7280' }} />
                        <p style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                          {alert.location}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <p style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                        {alert.provider}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge 
                        className={`text-white rounded-full px-3 py-1 text-xs font-medium border-0`}
                        style={{ backgroundColor: alert.daysLeft <= 30 ? '#dc3545' : '#6B7280' }}
                      >
                        {alert.daysLeft}d
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1">
                        {alert.status === 'active' ? (
                          <AlertTriangle className="h-3 w-3" style={{ color: '#FFA500' }} />
                        ) : (
                          <CheckCircle className="h-3 w-3" style={{ color: '#28A745' }} />
                        )}
                        <Badge 
                          className={`text-white rounded-full px-3 py-1 text-xs font-medium border-0`}
                          style={{ backgroundColor: alert.status === 'active' ? '#005B94' : '#6B7280' }}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 px-3 rounded border hover:bg-gray-50"
                          style={{ borderColor: '#e5e7eb', color: '#374151', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                        >
                          View
                        </Button>
                        {alert.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 rounded border hover:bg-gray-50"
                            style={{ borderColor: '#e5e7eb', color: '#374151', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle style={{ fontSize: '22px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Alert Configuration
            </DialogTitle>
            <DialogDescription style={{ fontSize: '16px', fontWeight: 400, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
              Configure alert lead times and notification preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Card className="bg-white rounded-xl shadow-sm border-0">
              <CardHeader className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
                <CardTitle style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                  Lead Time Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[180, 90, 60, 30, 14].map((days) => (
                  <div key={days} className="flex items-center justify-between">
                    <Label 
                      htmlFor={`alert-${days}`} 
                      style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                    >
                      {days} days before expiration
                    </Label>
                    <Switch id={`alert-${days}`} defaultChecked={true} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
            <Button 
              variant="outline" 
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 rounded-md border hover:bg-gray-50"
              style={{ borderColor: '#e5e7eb', color: '#374151', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setShowSettings(false)}
              className="text-white px-4 py-2 rounded-md"
              style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}