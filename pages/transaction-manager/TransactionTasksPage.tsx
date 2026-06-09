import React from 'react';
import { TransactionTasks } from '../../components/TransactionTasks';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function TransactionTasksPage() {
  const { openDrawer, isOpen } = useAIDrawer();
  return (
    <TransactionTasks
      onAIAssistantOpen={openDrawer}
      isAIDrawerOpen={isOpen}
    />
  );
}
