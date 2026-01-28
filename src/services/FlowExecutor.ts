import { Cron, CronStatus } from '@/types/cron';
import { CronFlow } from '@/types/flow';

export class FlowExecutor {

    /**
     * Instantiates a CronFlow into a set of executable Crons.
     * All nodes are created, but only those with no dependencies are set to 'active'.
     * Others start as 'pending'.
     */
    static startFlow(flow: CronFlow): Cron[] {
        const now = new Date().toISOString();

        // 1. Create a map of FlowNode ID -> Cron ID
        const nodeToCronIdMap = new Map<string, string>();
        flow.nodes.forEach((node) => {
            nodeToCronIdMap.set(node.id, crypto.randomUUID());
        });

        // 2. Map nodes to Crons
        const crons: Cron[] = flow.nodes.map((node) => {
            const cronId = nodeToCronIdMap.get(node.id)!;

            // Find incoming edges to determine dependencies
            const incomingEdges = flow.edges.filter((edge) => edge.target === node.id);
            const dependencyIds = incomingEdges
                .map((edge) => nodeToCronIdMap.get(edge.source))
                .filter((id): id is string => !!id);

            // Determine initial status
            const initialStatus: CronStatus = dependencyIds.length === 0 ? 'active' : 'pending';

            // Extract data safer
            const data = node.data;
            const label = data.label || 'Untitled Task';
            const duration = data.duration || 0;
            const mode = data.mode || 'task';
            const rule = data.schedulingRule || { type: 'immediate' };

            return {
                id: cronId,
                title: label,
                mode: mode,
                status: initialStatus,
                schedulingRule: rule,
                duration: duration,
                dependencies: dependencyIds,

                // Flow Relationship
                flowId: flow.id,
                nodeId: node.id,

                // Metadata
                createdAt: now,
                updatedAt: now
            };
        });

        return crons;
    }
}
