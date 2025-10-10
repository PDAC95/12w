/**
 * Space Store
 *
 * Zustand store for managing active space and space switching
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Space } from '@/types/Space.types';

interface SpaceState {
  activeSpace: Space | null;
  recentSpaces: Space[];
  setActiveSpace: (space: Space) => void;
  addRecentSpace: (space: Space) => void;
  clearActiveSpace: () => void;
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set, get) => ({
      activeSpace: null,
      recentSpaces: [],

      setActiveSpace: (space: Space) => {
        set({ activeSpace: space });
        get().addRecentSpace(space);
      },

      addRecentSpace: (space: Space) => {
        set((state) => {
          // Remove if already exists
          const filtered = state.recentSpaces.filter((s) => s.id !== space.id);
          // Add to beginning, keep max 5
          return {
            recentSpaces: [space, ...filtered].slice(0, 5),
          };
        });
      },

      clearActiveSpace: () => {
        set({ activeSpace: null });
      },
    }),
    {
      name: 'wallai-active-space',
    }
  )
);
