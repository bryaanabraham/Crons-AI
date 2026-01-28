import { FlowNode, FlowEdge, CronFlow } from '@/types/flow';

export class FlowValidator {
    /**
     * Validates a flow structure for integrity and validity.
     */
    static validateFlow(flow: CronFlow): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check for empty flows
        if (flow.nodes.length === 0) {
            errors.push('Flow must have at least one node.');
        }

        // Check for cycles
        if (this.detectCycles(flow.nodes, flow.edges)) {
            errors.push('Flow contains circular dependencies.');
        }

        // Check for disconnected components (optional, but good practice - maybe active flows must be fully connected? 
        // Or at least reachable from start nodes. For now, we allow loose nodes but maybe warn).

        // Check missing edge targets
        flow.edges.forEach(edge => {
            const sourceExists = flow.nodes.some(n => n.id === edge.source);
            const targetExists = flow.nodes.some(n => n.id === edge.target);
            if (!sourceExists || !targetExists) {
                errors.push(`Edge ${edge.id} refers to missing node.`);
            }
        });

        return { isValid: errors.length === 0, errors };
    }

    /**
     * Detects circular dependencies using DFS.
     */
    static detectCycles(nodes: FlowNode[], edges: FlowEdge[]): boolean {
        const adjacencyList = new Map<string, string[]>();

        nodes.forEach(node => adjacencyList.set(node.id, []));
        edges.forEach(edge => {
            if (adjacencyList.has(edge.source)) {
                adjacencyList.get(edge.source)?.push(edge.target);
            }
        });

        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const dfs = (nodeId: string): boolean => {
            visited.add(nodeId);
            recursionStack.add(nodeId);

            const neighbors = adjacencyList.get(nodeId) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (dfs(neighbor)) return true;
                } else if (recursionStack.has(neighbor)) {
                    return true;
                }
            }

            recursionStack.delete(nodeId);
            return false;
        };

        for (const node of nodes) {
            if (!visited.has(node.id)) {
                if (dfs(node.id)) return true;
            }
        }

        return false;
    }

    /**
     * Topological Sort (useful for execution order, throws if cycle)
     */
    static topologicalSort(_nodes: FlowNode[], _edges: FlowEdge[]): string[] {
        // similar to Khan's algorithm or DFS post-order reverse
        // Implementation placeholder if needed for execution engine
        return [];
    }
}
