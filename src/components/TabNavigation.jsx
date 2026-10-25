import React from 'react';
import { Flame, Calendar, Wallet, MapPin, User } from 'lucide-react';

export const TABS = [
  { id: 'tracker', label: 'Today', icon: Flame },
  { id: 'calendar', label: 'Journey', icon: Calendar },
  { id: 'planner', label: 'Budget', icon: Wallet },
  { id: 'stores', label: 'Stores', icon: MapPin },
  { id: 'profile', label: 'Profile', icon: User }
];

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-white/[0.08] pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] pt-1.5 px-3">
      <div className="max-w-md md:max-w-xl mx-auto">
        <div className="grid grid-cols-5 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 active:scale-90 relative ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active Pill Indicator (Material 3 style) */}
                <div
                  className={`w-11 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-sm shadow-emerald-950'
                      : 'bg-transparent text-slate-400 group-hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold tracking-tight transition-colors duration-200 ${
                    isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
