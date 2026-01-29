import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { DetailsPanel } from './DetailsPanel';
import { useUIStore } from '@/store/uiStore';
import { CronDetails } from '../cron/CronDetails';
import { useCronStore } from '@/store/cronStore';
import { TopNav } from './TopNav';

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { setSidebarOpen, selectedCronId } = useUIStore();
    const { crons } = useCronStore();

    const selectedCron = selectedCronId ? crons.find(c => c.id === selectedCronId) : null;

    return (
        <div className="flex h-screen w-full bg-background text-foreground font-display overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
                <TopNav />

                {/* Content Scroll Area */}

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
