import React from 'react';
import { Tasks } from '../../components/Tasks';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function TasksPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <Tasks onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
