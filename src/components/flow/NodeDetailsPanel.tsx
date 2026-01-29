import { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { FlowNodeData } from '@/types/flow';
import { X, CalendarClock, AlignLeft } from 'lucide-react';
import { SchedulingRule } from '@/types/cron';

interface NodeDetailsPanelProps {
    node: Node | null;
    onChange: (nodeId: string, data: FlowNodeData) => void;
    onClose: () => void;
}

export function NodeDetailsPanel({ node, onChange, onClose }: NodeDetailsPanelProps) {
    // Local state for immediate feedback, synced with props
    const [data, setData] = useState<FlowNodeData | null>(null);

    useEffect(() => {
        if (node) {
            setData(node.data as unknown as FlowNodeData);
        } else {
            setData(null);
        }
    }, [node]);

    if (!node || !data) return null;

    const handleChange = (field: keyof FlowNodeData, value: any) => {
        const newData = { ...data, [field]: value };
        setData(newData);
        onChange(node.id, newData);
    };

    const handleSchedulingChange = (hours: number) => {
        const rule: SchedulingRule = {
            type: hours === 0 ? 'immediate' : 'relative',
            relativeHours: hours
        };
        handleChange('schedulingRule', rule);
    };

    return (
        <div className="absolute top-4 right-4 z-20 w-80 bg-background/95 backdrop-blur shadow-xl rounded-lg border border-border flex flex-col max-h-[calc(100%-2rem)] animate-in slide-in-from-right-5">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
                <span className="font-semibold text-sm">Action Details</span>
                <button onClick={onClose} className="hover:bg-muted p-1 rounded-md">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Title */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Action Title</label>
                    <input
                        type="text"
                        value={data.label || ''}
                        onChange={(e) => handleChange('label', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-bold focus:ring-1 focus:ring-primary"
                        placeholder="e.g. Email Client"
                    />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1">
                        <AlignLeft className="w-3 h-3" /> Description
                    </label>
                    <textarea
                        value={data.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full h-24 px-3 py-2 bg-background border border-input rounded-md text-sm resize-none focus:ring-1 focus:ring-primary"
                        placeholder="Add details, links, or instructions..."
                    />
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Duration (h)</label>
                        <input
                            type="number"
                            min="0.1"
                            step="0.5"
                            value={data.duration || 1}
                            onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="h-px bg-border" />

                {/* Scheduling Logic */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">Trigger Condition</span>
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg border border-border space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="schedule"
                                id="imm"
                                checked={!data.schedulingRule || data.schedulingRule.type === 'immediate'}
                                onChange={() => handleSchedulingChange(0)}
                            />
                            <label htmlFor="imm" className="text-sm cursor-pointer">Start immediately after previous</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="schedule"
                                id="rel"
                                checked={data.schedulingRule?.type === 'relative'}
                                onChange={() => handleSchedulingChange(1)} // Default 1h
                            />
                            <label htmlFor="rel" className="text-sm cursor-pointer">Wait for time delay</label>
                        </div>

                        {data.schedulingRule?.type === 'relative' && (
                            <div className="pl-6 pt-1 animate-in slide-in-from-top-2">
                                <label className="text-xs text-muted-foreground mr-2">Wait Hours:</label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-16 px-2 py-1 text-sm border rounded bg-background"
                                    value={data.schedulingRule.relativeHours || 0}
                                    onChange={(e) => handleSchedulingChange(parseFloat(e.target.value))}
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
