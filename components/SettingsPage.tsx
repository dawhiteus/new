import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8" />
            <div>
              <h1 className="text-heading-1" style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif' }}>
                Settings
              </h1>
              <p className="text-primary-foreground/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                Manage your workspace preferences and configurations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
        {/* Profile Settings */}
        <Card className="bg-white rounded-xl shadow-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-heading-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <User className="h-6 w-6 text-primary" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" style={{ fontFamily: 'Inter, sans-serif' }}>First Name</Label>
                <Input 
                  id="firstName" 
                  defaultValue="John" 
                  className="border-gray-300"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" style={{ fontFamily: 'Inter, sans-serif' }}>Last Name</Label>
                <Input 
                  id="lastName" 
                  defaultValue="Doe" 
                  className="border-gray-300"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" style={{ fontFamily: 'Inter, sans-serif' }}>Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="john.doe@company.com" 
                className="border-gray-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white rounded-xl shadow-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-heading-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Bell className="h-6 w-6 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Email Notifications
                </p>
                <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Receive notifications about license renewals and alerts
                </p>
              </div>
              <Switch 
                checked={notifications} 
                onCheckedChange={setNotifications} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Dark Mode
                </p>
                <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Switch to dark theme for better visibility
                </p>
              </div>
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-white rounded-xl shadow-card border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-heading-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <Database className="h-6 w-6 text-primary" />
              System Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-body font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Automatic Backup
                </p>
                <p className="text-muted" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Automatically backup your data daily
                </p>
              </div>
              <Switch 
                checked={autoBackup} 
                onCheckedChange={setAutoBackup} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            className="border-gray-300 text-foreground hover:bg-gray-50 font-medium px-6 py-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </Button>
          <Button 
            className="bg-primary hover:bg-primary-dark text-primary-foreground font-medium px-6 py-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}