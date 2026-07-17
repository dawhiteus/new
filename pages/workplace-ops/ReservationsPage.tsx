import React from 'react';
import { WorkplaceReservations } from '../../components/WorkplaceReservations';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function ReservationsPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceReservations onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
