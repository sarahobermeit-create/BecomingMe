import {
  BookHeart,
  BookOpen,
  Calendar,
  CheckSquare,
  ChevronRight,
  Droplet,
  Dumbbell,
  LayoutDashboard,
  Lightbulb,
  Palette,
  Smile,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router";

const navItems = [
  { path: "/", label: "Overview", icon: LayoutDashboard },
  { path: "/books", label: "Grand Library", icon: BookOpen },
  { path: "/routines", label: "Routines & Habits", icon: CheckSquare },
  { path: "/water", label: "Water Tracker", icon: Droplet },
  { path: "/meals", label: "Daily Meal Logs", icon: UtensilsCrossed },
  { path: "/budget", label: "Budget & Spendings", icon: Wallet },
  { path: "/mood", label: "Mood Tracker", icon: Smile },
  { path: "/journal", label: "Junk Journal", icon: BookHeart },
  { path: "/hobbies", label: "Hobbies & Craft", icon: Palette },
  { path: "/exercise", label: "Workouts & Fitness", icon: Dumbbell },
  { path: "/ideas", label: "Ideas & Future", icon: Lightbulb },
  { path: "/calendar", label: "Personal Calendar", icon: Calendar },
];

export function Sidebar() {
  return (
    <aside className="w-full lg:w-64 bg-[#08140d]/80 lg:border-r border-emerald-500/10 flex flex-col shrink-0">
      <div className="px-5 pt-5 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden lg:block">
        Life Modules
      </div>

      <nav className="p-3 space-y-1 overflow-x-auto lg:overflow-x-hidden flex lg:flex-col no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `group flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-800/40 to-forest-800/25 text-white border border-emerald-500/40 shadow-md shadow-emerald-950/60"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-300"
                      }`}
                    />
                    <span className={isActive ? "font-semibold text-white" : ""}>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 hidden lg:block" />}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto p-4 hidden lg:block border-t border-emerald-500/10">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#061c10] via-emerald-950/30 to-transparent border border-emerald-500/20 text-xs">
          <p className="font-semibold text-emerald-300">Daily Mindfulness</p>
          <p className="text-[11px] text-slate-400 mt-1 italic leading-relaxed">
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </p>
        </div>
      </div>
    </aside>
  );
}
