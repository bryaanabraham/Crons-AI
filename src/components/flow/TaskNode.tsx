import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlowNodeData } from '@/types/flow';

export function TaskNode({ id, data, selected }: NodeProps<any>) {
    const { deleteElements } = useReactFlow();
    const nodeData = data as unknown as FlowNodeData;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteElements({ nodes: [{ id }] });
    };

    return (
        <div className={cn(
            "w-[340px] bg-white dark:bg-gray-900 rounded-xl shadow-sm border group transition-all p-5 relative",
            selected ? "border-primary/50 ring-2 ring-primary/10" : "border-slate-200 dark:border-slate-800 hover:border-primary/30"
        )}>
            {/* Drag Handle (Visual only for now) */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <span className="material-symbols-outlined text-gray-400">drag_indicator</span>
            </div>

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                    </div>
                    <input
                        className="bg-transparent border-none p-0 text-base font-bold text-[#0d121b] dark:text-white focus:ring-0 w-48 placeholder:text-slate-400 pointer-events-none"
                        placeholder="Task Title"
                        type="text"
                        defaultValue={nodeData.label || ''}
                        readOnly
                    />
                </div>
                <button
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#4c669a] dark:text-gray-400 uppercase tracking-wider">Duration</label>
                    <div className="flex items-center border border-[#e7ebf3] dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5">
                        <input
                            className="w-8 bg-transparent border-none p-0 text-sm font-medium focus:ring-0 text-slate-700 dark:text-slate-200 pointer-events-none"
                            type="text"
                            defaultValue={nodeData.duration || '1'}
                            readOnly
                        />
                        <span className="text-xs text-slate-500 font-medium">hr(s)</span>
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-[#4c669a] dark:text-gray-400 uppercase tracking-wider">Start Rule</label>
                    <div className="flex items-center border border-[#e7ebf3] dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 overflow-hidden">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {nodeData.schedulingRule?.type === 'relative' ? `Wait ${nodeData.schedulingRule.relativeHours}h` : 'After Prev'}
                        </span>
                    </div>
                </div>
            </div>

            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-400 dark:!bg-slate-600 !border-2 !border-white dark:!border-gray-900" />
            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-primary !border-2 !border-white dark:!border-gray-900" />
        </div>
    );
}
