import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { useCronStore } from '@/store/cronStore';
import { useUIStore } from '@/store/uiStore';
import { CalendarEvent } from './CalendarEvent';
import { useMemo } from 'react';
import { EventInput } from '@fullcalendar/core';
import '@/index.css'; // Ensure tailwind is loaded, though it's global.
import { mapCronsToEvents } from './calendarUtils';
import { Cron } from '@/types/cron';

export function CalendarView() {
    const { crons } = useCronStore();
    const { setDetailsPanelOpen } = useUIStore();

    // Map crons to FullCalendar events
    const events = useMemo<EventInput[]>(() => {
        return mapCronsToEvents(crons);
    }, [crons]);

    const handleEventClick = (info: EventClickArg) => {
        const cron = info.event.extendedProps.cron as Cron;
        useUIStore.getState().setSelectedCronId(cron.id);
        setDetailsPanelOpen(true);
        console.log('Clicked cron:', cron);
    };

    return (
        <div className="h-full w-full bg-card rounded-xl border border-border shadow-sm p-4 overflow-hidden flex flex-col">
            <div className="flex-1 calendar-wrapper">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    editable={true} // Allow drag drop
                    selectable={true}
                    height="100%"
                    dayMaxEvents={true}
                    // Custom styling hooks
                    eventClassNames="!bg-transparent !border-0 !shadow-none !p-0"
                />
            </div>
        </div>
    );
}

function renderEventContent(eventInfo: any) {
    return <CalendarEvent event={eventInfo} />;
}
