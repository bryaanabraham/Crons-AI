import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DetailsPanel } from './DetailsPanel';
import { useUIStore } from '@/store/uiStore';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

import { CronDetails } from '../cron/CronDetails';
import { useCronStore } from '@/store/cronStore';

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { setSidebarOpen, selectedCronId } = useUIStore();
    const { crons } = useCronStore();

    const selectedCron = selectedCronId ? crons.find(c => c.id === selectedCronId) : null;

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden text-foreground">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300">

                {/* Mobile Header */}
                <header className="lg:hidden flex items-center h-16 px-4 border-b bg-card">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 hover:bg-accent rounded-md"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 font-semibold">Crons.ai</span>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </div>

            </main>

            {/* Right Drawer / Details Panel */}
            <DetailsPanel title={selectedCron ? "Task Details" : "Details"}>
                {selectedCron ? (
                    <CronDetails cron={selectedCron} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6 text-center">
                        <p>Select a task from the calendar to view details.</p>
                    </div>
                )}
            </DetailsPanel>
        </div>
    );
}
