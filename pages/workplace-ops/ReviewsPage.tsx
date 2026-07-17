import React from 'react';
import { WorkplaceReviews } from '../../components/WorkplaceReviews';
import { useAIDrawer } from '../../context/AIDrawerContext';

export default function ReviewsPage() {
  const { openGeneric, isOpen } = useAIDrawer();
  return <WorkplaceReviews onAIAssistantOpen={openGeneric} isAIDrawerOpen={isOpen} />;
}
