import React from 'react';
import { WorkplaceSetup } from '../../components/WorkplaceSetup';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function SetupPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceSetup onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
