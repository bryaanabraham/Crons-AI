import { useCallback, useEffect } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { AIPromptModal } from '../ai/AIPromptModal';
import { NodePalette } from './NodePalette';
import { NodeDetailsPanel } from './NodeDetailsPanel';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';

import { TaskNode } from './TaskNode';
import { DeadlineNode } from './DeadlineNode';
import { useFlowStore } from '@/store/flowStore';
import { FlowNode, FlowEdge } from '@/types/flow';

const nodeTypes: any = {
    taskMode: TaskNode,
    deadlineMode: DeadlineNode,
};


// Wrap basic FlowBuilder content in a component that can use useReactFlow hooks
function FlowBuilderContent() {
    const { activeFlowId, getFlow, updateFlowNodes, updateFlowEdges, addFlow, setActiveFlow } = useFlowStore();
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

    // Selection state
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const { screenToFlowPosition } = useReactFlow();

    // Sync from store
    useEffect(() => {
        if (activeFlowId) {
            const flow = getFlow(activeFlowId);
            if (flow) {
                setNodes(flow.nodes as unknown as Node[]);
                setEdges(flow.edges as unknown as any[]);
            }
        }
    }, [activeFlowId, getFlow, setNodes, setEdges]);

    // Update store (debounced/effect)
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

    // Handle Selection Change
    const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
        if (nodes.length === 1) {
            setSelectedNode(nodes[0]);
        } else {
            setSelectedNode(null);
        }
    }, []);

    // Handle Data Change from Panel
    const onNodeDataChange = (nodeId: string, newData: any) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === nodeId) {
                // Update local state directly
                return { ...node, data: newData };
            }
            return node;
        }));
        // Update selected node ref as well to prevent flicker
        if (selectedNode?.id === nodeId) {
            setSelectedNode(curr => curr ? { ...curr, data: newData } : null);
        }
    };

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // DnD Handlers
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: crypto.randomUUID(),
                type,
                position,
                data: { label: type === 'taskMode' ? 'New Task' : 'Deadline' },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
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

    // ... Save Template handler ...
    const handleSaveAsTemplate = () => {
        if (!activeFlowId) return;
        const name = prompt("Enter template name:");
        if (name) {
            useFlowStore.getState().saveAsTemplate(activeFlowId, name);
            alert("Template saved!");
        }
    };

    if (!activeFlowId) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-muted/20 border-2 border-dashed rounded-xl">
                <p className="text-muted-foreground mb-4">No flow selected</p>
                <button onClick={handleCreateFlow} className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90">
                    Create New Flow
                </button>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-background-light dark:bg-background-dark workflow-dot-grid rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden flex flex-col relative">
            {/* Header Overlays */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none pl-48"> {/* Offset for palette */}
                <h1 className="text-2xl font-extrabold text-[#0d121b] dark:text-white tracking-tight">Workflow Canvas</h1>
                <p className="text-sm text-slate-500 font-medium">Design task dependencies</p>
            </div>

            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm font-bold shadow-sm transition-colors animate-in zoom-in-50 duration-300"
                >
                    <Sparkles className="w-4 h-4" />
                    AI Assistant
                </button>
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
                            setNodes([]);
                            setEdges([]);
                        }
                    }}
                    className="p-1.5 bg-background hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-input rounded-md shadow-sm transition-colors"
                    title="Clear Canvas"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button
                    onClick={handleSaveAsTemplate}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm border border-input transition-colors"
                >
                    Save as Template
                </button>
            </div>

            {/* Left Palette */}
            <NodePalette />

            {/* Right Details Panel */}
            {selectedNode && (
                <NodeDetailsPanel
                    node={selectedNode}
                    onChange={onNodeDataChange}
                    onClose={() => setSelectedNode(null)}
                />
            )}

            <div className="flex-1 relative">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onSelectionChange={onSelectionChange}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={1} />
                </ReactFlow>
            </div>

            <AIPromptModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
            />
        </div>
    );
}

export function FlowBuilder() {
    return (
        <ReactFlowProvider>
            <FlowBuilderContent />
        </ReactFlowProvider>
    );
}
