/**
 * InviteCodeDisplay Component
 *
 * Displays invite code with copy functionality
 */

import React, { useState } from 'react';
import {
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface InviteCodeDisplayProps {
  code: string;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
  isRegenerating?: boolean;
}

const InviteCodeDisplay: React.FC<InviteCodeDisplayProps> = ({
  code,
  onRegenerate,
  canRegenerate = false,
  isRegenerating = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy invite code:', error);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Invite Code
        </p>
        <p className="text-xs text-gray-500">
          Share this code with others to invite them to this space
        </p>
      </div>

      {/* Code Display */}
      <div className="flex items-center gap-2">
        {/* Code Box */}
        <div className="flex-1 flex items-center justify-between px-6 py-4 bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-lg">
          <span className="text-3xl font-bold tracking-widest text-primary-700 select-all">
            {code}
          </span>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="ml-4 p-2 rounded-lg hover:bg-white/50 transition-colors group"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="h-6 w-6 text-green-600" />
            ) : (
              <ClipboardDocumentIcon className="h-6 w-6 text-primary-600 group-hover:text-primary-700" />
            )}
          </button>
        </div>

        {/* Regenerate Button (Optional) */}
        {canRegenerate && onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate new code"
          >
            <ArrowPathIcon
              className={`h-6 w-6 text-gray-600 ${
                isRegenerating ? 'animate-spin' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Copied Feedback */}
      {copied && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckIcon className="h-4 w-4" />
          <span>Copied to clipboard!</span>
        </div>
      )}
    </div>
  );
};

export default InviteCodeDisplay;
