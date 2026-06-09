import React from 'react';
import { LicenseTracker } from '../../components/LicenseTracker';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function LicenseTrackerPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <LicenseTracker onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
