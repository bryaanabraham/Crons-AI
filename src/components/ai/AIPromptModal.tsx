import { useState } from 'react';
import { aiService } from '@/services/AIService';
import { useFlowStore } from '@/store/flowStore';
import { useUIStore } from '@/store/uiStore';
import { Sparkles, Loader2, X } from 'lucide-react';

interface AIPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AIPromptModal({ isOpen, onClose }: AIPromptModalProps) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const { addFlow, setActiveFlow } = useFlowStore();
    const { setView } = useUIStore();

    if (!isOpen) return null;

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        try {
            const flow = await aiService.generateFlowFromPrompt(prompt);
            addFlow(flow);
            setActiveFlow(flow.id);
            // Close modal and verify view is builder
            onClose();
            setView('flow-builder');
        } catch (error) {
            console.error("AI Generation failed", error);
            alert("Failed to generate flow. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <Sparkles className="w-5 h-5" />
                        <h3>AI Assistant</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">
                            Describe your workflow
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., 'Create a daily database backup sequence that dumps the DB, uploads to S3, and sends a slack notification.'"
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            autoFocus
                        />
                        <p className="text-xs text-muted-foreground">
                            Try keywords like "backup", "report", or "email" to trigger specific patterns.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-4 border-t border-border bg-muted/10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                        disabled={isGenerating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary-foreground bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Flow
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
