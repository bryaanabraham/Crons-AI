import {
    LayoutDashboard,
    Workflow,
    LayoutTemplate,
    Settings,
    X
} from 'lucide-react';
import { useUIStore, ViewType } from '@/store/uiStore';
// Task 1 created src/lib? Yes. But I haven't implemented cn utility yet maybe? 
// Usually shadcn/ui uses lib/utils. Task 1 said "Utilities: clsx, tailwind-merge".
// I'll assume I need to create the helper first or inline it.
// Let's create src/lib/utils.ts first to be safe in next step if it fails.
// Actually, I'll inline standard daisy-chain for now or just standard class strings if simple.
// But `cn` is cleaner. I'll create `src/lib/utils.ts` in a separate call if needed, 
// for now let's assume I will create it.

const NavItem = ({
    icon: Icon,
    label,
    active,
    onClick
}: {
    icon: any,
    label: string,
    active: boolean,
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full gap-3 px-3 py-2.5 text-sm font-semibold transition-colors rounded-lg group
      ${active
                ? 'bg-primary/10 text-primary font-bold shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
    >
        <span className="material-symbols-outlined text-[20px]">{label === 'Dashboard' ? 'schedule' : label === 'Cron Flows' ? 'schema' : label === 'Templates' ? 'dashboard_customize' : 'settings'}</span>
        <span>{label}</span>
    </button>
);

export function Sidebar() {
    const { currentView, setView, sidebarOpen, setSidebarOpen } = useUIStore();

    const navItems: { view: ViewType; label: string; icon: any }[] = [
        { view: 'calendar', label: 'Dashboard', icon: LayoutDashboard },
        { view: 'flow-builder', label: 'Cron Flows', icon: Workflow },
        { view: 'templates', label: 'Templates', icon: LayoutTemplate },
        { view: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <div className="flex items-center gap-2 font-bold text-xl text-[#0d121b] dark:text-white">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <Workflow className="w-5 h-5" />
                            </div>
                            <span>Crons.ai</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 hover:bg-accent rounded-md"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav Items */}
                    <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Overview
                        </div>
                        <NavItem
                            icon={() => <></>}
                            label="Dashboard"
                            active={currentView === 'calendar'}
                            onClick={() => { setView('calendar'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
                        />

                        <div className="pt-6 px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Management
                        </div>
                        {navItems.filter(i => i.view !== 'calendar').map((item) => (
                            <NavItem
                                key={item.view}
                                icon={item.icon}
                                label={item.label}
                                active={currentView === item.view}
                                onClick={() => {
                                    setView(item.view);
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                            />
                        ))}
                    </div>

                    {/* Footer User/Settings */}
                    <div className="p-4 border-t border-border">
                        <div className="bg-muted/50 p-3 rounded-xl flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-cover bg-center bg-gray-300" />
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold truncate text-slate-900 dark:text-white">Alex Rivera</p>
                                <p className="text-xs text-slate-500 truncate">Pro Plan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
