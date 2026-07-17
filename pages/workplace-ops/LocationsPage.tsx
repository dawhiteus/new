import React from 'react';
import { WorkplaceLocations } from '../../components/WorkplaceLocations';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function LocationsPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceLocations onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
