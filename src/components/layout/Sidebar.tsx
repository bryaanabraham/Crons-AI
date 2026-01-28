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
        className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg group
      ${active
                ? 'bg-primary/10 text-primary hover:bg-primary/15'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
    >
        <Icon className="w-5 h-5" />
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
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <div className="flex items-center gap-2 font-bold text-xl text-primary">
                            <Workflow className="w-6 h-6" />
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
                        <div className="px-3 mb-2 text-xs font-semibold uppercase text-muted-foreground/50 tracking-wider">
                            Main Menu
                        </div>
                        {navItems.map((item) => (
                            <NavItem
                                key={item.view}
                                icon={item.icon}
                                label={item.label}
                                active={currentView === item.view}
                                onClick={() => {
                                    setView(item.view);
                                    // On mobile, close sidebar after selection
                                    if (window.innerWidth < 1024) setSidebarOpen(false);
                                }}
                            />
                        ))}
                    </div>

                    {/* Footer User/Settings info could go here */}
                    <div className="p-4 border-t">
                        <div className="text-xs text-center text-muted-foreground">
                            v0.1.0 Alpha
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
