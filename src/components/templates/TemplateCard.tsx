import { CronFlow } from '@/types/flow';
import { Play, Edit, Trash2, Layers } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TemplateCardProps {
    template: CronFlow;
    onUse: (templateId: string) => void;
    onEdit: (templateId: string) => void;
    onDelete?: (templateId: string) => void;
}

export function TemplateCard({ template, onUse, onEdit, onDelete }: TemplateCardProps) {
    return (
        <div className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md h-full">
            <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Layers className="w-6 h-6" />
                    </div>
                    {template.templateCategory && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {template.templateCategory}
                        </span>
                    )}
                </div>

                <h3 className="font-semibold text-lg leading-none tracking-tight mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {template.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <span className="font-medium text-foreground">{template.nodes.length}</span>
                        Nodes
                    </span>
                    <span>•</span>
                    <span>
                        Updated {formatDistanceToNow(new Date(template.createdAt), { addSuffix: true })}
                    </span>
                </div>
            </div>

            <div className="p-6 pt-0 flex items-center gap-2 mt-auto">
                <button
                    onClick={() => onUse(template.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Play className="w-4 h-4" />
                    Use Template
                </button>
                <button
                    onClick={() => onEdit(template.id)}
                    className="inline-flex items-center justify-center w-10 h-10 text-sm font-medium border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    title="Edit Template"
                >
                    <Edit className="w-4 h-4" />
                </button>
                {onDelete && (
                    <button
                        onClick={() => onDelete(template.id)}
                        className="inline-flex items-center justify-center w-10 h-10 text-sm font-medium text-muted-foreground rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Delete Template"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
