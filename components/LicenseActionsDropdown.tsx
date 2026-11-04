import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';

interface License {
  id: number;
  [key: string]: any;
}

interface LicenseActionsDropdownProps {
  license: License;
  onViewDetails?: (license: License) => void;
  onViewPayments?: (license: License) => void;
  onViewTasks?: (license: License) => void;
  onEdit?: (license: License) => void;
  onCreateCollection?: (license: License) => void;
  onViewCollection?: (license: License) => void;
  onCreateRequirement?: (license: License) => void;
}

const itemStyle: React.CSSProperties = { fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', color: '#1A1A1A' };
const itemClass = 'px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-gray-50 focus:bg-gray-100';

/** Row actions, matching the production License Administrator menu, plus Create New Requirement. */
export function LicenseActionsDropdown({
  license, onViewDetails, onViewPayments, onViewTasks, onEdit, onCreateCollection, onViewCollection, onCreateRequirement,
}: LicenseActionsDropdownProps) {
  const items: { label: string; run?: (l: License) => void }[] = [
    { label: 'View Details', run: onViewDetails },
    { label: 'View Payments', run: onViewPayments },
    { label: 'View Tasks', run: onViewTasks },
    { label: 'Edit', run: onEdit },
    onViewCollection ? { label: 'View collection', run: onViewCollection } : { label: 'Create collection', run: onCreateCollection },
    { label: 'Create New Requirement', run: onCreateRequirement },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={(e) => e.stopPropagation()} aria-label="Row actions">
          <MoreHorizontal className="h-4 w-4" style={{ color: '#6B7280' }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white border border-gray-200 shadow-md p-2"
        style={{ width: 220, borderRadius: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((it) => (
          <DropdownMenuItem key={it.label} onClick={() => it.run?.(license)} className={itemClass} style={itemStyle}>
            {it.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
