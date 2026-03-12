import React from 'react';
import { Card, CardContent } from './ui/card';

interface MetricCardProps {
  label: string;
  value: string;
  subtext: string;
}

function MetricCard({ label, value, subtext }: MetricCardProps) {
  return (
    <Card 
      className="bg-white rounded-xl border flex-1"
      style={{ 
        borderColor: '#E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        minWidth: '200px',
      }}
    >
      <CardContent className="p-5">
        <div 
          className="uppercase tracking-wide mb-3"
          style={{ 
            fontSize: '11px', 
            fontWeight: 600, 
            color: '#6B7280', 
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          {label}
        </div>
        <div 
          className="mb-2"
          style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            color: '#005B94', 
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.1',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {value}
        </div>
        <div 
          style={{ 
            fontSize: '13px', 
            fontWeight: 400, 
            color: '#6B7280', 
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.4'
          }}
        >
          {subtext}
        </div>
      </CardContent>
    </Card>
  );
}

export function BrokerDealMetrics() {
  const metrics = [
    {
      label: 'Total Deal Volume',
      value: '$18.25M',
      subtext: 'Total value of all active and completed requirements',
    },
    {
      label: 'Forecasted Volume',
      value: '$5.8M',
      subtext: 'Expected value based on active requirements',
    },
    {
      label: 'In-Progress Deal Value',
      value: '$10.75M',
      subtext: 'Value of all requirements not yet signed',
    },
    {
      label: 'Leases Signed',
      value: '$6.4M',
      subtext: 'Total value of completed deals',
    },
    {
      label: 'Lost Opportunities',
      value: '$1.2M',
      subtext: 'Deals not proceeding or closed without lease',
    },
  ];

  return (
    <div className="w-full mb-6">
      <div className="flex gap-4 justify-between">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            subtext={metric.subtext}
          />
        ))}
      </div>
    </div>
  );
}