import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: LucideIcon;
    color: 'blue' | 'emerald' | 'amber' | 'purple';
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, color }: StatsCardProps) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-lg", colorStyles[color])}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1",
                        trendUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" : "bg-red-50 text-red-600 dark:bg-red-900/20"
                    )}>
                        <span className="material-symbols-outlined text-[10px]">
                            {trendUp ? 'trending_up' : 'trending_down'}
                        </span>
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-3xl font-extrabold text-[#0d121b] dark:text-white tracking-tight">{value}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
            </div>
        </div>
    );
}
