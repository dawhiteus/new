import React from 'react';
import { PaymentManagement } from '../../components/PaymentManagement';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function PaymentsDashboardPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <PaymentManagement onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
