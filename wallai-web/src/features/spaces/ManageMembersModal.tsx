/**
 * ManageMembersModal Component
 *
 * Modal for viewing and managing space members
 * Owners and admins can remove members
 */

import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  UserGroupIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserIcon as UserIconSolid,
} from '@heroicons/react/24/outline';
import { spaceService } from '../../services/space.service';
import type { Space, SpaceMember } from '../../types/Space.types';
import { useAuthStore } from '../../stores/authStore';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  space: Space | null;
  onMemberRemoved: () => void;
}

const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  space,
  onMemberRemoved,
}) => {
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen && space) {
      loadMembers();
    }
  }, [isOpen, space]);

  const loadMembers = async () => {
    if (!space) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await spaceService.getSpaceMembers(space.id);
      setMembers(response.data.members);
    } catch (err: any) {
      console.error('Failed to load members:', err);
      setError('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    if (!space) return;

    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    setRemovingMemberId(memberId);
    setError('');

    try {
      await spaceService.removeMember(space.id, memberUserId);
      await loadMembers(); // Reload members list
      onMemberRemoved(); // Notify parent to reload spaces
    } catch (err: any) {
      console.error('Failed to remove member:', err);
      setError(err.message || 'Failed to remove member');
    } finally {
      setRemovingMemberId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-semibold">
            <ShieldCheckIcon className="h-3 w-3" />
            Owner
          </span>
        );
      case 'admin':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold">
            <ShieldCheckIcon className="h-3 w-3" />
            Admin
          </span>
        );
      case 'member':
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
            Member
          </span>
        );
      default:
        return null;
    }
  };

  const canRemoveMember = (member: SpaceMember) => {
    if (!space || !user) return false;

    // Cannot remove yourself
    if (member.user_id === user.id) return false;

    // Cannot remove owner
    if (member.role === 'owner') return false;

    // Only owners and admins can remove members
    const currentUserRole = space.user_role;
    if (currentUserRole !== 'owner' && currentUserRole !== 'admin') return false;

    // Admins cannot remove other admins
    if (currentUserRole === 'admin' && member.role === 'admin') return false;

    return true;
  };

  if (!isOpen || !space) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl">
              <UserGroupIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Space Members</h2>
              <p className="text-gray-600">{space.name}</p>
            </div>
          </div>

          {/* Member Count */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Current Members</p>
                <p className="text-2xl font-bold text-blue-700">{members.length} / 10</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-700">Available Slots</p>
                <p className="text-lg font-semibold text-blue-600">{10 - members.length}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Members List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No members found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all"
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {member.avatar_url ? (
                      <img
                        src={member.avatar_url}
                        alt={member.username || 'User'}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                        <UserIconSolid className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-base font-bold text-gray-900 truncate">
                        {member.full_name || member.username || 'Unknown User'}
                      </p>
                      {member.user_id === user?.id && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(member.role)}
                      {member.username && (
                        <span className="text-sm text-gray-500">@{member.username}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {canRemoveMember(member) && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.user_id)}
                      disabled={removingMemberId === member.id}
                      className="flex-shrink-0 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove member"
                    >
                      {removingMemberId === member.id ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
          >
            Close
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default ManageMembersModal;
