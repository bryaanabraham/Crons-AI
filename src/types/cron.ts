export type CronMode = 'task' | 'deadline';
export type CronStatus = 'pending' | 'active' | 'completed' | 'overdue';

export interface SchedulingRule {
    type: 'immediate' | 'relative' | 'absolute' | 'business_day';

    // For relative scheduling (T+N)
    relativeDays?: number; // T+1, T+3, etc.
    relativeHours?: number;

    // For absolute scheduling
    specificDate?: Date | string; // Date object or ISO string
    specificTime?: string; // "09:00"

    // For business day scheduling
    businessDayOffset?: number; // Next business day = 1
    timeOfDay?: string; // "morning", "afternoon", "09:00"
}

export interface Cron {
    id: string;
    title: string;
    description?: string;
    mode: CronMode;
    status: CronStatus;

    // Scheduling
    schedulingRule?: SchedulingRule; // The rule used to calculate scheduledDate
    scheduledDate?: Date | string;
    deadline?: Date | string; // For deadline mode
    duration: number; // in minutes

    // Flow relationship
    flowId: string;
    nodeId: string;
    dependencies: string[]; // Node IDs this cron depends on

    // Metadata
    createdAt: Date | string;
    updatedAt: Date | string;
    completedAt?: Date | string;

    // AI-readable format
    aiContext?: {
        priority: 'low' | 'medium' | 'high';
        category: string;
        tags: string[];
        estimatedEffort: number;
    };

    metadata?: Record<string, any>;
}
