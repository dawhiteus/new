import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';

import LicenseTrackerPage    from './pages/license-admin/LicenseTrackerPage';
import PaymentsDashboardPage from './pages/license-admin/PaymentsDashboardPage';
import FundingSourcesPage    from './pages/license-admin/FundingSourcesPage';
import TasksPage             from './pages/license-admin/TasksPage';

import DashboardPage         from './pages/workplace-ops/DashboardPage';
import LiquidAIPage          from './pages/workplace-ops/LiquidAIPage';
import TeamsPage             from './pages/workplace-ops/TeamsPage';
import LocationsPage         from './pages/workplace-ops/LocationsPage';
import ActivityPage          from './pages/workplace-ops/ActivityPage';
import ReservationsPage      from './pages/workplace-ops/ReservationsPage';
import SearchesPage          from './pages/workplace-ops/SearchesPage';
import ReviewsPage           from './pages/workplace-ops/ReviewsPage';
import SetupPage             from './pages/workplace-ops/SetupPage';
import BrandingPage          from './pages/workplace-ops/BrandingPage';

import TransactionsPage           from './pages/transaction-manager/TransactionsPage';
import TransactionTasksPage       from './pages/transaction-manager/TransactionTasksPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true,                         element: <Navigate to="/transactions/list" replace /> },

      // License Administrator
      { path: 'license/tracker',             element: <LicenseTrackerPage />    },
      { path: 'license/payments',            element: <PaymentsDashboardPage /> },
      { path: 'license/funding',             element: <FundingSourcesPage />    },
      { path: 'license/tasks',               element: <TasksPage />             },

      // Workplace Operations
      { path: 'workplace/dashboard',         element: <DashboardPage />         },
      { path: 'workplace/liquid-ai',         element: <LiquidAIPage />          },
      { path: 'workplace/teams',             element: <TeamsPage />             },
      { path: 'workplace/locations',         element: <LocationsPage />         },
      { path: 'workplace/activity',          element: <ActivityPage />          },
      { path: 'workplace/activity/reservations', element: <ReservationsPage /> },
      { path: 'workplace/activity/searches',     element: <SearchesPage />     },
      { path: 'workplace/activity/reviews',      element: <ReviewsPage />      },
      { path: 'workplace/setup',             element: <SetupPage />             },
      { path: 'workplace/branding',          element: <BrandingPage />          },

      // Transaction Manager
      { path: 'transactions/list',           element: <TransactionsPage />           },
      { path: 'transactions/tasks',          element: <TransactionTasksPage />       },
    ],
  },
]);
