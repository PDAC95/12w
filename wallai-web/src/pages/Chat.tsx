/**
 * Chat Page - AI Assistant
 * Chat with AI financial assistant
 */
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export function Chat() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {/* Icon */}
      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <ChatBubbleLeftRightIcon className="h-12 w-12 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        AI Chat Assistant
      </h1>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-8">
        Chat with your AI financial assistant. Get personalized advice, ask questions
        about your expenses, and receive smart recommendations.
      </p>

      {/* Coming Soon Badge */}
      <div className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-50 border border-primary-200 rounded-full">
        <span className="text-sm font-semibold text-primary-600">Coming Soon</span>
      </div>

      {/* Feature List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-12">
        {[
          'Natural language queries',
          'Expense analysis',
          'Budget recommendations',
          'Financial insights',
          'Transaction search',
          'Spending patterns',
        ].map((feature, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-700 font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
