import { DragEvent } from 'react';
import { Clock, CheckSquare } from 'lucide-react';

export function NodePalette() {
    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="absolute top-4 left-4 z-20 bg-background/95 backdrop-blur shadow-md rounded-lg border border-border p-3 flex flex-col gap-3 min-w-[160px] animate-in slide-in-from-left-5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Add Actions</h3>

            <div
                className="flex items-center gap-2 p-2 rounded bg-card border border-border shadow-sm cursor-grab hover:border-primary/50 transition-colors"
                draggable
                onDragStart={(event) => onDragStart(event, 'taskMode')}
            >
                <CheckSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Task Action</span>
            </div>

            <div
                className="flex items-center gap-2 p-2 rounded bg-card border border-border shadow-sm cursor-grab hover:border-primary/50 transition-colors"
                draggable
                onDragStart={(event) => onDragStart(event, 'deadlineMode')}
            >
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">Deadline</span>
            </div>

            <div className="h-px bg-border my-1" />
            <p className="text-[10px] text-muted-foreground text-center">
                Drag to canvas
            </p>
        </div>
    );
}
