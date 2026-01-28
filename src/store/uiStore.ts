import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewType = 'calendar' | 'flow-builder' | 'templates' | 'settings';

interface UIStore {
    sidebarOpen: boolean;
    detailsPanelOpen: boolean;
    activeDetailsTab: string;
    currentView: ViewType;
    selectedCronId: string | null;

    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleDetailsPanel: () => void;
    setDetailsPanelOpen: (open: boolean) => void;
    setView: (view: ViewType) => void;
    setSelectedCronId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            detailsPanelOpen: false,
            activeDetailsTab: 'info',
            currentView: 'calendar',
            selectedCronId: null,

            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            toggleDetailsPanel: () => set((state) => ({ detailsPanelOpen: !state.detailsPanelOpen })),
            setDetailsPanelOpen: (open) => set({ detailsPanelOpen: open }),
            setView: (view) => set({ currentView: view }),
            setSelectedCronId: (id) => set({ selectedCronId: id, detailsPanelOpen: !!id }),
        }),
        {
            name: 'ui-storage',
        }
    )
);
