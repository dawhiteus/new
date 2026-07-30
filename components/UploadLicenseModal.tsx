import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Upload, X } from 'lucide-react';

interface UploadLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (fileName: string) => void;
}

export function UploadLicenseModal({ isOpen, onClose, onSave }: UploadLicenseModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSave = () => {
    if (file) onSave?.(file.name);
    onClose();
    setFile(null);
  };

  const handleCancel = () => {
    onClose();
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg"
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
                Bulk-import license data from a CSV, XLS, or PDF export.
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
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors hover:border-primary/50"
            style={{ borderColor: isDragging ? '#005B94' : '#E5E7EB', backgroundColor: isDragging ? '#F0F7FF' : '#F8F9FA' }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
          >
            <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: '#6B7280' }} />
            <div style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#374151',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '8px'
            }}>
              {file ? file.name : 'Drag and drop your license file here'}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '16px'
            }}>
              {file ? 'Ready to import' : 'or click to browse files'}
            </div>

            <input
              type="file"
              className="hidden"
              id="license-file-upload"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }}
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
            disabled={!file}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              backgroundColor: file ? '#005B94' : '#93C5FD',
              color: '#FFFFFF'
            }}
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
