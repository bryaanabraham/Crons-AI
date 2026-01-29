import { describe, it, expect } from 'vitest';
import { aiService } from './AIService';

describe('MockAIService', () => {
    it('should generate a reporting flow from "daily report" prompt', async () => {
        const flow = await aiService.generateFlowFromPrompt('generate a daily report');

        expect(flow).toBeDefined();
        expect(flow.name).toBe('Daily Reporting');
        expect(flow.nodes.length).toBeGreaterThan(0);
        expect(flow.generatedFromPrompt).toBe('generate a daily report');
    });

    it('should generate a generic flow for unknown prompts', async () => {
        const flow = await aiService.generateFlowFromPrompt('some random task');

        expect(flow.name).toBe('Custom Task Flow');
    });
});
