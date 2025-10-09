/**
 * WelcomePage - Onboarding Step 1
 *
 * Welcome screen that introduces users to Wallai
 * and guides them to start the configuration process.
 */

import { SparklesIcon, UsersIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useOnboarding } from '@/context/OnboardingContext';

export default function WelcomePage() {
  const { nextStep } = useOnboarding();

  const handleStart = () => {
    nextStep(); // Navigate to space setup
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <img
            src="/logo/horizontal.png"
            alt="Wallai"
            className="h-20 mx-auto mb-6"
            onError={(e) => {
              // Fallback if image doesn't exist
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="text-sm text-gray-500 font-medium">
            Step 1 of 3
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-slide-up">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Wallai! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              We'll set up your personal financial space in less than 2 minutes
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-teal-50 hover:bg-teal-100 transition-colors">
              <div className="flex-shrink-0">
                <SparklesIcon className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  AI-Powered Insights
                </h3>
                <p className="text-sm text-gray-600">
                  Get smart suggestions to optimize your spending
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Collaborate Easily
                </h3>
                <p className="text-sm text-gray-600">
                  Share budgets with family or roommates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Track Everything
                </h3>
                <p className="text-sm text-gray-600">
                  Monitor expenses and reach your financial goals
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="flex-shrink-0">
                <LightBulbIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Smart Budgeting
                </h3>
                <p className="text-sm text-gray-600">
                  Use proven frameworks like 50/30/20
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-green-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Get Started
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-500">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">$2M+</div>
                <div className="text-sm text-gray-500">Money Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-500">User Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your financial data is encrypted and secure 🔒
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
