/**
 * WeeklyChallengesCard Component
 * Displays weekly saving challenges with progress
 */
import { TrophyIcon, FireIcon } from '@heroicons/react/24/solid';
import type { WeeklyChallenge } from '@/types/Dashboard.types';

interface WeeklyChallengesCardProps {
  challenges: WeeklyChallenge[];
}

export function WeeklyChallengesCard({ challenges }: WeeklyChallengesCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (challenges.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Challenges</h3>
        <div className="text-center py-8">
          <TrophyIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No challenges available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-md border border-orange-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FireIcon className="w-6 h-6 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Weekly Challenges</h3>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge) => {
          const progressPercent = (challenge.progress / challenge.target) * 100;
          const isCompleted = challenge.progress >= challenge.target;

          return (
            <div
              key={challenge.id}
              className={`bg-white rounded-lg p-4 border-2 ${
                isCompleted ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {challenge.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{challenge.description}</p>
                </div>
                {isCompleted && (
                  <TrophyIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">
                    {challenge.progress} / {challenge.target}
                  </span>
                  <span className="text-xs font-medium text-primary-600">
                    Reward: {formatCurrency(challenge.reward, challenge.currency)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isCompleted
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                        : 'bg-gradient-to-r from-primary-400 to-teal-400'
                    }`}
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
