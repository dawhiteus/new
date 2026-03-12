import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, X } from 'lucide-react';

interface UploadLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (licenseData: any) => void;
}

export function UploadLicenseModal({ isOpen, onClose, onSave }: UploadLicenseModalProps) {
  const [formData, setFormData] = useState({
    licenseName: '',
    propertyName: '',
    location: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
    squareFootage: '',
    licenseType: '',
    status: 'Active'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      licenseName: '',
      propertyName: '',
      location: '',
      startDate: '',
      endDate: '',
      monthlyRent: '',
      squareFootage: '',
      licenseType: '',
      status: 'Active'
    });
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      licenseName: '',
      propertyName: '',
      location: '',
      startDate: '',
      endDate: '',
      monthlyRent: '',
      squareFootage: '',
      licenseType: '',
      status: 'Active'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        <DialogHeader className="pb-4 border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle style={{ 
                fontSize: '24px', 
                fontWeight: 600, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '8px'
              }}>
                Upload External Licenses
              </DialogTitle>
              <DialogDescription style={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Add license data from external sources.
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* File Upload Section */}
          <div className="mb-8">
            <Label style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: '#374151', 
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px',
              display: 'block'
            }}>
              Upload License File
            </Label>
            
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-primary/50"
              style={{ borderColor: '#E5E7EB', backgroundColor: '#F8F9FA' }}
            >
              <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: '#6B7280' }} />
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 500, 
                color: '#374151', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '8px'
              }}>
                Drag and drop your license file here
              </div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 400, 
                color: '#6B7280', 
                fontFamily: 'Inter, sans-serif',
                marginBottom: '16px'
              }}>
                or click to browse files
              </div>
              
              <input
                type="file"
                className="hidden"
                id="license-file-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              />
              
              <label htmlFor="license-file-upload">
                <Button 
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    borderColor: '#E5E7EB',
                    color: '#374151'
                  }}
                  asChild
                >
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
            
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 400, 
              color: '#6B7280', 
              fontFamily: 'Inter, sans-serif',
              marginTop: '8px'
            }}>
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, CSV (Max 10MB)
            </div>
          </div>

          {/* Manual Entry Section */}
          <div className="border-t pt-8" style={{ borderColor: '#E5E7EB' }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              color: '#374151', 
              fontFamily: 'Inter, sans-serif',
              marginBottom: '16px'
            }}>
              Or Enter License Details Manually
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* License Name */}
              <div>
                <Label 
                  htmlFor="licenseName"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  License Name *
                </Label>
                <Input
                  id="licenseName"
                  type="text"
                  value={formData.licenseName}
                  onChange={(e) => handleInputChange('licenseName', e.target.value)}
                  placeholder="Enter license name"
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E5E7EB'
                  }}
                />
              </div>

              {/* Property Name */}
              <div>
                <Label 
                  htmlFor="propertyName"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Property Name *
                </Label>
                <Input
                  id="propertyName"
                  type="text"
                  value={formData.propertyName}
                  onChange={(e) => handleInputChange('propertyName', e.target.value)}
                  placeholder="Enter property name"
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E5E7EB'
                  }}
                />
              </div>

              {/* Location */}
              <div>
                <Label 
                  htmlFor="location"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Location *
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State/Country"
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E5E7EB'
                  }}
                />
              </div>

              {/* License Type */}
              <div>
                <Label 
                  htmlFor="licenseType"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  License Type
                </Label>
                <Select onValueChange={(value) => handleInputChange('licenseType', value)}>
                  <SelectTrigger 
                    style={{
                      fontSize: '16px',
                      fontFamily: 'Inter, sans-serif',
                      backgroundColor: '#F8F9FA',
                      borderColor: '#E5E7EB'
                    }}
                  >
                    <SelectValue placeholder="Select license type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">Traditional Lease</SelectItem>
                    <SelectItem value="dedicate">Dedicate (LS)</SelectItem>
                    <SelectItem value="flex">Flex (LS)</SelectItem>
                    <SelectItem value="coworking">Coworking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div>
                <Label 
                  htmlFor="startDate"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E5E7EB'
                  }}
                />
              </div>

              {/* End Date */}
              <div>
                <Label 
                  htmlFor="endDate"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E5E7EB'
                  }}
                />
              </div>

              {/* Monthly Rent */}
              <div>
                <Label 
                  htmlFor="monthlyRent"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Monthly Rent
                </Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                  placeholder="Enter monthly rent"
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E5E7EB'
                  }}
                />
              </div>

              {/* Square Footage */}
              <div>
                <Label 
                  htmlFor="squareFootage"
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: '#374151', 
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '8px',
                    display: 'block'
                  }}
                >
                  Square Footage
                </Label>
                <Input
                  id="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                  placeholder="Enter square footage"
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    backgroundColor: '#F8F9FA',
                    borderColor: '#E5E7EB'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t" style={{ borderColor: '#E5E7EB' }}>
          <Button
            variant="outline"
            onClick={handleCancel}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              borderColor: '#E5E7EB',
              color: '#374151'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              backgroundColor: '#005B94',
              color: '#FFFFFF'
            }}
          >
            Save License
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}