import { X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { ReactNode } from 'react';

interface DetailsPanelProps {
    children?: ReactNode;
    title?: string;
}

export function DetailsPanel({ children, title = "Details" }: DetailsPanelProps) {
    const { detailsPanelOpen, setDetailsPanelOpen } = useUIStore();

    return (
        <>
            {/* Overlay for mobile mainly, but maybe desktop too if we want modal-like focus? 
           Usually split-screen details don't use overlay on desktop. 
       */}
            {detailsPanelOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setDetailsPanelOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-card border-l shadow-xl transition-transform duration-300 ease-in-out
          ${detailsPanelOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <button
                            onClick={() => setDetailsPanelOpen(false)}
                            className="p-2 hover:bg-accent rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {children || (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Select an item to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
