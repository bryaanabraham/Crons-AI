
import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import { DynamicScheduler } from './scheduler';
import { FlowValidator } from './validator';
import { CronEngine } from './cronEngine';
import { SchedulingRule, Cron } from '@/types/cron';

describe('Property 6: Scheduling Rule Application', () => {
    test('Relative scheduling (T+N) always results in a future date > reference date', () => {
        // Arbitrary for T+N rule
        const relativeRuleArb = fc.record({
            type: fc.constant('relative'),
            relativeDays: fc.integer({ min: 0, max: 365 }),
            relativeHours: fc.integer({ min: 0, max: 23 })
        }).filter(r => (r.relativeDays || 0) + (r.relativeHours || 0) > 0) as fc.Arbitrary<SchedulingRule>;

        fc.assert(
            fc.property(relativeRuleArb, fc.date({ min: new Date('2000-01-01'), max: new Date('3000-01-01') }), (rule, refDate) => {
                const result = DynamicScheduler.calculateNextDate(rule, refDate);
                expect(result.getTime()).toBeGreaterThan(refDate.getTime());
            })
        );
    });
});

describe('Property 12: Circular Dependency Prevention', () => {
    test('detectCycles identifies cycles in simple circular graphs', () => {
        // Create a cycle A -> B -> A
        const nodes = [
            { id: 'A', position: { x: 0, y: 0 }, data: {}, type: 'taskMode' },
            { id: 'B', position: { x: 0, y: 0 }, data: {}, type: 'taskMode' }
        ];
        const edges = [
            { id: 'e1', source: 'A', target: 'B' },
            { id: 'e2', source: 'B', target: 'A' }
        ];
        // @ts-ignore - mock minimal node/edge
        const hasCycle = FlowValidator.detectCycles(nodes, edges);
        expect(hasCycle).toBe(true);
    });

    test('detectCycles passes for linear graphs A -> B -> C', () => {
        const nodes = [
            { id: 'A', position: { x: 0, y: 0 }, data: {}, type: 'taskMode' },
            { id: 'B', position: { x: 0, y: 0 }, data: {}, type: 'taskMode' },
            { id: 'C', position: { x: 0, y: 0 }, data: {}, type: 'taskMode' }
        ];
        const edges = [
            { id: 'e1', source: 'A', target: 'B' },
            { id: 'e2', source: 'B', target: 'C' }
        ];
        // @ts-ignore
        const hasCycle = FlowValidator.detectCycles(nodes, edges);
        expect(hasCycle).toBe(false);
    });
});

describe('Property 4: Cascading Activation', () => {
    test('Completing a cron triggers dependents if all deps met', () => {
        const cron1: Cron = {
            id: 'c1', status: 'pending', mode: 'task', title: 'Start',
            dependencies: [], flowId: 'f1', nodeId: 'n1', duration: 60, createdAt: '', updatedAt: ''
        };
        const cron2: Cron = {
            id: 'c2', status: 'pending', mode: 'task', title: 'Next',
            dependencies: ['c1'], flowId: 'f1', nodeId: 'n2', duration: 60, createdAt: '', updatedAt: ''
        };

        const allCrons = [cron1, cron2];
        const result = CronEngine.completeCron(cron1, allCrons);

        expect(result.updatedCron.status).toBe('completed');
        expect(result.triggeredCrons).toHaveLength(1);
        expect(result.triggeredCrons[0].id).toBe('c2');
        expect(result.triggeredCrons[0].status).toBe('active');
    });
});
