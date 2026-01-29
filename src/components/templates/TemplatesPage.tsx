import { useFlowStore } from '@/store/flowStore';
import { useCronStore } from '@/store/cronStore';
import { useUIStore } from '@/store/uiStore';
import { TemplateCard } from './TemplateCard';
import { LayoutTemplate } from 'lucide-react';

export function TemplatesPage() {
    const { flows, instantiateTemplate, deleteFlow, setActiveFlow } = useFlowStore();
    const { startFlow } = useCronStore();
    const { setView } = useUIStore();

    // Filter for templates
    const templates = flows.filter(f => f.isTemplate);

    const handleUseTemplate = (templateId: string) => {
        try {
            // 1. Instantiate the template explicitly in flow store (creates a new flow)
            const newFlowId = instantiateTemplate(templateId);

            // 2. Set it as active
            setActiveFlow(newFlowId);

            // 3. Start execution immediately? Or just open it in builder?
            // "Use Template" usually implies starting an instance of it.
            // Requirement 12.2 says "Start Flow" action button.
            // Let's look up the new flow and start it via cron store.
            const newFlow = useFlowStore.getState().getFlow(newFlowId)!;
            startFlow(newFlow);

            // 4. Go to dashboard to see it running
            setView('dashboard');
        } catch (error) {
            console.error("Failed to start template:", error);
            alert("Failed to start template. See console for details.");
        }
    };

    const handleEditTemplate = (templateId: string) => {
        setActiveFlow(templateId);
        setView('flow-builder');
    };

    const handleDeleteTemplate = (templateId: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            deleteFlow(templateId);
        }
    };

    return (
        <div className="h-full flex flex-col p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
                    <p className="text-muted-foreground mt-2">
                        Start your workflow from a pre-built automation pattern.
                    </p>
                </div>
                {/* 
                <button 
                    onClick={handleCreateTemplate}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Template
                </button>
                */}
            </div>

            {/* Grid */}
            {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {templates.map(template => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            onUse={handleUseTemplate}
                            onEdit={handleEditTemplate}
                            onDelete={handleDeleteTemplate}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl p-12 bg-muted/20">
                    <div className="p-4 bg-muted mb-4 rounded-full">
                        <LayoutTemplate className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No templates yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Create a Flow in the builder and save it as a template to see it here.
                    </p>
                    <button
                        onClick={() => setView('flow-builder')}
                        className="mt-6 text-primary hover:underline font-medium"
                    >
                        Go to Flow Builder
                    </button>
                </div>
            )}
        </div>
    );
}
