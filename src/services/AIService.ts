import { CronFlow, FlowNode, FlowEdge } from '@/types/flow';

export interface AIService {
    generateFlowFromPrompt(prompt: string): Promise<CronFlow>;
}

export class MockAIService implements AIService {
    async generateFlowFromPrompt(prompt: string): Promise<CronFlow> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const lowerPrompt = prompt.toLowerCase();

        let nodes: FlowNode[] = [];
        let edges: FlowEdge[] = [];
        let name = "Generated Flow";

        if (lowerPrompt.includes('backup') || lowerPrompt.includes('database')) {
            name = "Database Backup Pipeline";
            nodes = [
                { id: '1', type: 'taskMode', position: { x: 100, y: 100 }, data: { label: 'Stop Write Services', duration: 5 } },
                { id: '2', type: 'taskMode', position: { x: 100, y: 200 }, data: { label: 'Dump Database', duration: 15 } },
                { id: '3', type: 'taskMode', position: { x: 100, y: 300 }, data: { label: 'Upload to S3', duration: 10 } },
                { id: '4', type: 'taskMode', position: { x: 100, y: 400 }, data: { label: 'Restart Services', duration: 5 } },
            ];
            edges = [
                { id: 'e1-2', source: '1', target: '2' },
                { id: 'e2-3', source: '2', target: '3' },
                { id: 'e3-4', source: '3', target: '4' },
            ];
        } else if (lowerPrompt.includes('report') || lowerPrompt.includes('email')) {
            name = "Daily Reporting";
            nodes = [
                { id: '1', type: 'taskMode', position: { x: 250, y: 50 }, data: { label: 'Fetch Analytics Data', duration: 2 } },
                { id: '2', type: 'taskMode', position: { x: 100, y: 150 }, data: { label: 'Process User Metrics', duration: 5 } },
                { id: '3', type: 'taskMode', position: { x: 400, y: 150 }, data: { label: 'Process Revenue Metrics', duration: 5 } },
                { id: '4', type: 'taskMode', position: { x: 250, y: 300 }, data: { label: 'Generate PDF', duration: 3 } },
                { id: '5', type: 'taskMode', position: { x: 250, y: 400 }, data: { label: 'Email Stakeholders', duration: 1 } },
            ];
            edges = [
                { id: 'e1-2', source: '1', target: '2' },
                { id: 'e1-3', source: '1', target: '3' },
                { id: 'e2-4', source: '2', target: '4' },
                { id: 'e3-4', source: '3', target: '4' },
                { id: 'e4-5', source: '4', target: '5' },
            ];
        } else {
            // Default generic flow
            name = "Custom Task Flow";
            nodes = [
                { id: '1', type: 'taskMode', position: { x: 250, y: 100 }, data: { label: 'Start Task', duration: 10 } },
                { id: '2', type: 'deadlineMode', position: { x: 250, y: 250 }, data: { label: 'Verification (Due in 1h)', duration: 10, deadline: new Date(Date.now() + 3600000).toISOString() } },
            ];
            edges = [
                { id: 'e1-2', source: '1', target: '2' }
            ];
        }

        const flow: CronFlow = {
            id: crypto.randomUUID(),
            name,
            nodes,
            edges,
            status: 'draft',
            currentActiveNodes: [],
            isTemplate: false,
            createdAt: new Date().toISOString(),
            generatedFromPrompt: prompt
        };

        return flow;
    }
}

export const aiService = new MockAIService();
