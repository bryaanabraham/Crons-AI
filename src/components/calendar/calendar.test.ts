
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { mapCronsToEvents } from './calendarUtils';
import { Cron, CronMode, CronStatus } from '@/types/cron';

describe('Property 1: Cron Visual Consistency', () => {
    const cronModeArb = fc.constantFrom('task', 'deadline') as fc.Arbitrary<CronMode>;
    const cronStatusArb = fc.constantFrom('pending', 'active', 'completed', 'overdue') as fc.Arbitrary<CronStatus>;

    const cronArb = fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 1 }),
        description: fc.option(fc.string()).map(d => d === null ? undefined : d),
        mode: cronModeArb,
        status: cronStatusArb,
        duration: fc.integer({ min: 1, max: 100 }),
        flowId: fc.uuid(),
        nodeId: fc.uuid(),
        dependencies: fc.array(fc.uuid()),
        // Generate dates within a reasonable range to avoid invalid dates
        scheduledDate: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') })).map(d => d ? d.toISOString() : undefined),
        deadline: fc.option(fc.date({ min: new Date('2020-01-01'), max: new Date('2030-01-01') })).map(d => d ? d.toISOString() : undefined),
        createdAt: fc.constant(new Date().toISOString()),
        updatedAt: fc.constant(new Date().toISOString()),
    });

    test('Mapped events match scheduled crons exactly', () => {
        fc.assert(
            fc.property(fc.array(cronArb), (crons) => {
                const events = mapCronsToEvents(crons);

                // Filter input crons to what we expect to be mapped
                const expectedCrons = crons.filter(c => c.scheduledDate || c.deadline);

                expect(events).toHaveLength(expectedCrons.length);

                events.forEach(event => {
                    const originalCron = crons.find(c => c.id === event.id);
                    expect(originalCron).toBeDefined();
                    expect(event.title).toBe(originalCron?.title);

                    // Verify props
                    const extended = event.extendedProps as { cron: Cron };
                    expect(extended.cron).toEqual(originalCron);
                });
            })
        );
    });
});
