import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { CalendarView } from '@/components/calendar/CalendarView'
import { FlowBuilder } from '@/components/flow/FlowBuilder'
import { useUIStore } from '@/store/uiStore'

function App() {
  const { currentView } = useUIStore()

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Placeholders */}
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h3 className="font-semibold mb-2">Today's Tasks</h3>
                <p className="text-muted-foreground text-sm">No tasks scheduled for today.</p>
              </div>
              <div className="p-6 bg-card rounded-xl border shadow-sm">
                <h3 className="font-semibold mb-2">Active Flows</h3>
                <p className="text-muted-foreground text-sm">0 flows running.</p>
              </div>
            </div>
            <div className="h-[600px] lg:h-[700px]">
              <CalendarView />
            </div>
          </div>
        )
      case 'flow-builder':
        return (
          <div className="h-[600px] lg:h-[700px]">
            <FlowBuilder />
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <span className="text-muted-foreground capitalize">{currentView} View Placeholder</span>
          </div>
        )
    }
  }

  return (
    <DashboardLayout>
      {renderContent()}
    </DashboardLayout>
  )
}

export default App
