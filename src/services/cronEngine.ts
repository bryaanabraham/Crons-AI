import { Cron } from '@/types/cron';

// We'd typically inject the store, but to keep it simple we might use the hook directly or passed as arg.
// For a service class, it's better to be pure or access a passed state manager.
// To make it testable, we'll design methods to accept state or store actions.

export class CronEngine {

    /**
     * Activates a cron task, changing its status to active.
     */
    static activateCron(cron: Cron): Cron {
        return {
            ...cron,
            status: 'active',
            updatedAt: new Date().toISOString()
        };
    }

    /**
     * Completes a cron task and calculates next steps (triggering dependencies).
     */
    static completeCron(cron: Cron, allFlowCrons: Cron[]): { updatedCron: Cron; triggeredCrons: Cron[] } {
        const completedCron: Cron = {
            ...cron,
            status: 'completed',
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Find crons that depend on this one
        // A cron is ready if ALL its dependencies are completed.
        const dependents = allFlowCrons.filter(c => c.dependencies.includes(cron.id));

        const triggeredCrons: Cron[] = [];

        dependents.forEach(dep => {
            // Check if all its dependencies are met (excluding the one just finished, or just check all in updated state)
            // We simulate the world where 'cron' is complete.
            const dependencies = dep.dependencies;
            // Check status of all dep IDs. 
            // Logic: All dependencies must be 'completed'.
            const allMet = dependencies.every(depId => {
                if (depId === cron.id) return true; // The one we just finished is effectively complete
                const depCron = allFlowCrons.find(c => c.id === depId);
                return depCron?.status === 'completed';
            });

            if (allMet && dep.status === 'pending') {
                // Calculate scheduled start time based on this completion
                // Note: The logic for *which* parent determines the schedule if multiple parents exists 
                // usually falls to "latest completion" or "specific rules". 
                // For MVP, we assume the completion of the *last* dependency triggers it.
                // We might need to look up the node definition for the scheduling rule, 
                // but for now let's assume the Cron object has what it needs or we update it simply.
                // (In a full impl, we'd look up the FlowNode to get the SchedulingRule).

                // Placeholder: Activate it.
                triggeredCrons.push({
                    ...dep,
                    status: 'active',
                    // meaningful start time calculation happens here if we had the rule available.
                    // assuming 'scheduledDate' acts as "available from"
                    updatedAt: new Date().toISOString()
                });
            }
        });

        return { updatedCron: completedCron, triggeredCrons };
    }
}
