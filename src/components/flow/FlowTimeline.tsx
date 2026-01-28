import { Cron } from '@/types/cron';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

interface FlowTimelineProps {
    crons: Cron[];
    onCronClick?: (cron: Cron) => void;
    className?: string;
}

export function FlowTimeline({ crons, onCronClick, className }: FlowTimelineProps) {
    // Sort logic: ideally topological or by scheduled time. 
    // For MVP simple sort by created/scheduled or just list them.
    // If we have dependencies, we should try to order parents before children.
    // A simple approach: Pending/Active first, or just alphabetical if no clear order?
    // Let's use a topological sort utility if we had one, or just trust the input order if it comes from a sorted source.
    // FlowExecutor creates them in node order. Let's assume input is somewhat ordered or just render simple list.

    const renderIcon = (cron: Cron) => {
        if (cron.status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        if (cron.status === 'active') return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
        if (cron.status === 'overdue') return <AlertTriangle className="w-5 h-5 text-red-500" />;
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    };

    return (
        <div className={cn("flex flex-col space-y-4", className)}>
            {crons.map((cron, index) => (
                <div key={cron.id} className="relative flex items-start group">
                    {/* Connector Line */}
                    {index !== crons.length - 1 && (
                        <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-border -mb-4 group-last:hidden" />
                    )}

                    {/* Status Icon */}
                    <div className="relative z-10 flex-shrink-0 mt-0.5 bg-background pr-2">
                        {renderIcon(cron)}
                    </div>

                    {/* Content */}
                    <div
                        className={cn(
                            "flex-1 p-3 rounded-lg border text-sm cursor-pointer transition-colors hover:bg-accent",
                            cron.status === 'active' ? "border-blue-200 bg-blue-50/50" : "border-border"
                        )}
                        onClick={() => onCronClick?.(cron)}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className={cn("font-medium", cron.status === 'completed' && "text-muted-foreground line-through")}>
                                {cron.title}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded-full bg-secondary">
                                {cron.status}
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {cron.duration}m • {cron.mode}
                        </div>
                    </div>
                </div>
            ))}
            {crons.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-4">
                    No steps in this timeline
                </div>
            )}
        </div>
    );
}
