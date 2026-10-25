import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Scale, Plus, Flame, Dumbbell, Check, TrendingUp 
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

  // Calendar math
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Today string
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

    const totalCal = bCal + lCal + dCal + eggCal + milkCal + bananaCal + peanutCal + soyaCal;
    const totalPro = parseFloat((bPro + lPro + dPro + eggPro + milkPro + bananaPro + peanutPro + soyaPro).toFixed(1));

    return { totalCal, totalPro, metSurplus: totalCal >= targetCalories };
  };

  // Add weight entry
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

  // Find selected date data
  const selectedDayData = getDayTotals(selectedDateKey);
  const selectedWeight = weightHistory.find(w => w.date === selectedDateKey);

  const startingWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weight : 55.0;
  const latestWeight = weightHistory.length > 0 ? weightHistory[0].weight : 55.0;
  const netWeightGain = (latestWeight - startingWeight).toFixed(1);

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-fadeIn">
      {/* 1. Header: Minimalist Google Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Bulk Journey & Calendar</h2>
          <p className="text-xs text-slate-400">Review past daily intake and log your weekly weight</p>
        </div>

        <button
          onClick={() => setIsWeightModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Weight</span>
        </button>
      </div>

      {/* 2. Weight Progress Pill (Clean Google Health Style) */}
      <div className="grid grid-cols-3 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Starting</span>
          <p className="text-base font-bold text-white mt-0.5">{startingWeight} kg</p>
          <span className="text-[10px] text-slate-500">Day 1 baseline</span>
        </div>
        <div className="border-x border-slate-800/80 px-3">
          <span className="text-[11px] text-slate-400 block font-medium">Current</span>
          <p className="text-base font-bold text-emerald-400 mt-0.5">{latestWeight} kg</p>
          <span className="text-[10px] text-slate-500">Latest recorded</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block font-medium">Net Change</span>
          <p className={`text-base font-bold mt-0.5 ${Number(netWeightGain) >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
            {Number(netWeightGain) > 0 ? `+${netWeightGain}` : netWeightGain} kg
          </p>
          <span className="text-[10px] text-slate-500">Target ~0.25 kg/wk</span>
        </div>
      </div>

      {/* 3. Monthly Calendar Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        {/* Month Selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-base">{monthName}</h3>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-500 mb-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {/* Empty prefix cells */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl bg-transparent" />
          ))}

          {/* Actual days */}
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
                className={`h-14 sm:h-16 p-1.5 rounded-xl text-left border flex flex-col justify-between transition-all relative ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-semibold ${isToday ? 'w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold' : ''}`}>
                    {dayNum}
                  </span>
                  {dayWeight && (
                    <span className="text-[9px] text-amber-400 font-bold hidden sm:inline">
                      {dayWeight.weight}k
                    </span>
                  )}
                </div>

                {totals ? (
                  <div className="w-full">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-medium ${totals.metSurplus ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {totals.totalCal}
                      </span>
                      <span className="text-[9px] text-slate-500 hidden sm:inline">{totals.totalPro}g</span>
                    </div>
                    {/* Status dot */}
                    <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${totals.metSurplus ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-700 font-mono">—</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Selected Day Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Day Breakdown
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              {new Date(selectedDateKey).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
          </div>

          {selectedWeight && (
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Recorded Weight</span>
              <span className="text-base font-bold text-emerald-400">{selectedWeight.weight} kg</span>
            </div>
          )}
        </div>

        {selectedDayData ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Calories
              </span>
              <p className="text-lg font-bold text-white mt-0.5">{selectedDayData.totalCal} kcal</p>
              <span className={`text-[10px] font-medium ${selectedDayData.metSurplus ? 'text-emerald-400' : 'text-amber-400'}`}>
                {selectedDayData.metSurplus ? 'Surplus Achieved' : `${targetCalories - selectedDayData.totalCal} kcal below goal`}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Protein
              </span>
              <p className="text-lg font-bold text-white mt-0.5">{selectedDayData.totalPro}g</p>
              <span className="text-[10px] text-slate-400">Target: {targetProtein}g</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-400 block">Logging Status</span>
              <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Logged & Synced
              </p>
              <span className="text-[10px] text-slate-500">Tap "Today's Log" tab to edit this day</span>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            No meals logged for this day yet. Switch to the <strong>Today's Log</strong> tab to record intake.
          </div>
        )}
      </div>

      {/* 5. Weight Entry Modal */}
      {isWeightModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Record Body Weight</h3>
              <p className="text-xs text-slate-400">Log on any morning or flexible weekly schedule</p>
            </div>

            <form onSubmit={handleSaveWeight} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Date</label>
                <input
                  type="date"
                  value={weightDateInput}
                  onChange={(e) => setWeightDateInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 55.4"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 font-bold"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWeightModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm"
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
