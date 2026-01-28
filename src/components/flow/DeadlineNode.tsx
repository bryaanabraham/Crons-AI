import { Handle, Position, NodeProps } from '@xyflow/react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlowNodeData } from '@/types/flow';

export function DeadlineNode({ data, selected }: NodeProps<any>) {
    const nodeData = data as unknown as FlowNodeData;
    return (
        <div className={cn(
            "px-4 py-2 shadow-md rounded-md bg-card border-2 min-w-[150px] border-orange-200",
            selected ? "border-orange-500" : "border-orange-200"
        )}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-orange-400" />

            <div className="flex items-center">
                <div className="rounded-full w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 mr-2">
                    <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                    <div className="text-sm font-bold">{nodeData.label || 'Deadline'}</div>
                    <div className="text-xs text-muted-foreground">Critical Path</div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-orange-400" />
        </div>
    );
}
