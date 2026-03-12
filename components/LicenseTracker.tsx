import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Upload, Search, Filter, Plus, MoreHorizontal, MapPin, Calendar, FileText, Building2, DollarSign, Users, TrendingUp, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { UploadLicenseModal } from './UploadLicenseModal';
import { LicenseDetailModal } from './LicenseDetailModal';
import { LicenseActionsDropdown } from './LicenseActionsDropdown';
import { AlternativeSpacesModal } from './AlternativeSpacesModal';
import { PageHeader } from './PageHeader';

interface LicenseTrackerProps {
  onAIAssistantOpen?: () => void;
  isAIDrawerOpen?: boolean;
}

const mockLicenses = [
  {
    id: 1,
    city: 'Bellevue',
    type: 'Headquarters Campus',
    address: 'Tel Tech Campus, 12920 SE 38th St',
    size: '485,000 sq ft',
    cost: 1950000,
    marketRateComparison: '-8%',
    startDate: '2022-04-01',
    endDate: '2025-03-31',
    operator: 'Tel Tech Corporation',
    status: 'Critical Renewal',
    paymentInfo: 'Quarterly Wire Transfer',
    daysUntilExpiration: 89,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    // Add additional fields for the detail modal
    name: 'Tel Tech Engineering Campus',
    property: 'Tel Tech Campus',
    location: 'Bellevue, WA',
    monthlyRent: 1950000,
    squareFootage: 485000,
    renewalStatus: 'Under Negotiation',
    lastModified: '2024-09-15',
    documents: [
      { name: 'Master Campus Agreement', type: 'PDF', size: '8.2 MB', uploadDate: '2022-04-01' },
      { name: 'Environmental Impact Study', type: 'PDF', size: '4.1 MB', uploadDate: '2022-03-20' },
      { name: 'Zoning Compliance Certificate', type: 'PDF', size: '1.8 MB', uploadDate: '2024-01-10' }
    ],
    financials: {
      monthlyRent: 1950000,
      securityDeposit: 5850000,
      brokerFee: 3900000,
      totalFirstYear: 27300000
    },
    contacts: {
      landlord: { name: 'Tel Tech Properties LLC', phone: '(425) 555-0200', email: 'facilities@teltech.com' },
      broker: { name: 'Jennifer Walsh, CBRE', phone: '(425) 555-0156', email: 'jennifer.walsh@cbre.com' }
    }
  },
  {
    id: 2,
    city: 'Atlanta',
    type: 'Regional Hub',
    address: 'Tel Tech Regional Center, 3424 Peachtree Rd NE',
    size: '180,000 sq ft',
    cost: 685000,
    marketRateComparison: '+12%',
    startDate: '2022-06-01',
    endDate: '2025-05-31',
    operator: 'Tel Tech Corporation',
    status: 'High Priority Renewal',
    paymentInfo: 'Monthly ACH Auto-Pay',
    daysUntilExpiration: 156,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    // Add additional fields for the detail modal
    name: 'Tel Tech Regional Hub',
    property: 'Peachtree Center',
    location: 'Atlanta, GA',
    monthlyRent: 685000,
    squareFootage: 180000,
    renewalStatus: 'Renewal Notice Sent',
    lastModified: '2024-08-20',
    documents: [
      { name: 'Regional Hub License Agreement', type: 'PDF', size: '3.8 MB', uploadDate: '2022-06-01' },
      { name: 'Telecommunications Infrastructure Plan', type: 'PDF', size: '2.2 MB', uploadDate: '2022-05-15' }
    ],
    financials: {
      monthlyRent: 685000,
      securityDeposit: 1370000,
      brokerFee: 685000,
      totalFirstYear: 9590000
    },
    contacts: {
      landlord: { name: 'Tel Tech Properties Southeast', phone: '(404) 555-0198', email: 'atlanta@teltech.com' },
      broker: { name: 'Marcus Johnson, JLL', phone: '(404) 555-0142', email: 'marcus.johnson@jll.com' }
    }
  },
  {
    id: 3,
    city: 'New York',
    type: 'Engineering Center',
    address: 'Tel Tech NYC, 101 Avenue of the Americas',
    size: '95,000 sq ft',
    cost: 485000,
    marketRateComparison: '-3%',
    startDate: '2023-07-01',
    endDate: '2025-06-30',
    operator: 'Tel Tech Corporation',
    status: 'Recently Renewed',
    paymentInfo: 'Monthly Auto-Pay',
    daysUntilExpiration: 245,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    // Add additional fields for the detail modal
    name: 'Tel Tech East Coast Operations',
    property: '101 Avenue of the Americas',
    location: 'New York, NY',
    monthlyRent: 485000,
    squareFootage: 95000,
    renewalStatus: 'Renewed',
    lastModified: '2024-06-15',
    documents: [
      { name: 'Engineering Center License', type: 'PDF', size: '2.9 MB', uploadDate: '2023-07-01' },
      { name: 'Security Infrastructure Plan', type: 'PDF', size: '1.6 MB', uploadDate: '2023-06-20' },
      { name: 'Renewed Agreement 2025-2027', type: 'PDF', size: '3.1 MB', uploadDate: '2024-06-15' }
    ],
    financials: {
      monthlyRent: 485000,
      securityDeposit: 970000,
      brokerFee: 485000,
      totalFirstYear: 6790000
    },
    contacts: {
      landlord: { name: 'Tel Tech Real Estate', phone: '(212) 555-0174', email: 'nyc@teltech.com' },
      broker: { name: 'David Chen, Newmark', phone: '(212) 555-0189', email: 'david.chen@newmark.com' }
    }
  },
  {
    id: 4,
    city: 'Seattle',
    type: 'Partnership Hub',
    address: 'Tel Tech Partnership Center, 15010 NE 36th St',
    size: '125,000 sq ft',
    cost: 398000,
    marketRateComparison: '-15%',
    startDate: '2023-09-01',
    endDate: '2025-08-31',
    operator: 'Tel Tech Corporation',
    status: 'Under Evaluation',
    paymentInfo: 'Quarterly Invoice',
    daysUntilExpiration: 298,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    // Add additional fields for the detail modal
    name: 'Tel Tech Partnership Center',
    property: 'Tel Tech Partnership Campus',
    location: 'Seattle, WA',
    monthlyRent: 398000,
    squareFootage: 125000,
    renewalStatus: 'Evaluation Phase',
    lastModified: '2024-09-10',
    documents: [
      { name: 'Partnership Hub Agreement', type: 'PDF', size: '4.2 MB', uploadDate: '2023-09-01' },
      { name: 'Joint Venture Addendum', type: 'PDF', size: '2.8 MB', uploadDate: '2023-08-15' }
    ],
    financials: {
      monthlyRent: 398000,
      securityDeposit: 796000,
      brokerFee: 0, // Direct partnership
      totalFirstYear: 5572000
    },
    contacts: {
      landlord: { name: 'Tel Tech Real Estate', phone: '(425) 555-0300', email: 'realestate@teltech.com' },
      broker: { name: 'Direct Partnership', phone: 'N/A', email: 'N/A' }
    }
  },
  {
    id: 5,
    city: 'London',
    type: 'Global Finance Center',
    address: 'Tel Tech Global Finance Center, One Canada Square',
    size: '200,000 sq ft',
    cost: 920000,
    marketRateComparison: '+5%',
    startDate: '2022-11-01',
    endDate: '2025-10-31',
    operator: 'Tel Tech Corporation',
    status: 'Pre-Negotiation',
    paymentInfo: 'Monthly Sterling Transfer',
    daysUntilExpiration: 398,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    // Add additional fields for the detail modal
    name: 'Tel Tech Global Finance Center',
    property: 'One Canada Square',
    location: 'London, UK',
    monthlyRent: 920000,
    squareFootage: 200000,
    renewalStatus: 'Pre-Negotiation',
    lastModified: '2024-08-30',
    documents: [
      { name: 'UK Financial Services License', type: 'PDF', size: '5.1 MB', uploadDate: '2022-11-01' },
      { name: 'FCA Compliance Certificate', type: 'PDF', size: '2.4 MB', uploadDate: '2024-01-15' },
      { name: 'Brexit Impact Assessment', type: 'PDF', size: '1.9 MB', uploadDate: '2023-03-10' }
    ],
    financials: {
      monthlyRent: 920000,
      securityDeposit: 2760000,
      brokerFee: 920000,
      totalFirstYear: 14720000
    },
    contacts: {
      landlord: { name: 'Tel Tech Management Ltd', phone: '+44 20 7555 0200', email: 'leasing@teltech.co.uk' },
      broker: { name: 'Sarah Williams, Savills', phone: '+44 20 7555 0156', email: 'sarah.williams@savills.com' }
    }
  },
  {
    id: 6,
    city: 'Dallas',
    type: 'Innovation Lab',
    address: 'Tel Tech Innovation Lab, 2600 Commerce St',
    size: '68,000 sq ft',
    cost: 198000,
    marketRateComparison: '-22%',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    operator: 'Tel Tech Corporation',
    status: 'Performing Well',
    paymentInfo: 'Bi-Annual Payment',
    daysUntilExpiration: 456,
    hasContract: true,
    isActive: true,
    isRenewable: true,
    // Add additional fields for the detail modal
    name: 'Tel Tech Innovation Lab',
    property: 'Deep Ellum Innovation Complex',
    location: 'Dallas, TX',
    monthlyRent: 198000,
    squareFootage: 68000,
    renewalStatus: 'Early Renewal Option',
    lastModified: '2024-07-22',
    documents: [
      { name: 'Innovation Lab License', type: 'PDF', size: '2.7 MB', uploadDate: '2023-01-01' },
      { name: 'R&D Tax Incentive Agreement', type: 'PDF', size: '1.3 MB', uploadDate: '2023-01-15' }
    ],
    financials: {
      monthlyRent: 198000,
      securityDeposit: 396000,
      brokerFee: 198000,
      totalFirstYear: 3168000
    },
    contacts: {
      landlord: { name: 'Tel Tech Innovation Alliance', phone: '(214) 555-0167', email: 'leasing@teltech.org' },
      broker: { name: 'Roberto Martinez, CBRE', phone: '(214) 555-0134', email: 'roberto.martinez@cbre.com' }
    }
  },
];

const licenseTypeData = [
  { name: 'Innovation Labs', value: 23, color: '#B3D9FF', percentage: 10.3 },
  { name: 'Partnership Hubs', value: 45, color: '#80C7FF', percentage: 20.2 },
  { name: 'Enterprise Centers', value: 89, color: '#28A745', percentage: 39.9 },
  { name: 'Global Headquarters', value: 66, color: '#005B94', percentage: 29.6 },
];

const COLORS = {
  'Flex (Hourly)': '#B3D9FF',
  'Dedicated (External)': '#80C7FF', 
  'Dedicated (LiquidSpace)': '#005B94'
};

export function LicenseTracker({
  onAIAssistantOpen = () => {},
  isAIDrawerOpen = false
}: LicenseTrackerProps) {
  const [licenses, setLicenses] = useState(mockLicenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [generatedCollections, setGeneratedCollections] = useState<Set<number>>(new Set());
  const [isAlternativeSpacesModalOpen, setIsAlternativeSpacesModalOpen] = useState(false);
  const [currentLicenseForCollection, setCurrentLicenseForCollection] = useState<any>(null);

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || license.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string, daysUntilExpiration: number) => {
    if (daysUntilExpiration <= 30) {
      return (
        <Badge 
          className="text-white rounded-full px-3 py-1 border-0" 
          style={{ backgroundColor: '#FFA500', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
        >
          Expiring Soon
        </Badge>
      );
    }
    if (daysUntilExpiration <= 90) {
      return (
        <Badge 
          className="text-white rounded-full px-3 py-1 border-0" 
          style={{ backgroundColor: '#FFA500', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
        >
          Renewal Due
        </Badge>
      );
    }
    return (
      <Badge 
        className="text-white rounded-full px-3 py-1 border-0" 
        style={{ backgroundColor: '#28A745', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
      >
        Active
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMarketRateColor = (rateComparison: string) => {
    // Extract numeric value from percentage string
    const numericValue = parseFloat(rateComparison.replace('%', ''));
    
    if (numericValue === 0) {
      return '#000000'; // Black for 0%
    } else if (numericValue >= 1) {
      return '#DC3545'; // Red for positive percentages (1% or higher)
    } else if (numericValue <= -1) {
      return '#28A745'; // Green for negative percentages (-1% or lower)
    } else {
      return '#000000'; // Black for values between -1% and 1% (exclusive)
    }
  };

  // License action handlers
  const handleViewLicense = (license: any) => {
    console.log('Opening license detail modal for:', license.name);
    setSelectedLicense(license);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedLicense(null);
    setIsDetailModalOpen(false);
  };

  const handleSaveLicense = (updatedLicense: any) => {
    console.log('License updated:', updatedLicense);
    // Update the license in the list
    setLicenses(prev => prev.map(l => 
      l.id === updatedLicense.id 
        ? { ...l, ...updatedLicense }
        : l
    ));
    handleCloseDetailModal();
  };

  const handleEditLicense = (license: any) => {
    // In a real app, this would open an edit modal or navigate to edit page
    console.log('Editing license:', license.id);
    // For demo purposes, open the detail modal in edit mode
    handleViewLicense(license);
  };

  const handleUploadContract = (license: any) => {
    // In a real app, this would open a file upload modal
    console.log('Uploading contract for license:', license.id);
    // For demo purposes, simulate adding a contract
    setLicenses(prev => prev.map(l => 
      l.id === license.id 
        ? { ...l, hasContract: true }
        : l
    ));
  };

  const handleDownloadAgreement = (license: any) => {
    // In a real app, this would trigger a file download
    console.log('Downloading agreement for license:', license.id);
    // For demo purposes, just log the action
  };

  const handleRenewLicense = (license: any) => {
    // In a real app, this would start the renewal workflow
    console.log('Renewing license:', license.id);
    // For demo purposes, just log the action
  };

  const handleTerminateLicense = (license: any) => {
    // In a real app, this would show a confirmation modal then terminate
    const confirmTerminate = window.confirm(`Are you sure you want to terminate the license for ${license.address}?`);
    if (confirmTerminate) {
      setLicenses(prev => prev.map(l => 
        l.id === license.id 
          ? { ...l, status: 'Terminated', isActive: false }
          : l
      ));
    }
  };

  const handleFlagForReview = (license: any) => {
    // In a real app, this would add a flag/tag to the license
    console.log('Flagging license for review:', license.id);
    // For demo purposes, just log the action
  };

  const handleGenerateCollection = (license: any) => {
    console.log('Generating collection for license:', license.id);
    // Mark this license as having a generated collection
    setGeneratedCollections(prev => new Set(prev).add(license.id));
    setCurrentLicenseForCollection(license);
    setIsAlternativeSpacesModalOpen(true);
  };

  const handleViewCollection = (license: any) => {
    console.log('Viewing collection for license:', license.id);
    setCurrentLicenseForCollection(license);
    setIsAlternativeSpacesModalOpen(true);
  };

  const handleViewFullCollection = () => {
    // In a real app, this would open the full collection in a new tab
    console.log('Opening full collection in new tab');
    window.open('#/collections', '_blank');
    setIsAlternativeSpacesModalOpen(false);
  };

  // Mock alternative spaces data based on license location
  const getAlternativeSpaces = (license: any) => {
    const getStateAbbreviation = (city: string) => {
      const cityStateMap: { [key: string]: string } = {
        'New York': 'NY',
        'San Francisco': 'CA',
        'Seattle': 'WA',
        'Austin': 'TX',
        'Chicago': 'IL',
        'Atlanta': 'GA',
        'Bellevue': 'WA',
        'Dallas': 'TX',
        'London': 'UK'
      };
      return cityStateMap[city] || 'CA';
    };

    const baseSpaces = [
      {
        id: '1',
        name: 'WeWork - Colony Square',
        image: 'https://images.unsplash.com/photo-1718220216044-006f43e3a9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU2NzUxMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 29048,
        priceUnit: 'month',
        rating: 5.0,
        location: `${license.city}, ${getStateAbbreviation(license.city)}`,
        address: `1175 Peachtree St NE, ${license.city}, ${getStateAbbreviation(license.city)} 30361`,
        type: 'Office Suite',
        capacity: '5 Offices – 66 Desks',
        bookingMode: 'Available Now – Online',
        amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen', 'More'],
        isAvailable: true
      },
      {
        id: '2',
        name: 'WeWork - Coda',
        image: 'https://images.unsplash.com/photo-1653463173471-a8230f38b3f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhjb3dvcmtpbmclMjBzcGFjZSUyMGludGVyaW9yfGVufDF8fHx8MTc1Njc0NTk4MHww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 68575,
        priceUnit: 'month',
        rating: 4.7,
        location: `${license.city}, ${getStateAbbreviation(license.city)}`,
        address: `756 West Peachtree Street Northwest, ${license.city}, ${getStateAbbreviation(license.city)} 30308`,
        type: 'Team Office',
        capacity: '87 Desks – 57 Desks, Diff Floors',
        bookingMode: 'Available Now – Online',
        amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen', 'More'],
        isAvailable: true
      },
      {
        id: '3',
        name: 'Industrious - Peachtree',
        image: 'https://images.unsplash.com/photo-1596749853719-e6aa1dc2eabe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YXRlJTIwb2ZmaWNlJTIwc3BhY2V8ZW58MXx8fHwxNzU2ODEyMDEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 19108,
        priceUnit: 'month',
        rating: 4.6,
        location: `${license.city}, ${getStateAbbreviation(license.city)}`,
        address: `7000 Central Pkwy, Suite 1600, ${license.city}, ${getStateAbbreviation(license.city)} 30328`,
        type: 'Team Office',
        capacity: '1 Suite | A',
        bookingMode: 'Available Now – Online',
        amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen', 'More'],
        isAvailable: true
      },
      {
        id: '4',
        name: 'Industrious - Downtown',
        image: 'https://images.unsplash.com/photo-1557804500-7a58fbcd4d1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwcm9vbSUyMG1lZXRpbmd8ZW58MXx8fHwxNzU2NzgzNTgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 8632,
        priceUnit: 'month',
        rating: 4.8,
        location: `${license.city}, ${getStateAbbreviation(license.city)}`,
        address: `191 Marietta Street, Northwest, ${license.city}, ${getStateAbbreviation(license.city)} 30303`,
        type: 'Team Office',
        capacity: '1 Suite | C',
        bookingMode: 'Available Now – Online',
        amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'More'],
        isAvailable: true
      },
      {
        id: '5',
        name: 'WeWork - Colony Point',
        image: 'https://images.unsplash.com/photo-1742440711276-679934f5b988?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGRlc2lnbnxlbnwxfHx8fDE3NTY3MDk0MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
        price: 55647,
        priceUnit: 'month',
        rating: 4.5,
        location: `${license.city}, ${getStateAbbreviation(license.city)}`,
        address: `87 Desk Suite, 197 Desk Suite, ${license.city}, ${getStateAbbreviation(license.city)}`,
        type: 'Team Office',
        capacity: '117 Desks',
        bookingMode: 'Offline with DASH',
        amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'More'],
        isAvailable: false
      },
      {
        id: '6',
        name: 'Executive Meeting Hub',
        image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjByb29tfGVufDF8fHx8MTc1NjgzMjUyMnww&ixlib=rb-4.1.0&q=80&w=1080',
        price: 4375,
        priceUnit: 'month',
        rating: 4.2,
        location: `${license.city}, ${getStateAbbreviation(license.city)}`,
        address: `Premium Business District, ${license.city}, ${getStateAbbreviation(license.city)}`,
        type: 'Coworking',
        capacity: '30 Desks',
        bookingMode: 'Available Now – Online',
        amenities: ['WiFi', 'Furnished', 'Hosted Reception', 'Kitchen'],
        isAvailable: true
      }
    ];

    return baseSpaces;
  };

  const totalLicenses = 223;
  const totalMonthlyCost = 4636000; // Enterprise-scale monthly costs
  const totalSeats = 58400; // Global workforce
  const costPerSeat = totalMonthlyCost / totalSeats;

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    // Position labels closer to center to prevent bleeding
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const ProgressBar = ({ value, max, color, label }: { value: number; max: number; color: string; label: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
          {value}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${(value / max) * 100}%`, 
            backgroundColor: color 
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <PageHeader
        icon={<FileText className="h-6 w-6" />}
        title="License Tracker"
        subtitle="View and manage all of your workspace licenses and view on on-demand booking in one place."
        onAIAssistantOpen={onAIAssistantOpen}
        isAIDrawerOpen={isAIDrawerOpen}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Enhanced Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Total Licenses Card */}
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#E3F2FD' }}
                  >
                    <Building2 className="h-5 w-5" style={{ color: '#005B94' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Total Licenses
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                      Across all locations
                    </div>
                  </div>
                </div>
                
                <div 
                  className="mb-4" 
                  style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.2, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {totalLicenses}
                </div>
              </div>
              
              <div className="space-y-3">
                <ProgressBar 
                  value={38} 
                  max={totalLicenses} 
                  color="#B3D9FF" 
                  label="Flex (Hourly)" 
                />
                <ProgressBar 
                  value={72} 
                  max={totalLicenses} 
                  color="#80C7FF" 
                  label="Dedicated (External)" 
                />
                <ProgressBar 
                  value={44} 
                  max={totalLicenses} 
                  color="#005B94" 
                  label="Dedicated (LiquidSpace)" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Total Monthly Cost Card */}
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: '#E8F5E8' }}
                  >
                    <DollarSign className="h-5 w-5" style={{ color: '#28A745' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      Total Monthly Cost
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                      All workspace expenses
                    </div>
                  </div>
                </div>
                
                <div 
                  className="mb-4" 
                  style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1.2, color: '#374151', fontFamily: 'Inter, sans-serif' }}
                >
                  {formatCurrency(totalMonthlyCost)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                      Total Seats
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    {totalSeats.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F9FA' }}>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" style={{ color: '#28A745' }} />
                    <span style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                      Cost per Seat
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#28A745', fontFamily: 'Inter, sans-serif' }}>
                    {formatCurrency(costPerSeat)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Pie Chart Card */}
          <Card className="bg-white rounded-xl shadow-sm border-0 p-6">
            <CardContent className="p-0 flex flex-col justify-between min-h-[280px]">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FFF3E0' }}
                >
                  <FileText className="h-5 w-5" style={{ color: '#FFA500' }} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                    License Distribution
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                    By workspace type
                  </div>
                </div>
              </div>
              
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Pie
                      data={licenseTypeData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={60}
                      innerRadius={25}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={2}
                      stroke="#ffffff"
                    >
                      {licenseTypeData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend */}
                <div className="absolute bottom-0 left-0 right-0">
                  <div className="flex justify-center gap-4">
                    {licenseTypeData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span style={{ fontSize: '11px', fontWeight: 400, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                          {entry.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Licenses Table Card */}
        <Card className="bg-white rounded-xl shadow-sm border-0">
          {/* Filter Section */}
          <div className="p-6 border-b" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex flex-wrap gap-3">
              <Select>
                <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="seattle">Seattle</SelectItem>
                  <SelectItem value="austin">Austin</SelectItem>
                  <SelectItem value="newyork">New York</SelectItem>
                  <SelectItem value="sanfrancisco">San Francisco</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="flex">Flex (Hourly)</SelectItem>
                  <SelectItem value="dedicated-external">Dedicated (External)</SelectItem>
                  <SelectItem value="dedicated-liquidspace">Dedicated (LiquidSpace)</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Operators</SelectItem>
                  <SelectItem value="wework">WeWork</SelectItem>
                  <SelectItem value="regus">Regus</SelectItem>
                  <SelectItem value="spaces">Spaces</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Term End" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="30days">30 days</SelectItem>
                  <SelectItem value="90days">90 days</SelectItem>
                  <SelectItem value="1year">1 year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9 bg-white border rounded" style={{ borderColor: '#e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={() => setShowUploadModal(true)}
                className="text-white px-4 py-2 rounded-md h-9"
                style={{ backgroundColor: '#005B94', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
              >
                Upload Licenses
              </Button>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f8f9fa' }}>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Status
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    City
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Type
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Address
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Size
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Cost/Month
                  </TableHead>
                  <TableHead className="py-4 px-6 text-center" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Rate vs Mkt
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Term End
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Operator
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Payment Info
                  </TableHead>
                  <TableHead className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLicenses.map((license) => (
                  <TableRow 
                    key={license.id} 
                    className="border-b hover:bg-gray-50 transition-colors" 
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <TableCell className="py-4 px-6">
                      {getStatusBadge(license.status, license.daysUntilExpiration)}
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 500, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {license.city}
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {license.type}
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {license.address}
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {license.size}
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', fontWeight: 600, color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {formatCurrency(license.cost)}
                    </TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <span style={{ 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: getMarketRateColor(license.marketRateComparison),
                        fontFamily: 'Inter, sans-serif' 
                      }}>
                        {license.marketRateComparison}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {license.endDate}
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {license.operator}
                    </TableCell>
                    <TableCell className="py-4 px-6" style={{ fontSize: '14px', color: '#374151', fontFamily: 'Inter, sans-serif' }}>
                      {license.paymentInfo}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <LicenseActionsDropdown 
                        license={license}
                        onViewLicense={() => handleViewLicense(license)}
                        onEditLicense={() => handleEditLicense(license)}
                        onUploadContract={() => handleUploadContract(license)}
                        onDownloadAgreement={() => handleDownloadAgreement(license)}
                        onRenewLicense={() => handleRenewLicense(license)}
                        onTerminateLicense={() => handleTerminateLicense(license)}
                        onFlagForReview={() => handleFlagForReview(license)}
                        onGenerateCollection={!generatedCollections.has(license.id) ? () => handleGenerateCollection(license) : undefined}
                        onViewCollection={generatedCollections.has(license.id) ? () => handleViewCollection(license) : undefined}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Modals */}
      <UploadLicenseModal 
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />

      <LicenseDetailModal 
        isOpen={isDetailModalOpen}
        license={selectedLicense}
        onClose={handleCloseDetailModal}
        onSave={handleSaveLicense}
      />

      {/* Alternative Spaces Modal */}
      <AlternativeSpacesModal
        isOpen={isAlternativeSpacesModalOpen}
        onClose={() => setIsAlternativeSpacesModalOpen(false)}
        licenseName={currentLicenseForCollection?.name || ''}
        spaces={currentLicenseForCollection ? getAlternativeSpaces(currentLicenseForCollection) : []}
        onViewFullCollection={handleViewFullCollection}
      />
    </div>
  );
}