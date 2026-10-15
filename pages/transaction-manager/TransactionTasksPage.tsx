import React from 'react';
import { RequirementTasksHome } from '../../components/RequirementTasksHome';

// Legacy TransactionTasks (deal-based task list) is intentionally not linked from the demo;
// its code remains in components/TransactionTasks.tsx.
export default function TransactionTasksPage() {
  return <RequirementTasksHome />;
}
