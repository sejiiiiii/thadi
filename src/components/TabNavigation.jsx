import React from 'react';
import { CheckCircle2, Calendar, DollarSign, User } from 'lucide-react';

export const TABS = [
  { id: 'tracker', label: 'Today', icon: CheckCircle2 },
  { id: 'calendar', label: 'Calendar & Weight', icon: Calendar },
  { id: 'planner', label: 'Budget & Stores', icon: DollarSign },
  { id: 'profile', label: 'Body & TDEE', icon: User }
];

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:static md:bg-transparent md:border-0 md:mb-5">
      <div className="max-w-2xl mx-auto px-3 py-1.5 md:py-0">
        <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 py-2 px-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
