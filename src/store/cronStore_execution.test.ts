import { describe, it, expect, beforeEach } from 'vitest';
import { useCronStore } from './cronStore';
import { CronFlow } from '@/types/flow';

describe('CronStore Execution Logic', () => {
    beforeEach(() => {
        useCronStore.setState({ crons: [] });
    });

    it('should start a flow and instantiate crons', () => {
        const flow: CronFlow = {
            id: 'flow-1',
            name: 'Test Flow',
            nodes: [
                { id: 'node-1', type: 'taskMode', position: { x: 0, y: 0 }, data: { label: 'Task 1' } },
                { id: 'node-2', type: 'taskMode', position: { x: 0, y: 0 }, data: { label: 'Task 2' } }
            ],
            edges: [
                { id: 'e1-2', source: 'node-1', target: 'node-2' }
            ],
            status: 'active',
            currentActiveNodes: [],
            isTemplate: false,
            createdAt: new Date().toISOString(),
            nodes: [], // Typo in manual obj creation? Typescript handles map so raw obj OK? 
            // Wait, I defined nodes twice. Fix below.
            edges: []
        } as any;

        // Correcting the mock object structure
        flow.nodes = [
            { id: 'node-1', type: 'taskMode', position: { x: 0, y: 0 }, data: { label: 'Task 1' } },
            { id: 'node-2', type: 'taskMode', position: { x: 0, y: 0 }, data: { label: 'Task 2' } }
        ];
        flow.edges = [
            { id: 'e1-2', source: 'node-1', target: 'node-2' }
        ];

        useCronStore.getState().startFlow(flow);

        const crons = useCronStore.getState().crons;
        expect(crons.length).toBe(2);

        const task1 = crons.find(c => c.title === 'Task 1');
        const task2 = crons.find(c => c.title === 'Task 2');

        expect(task1).toBeDefined();
        expect(task2).toBeDefined();

        expect(task1?.status).toBe('active'); // No deps
        expect(task2?.status).toBe('pending'); // Depends on Task 1
    });

    it('should cascade activation when completing a cron', () => {
        const flow: CronFlow = {
            id: 'flow-casc',
            name: 'Cascading Flow',
            nodes: [
                { id: 'A', type: 'taskMode', position: { x: 0, y: 0 }, data: { label: 'A' } },
                { id: 'B', type: 'taskMode', position: { x: 0, y: 0 }, data: { label: 'B' } }
            ],
            edges: [
                { id: 'e-a-b', source: 'A', target: 'B' }
            ],
            status: 'draft',
            currentActiveNodes: [],
            isTemplate: false,
            createdAt: ''
        } as any;

        useCronStore.getState().startFlow(flow);

        const crons = useCronStore.getState().crons;
        const cronA = crons.find(c => c.title === 'A')!;
        const cronB = crons.find(c => c.title === 'B')!;

        expect(cronA.status).toBe('active');
        expect(cronB.status).toBe('pending');

        // Complete A
        useCronStore.getState().completeCron(cronA.id);

        const updatedCrons = useCronStore.getState().crons;
        const updatedA = updatedCrons.find(c => c.id === cronA.id)!;
        const updatedB = updatedCrons.find(c => c.id === cronB.id)!;

        expect(updatedA.status).toBe('completed');
        expect(updatedA.completedAt).toBeDefined();

        // B should now be active
        expect(updatedB.status).toBe('active');
    });
});
