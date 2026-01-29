import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CronFlow, FlowNode, FlowEdge } from '@/types/flow';

interface FlowStore {
    flows: CronFlow[];
    activeFlowId: string | null;
    addFlow: (flow: CronFlow) => void;
    updateFlow: (id: string, updates: Partial<CronFlow>) => void;
    deleteFlow: (id: string) => void;
    setActiveFlow: (id: string | null) => void;
    getFlow: (id: string) => CronFlow | undefined;

    // Node/Edge operations for the active flow (or specific flow if needed, but usually specific to active context)
    // For simplicity, we'll expose general updates, but strict "addNode" actions might be better handled 
    // by updating the entire flow or specific helper methods. 
    // Let's verify requirements: "Visual Flow Builder" implies granular updates.
    updateFlowNodes: (flowId: string, nodes: FlowNode[]) => void;
    updateFlowEdges: (flowId: string, edges: FlowEdge[]) => void;

    // Template actions
    saveAsTemplate: (flowId: string, templateName: string) => void;
    instantiateTemplate: (templateId: string) => string; // Returns new flow ID
}

export const useFlowStore = create<FlowStore>()(
    persist(
        (set, get) => ({
            flows: [],
            activeFlowId: null,
            addFlow: (flow) => set((state) => ({ flows: [...state.flows, flow] })),
            updateFlow: (id, updates) =>
                set((state) => ({
                    flows: state.flows.map((f) => (f.id === id ? { ...f, ...updates } : f)),
                })),
            deleteFlow: (id) =>
                set((state) => ({
                    flows: state.flows.filter((f) => f.id !== id),
                    activeFlowId: state.activeFlowId === id ? null : state.activeFlowId,
                })),
            setActiveFlow: (id) => set({ activeFlowId: id }),
            getFlow: (id) => get().flows.find((f) => f.id === id),
            updateFlowNodes: (flowId, nodes) =>
                set((state) => ({
                    flows: state.flows.map((f) => (f.id === flowId ? { ...f, nodes } : f)),
                })),
            updateFlowEdges: (flowId, edges) =>
                set((state) => ({
                    flows: state.flows.map((f) => (f.id === flowId ? { ...f, edges } : f)),
                })),

            saveAsTemplate: (flowId, templateName) =>
                set((state) => {
                    const original = state.flows.find((f) => f.id === flowId);
                    if (!original) return state;

                    const template: CronFlow = {
                        ...original,
                        id: crypto.randomUUID(),
                        name: templateName,
                        isTemplate: true,
                        status: 'draft',
                        createdAt: new Date().toISOString(),
                    };
                    return { flows: [...state.flows, template] };
                }),

            instantiateTemplate: (templateId) => {
                const state = get();
                const template = state.flows.find((f) => f.id === templateId);
                if (!template) throw new Error('Template not found');

                const newFlowId = crypto.randomUUID();
                const newFlow: CronFlow = {
                    ...template,
                    id: newFlowId,
                    name: `${template.name} (Copy)`,
                    isTemplate: false,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                };

                set((state) => ({ flows: [...state.flows, newFlow] }));
                return newFlowId;
            },
        }),
        {
            name: 'flows-storage',
        }
    )
);
