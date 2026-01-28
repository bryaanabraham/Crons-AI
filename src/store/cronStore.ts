import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cron, CronStatus } from '@/types/cron';
import { CronFlow } from '@/types/flow';
import { FlowExecutor } from '@/services/FlowExecutor';
import { CronEngine } from '@/services/cronEngine';

interface CronStore {
    crons: Cron[];
    addCron: (cron: Cron) => void;
    updateCron: (id: string, updates: Partial<Cron>) => void;
    deleteCron: (id: string) => void;
    setCrons: (crons: Cron[]) => void;
    getCron: (id: string) => Cron | undefined;
    startFlow: (flow: CronFlow) => void;
    completeCron: (id: string) => void;
}

export const useCronStore = create<CronStore>()(
    persist(
        (set, get) => ({
            crons: [],
            addCron: (cron) => set((state) => ({ crons: [...state.crons, cron] })),
            updateCron: (id, updates) =>
                set((state) => ({
                    crons: state.crons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
                })),
            deleteCron: (id) =>
                set((state) => ({ crons: state.crons.filter((c) => c.id !== id) })),
            setCrons: (crons) => set({ crons }),
            getCron: (id) => get().crons.find((c) => c.id === id),

            startFlow: (flow) => {
                const newCrons = FlowExecutor.startFlow(flow);
                set((state) => ({ crons: [...state.crons, ...newCrons] }));
            },

            completeCron: (id) => set((state) => {
                const cron = state.crons.find(c => c.id === id);
                if (!cron || cron.status === 'completed') return state;

                // Delegate to CronEngine for flow logic
                const { updatedCron, triggeredCrons } = CronEngine.completeCron(cron, state.crons);

                // Index triggered crons for easier update
                const triggeredMap = new Map(triggeredCrons.map(c => [c.id, c]));

                const nextCrons = state.crons.map(c => {
                    if (c.id === id) return updatedCron;
                    if (triggeredMap.has(c.id)) return triggeredMap.get(c.id)!;
                    return c;
                });

                return { crons: nextCrons };
            }),
        }),
        {
            name: 'crons-storage',
        }
    )
);
