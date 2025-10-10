/**
 * QuickStatsCard Component
 * Displays key financial metrics and insights
 */
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import type { QuickStats } from '@/types/Dashboard.types';

interface QuickStatsCardProps {
  stats: QuickStats;
}

export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: stats.currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statsData = [
    {
      label: 'Avg Daily Spending',
      value: formatCurrency(stats.avg_daily_spending),
      icon: CalendarDaysIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Projected Monthly',
      value: formatCurrency(stats.projected_monthly),
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Top Category',
      value: stats.top_category,
      subtitle: formatCurrency(stats.top_category_amount),
      icon: TagIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Days Remaining',
      value: `${stats.days_remaining} days`,
      icon: ChartBarIcon,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>

      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-4`}>
            <div className="flex items-start justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            {stat.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
