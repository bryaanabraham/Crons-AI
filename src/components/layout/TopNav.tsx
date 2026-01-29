import { Search, Bell, ChevronRight } from 'lucide-react';

export function TopNav() {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur flex items-center justify-between px-8 shrink-0 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
                    <span>Workspace</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#0d121b] dark:text-white font-bold">Project Cascade</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400"
                        placeholder="Search tasks..."
                        type="text"
                    />
                </div>
                <button className="relative h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
                </button>
            </div>
        </header>
    );
}
