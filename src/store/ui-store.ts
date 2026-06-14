import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
}

interface UIStore {
  // Theme state
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Recording state
  recording: RecordingState;
  setRecording: (recording: Partial<RecordingState>) => void;
  resetRecording: () => void;

  // Modal state
  modals: {
    isSettingsOpen: boolean;
    isDeleteConfirmOpen: boolean;
    isUpgradeOpen: boolean;
  };
  openModal: (modal: keyof UIStore['modals']) => void;
  closeModal: (modal: keyof UIStore['modals']) => void;

  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const initialRecordingState: RecordingState = {
  isRecording: false,
  isPaused: false,
  duration: 0,
  audioBlob: null,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
      },

      // Recording
      recording: initialRecordingState,
      setRecording: (recording) =>
        set((state) => ({
          recording: { ...state.recording, ...recording },
        })),
      resetRecording: () => set({ recording: initialRecordingState }),

      // Modals
      modals: {
        isSettingsOpen: false,
        isDeleteConfirmOpen: false,
        isUpgradeOpen: false,
      },
      openModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: true },
        })),
      closeModal: (modal) =>
        set((state) => ({
          modals: { ...state.modals, [modal]: false },
        })),

      // Sidebar
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'rehearse-ai-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
