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
        pending: 'bg-slate-100 text-slate-700 border-slate-300',
        active: 'bg-blue-100 text-blue-700 border-blue-300',
        completed: 'bg-green-100 text-green-700 border-green-300',
        overdue: 'bg-red-100 text-red-700 border-red-300'
    };

    const statusColor = statusColors[cron.status] || statusColors.pending;

    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 w-full h-full rounded-md border text-xs font-medium overflow-hidden transition-all hover:brightness-95",
            statusColor,
            // FullCalendar sometimes sets strict heights, we want to fill it but keep it nice
            "shadow-sm"
        )}>
            {cron.status === 'completed' && <CheckCircle className="w-3 h-3 flex-shrink-0" />}
            {cron.status === 'active' && <Clock className="w-3 h-3 flex-shrink-0 animate-pulse" />}
            {cron.status === 'overdue' && <AlertTriangle className="w-3 h-3 flex-shrink-0" />}

            <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate">{cron.title}</span>
                {isDeadline && cron.deadline && (
                    <span className="text-[10px] opacity-75 truncate">
                        Due: {new Date(cron.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                )}
            </div>
        </div>
    );
}
