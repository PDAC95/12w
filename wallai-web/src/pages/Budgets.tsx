/**
 * Budgets Page
 * Dedicated page for budget management
 */

import React from 'react';
import { BudgetList } from '@/features/budgets';

const BudgetsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Budgets
          </h1>
          <p className="text-gray-600">
            Manage your monthly budgets and track your spending
          </p>
        </div>

        {/* Budget List Component */}
        <BudgetList />
      </div>
    </div>
  );
};

export default BudgetsPage;
