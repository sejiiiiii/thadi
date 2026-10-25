import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Scale, Plus, Flame, Dumbbell, Check, TrendingUp, X 
} from 'lucide-react';

export default function CalendarTab({ 
  allDailyLogs, 
  selectedDateKey, 
  setSelectedDateKey, 
  targetCalories, 
  targetProtein,
  weightHistory, 
  setWeightHistory,
  userProfile 
}) {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightDateInput, setWeightDateInput] = useState(() => new Date().toISOString().split('T')[0]);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed

  // Month navigation
  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  // Calendar calculations
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to calculate totals for any day
  const getDayTotals = (dateKey) => {
    const log = allDailyLogs[dateKey];
    if (!log) return null;

    const bCal = log.breakfast?.calories || 0;
    const bPro = log.breakfast?.protein || 0;

    const lCal = Math.round(
      ((log.lunch?.riceKatoris || 0) * 180) + 
      ((log.lunch?.curryKatoris || 0) * 140) + 
      ((log.lunch?.dalKatoris || 0) * 150)
    );
    const lPro = parseFloat((
      ((log.lunch?.riceKatoris || 0) * 3.8) + 
      ((log.lunch?.curryKatoris || 0) * 3.5) + 
      ((log.lunch?.dalKatoris || 0) * 7.0)
    ).toFixed(1));

    const dCal = Math.round(
      ((log.dinner?.riceKatoris || 0) * 180) + 
      ((log.dinner?.chapatis || 0) * 110) + 
      (log.dinner?.hasChickenCurry ? 260 : 0) + 
      (log.dinner?.hasEggCurry ? 180 : 0) + 
      (log.dinner?.hasVegCurry ? 130 : 0)
    );
    const dPro = parseFloat((
      ((log.dinner?.riceKatoris || 0) * 3.8) + 
      ((log.dinner?.chapatis || 0) * 3.2) + 
      (log.dinner?.hasChickenCurry ? 18.0 : 0) + 
      (log.dinner?.hasEggCurry ? 8.5 : 0) + 
      (log.dinner?.hasVegCurry ? 3.0 : 0)
    ).toFixed(1));

    const eggCal = (log.standaloneEggs || 0) * 75;
    const eggPro = parseFloat(((log.standaloneEggs || 0) * 6.5).toFixed(1));

    const milkCal = log.extraFoods?.milk500ml ? 300 : (log.extraFoods?.milk250ml ? 150 : 0);
    const milkPro = log.extraFoods?.milk500ml ? 16.5 : (log.extraFoods?.milk250ml ? 8.2 : 0);
    const bananaCal = (log.extraFoods?.bananasCount || 0) * 100;
    const bananaPro = (log.extraFoods?.bananasCount || 0) * 1.25;
    const peanutCal = log.extraFoods?.peanuts30g ? 170 : 0;
    const peanutPro = log.extraFoods?.peanuts30g ? 7.5 : 0;
    const soyaCal = log.extraFoods?.soyaChunks30g ? 105 : 0;
    const soyaPro = log.extraFoods?.soyaChunks30g ? 15.5 : 0;

    const customCal = (log.customItems || []).reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
    const customPro = (log.customItems || []).reduce((acc, it) => acc + (Number(it.protein) || 0), 0);

    const totalCal = bCal + lCal + dCal + eggCal + milkCal + bananaCal + peanutCal + soyaCal + customCal;
    const totalPro = parseFloat((bPro + lPro + dPro + eggPro + milkPro + bananaPro + peanutPro + soyaPro + customPro).toFixed(1));

    return { totalCal, totalPro, metSurplus: totalCal >= targetCalories };
  };

  const handleSaveWeight = (e) => {
    e.preventDefault();
    const val = parseFloat(weightInput);
    if (!val || val < 30 || val > 150) return;

    const updated = [
      { date: weightDateInput, weight: val },
      ...weightHistory.filter(w => w.date !== weightDateInput)
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    setWeightHistory(updated);
    setIsWeightModalOpen(false);
    setWeightInput('');
  };

  const startingWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 55.0;
  const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight : 55.0;
  const netWeightGain = (latestWeight - startingWeight).toFixed(1);
  const selectedDayData = getDayTotals(selectedDateKey);
  const selectedWeight = weightHistory.find(w => w.date === selectedDateKey);

  return (
    <div className="space-y-4 pb-28 animate-fadeIn max-w-md md:max-w-xl mx-auto">
      {/* 1. Weight Hero Card (Double-Bezel) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-xl">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Bulk Progress
              </span>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">Weight & Consistency</h2>
            </div>
            <button
              onClick={() => setIsWeightModalOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shadow-md shadow-emerald-950 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Weight</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Starting</span>
              <p className="text-base font-black text-white font-mono mt-0.5">{startingWeight} kg</p>
              <span className="text-[9px] text-slate-500 block">Baseline</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Current</span>
              <p className="text-base font-black text-emerald-400 font-mono mt-0.5">{latestWeight} kg</p>
              <span className="text-[9px] text-emerald-500/80 block">Latest</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Net Change</span>
              <p className={`text-base font-black font-mono mt-0.5 ${Number(netWeightGain) >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                {Number(netWeightGain) > 0 ? `+${netWeightGain}` : netWeightGain} kg
              </p>
              <span className="text-[9px] text-slate-500 block">Target +0.25k/wk</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Monthly Calendar */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          {/* Month Switcher */}
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-extrabold text-sm text-white tracking-tight">{monthName}</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition active:scale-90"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition active:scale-90"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* Calendar Days Matrix */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty Offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-12 rounded-xl bg-transparent" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = dateStr === selectedDateKey;
              const isToday = dateStr === todayStr;
              const totals = getDayTotals(dateStr);
              const dayWeight = weightHistory.find(w => w.date === dateStr);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateKey(dateStr)}
                  className={`h-12 p-1 rounded-2xl flex flex-col justify-between items-center transition-all duration-200 active:scale-90 relative border ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                      : 'bg-slate-900/50 border-white/[0.05] hover:border-white/[0.15] text-slate-300'
                  }`}
                >
                  <span className={`text-[11px] font-bold ${
                    isToday ? 'w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center' : ''
                  }`}>
                    {dayNum}
                  </span>

                  {totals ? (
                    <div className="flex items-center gap-0.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${totals.metSurplus ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    </div>
                  ) : dayWeight ? (
                    <span className="text-[8px] font-mono text-amber-400 font-bold">{dayWeight.weight}k</span>
                  ) : (
                    <span className="text-[9px] text-slate-700">·</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Surplus Hit (&ge;{targetCalories} kcal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Intake Logged</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Selected Day Inspector Card */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">
                Inspection
              </span>
              <h4 className="text-sm font-extrabold text-white">
                {new Date(selectedDateKey).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </h4>
            </div>

            {selectedWeight && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-medium">Morning Weight</span>
                <span className="text-sm font-black text-emerald-400 font-mono">{selectedWeight.weight} kg</span>
              </div>
            )}
          </div>

          {selectedDayData ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Calories</span>
                </div>
                <p className="text-base font-black text-white font-mono mt-1">{selectedDayData.totalCal} kcal</p>
                <span className={`text-[10px] font-bold ${selectedDayData.metSurplus ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedDayData.metSurplus ? 'Surplus Achieved 🔥' : `${targetCalories - selectedDayData.totalCal} kcal below goal`}
                </span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Protein</span>
                </div>
                <p className="text-base font-black text-white font-mono mt-1">{selectedDayData.totalPro}g</p>
                <span className="text-[10px] text-slate-400">Target: {targetProtein}g</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">
              No meals logged on this date yet. Tap the <strong>Today</strong> tab to record intake.
            </div>
          )}
        </div>
      </div>

      {/* 4. Weight Entry Modal */}
      {isWeightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/[0.1] rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">Record Body Weight</h3>
                <p className="text-xs text-slate-400">Log your morning weight on an empty stomach</p>
              </div>
              <button
                onClick={() => setIsWeightModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Date</label>
                <input
                  type="date"
                  value={weightDateInput}
                  onChange={(e) => setWeightDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1 font-semibold">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 55.4"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-base text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWeightModalOpen(false)}
                  className="flex-1 py-3 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-md shadow-emerald-950"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
