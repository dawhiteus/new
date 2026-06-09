import React from 'react';
import { WorkplaceManagerDashboard } from '../../components/WorkplaceManagerDashboard';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function DashboardPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceManagerDashboard onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
