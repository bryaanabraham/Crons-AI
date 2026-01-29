import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CalendarView } from '@/components/calendar/CalendarView';
import { FlowBuilder } from '@/components/flow/FlowBuilder';
import { TemplatesPage } from '@/components/templates/TemplatesPage';
import { useUIStore } from '@/store/uiStore';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Activity, CheckCircle, Clock } from 'lucide-react';

function App() {
  const { currentView } = useUIStore();

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0d121b] dark:text-white">Dashboard Overview</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back, Alex. Here's what's happening today.</p>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">add</span>
                New Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Active Workflows"
                value="12"
                trend="+24%"
                trendUp={true}
                icon={Activity}
                color="blue"
              />
              <StatsCard
                title="Pending Approvals"
                value="4"
                trend="Waiting"
                trendUp={false}
                icon={Clock}
                color="amber"
              />
              <StatsCard
                title="Tasks Completed"
                value="128"
                trend="+12%"
                trendUp={true}
                icon={CheckCircle}
                color="emerald"
              />
            </div>

            <div className="h-[600px] lg:h-[700px]">
              <CalendarView />
            </div>
          </div>
        );
      case 'flow-builder':
        return (
          <div className="h-[600px] lg:h-[700px]">
            <FlowBuilder />
          </div>
        );
      case 'templates':
        return <TemplatesPage />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground capitalize">{currentView} View Placeholder</span>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  );
}

export default App;
