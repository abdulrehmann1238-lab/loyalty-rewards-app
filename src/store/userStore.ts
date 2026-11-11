import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { INITIAL_MOCK_USER, INITIAL_USER_PREFERENCES } from '@/data/mockUser';
import { UserPreferences, UserProfile } from '@/types/user';

const safeStorage: StateStorage = {
  getItem: async (name) => {
    if (typeof window === 'undefined' && typeof navigator === 'undefined') {
      return null;
    }
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    if (typeof window === 'undefined' && typeof navigator === 'undefined') {
      return;
    }
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Ignore persistence write errors in restricted contexts
    }
  },
  removeItem: async (name) => {
    if (typeof window === 'undefined' && typeof navigator === 'undefined') {
      return;
    }
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Ignore
    }
  },
};

interface UserState {
  isAuthenticated: boolean;
  isDemoSession: boolean;
  hasSeenIntro: boolean;
  user: UserProfile;
  preferences: UserPreferences;
  markIntroSeen: () => void;
  loginAsDemo: () => void;
  loginWithCredentials: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, 'fullName' | 'email' | 'phone'>>) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetDemoUser: () => void;
}

function deriveInitials(fullName: string): { firstName: string; initials: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] || 'Alex';
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : firstName.slice(0, 2).toUpperCase();
  return { firstName, initials };
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isDemoSession: true,
      hasSeenIntro: false,
      user: INITIAL_MOCK_USER,
      preferences: INITIAL_USER_PREFERENCES,

      markIntroSeen: () => set({ hasSeenIntro: true }),

      loginAsDemo: () =>
        set({
          isAuthenticated: true,
          isDemoSession: true,
        }),

      loginWithCredentials: async (email: string) => {
        await new Promise((resolve) => setTimeout(resolve, 680));
        set((state) => ({
          isAuthenticated: true,
          isDemoSession: true,
          user: {
            ...state.user,
            email: email.trim() || state.user.email,
          },
        }));
      },

      logout: () =>
        set({
          isAuthenticated: false,
        }),

      updateProfile: (updates) =>
        set((state) => {
          const nextName = updates.fullName ?? state.user.fullName;
          const { firstName, initials } = deriveInitials(nextName);
          return {
            user: {
              ...state.user,
              ...updates,
              fullName: nextName,
              firstName,
              initials,
            },
          };
        }),

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...updates,
          },
        })),

      resetDemoUser: () =>
        set({
          user: INITIAL_MOCK_USER,
          preferences: INITIAL_USER_PREFERENCES,
        }),
    }),
    {
      name: 'verdant_user_demo_storage_v1',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        preferences: state.preferences,
      }),
    }
  )
);

