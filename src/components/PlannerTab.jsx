import React, { useState } from 'react';
import { 
  DollarSign, ShieldAlert, Calendar, Store, ArrowUpRight, 
  MapPin, ShoppingCart, Search, ExternalLink 
} from 'lucide-react';
import { MANGALORE_CURATED_PRESET, MANGALORE_STORES, QUICK_COMMERCE_PRODUCTS, getQuickCommerceLinks } from '../data/defaultData';
import StoreMapTab from './StoreMapTab';
import QuickCommerceTab from './QuickCommerceTab';

export default function PlannerTab({ budgetCap, setBudgetCap }) {
  const [subView, setSubView] = useState('budget'); // 'budget' | 'stores' | 'online'

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fadeIn">
      {/* 1. Header & Segmented Pill Switcher (Google Material 3 style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Budget & Grocery Hub</h2>
          <p className="text-xs text-slate-400">Manage your ₹2,000/month cap and locate diet staples</p>
        </div>

        {/* Sub-view switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setSubView('budget')}
            className={`px-3 py-1.5 rounded-lg transition ${
              subView === 'budget' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ₹2,000 Plan
          </button>
          <button
            onClick={() => setSubView('stores')}
            className={`px-3 py-1.5 rounded-lg transition ${
              subView === 'stores' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Local Map
          </button>
          <button
            onClick={() => setSubView('online')}
            className={`px-3 py-1.5 rounded-lg transition ${
              subView === 'online' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Instant Delivery
          </button>
        </div>
      </div>

      {/* 2. Sub-view Render */}
      {subView === 'budget' && (
        <div className="space-y-4">
          {/* Cash Ledger */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Monthly Outlay</span>
              <p className="text-lg font-bold text-white mt-0.5">₹1,896</p>
              <span className="text-[10px] text-slate-500">1kg packs + perishables</span>
            </div>
            <div className="border-x border-slate-800 px-3">
              <span className="text-[11px] text-slate-400 block font-medium">Cash Buffer</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">₹104</p>
              <span className="text-[10px] text-slate-500">Under ₹2,000 ceiling</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Daily Cost</span>
              <p className="text-lg font-bold text-amber-400 mt-0.5">₹60.10<span className="text-[10px] font-normal text-slate-500">/d</span></p>
              <span className="text-[10px] text-slate-500">+775 kcal extra food</span>
            </div>
          </div>

          {/* Essentials Guardrail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-300 space-y-0.5">
              <h4 className="font-bold text-white text-sm">Protected Essentials Rule</h4>
              <p className="text-slate-400 leading-relaxed">
                Your ₹12,500 essentials allocation already covers your 3 daily eggs, gym membership, creatine, and hostel rent. <strong>None of those are counted in this ₹2,000 cap.</strong>
              </p>
            </div>
          </div>

          {/* Planned Basket Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-3.5 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-xs">31-Day Extra Grocery Basket</h3>
              <span className="text-[11px] text-emerald-400 font-semibold">₹1,896 Total</span>
            </div>

            <div className="divide-y divide-slate-800 text-xs">
              {MANGALORE_CURATED_PRESET.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between hover:bg-slate-850 transition">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.monthlyPlannedQty} × {item.purchaseUnit} • {item.frequency}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">₹{item.monthlyTotalSpend}</span>
                    <span className="text-[10px] text-slate-500 block">₹{item.unitPriceInr}/unit</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Replenishment Schedule */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-xs">When & How Much to Spend</h3>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">Week 1 (Days 1–7)</span>
                  <p className="text-[11px] text-slate-400">1kg Peanuts (₹260) + 1kg Soya (₹210) + 7 days milk/bananas (₹322)</p>
                </div>
                <span className="font-bold text-emerald-400">₹792</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">Weeks 2, 3 & 4 (Days 8–28)</span>
                  <p className="text-[11px] text-slate-400">7 days fresh milk pouches (₹210) + bananas (₹112) each week</p>
                </div>
                <span className="font-bold text-emerald-400">₹322/wk</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold text-white">Days 29–31 (Month End)</span>
                  <p className="text-[11px] text-slate-400">Final 3 days milk & bananas</p>
                </div>
                <span className="font-bold text-emerald-400">₹138</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {subView === 'stores' && (
        <StoreMapTab />
      )}

      {subView === 'online' && (
        <QuickCommerceTab />
      )}
    </div>
  );
}
