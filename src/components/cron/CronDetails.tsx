import { Cron } from '@/types/cron';
import { useCronStore } from '@/store/cronStore';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists now
import { format } from 'date-fns';
import { FlowTimelineContainer } from './FlowTimelineContainer';

export function CronDetails({ cron }: { cron: Cron }) {
    const { completeCron } = useCronStore();

    const handleComplete = () => {
        completeCron(cron.id);
        // Optionally close panel or keep open to see status change
    };

    const isCompleted = cron.status === 'completed';
    const isPending = cron.status === 'pending';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-start justify-between">
                    <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border uppercase tracking-wide",
                        cron.mode === 'deadline' ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-blue-100 text-blue-800 border-blue-200"
                    )}>
                        {cron.mode}
                    </span>
                    <span className={cn(
                        "text-sm font-medium",
                        cron.status === 'completed' ? "text-green-600" :
                            cron.status === 'active' ? "text-blue-600" :
                                cron.status === 'overdue' ? "text-red-600" : "text-muted-foreground"
                    )}>
                        {cron.status}
                    </span>
                </div>
                <h1 className="mt-2 text-2xl font-bold">{cron.title}</h1>
                {cron.description && (
                    <p className="mt-2 text-muted-foreground">{cron.description}</p>
                )}
            </div>

            {/* Timing */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">
                            {cron.mode === 'deadline' ? 'Deadline' : 'Scheduled'}
                        </p>
                        <p className="text-sm font-medium">
                            {cron.scheduledDate ? format(new Date(cron.scheduledDate), 'PPP p') : 'Unscheduled'}
                            {cron.deadline && (
                                <span className="block text-red-500 text-xs">Due: {format(new Date(cron.deadline), 'PPP p')}</span>
                            )}
                        </p>
                    </div>
                </div>
                {cron.duration && (
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">Duration</p>
                            <p className="text-sm font-medium">{cron.duration} minutes</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Flow Context */}
            <div className="pt-2">
                <h3 className="text-sm font-semibold mb-3">Flow Progress</h3>
                <FlowTimelineContainer
                    currentCron={cron}
                />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
                <button
                    onClick={handleComplete}
                    disabled={isCompleted || isPending}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all",
                        isCompleted
                            ? "bg-green-100 text-green-700 cursor-default"
                            : isPending
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                    )}
                >
                    {isCompleted ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Completed
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            {isPending ? "Pending Dependencies" : "Mark as Complete"}
                        </>
                    )}
                </button>

                {isPending && cron.dependencies.length > 0 && (
                    <p className="mt-2 text-xs text-center text-muted-foreground">
                        Waiting for {cron.dependencies.length} tasks to complete.
                    </p>
                )}
            </div>
        </div>
    );
}
