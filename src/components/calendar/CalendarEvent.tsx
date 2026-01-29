import { Cron } from '@/types/cron';
import { EventContentArg } from '@fullcalendar/core';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CalendarEvent({ event }: { event: EventContentArg }) {
    const { extendedProps } = event.event;
    const cron = extendedProps.cron as Cron;
    const isDeadline = cron.mode === 'deadline';

    // Status Colors
    const statusColors = {
        pending: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400',
        active: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
        completed: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400',
        overdue: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
    };

    const statusColor = statusColors[cron.status] || statusColors.pending;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 w-full rounded border text-[11px] font-bold overflow-hidden transition-all hover:brightness-95 hover:scale-[1.02] shadow-sm",
            statusColor
        )}>
            <span className="material-symbols-outlined text-[14px]">
                {cron.status === 'completed' ? 'check_circle' : cron.status === 'active' ? 'play_circle' : 'schedule'}
            </span>

            <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate">{cron.title}</span>
            </div>
        </div>
    );
}
