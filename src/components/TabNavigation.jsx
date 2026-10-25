import React from 'react';
import { CalendarCheck, DollarSign, MapPin, Zap, User } from 'lucide-react';

export const TABS = [
  { id: 'tracker', label: "Today's Log", icon: CalendarCheck },
  { id: 'planner', label: 'Budget Plan', icon: DollarSign },
  { id: 'map', label: 'Store Finder', icon: MapPin },
  { id: 'delivery', label: 'Quick Order', icon: Zap },
  { id: 'profile', label: 'Body & TDEE', icon: User }
];

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:static md:bg-transparent md:border-0 md:mb-5">
      <div className="max-w-4xl mx-auto px-2 py-1 md:py-0">
        <div className="grid grid-cols-5 gap-1 md:flex md:justify-center md:gap-1.5 bg-slate-900/80 p-1 md:rounded-xl md:border md:border-slate-800">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 px-2 md:px-3.5 py-1.5 md:py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
