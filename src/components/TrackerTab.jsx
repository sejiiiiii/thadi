import React, { useState } from 'react';
import { 
  Flame, Dumbbell, Egg, Check, Plus, Minus, 
  HelpCircle, Utensils, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Sparkles 
} from 'lucide-react';
import { HOSTEL_BREAKFAST_OPTIONS } from '../data/defaultData';

export default function TrackerTab({ 
  dailyLog, 
  setDailyLog, 
  selectedDateKey,
  setSelectedDateKey,
  targetCalories, 
  targetProtein,
  onOpenExport
}) {
  const [showKettleTip, setShowKettleTip] = useState(false);
  const [isBreakfastPickerOpen, setIsBreakfastPickerOpen] = useState(false);

  const { 
    breakfast, 
    lunch, 
    dinner, 
    extraFoods, 
    standaloneEggs 
  } = dailyLog;

  // Curry eggs count
  const curryEggsCount = (dinner.hasEggCurry ? 1 : 0) + (breakfast.isEggCurry ? 1 : 0);
  const totalEggsToday = standaloneEggs + curryEggsCount;

  // Macros calculations
  const breakfastCalories = breakfast.calories || 0;
  const breakfastProtein = breakfast.protein || 0;

  const lunchCalories = Math.round(
    (lunch.riceKatoris * 180) + 
    (lunch.curryKatoris * 140) + 
    (lunch.dalKatoris * 150)
  );
  const lunchProtein = parseFloat((
    (lunch.riceKatoris * 3.8) + 
    (lunch.curryKatoris * 3.5) + 
    (lunch.dalKatoris * 7.0)
  ).toFixed(1));

  const dinnerCalories = Math.round(
    (dinner.riceKatoris * 180) + 
    (dinner.chapatis * 110) + 
    (dinner.hasChickenCurry ? 260 : 0) + 
    (dinner.hasEggCurry ? 180 : 0) + 
    (dinner.hasVegCurry ? 130 : 0)
  );
  const dinnerProtein = parseFloat((
    (dinner.riceKatoris * 3.8) + 
    (dinner.chapatis * 3.2) + 
    (dinner.hasChickenCurry ? 18.0 : 0) + 
    (dinner.hasEggCurry ? 8.5 : 0) + 
    (dinner.hasVegCurry ? 3.0 : 0)
  ).toFixed(1));

  const eggCalories = standaloneEggs * 75;
  const eggProtein = parseFloat((standaloneEggs * 6.5).toFixed(1));

  const milkCal = extraFoods.milk500ml ? 300 : (extraFoods.milk250ml ? 150 : 0);
  const milkPro = extraFoods.milk500ml ? 16.5 : (extraFoods.milk250ml ? 8.2 : 0);

  const bananaCal = extraFoods.bananasCount * 100;
  const bananaPro = parseFloat((extraFoods.bananasCount * 1.25).toFixed(1));

  const peanutCal = extraFoods.peanuts30g ? 170 : 0;
  const peanutPro = extraFoods.peanuts30g ? 7.5 : 0;

  const soyaCal = extraFoods.soyaChunks30g ? 105 : 0;
  const soyaPro = extraFoods.soyaChunks30g ? 15.5 : 0;

  const extraCalories = milkCal + bananaCal + peanutCal + soyaCal;
  const extraProtein = parseFloat((milkPro + bananaPro + peanutPro + soyaPro).toFixed(1));

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + eggCalories + extraCalories;
  const totalProtein = parseFloat((breakfastProtein + lunchProtein + dinnerProtein + eggProtein + extraProtein).toFixed(1));

  const calPercentage = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const proPercentage = Math.min(100, Math.round((totalProtein / targetProtein) * 100));

  // Date navigation helpers
  const changeDateBy = (days) => {
    const cur = new Date(selectedDateKey);
    cur.setDate(cur.getDate() + days);
    setSelectedDateKey(cur.toISOString().split('T')[0]);
  };

  const isToday = selectedDateKey === new Date().toISOString().split('T')[0];
  const formattedDate = new Date(selectedDateKey).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-5 pb-20 md:pb-6 animate-fadeIn">
      {/* 1. Date Switcher (Google Style) */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
        <button
          onClick={() => changeDateBy(-1)}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
          title="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-white tracking-wide">
            {isToday ? `Today (${formattedDate})` : formattedDate}
          </span>
        </div>

        <button
          onClick={() => changeDateBy(1)}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
          title="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Google Fit Style Hero Progress Card */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Daily Target Surplus
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-white">{totalCalories}</span>
              <span className="text-xs text-slate-400">/ {targetCalories} kcal</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {totalCalories >= targetCalories ? (
                <span className="text-emerald-400 font-semibold">Lean bulk surplus goal achieved! 🎉</span>
              ) : (
                <span><strong>{targetCalories - totalCalories} kcal</strong> needed today for steady weight gain</span>
              )}
            </p>
          </div>

          {/* Protein Pill */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 self-start sm:self-auto sm:text-right min-w-[130px]">
            <span className="text-[11px] text-slate-400 font-medium block">Protein Progress</span>
            <span className="text-xl font-bold text-emerald-400">{totalProtein}g</span>
            <span className="text-[11px] text-slate-500 block">Target: {targetProtein}g</span>
          </div>
        </div>

        {/* Dual Progress Bars */}
        <div className="space-y-2 mt-4 pt-4 border-t border-slate-800/80">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Calories ({calPercentage}%)</span>
              <span>{totalCalories >= targetCalories ? 'Target met' : `${targetCalories - totalCalories} left`}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${calPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Protein ({proPercentage}%)</span>
              <span>{totalProtein >= targetProtein ? 'Target met' : `${(targetProtein - totalProtein).toFixed(1)}g left`}</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${proPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Bulking Pillars Checklist (Google Tasks Style) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">The 4 Bulking Staples</h3>
            <p className="text-xs text-slate-400">+775 kcal and +42g protein (under ₹2,000/mo)</p>
          </div>
          <button
            onClick={() => setShowKettleTip(!showKettleTip)}
            className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Kettle Prep</span>
          </button>
        </div>

        {showKettleTip && (
          <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-xs text-slate-300 space-y-1 animate-fadeIn">
            <span className="font-semibold text-emerald-400">⚡ Soya Chunks Kettle Hack:</span>
            <p>Boil water in your electric kettle. Pour into a bowl containing 30g dry soya chunks, cover with a plate for 8–10 mins. Squeeze water out and mix into your hostel dinner curry!</p>
          </div>
        )}

        <div className="space-y-2 pt-1">
          {/* Item 1: Milk */}
          <div 
            onClick={() => setDailyLog(prev => ({
              ...prev,
              extraFoods: { ...prev.extraFoods, milk500ml: !prev.extraFoods.milk500ml }
            }))}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
              extraFoods.milk500ml ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                extraFoods.milk500ml ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
              }`}>
                {extraFoods.milk500ml && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Nandini Toned Milk (500ml)</p>
                <p className="text-[11px] text-slate-500">+300 kcal • 16.5g protein (₹30/day)</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">
              {extraFoods.milk500ml ? 'Taken' : '+ Add'}
            </span>
          </div>

          {/* Item 2: Bananas */}
          <div className={`p-3 rounded-xl border flex items-center justify-between transition ${
            extraFoods.bananasCount === 2 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div 
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  extraFoods: { ...prev.extraFoods, bananasCount: prev.extraFoods.bananasCount >= 2 ? 0 : 2 }
                }))}
                className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                  extraFoods.bananasCount >= 2 ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
                }`}
              >
                {extraFoods.bananasCount >= 2 && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">2 Fresh Bananas</p>
                <p className="text-[11px] text-slate-500">+{extraFoods.bananasCount * 100} kcal • +{(extraFoods.bananasCount * 1.25).toFixed(1)}g protein</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  extraFoods: { ...prev.extraFoods, bananasCount: Math.max(0, prev.extraFoods.bananasCount - 1) }
                }))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-white w-4 text-center">{extraFoods.bananasCount}</span>
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  extraFoods: { ...prev.extraFoods, bananasCount: Math.min(4, prev.extraFoods.bananasCount + 1) }
                }))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Item 3: Peanuts */}
          <div 
            onClick={() => setDailyLog(prev => ({
              ...prev,
              extraFoods: { ...prev.extraFoods, peanuts30g: !prev.extraFoods.peanuts30g }
            }))}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
              extraFoods.peanuts30g ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                extraFoods.peanuts30g ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
              }`}>
                {extraFoods.peanuts30g && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Raw Peanuts (30g handful)</p>
                <p className="text-[11px] text-slate-500">+170 kcal • 7.5g protein</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">
              {extraFoods.peanuts30g ? 'Eaten' : '+ Add'}
            </span>
          </div>

          {/* Item 4: Soya Chunks */}
          <div 
            onClick={() => setDailyLog(prev => ({
              ...prev,
              extraFoods: { ...prev.extraFoods, soyaChunks30g: !prev.extraFoods.soyaChunks30g }
            }))}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
              extraFoods.soyaChunks30g ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                extraFoods.soyaChunks30g ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-700'
              }`}>
                {extraFoods.soyaChunks30g && <Check className="w-3.5 h-3.5" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Soya Chunks (30g dry, kettle cooked)</p>
                <p className="text-[11px] text-slate-500">+105 kcal • 15.5g complete protein</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">
              {extraFoods.soyaChunks30g ? 'Eaten' : '+ Add'}
            </span>
          </div>

          {/* Item 5: Daily 3 Eggs */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Egg className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Daily 3 Eggs Goal</p>
                <p className="text-[11px] text-slate-500">
                  {curryEggsCount > 0 ? `${curryEggsCount} egg in curry + ${standaloneEggs} boiled` : `${standaloneEggs} boiled eggs logged`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  standaloneEggs: Math.max(0, prev.standaloneEggs - 1)
                }))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-amber-400 w-4 text-center">{standaloneEggs}</span>
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  standaloneEggs: Math.min(5, prev.standaloneEggs + 1)
                }))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Hostel Regular Meals (Clean Material Selector) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-white text-base">Hostel Meals (Katoris & Pieces)</h3>

        {/* Breakfast Picker */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Breakfast</span>
            <span className="text-slate-300 font-semibold">{breakfast.calories} kcal • {breakfast.protein}g</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsBreakfastPickerOpen(!isBreakfastPickerOpen)}
              className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-white hover:border-slate-700 transition"
            >
              <span>{breakfast.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isBreakfastPickerOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl z-20">
                {HOSTEL_BREAKFAST_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setDailyLog(prev => ({
                        ...prev,
                        breakfast: {
                          name: opt.name,
                          calories: opt.calories,
                          protein: opt.protein,
                          isEggCurry: !!opt.hasCurryEgg
                        }
                      }));
                      setIsBreakfastPickerOpen(false);
                    }}
                    className="w-full text-left p-2.5 hover:bg-slate-900 text-xs text-slate-200 border-b border-slate-850 flex justify-between items-center transition"
                  >
                    <span>{opt.name}</span>
                    <span className="text-slate-500">{opt.calories} kcal</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lunch Steppers */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Lunch</span>
            <span className="text-slate-300 font-semibold">{lunchCalories} kcal • {lunchProtein}g</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Rice</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, riceKatoris: Math.max(0, prev.lunch.riceKatoris - 0.5) }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white w-6 text-center">{lunch.riceKatoris}k</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, riceKatoris: prev.lunch.riceKatoris + 0.5 }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Curry</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, curryKatoris: Math.max(0, prev.lunch.curryKatoris - 0.5) }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white w-6 text-center">{lunch.curryKatoris}k</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, curryKatoris: prev.lunch.curryKatoris + 0.5 }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Dal</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, dalKatoris: Math.max(0, prev.lunch.dalKatoris - 0.5) }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white w-6 text-center">{lunch.dalKatoris}k</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, dalKatoris: prev.lunch.dalKatoris + 0.5 }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dinner Steppers */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Dinner</span>
            <span className="text-slate-300 font-semibold">{dinnerCalories} kcal • {dinnerProtein}g</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Chapatis</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, chapatis: Math.max(0, prev.dinner.chapatis - 1) }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white w-6 text-center">{dinner.chapatis}</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, chapatis: prev.dinner.chapatis + 1 }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Rice</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, riceKatoris: Math.max(0, prev.dinner.riceKatoris - 0.5) }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white w-6 text-center">{dinner.riceKatoris}k</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, riceKatoris: prev.dinner.riceKatoris + 0.5 }
                  }))}
                  className="p-0.5 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setDailyLog(prev => ({
                ...prev,
                dinner: {
                  ...prev.dinner,
                  hasChickenCurry: !prev.dinner.hasChickenCurry,
                  hasEggCurry: false
                }
              }))}
              className={`p-2 rounded-xl border text-center transition font-semibold ${
                dinner.hasChickenCurry ? 'bg-emerald-500/15 border-emerald-500/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Chicken (+18g)
            </button>

            <button
              onClick={() => setDailyLog(prev => ({
                ...prev,
                dinner: {
                  ...prev.dinner,
                  hasEggCurry: !prev.dinner.hasEggCurry,
                  hasChickenCurry: false
                }
              }))}
              className={`p-2 rounded-xl border text-center transition font-semibold ${
                dinner.hasEggCurry ? 'bg-sky-500/15 border-sky-500/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              Egg Curry (1 egg)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
