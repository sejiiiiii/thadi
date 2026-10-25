import React, { useState } from 'react';
import { MapPin, Zap, Store, Compass } from 'lucide-react';
import StoreMapTab from './StoreMapTab';
import QuickCommerceTab from './QuickCommerceTab';

export default function StoresHubTab() {
  const [activeSegment, setActiveSegment] = useState('offline'); // 'offline' | 'online'

  return (
    <div className="space-y-4 pb-28 animate-fadeIn max-w-md md:max-w-xl mx-auto">
      {/* Top Segment Controller (Google Play / Material 3 style) */}
      <div className="bg-slate-900/70 p-1.5 rounded-2xl border border-white/[0.08] flex items-center gap-1.5 shadow-sm">
        <button
          onClick={() => setActiveSegment('offline')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
            activeSegment === 'offline'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Mangaluru Stores & Map</span>
        </button>

        <button
          onClick={() => setActiveSegment('online')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
            activeSegment === 'online'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Instant 10-Min Delivery</span>
        </button>
      </div>

      {/* Render selected view */}
      {activeSegment === 'offline' ? (
        <StoreMapTab />
      ) : (
        <QuickCommerceTab />
      )}
    </div>
  );
}
