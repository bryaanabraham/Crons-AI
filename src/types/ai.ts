import { Cron } from './cron';
import { CronFlow } from './flow';

export interface TemplatePrompt {
    id: string;
    name: string;
    prompt: string;
    category: 'project' | 'personal' | 'business' | 'health' | 'custom';
    description: string;
    isUserCreated: boolean;
    usageCount: number;

    // Example generated flows for preview
    exampleFlow?: CronFlow;
}

export interface AIResponse {
    type: 'flow' | 'clarification' | 'suggestion';
    message: string;
    flow?: CronFlow;
    suggestions?: string[];
    confidence: number;
}

export interface FlowOptimization {
    originalFlow: CronFlow;
    optimizedFlow: CronFlow;
    improvements: {
        type: 'scheduling' | 'dependency' | 'duration';
        description: string;
        impact: 'low' | 'medium' | 'high';
    }[];
    estimatedTimeSaving: number; // in hours
}

export interface AIService {
    processNaturalLanguage(prompt: string): Promise<AIResponse>;
    generateFlow(description: string): Promise<CronFlow>;
    optimizeFlow(flow: CronFlow): Promise<FlowOptimization>;
    generateDailySummary(crons: Cron[]): Promise<string>;
    suggestTemplates(userBehavior: unknown): Promise<TemplatePrompt[]>;
}
