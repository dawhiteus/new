import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Upload, 
  Download, 
  RefreshCw, 
  StopCircle, 
  Flag,
  FileText
} from 'lucide-react';

interface License {
  id: number;
  status: string;
  daysUntilExpiration: number;
  hasContract?: boolean;
  isActive?: boolean;
  isRenewable?: boolean;
}

interface LicenseActionsDropdownProps {
  license: License;
  onViewLicense?: (license: License) => void;
  onEditLicense?: (license: License) => void;
  onUploadContract?: (license: License) => void;
  onDownloadAgreement?: (license: License) => void;
  onRenewLicense?: (license: License) => void;
  onTerminateLicense?: (license: License) => void;
  onFlagForReview?: (license: License) => void;
  onGenerateCollection?: (license: License) => void;
  onViewCollection?: (license: License) => void;
}

export function LicenseActionsDropdown({ 
  license,
  onViewLicense, 
  onEditLicense, 
  onUploadContract, 
  onDownloadAgreement, 
  onRenewLicense, 
  onTerminateLicense, 
  onFlagForReview,
  onGenerateCollection,
  onViewCollection
}: LicenseActionsDropdownProps) {
  
  // Determine which actions to show based on license state
  const showUploadContract = !license.hasContract;
  const showDownloadAgreement = license.hasContract;
  const showRenewLicense = license.daysUntilExpiration <= 90 && license.status.toLowerCase() === 'active';
  const showTerminateLicense = license.status.toLowerCase() === 'active';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
          <MoreHorizontal className="h-4 w-4" style={{ color: '#6B7280' }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white border border-gray-200 shadow-md p-3 space-y-2"
        style={{ 
          width: '220px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
      >
        {/* View License */}
        <DropdownMenuItem
          onClick={() => onViewLicense?.(license)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <Eye className="h-4 w-4 text-blue-600" />
          <span>View License</span>
        </DropdownMenuItem>

        {/* Edit License Info */}
        <DropdownMenuItem
          onClick={() => onEditLicense?.(license)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <Edit className="h-4 w-4 text-gray-600" />
          <span>Edit License Info</span>
        </DropdownMenuItem>

        {/* Upload Contract - only if no contract exists */}
        {showUploadContract && (
          <DropdownMenuItem
            onClick={() => onUploadContract?.(license)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#1A1A1A'
            }}
          >
            <Upload className="h-4 w-4 text-green-600" />
            <span>Upload Contract</span>
          </DropdownMenuItem>
        )}

        {/* Download Agreement - only if contract exists */}
        {showDownloadAgreement && (
          <DropdownMenuItem
            onClick={() => onDownloadAgreement?.(license)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#1A1A1A'
            }}
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Download Agreement</span>
          </DropdownMenuItem>
        )}

        {/* Renew License - only if near expiration and active */}
        {showRenewLicense && (
          <DropdownMenuItem
            onClick={() => onRenewLicense?.(license)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#1A1A1A'
            }}
          >
            <RefreshCw className="h-4 w-4 text-green-600" />
            <span>Renew License</span>
          </DropdownMenuItem>
        )}

        {/* Terminate License - only for active licenses */}
        {showTerminateLicense && (
          <DropdownMenuItem
            onClick={() => onTerminateLicense?.(license)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-red-50 focus:bg-red-100"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#DC3545'
            }}
          >
            <StopCircle className="h-4 w-4 text-red-600" />
            <span>Terminate License</span>
          </DropdownMenuItem>
        )}

        {/* Flag for Review */}
        <DropdownMenuItem
          onClick={() => onFlagForReview?.(license)}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A'
          }}
        >
          <Flag className="h-4 w-4 text-orange-600" />
          <span>Flag for Review</span>
        </DropdownMenuItem>

        {/* Generate Collection or View Collection */}
        {onGenerateCollection && (
          <DropdownMenuItem
            onClick={() => onGenerateCollection?.(license)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#1A1A1A'
            }}
          >
            <FileText className="h-4 w-4 text-blue-600" />
            <span>Generate Collection</span>
          </DropdownMenuItem>
        )}

        {onViewCollection && (
          <DropdownMenuItem
            onClick={() => onViewCollection?.(license)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-blue-50 focus:bg-blue-100"
            style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: '#1A1A1A'
            }}
          >
            <FileText className="h-4 w-4 text-blue-600" />
            <span>View Collection</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}