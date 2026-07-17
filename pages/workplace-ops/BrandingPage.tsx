import React from 'react';
import { WorkplaceBranding } from '../../components/WorkplaceBranding';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function BrandingPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceBranding onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
