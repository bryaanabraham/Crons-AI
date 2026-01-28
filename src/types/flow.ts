import { SchedulingRule, CronMode } from './cron';

export type FlowNodeType = 'taskMode' | 'deadlineMode' | 'conditional' | 'parallel';
export type FlowStatus = 'draft' | 'active' | 'paused' | 'completed';
export type FlowEdgeType = 'default' | 'conditional';

export interface FlowNodeData extends Record<string, unknown> {
    label?: string;
    description?: string;
    duration?: number;
    schedulingRule?: SchedulingRule;
    mode?: CronMode;
    deadline?: Date | string;
}

export interface FlowNode {
    id: string;
    type: FlowNodeType;
    position: { x: number; y: number };
    data: FlowNodeData;
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    type?: FlowEdgeType;
    data?: {
        condition?: string;
        delay?: SchedulingRule;
    };
}

export interface CronFlow {
    id: string;
    name: string;
    description?: string;

    // Flow structure (React Flow format)
    nodes: FlowNode[];
    edges: FlowEdge[];

    // Execution state
    status: FlowStatus;
    currentActiveNodes: string[];

    // Template information
    isTemplate: boolean;
    templateCategory?: string;

    // AI generation metadata
    generatedFromPrompt?: string;
    aiOptimizations?: string[];

    // Timestamps
    createdAt: Date | string;
    startedAt?: Date | string;
    completedAt?: Date | string;
}
