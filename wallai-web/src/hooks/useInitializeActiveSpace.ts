/**
 * useInitializeActiveSpace Hook
 * ================================
 * Automatically loads and sets the user's active space on app load
 */

import { useEffect } from 'react';
import { useSpaceStore } from '@/stores/spaceStore';
import { spaceService } from '@/services/space.service';
import { useAuthStore } from '@/stores/authStore';

export function useInitializeActiveSpace() {
  const { activeSpace, setActiveSpace } = useSpaceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Skip if already have an active space or no user
    if (activeSpace || !user) {
      return;
    }

    // Load user's spaces and set the first one as active
    const loadActiveSpace = async () => {
      try {
        const spaces = await spaceService.listSpaces();

        if (spaces && spaces.length > 0) {
          // Set the first space as active
          // TODO: In the future, load from user preferences or last used space
          setActiveSpace(spaces[0]);
          console.log('✅ Active space set:', spaces[0].name);
        } else {
          console.warn('⚠️ No spaces found for user');
        }
      } catch (error) {
        console.error('❌ Failed to load active space:', error);
      }
    };

    loadActiveSpace();
  }, [user, activeSpace, setActiveSpace]);
}
