import React from 'react';
import { 
  Wallet, ShieldCheck, Calendar, ArrowUpRight, CheckCircle2, 
  Sparkles, TrendingUp, AlertCircle, ShoppingBag, Coffee 
} from 'lucide-react';
import { MANGALORE_CURATED_PRESET } from '../data/defaultData';

export default function PlannerTab({ budgetCap = 2000, setBudgetCap }) {
  const plannedSpend = 1896;
  const cashBuffer = budgetCap - plannedSpend;
  const dailyCost = 60.10;
  const dailyExtraCalories = 775;
  const dailyExtraProtein = 42.5;

  return (
    <div className="space-y-4 pb-28 animate-fadeIn max-w-md md:max-w-xl mx-auto">
      {/* 1. Hero Financial Gauge Card (Double-Bezel Architecture) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-xl">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Monthly Grocery Cap
              </span>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">₹2,000 Hard Limit</h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Metric Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="text-slate-400 font-medium">Monthly Outlay</span>
              <span className="font-mono font-bold text-white">
                ₹{plannedSpend} <span className="text-slate-500 font-normal">/ ₹{budgetCap}</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (plannedSpend / budgetCap) * 100)}%` }}
              />
            </div>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Total Spend</span>
              <p className="text-base font-black text-white font-mono mt-0.5">₹{plannedSpend}</p>
              <span className="text-[9px] text-slate-500 block">Packs + Fresh</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Cash Left</span>
              <p className="text-base font-black text-emerald-400 font-mono mt-0.5">₹{cashBuffer}</p>
              <span className="text-[9px] text-emerald-500/80 block">Safe Reserve</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Daily Burn</span>
              <p className="text-base font-black text-amber-400 font-mono mt-0.5">₹{dailyCost.toFixed(0)}</p>
              <span className="text-[9px] text-slate-500 block">₹60.10 / day</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Protected Essentials Guardrail (Clear UX explaining the ₹12,500 split) */}
      <div className="bg-slate-900/40 p-4 rounded-3xl border border-white/[0.06] flex items-start gap-3">
        <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-white text-sm">Protected Essentials Rule</h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Your ₹12,500 essentials allocation already covers your <strong className="text-emerald-400">3 daily eggs, gym membership, creatine, and room rent</strong>. None of those count against this ₹2,000 grocery cap.
          </p>
        </div>
      </div>

      {/* 3. The 31-Day Extra Grocery Basket */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Monthly Bulking Basket</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              ₹1,896 / 31 Days
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Provides <strong className="text-amber-400">+775 kcal</strong> & <strong className="text-emerald-400">+42.5g protein</strong> every day above your hostel mess meals.
          </p>

          <div className="space-y-2 pt-1">
            {MANGALORE_CURATED_PRESET.map((item) => (
              <div 
                key={item.id} 
                className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.05] flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-white text-xs">{item.name}</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {item.monthlyPlannedQty} × {item.purchaseUnit} • {item.frequency}
                  </p>
                  <span className="text-[9px] font-medium text-emerald-400/90 block mt-0.5">
                    +{item.caloriesPerDay} kcal & +{item.proteinGramsPerDay}g pro/day
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-white font-mono block">₹{item.monthlyTotalSpend}</span>
                  <span className="text-[10px] text-slate-500 block">₹{item.unitPriceInr}/unit</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Replenishment Schedule (When to spend throughout the month) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">When & What to Buy</h3>
          </div>

          <div className="space-y-2 text-xs">
            {/* Week 1 */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-bold text-white text-xs">Week 1 (Days 1–7)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Buy 1kg Peanuts (₹260) + 1kg Soya (₹210) + 7 days Milk & Bananas (₹322)
                </p>
              </div>
              <span className="font-mono font-black text-emerald-400 text-sm shrink-0">₹792</span>
            </div>

            {/* Weeks 2, 3 & 4 */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400" />
                  <span className="font-bold text-white text-xs">Weeks 2, 3 & 4 (Days 8–28)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Weekly fresh restock: 7 days Milk (₹210) + Bananas (₹112) each week
                </p>
              </div>
              <span className="font-mono font-black text-emerald-400 text-sm shrink-0">₹322<span className="text-[10px] text-slate-500 font-normal">/wk</span></span>
            </div>

            {/* Month-End */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-bold text-white text-xs">Days 29–31 (Final 3 Days)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Final 3 days milk pouches (₹90) + bananas (₹48)
                </p>
              </div>
              <span className="font-mono font-black text-emerald-400 text-sm shrink-0">₹138</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
