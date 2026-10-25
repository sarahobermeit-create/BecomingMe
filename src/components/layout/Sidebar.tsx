import React from 'react';
import { TabType } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  UtensilsCrossed,
  Droplet,
  Wallet,
  BookOpen,
  Smile,
  BookHeart,
  Palette,
  Dumbbell,
  Lightbulb,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useLife } from '../../context/LifeContext';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge?: (state: any, todayDate: string) => string | number | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { state, todayDate } = useLife();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      accentColor: 'text-emerald-400 group-hover:text-emerald-300',
    },
    {
      id: 'routines',
      label: 'Routines & Habits',
      icon: CheckSquare,
      accentColor: 'text-green-400 group-hover:text-green-300',
      badge: (s, t) => {
        const remaining = s.routines.filter((r: any) => !r.completedDates.includes(t)).length;
        return remaining > 0 ? remaining : null;
      },
    },
    {
      id: 'meals',
      label: 'Daily Meal Logs',
      icon: UtensilsCrossed,
      accentColor: 'text-amber-400 group-hover:text-amber-300',
      badge: (s, t) => {
        const todayMeals = s.meals.filter((m: any) => m.date === t).length;
        return todayMeals > 0 ? `${todayMeals} meals` : null;
      },
    },
    {
      id: 'water',
      label: 'Water Tracker',
      icon: Droplet,
      accentColor: 'text-cyan-400 group-hover:text-cyan-300',
      badge: (s, t) => {
        const log = s.waterLogs[t];
        if (!log || log.amountMl === 0) return null;
        return `${Math.round((log.amountMl / s.waterDailyTargetMl) * 100)}%`;
      },
    },
    {
      id: 'budget',
      label: 'Budget & Spendings',
      icon: Wallet,
      accentColor: 'text-emerald-400 group-hover:text-emerald-300',
    },
    {
      id: 'books',
      label: 'Books Tracker',
      icon: BookOpen,
      accentColor: 'text-teal-400 group-hover:text-teal-300',
      badge: (s) => {
        const reading = s.books.filter((b: any) => b.status === 'reading').length;
        return reading > 0 ? `${reading} reading` : null;
      },
    },
    {
      id: 'mood',
      label: 'Mood Tracker',
      icon: Smile,
      accentColor: 'text-rose-400 group-hover:text-rose-300',
    },
    {
      id: 'journal',
      label: 'Junk Journal',
      icon: BookHeart,
      accentColor: 'text-emerald-300 group-hover:text-emerald-200',
      badge: (s) => (s.journalEntries.length > 0 ? s.journalEntries.length : null),
    },
    {
      id: 'hobbies',
      label: 'Hobbies Tracker',
      icon: Palette,
      accentColor: 'text-forest-400 group-hover:text-forest-300',
    },
    {
      id: 'exercise',
      label: 'Exercise & Workouts',
      icon: Dumbbell,
      accentColor: 'text-orange-400 group-hover:text-orange-300',
    },
    {
      id: 'ideas',
      label: 'Ideas & Future Plans',
      icon: Lightbulb,
      accentColor: 'text-yellow-400 group-hover:text-yellow-300',
    },
    {
      id: 'calendar',
      label: 'Personal Calendar',
      icon: Calendar,
      accentColor: 'text-teal-400 group-hover:text-teal-300',
      badge: (s, t) => {
        const count = s.events.filter((e: any) => e.date === t).length;
        return count > 0 ? `${count} events` : null;
      },
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#08140d]/80 lg:border-r border-emerald-500/10 flex flex-col shrink-0">
      {/* Category header for desktop */}
      <div className="px-5 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden lg:block">
        Life Modules
      </div>

      <nav className="p-3 space-y-1 overflow-x-auto lg:overflow-x-hidden flex lg:flex-col no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const badgeVal = item.badge ? item.badge(state, todayDate) : null;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-800/40 to-forest-800/25 text-white border border-emerald-500/40 shadow-md shadow-emerald-950/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400' : item.accentColor
                  }`}
                />
                <span className={isActive ? 'font-semibold text-white' : ''}>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 ml-2">
                {badgeVal !== null && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
                        : 'bg-white/[0.06] text-slate-400 group-hover:bg-white/[0.1]'
                    }`}
                  >
                    {badgeVal}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400 hidden lg:block" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Aesthetic bottom widget in sidebar */}
      <div className="mt-auto p-4 hidden lg:block border-t border-emerald-500/10">
        <div className="p-3 rounded-xl bg-gradient-to-br from-forest-950/80 via-emerald-950/40 to-transparent border border-emerald-500/20">
          <p className="text-xs font-semibold text-emerald-300">Daily Mindfulness</p>
          <p className="text-[11px] text-slate-400 mt-1 italic leading-relaxed">
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
            <span>BecomingMe v1.0</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Synced
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
