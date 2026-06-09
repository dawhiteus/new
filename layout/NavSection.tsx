import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface NavSectionProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsed?: boolean;
}

export function NavSection({ label, children, defaultOpen = true, collapsed }: NavSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  if (collapsed) {
    return <div className="flex flex-col gap-0.5">{children}</div>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full px-3 py-1.5 rounded-[8px] group hover:bg-gray-50 transition-colors"
      >
        <span
          className="text-[11px] font-bold uppercase tracking-wider text-[#9ca3af] group-hover:text-[#6b7280] transition-colors"
        >
          {label}
        </span>
        <span className="text-[#9ca3af] group-hover:text-[#6b7280] transition-colors">
          {open
            ? <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            : <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
          }
        </span>
      </button>

      {open && (
        <div className={clsx('flex flex-col gap-0.5', !collapsed && 'pl-0')}>
          {children}
        </div>
      )}
    </div>
  );
}
