import { Handle, Position, NodeProps } from '@xyflow/react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlowNodeData } from '@/types/flow';

export function TaskNode({ data, selected }: NodeProps<any>) { // Using any for simpler generic props for now, ideally strictly typed
    const nodeData = data as unknown as FlowNodeData;
    return (
        <div className={cn(
            "px-4 py-2 shadow-md rounded-md bg-card border-2 min-w-[150px]",
            selected ? "border-primary" : "border-border"
        )}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-muted-foreground" />

            <div className="flex items-center">
                <div className="rounded-full w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 mr-2">
                    <Clock className="w-4 h-4" />
                </div>
                <div>
                    <div className="text-sm font-bold">{nodeData.label || 'Task'}</div>
                    <div className="text-xs text-muted-foreground">{nodeData.duration ? `${nodeData.duration}m` : 'no duration'}</div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-muted-foreground" />
        </div>
    );
}
