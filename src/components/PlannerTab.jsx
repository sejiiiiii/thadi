import React, { useState } from 'react';
import { 
  DollarSign, ShieldAlert, CheckCircle, Sliders, Calendar, 
  TrendingUp, AlertTriangle, Package, ShoppingBag, ArrowRight, Sparkles
} from 'lucide-react';
import { MANGALORE_CURATED_PRESET, BUDGET_FOOD_POOL } from '../data/defaultData';
import { optimizeBudgetDiet } from '../utils/nutritionEngine';

export const REPLENISHMENT_SCHEDULE_31_DAYS = [
  { period: 'Week 1 (Days 1–7)', items: '1kg Peanuts (₹260) + 1kg Soya (₹210) + 7 Days Milk & Bananas (₹322)', amount: 792, note: 'Bulk pantry setup + 1st week perishables' },
  { period: 'Week 2 (Days 8–14)', items: '7 Days Milk (₹210) + 7 Days Bananas (₹112)', amount: 322, note: 'Buy bananas every 2–3 days; daily milk' },
  { period: 'Week 3 (Days 15–21)', items: '7 Days Milk (₹210) + 7 Days Bananas (₹112)', amount: 322, note: 'Daily milk pouch pickup from Nandini booth' },
  { period: 'Week 4 (Days 22–28)', items: '7 Days Milk (₹210) + 7 Days Bananas (₹112)', amount: 322, note: 'Continue routine; check body weight' },
  { period: 'Days 29–31 (Month End)', items: '3 Days Milk (₹90) + 3 Days Bananas (₹48)', amount: 138, note: 'Closes full 31-day month' }
];

export default function PlannerTab({ budgetCap, setBudgetCap }) {
  const [plannerMode, setPlannerMode] = useState('curated');
  const [daysInMonth, setDaysInMonth] = useState(31);

  const optimized = optimizeBudgetDiet(budgetCap, daysInMonth);

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* 1. Header & Mode Switcher */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Budget Architecture
            </span>
            <h2 className="text-xl font-bold text-white mt-1">₹{budgetCap}/Month Hard Cap Plan</h2>
            <p className="text-xs text-slate-400">Strict ceiling separating upfront pack purchases from consumed food</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setPlannerMode('curated')}
              className={`px-3 py-1.5 rounded-lg transition ${
                plannerMode === 'curated'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mangalore Preset
            </button>
            <button
              onClick={() => setPlannerMode('optimizer')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                plannerMode === 'optimizer'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimizer</span>
            </button>
          </div>
        </div>

        {/* Budget Cap Slider */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Monthly Extra-Food Budget Cap:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-emerald-400">₹{budgetCap}</span>
              <span className="text-slate-500 text-[11px]">/ 31-day month</span>
            </div>
          </div>
          <input
            type="range"
            min="1000"
            max="3500"
            step="50"
            value={budgetCap}
            onChange={(e) => setBudgetCap(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>₹1,000 (Low)</span>
            <span className="text-emerald-400 font-semibold">₹2,000 (Hostel Cap)</span>
            <span>₹3,500 (Extended)</span>
          </div>
        </div>
      </section>

      {/* 2. Zero-Leakage Guardrail */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs text-slate-300">
            <h4 className="font-bold text-white text-sm">Protected Essentials Guardrail</h4>
            <p className="text-slate-400 leading-relaxed">
              Your <strong>₹12,500/month essentials budget</strong> covers your 3 daily eggs, gym membership, creatine, and hostel rent. <em>Never count them against this ₹2,000 extra food ceiling.</em> Your remaining ₹5,500 leisure money remains intact.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Mode Content */}
      {plannerMode === 'curated' ? (
        <div className="space-y-5">
          {/* 3 Quick Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Planned Outlay</span>
              <p className="text-xl font-bold text-white mt-1">₹1,896</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Full 1kg packs + perishables</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Unspent Buffer</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">₹104</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Buffer under ₹2,000 ceiling</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Daily Consumed</span>
              <p className="text-xl font-bold text-amber-400 mt-1">₹60.10<span className="text-xs text-slate-500 font-normal">/day</span></p>
              <p className="text-[11px] text-slate-400 mt-0.5">+775 kcal and +42g protein</p>
            </div>
          </div>

          {/* Curated Product Table */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-sm">31-Day Additional Grocery Basket</h3>
                <p className="text-xs text-slate-400">Planned purchase units & price limits</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                4 Staples
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Planned Purchase</th>
                    <th className="p-3">Price Ceiling</th>
                    <th className="p-3">Monthly Outlay</th>
                    <th className="p-3">Daily Consumed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {MANGALORE_CURATED_PRESET.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-semibold text-white">
                        {item.name}
                        <p className="text-[11px] text-slate-500 font-normal">{item.frequency}</p>
                      </td>
                      <td className="p-3 text-slate-300 font-medium">
                        {item.monthlyPlannedQty} × {item.purchaseUnit}
                      </td>
                      <td className="p-3 text-slate-300">
                        ₹{item.unitPriceInr} / unit
                      </td>
                      <td className="p-3 font-bold text-emerald-400">
                        ₹{item.monthlyTotalSpend}
                      </td>
                      <td className="p-3 text-slate-300">
                        {item.dailyQty} {item.dailyUnit}
                        <span className="block text-[11px] text-emerald-400">+{item.dailyProtein}g pro</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-950 font-bold">
                    <td className="p-3 text-white" colSpan="3">Total Actual Purchase Allowance</td>
                    <td className="p-3 text-emerald-400 text-sm">₹1,896</td>
                    <td className="p-3 text-emerald-400 text-sm">+42g pro / day</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Replenishment Schedule */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Replenishment Schedule</h3>
            </div>

            <div className="space-y-2">
              {REPLENISHMENT_SCHEDULE_31_DAYS.map((sched, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">{sched.period}</span>
                      <span className="text-[11px] text-slate-500">• {sched.note}</span>
                    </div>
                    <p className="text-xs text-slate-300">{sched.items}</p>
                  </div>
                  <span className="text-xs font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-center">
                    ₹{sched.amount}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* Optimizer */
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Algorithmic Plan for ₹{budgetCap}/month
              </h3>
              <p className="text-xs text-slate-400">Optimal staples ranked by protein density per rupee</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-400">+{optimized.dailyTotals.protein}g protein • +{optimized.dailyTotals.calories} kcal</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Staple Product</th>
                  <th className="p-3">Recommended Purchase</th>
                  <th className="p-3">Daily Serving</th>
                  <th className="p-3">Monthly Outlay</th>
                  <th className="p-3">Daily Protein</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {optimized.items.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-semibold text-white">{it.name}</td>
                    <td className="p-3 text-slate-300 font-medium">{it.buyQty}</td>
                    <td className="p-3 text-slate-300">{it.dailyServing}</td>
                    <td className="p-3 font-bold text-emerald-400">₹{it.spend}</td>
                    <td className="p-3 font-semibold text-emerald-400">+{it.protein}g</td>
                  </tr>
                ))}
                <tr className="bg-slate-950 font-bold">
                  <td className="p-3 text-white" colSpan="3">Total Cash Spend</td>
                  <td className="p-3 text-emerald-400 text-sm">₹{optimized.totalCashSpend}</td>
                  <td className="p-3 text-emerald-400 text-sm">+{optimized.dailyTotals.protein}g / day</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center text-xs p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400">Unspent Buffer:</span>
            <span className="font-bold text-emerald-400">₹{optimized.cashBuffer} buffer under ₹{budgetCap} cap</span>
          </div>
        </section>
      )}
    </div>
  );
}
