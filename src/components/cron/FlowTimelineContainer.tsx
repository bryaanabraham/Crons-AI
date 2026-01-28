import { useCronStore } from '@/store/cronStore';
import { Cron } from '@/types/cron';
import { FlowTimeline } from '@/components/flow/FlowTimeline';
import { useUIStore } from '@/store/uiStore';

export function FlowTimelineContainer({ currentCron }: { currentCron: Cron }) {
    const { crons } = useCronStore();
    const { setSelectedCronId } = useUIStore();

    // Logic to find siblings:
    // If we have flowExecutionId in metadata, use that (best for unique run).
    // Fallback to flowId key (might mix runs if IDs reused, but per MVP FlowExecutor makes new IDs for crons anyway).
    // The key is differentiating runs. 
    // FlowExecutor: flowId = templateId.
    // metadata.flowExecutionId = unique run.

    // So we should filter by metadata.flowExecutionId IF available.

    const executionId = currentCron.metadata?.flowExecutionId;
    const flowId = currentCron.flowId;

    const relatedCrons = crons.filter(c => {
        if (executionId) {
            return c.metadata?.flowExecutionId === executionId;
        }
        return c.flowId === flowId; // Fallback
    });

    if (relatedCrons.length <= 1) return null; // Don't show timeline if solo task? Or show it as single dot.

    return (
        <FlowTimeline
            crons={relatedCrons}
            onCronClick={(c) => setSelectedCronId(c.id)}
        />
    );
}
