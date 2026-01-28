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
        }),
        {
            name: 'flows-storage',
        }
    )
);
