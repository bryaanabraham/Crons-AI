import { Cron } from '@/types/cron';
import { EventInput } from '@fullcalendar/core';

export function mapCronsToEvents(crons: Cron[]): EventInput[] {
    return crons
        .filter(cron => cron.scheduledDate || cron.deadline) // Only show scheduled items
        .map(cron => {
            let start = cron.scheduledDate ? new Date(cron.scheduledDate) : new Date();
            if (cron.mode === 'deadline' && cron.deadline) {
                start = new Date(cron.deadline);
            }

            // Add duration if available
            let end;
            if (cron.duration) {
                end = new Date(start.getTime() + cron.duration * 60000);
            }

            return {
                id: cron.id,
                title: cron.title,
                start: start,
                end: end,
                extendedProps: { cron }, // Pass full cron object for content render
                className: 'cron-event-container'
            };
        });
}
