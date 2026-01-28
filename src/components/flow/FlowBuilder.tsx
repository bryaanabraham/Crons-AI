import { useCallback, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TaskNode } from './TaskNode';
import { DeadlineNode } from './DeadlineNode';
import { useFlowStore } from '@/store/flowStore';
import { FlowNode, FlowEdge } from '@/types/flow';

const nodeTypes: any = {
    taskMode: TaskNode,
    deadlineMode: DeadlineNode,
};

export function FlowBuilder() {
    const { activeFlowId, getFlow, updateFlowNodes, updateFlowEdges, addFlow, setActiveFlow } = useFlowStore();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Load flow data when active ID changes
    useEffect(() => {
        if (activeFlowId) {
            const flow = getFlow(activeFlowId);
            if (flow) {
                setNodes(flow.nodes as unknown as Node[]); // Cast for compatibility
                setEdges(flow.edges as unknown as any[]);
            }
        }
    }, [activeFlowId, getFlow, setNodes, setEdges]);

    // Sync back to store (debouncing would be better in prod, but immediate is fine for MVP)
    useEffect(() => {
        if (activeFlowId && nodes.length > 0) {
            updateFlowNodes(activeFlowId, nodes as unknown as FlowNode[]);
        }
    }, [nodes, activeFlowId, updateFlowNodes]);

    useEffect(() => {
        if (activeFlowId && edges.length > 0) {
            updateFlowEdges(activeFlowId, edges as unknown as FlowEdge[]);
        }
    }, [edges, activeFlowId, updateFlowEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleCreateFlow = () => {
        const newFlowId = crypto.randomUUID();
        addFlow({
            id: newFlowId,
            name: 'New Flow',
            nodes: [],
            edges: [],
            status: 'draft',
            currentActiveNodes: [],
            isTemplate: false,
            createdAt: new Date().toISOString()
        });
        setActiveFlow(newFlowId);
    };

    if (!activeFlowId) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-muted/20 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground mb-4">No flow selected</p>
                <button
                    onClick={handleCreateFlow}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90"
                >
                    Create New Flow
                </button>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-background rounded-xl border shadow-sm overflow-hidden flex flex-col">
            <div className="p-2 border-b flex justify-between items-center bg-card">
                <span className="font-semibold text-sm">Flow Builder</span>
                <div className="text-xs text-muted-foreground">
                    {nodes.length} nodes • {edges.length} edges
                </div>
            </div>
            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}
