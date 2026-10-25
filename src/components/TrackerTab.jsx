import React, { useState } from 'react';
import { 
  Flame, Dumbbell, Egg, CheckCircle2, Circle, Plus, Minus, 
  HelpCircle, Utensils, Coffee, Sun, Moon, Info, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { HOSTEL_BREAKFAST_OPTIONS } from '../data/defaultData';

export default function TrackerTab({ 
  dailyLog, 
  setDailyLog, 
  targetCalories, 
  targetProtein,
  onOpenExport
}) {
  const [showKettleTip, setShowKettleTip] = useState(false);
  const [selectedBreakfastPreset, setSelectedBreakfastPreset] = useState('');

  const { 
    breakfast, 
    lunch, 
    dinner, 
    extraFoods, 
    standaloneEggs 
  } = dailyLog;

  const curryEggsCount = (dinner.hasEggCurry ? 1 : 0) + (breakfast.isEggCurry ? 1 : 0);
  const totalEggsToday = standaloneEggs + curryEggsCount;

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

  const handleBreakfastPresetSelect = (presetId) => {
    setSelectedBreakfastPreset(presetId);
    const found = HOSTEL_BREAKFAST_OPTIONS.find(p => p.id === presetId);
    if (found) {
      setDailyLog(prev => ({
        ...prev,
        breakfast: {
          name: found.name,
          calories: found.calories,
          protein: found.protein,
          isEggCurry: !!found.hasCurryEgg
        }
      }));
    }
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* 1. Daily Progress Dashboard */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              തടി • Lean Bulk Cockpit
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Today's Nutrition Intake</h2>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
            totalCalories >= targetCalories ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
          }`}>
            {totalCalories >= targetCalories ? 'Goal Reached 🎉' : `${targetCalories - totalCalories} kcal to target`}
          </span>
        </div>

        {/* Linear Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Calories */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Flame className="w-3.5 h-3.5" /> Calories
              </span>
              <span className="text-slate-200 font-bold">
                {totalCalories} <span className="text-slate-500 font-normal">/ {targetCalories} kcal</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${calPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
              <span>{calPercentage}% of surplus goal</span>
              <span>{totalCalories >= targetCalories ? 'Surplus met' : `+${targetCalories - totalCalories} kcal`}</span>
            </div>
          </div>

          {/* Protein */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Dumbbell className="w-3.5 h-3.5" /> Protein
              </span>
              <span className="text-slate-200 font-bold">
                {totalProtein}g <span className="text-slate-500 font-normal">/ {targetProtein}g</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${proPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
              <span>{proPercentage}% of muscle synthesis</span>
              <span>{totalProtein >= targetProtein ? 'Protein met' : `${(targetProtein - totalProtein).toFixed(1)}g left`}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Prescribed Extra Bulking Foods */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              The 4 Prescribed Extra Foods (+775 kcal, +42g protein)
            </h3>
            <p className="text-xs text-slate-400">Strictly budgeted under ₹2,000/month cap</p>
          </div>
          <button 
            onClick={() => setShowKettleTip(!showKettleTip)}
            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 font-medium"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Kettle Prep</span>
            {showKettleTip ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {showKettleTip && (
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-200/90 space-y-1 animate-fadeIn">
            <p className="font-semibold text-emerald-300">⚡ Electric Kettle Prep for Soya Chunks:</p>
            <p>Boil water in your electric kettle. Put 30g dry soya chunks in a cup/bowl, pour the boiling water over, cover for 8–10 mins. Squeeze water out and mix into your hostel dinner curry!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Milk */}
          <div className={`p-3 rounded-xl border transition-all ${
            extraFoods.milk500ml ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm text-white">Nandini Toned Milk</p>
                <p className="text-xs text-slate-400">500ml fresh pouch (₹30/day)</p>
                <span className="text-xs text-emerald-400 font-medium block mt-1">+300 kcal • +16.5g protein</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: {
                      ...prev.extraFoods,
                      milk500ml: !prev.extraFoods.milk500ml,
                      milk250ml: false
                    }
                  }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    extraFoods.milk500ml ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {extraFoods.milk500ml ? '✅ 500ml' : 'Drink 500ml'}
                </button>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: {
                      ...prev.extraFoods,
                      milk250ml: !prev.extraFoods.milk250ml,
                      milk500ml: false
                    }
                  }))}
                  className="text-[11px] text-slate-500 hover:text-slate-300"
                >
                  {extraFoods.milk250ml ? 'Drank 250ml' : '250ml half?'}
                </button>
              </div>
            </div>
          </div>

          {/* Bananas */}
          <div className={`p-3 rounded-xl border transition-all ${
            extraFoods.bananasCount === 2 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm text-white">Fresh Bananas</p>
                <p className="text-xs text-slate-400">Target: 2 bananas/day (~₹16/day)</p>
                <span className="text-xs text-emerald-400 font-medium block mt-1">+{extraFoods.bananasCount * 100} kcal • +{(extraFoods.bananasCount * 1.25).toFixed(1)}g pro</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: {
                      ...prev.extraFoods,
                      bananasCount: Math.max(0, prev.extraFoods.bananasCount - 1)
                    }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-xs w-4 text-center text-white">{extraFoods.bananasCount}</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: {
                      ...prev.extraFoods,
                      bananasCount: Math.min(4, prev.extraFoods.bananasCount + 1)
                    }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Peanuts */}
          <div className={`p-3 rounded-xl border transition-all ${
            extraFoods.peanuts30g ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm text-white">Raw Peanuts</p>
                <p className="text-xs text-slate-400">30g (~1 small handful snack)</p>
                <span className="text-xs text-emerald-400 font-medium block mt-1">+170 kcal • +7.5g protein</span>
              </div>
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  extraFoods: {
                    ...prev.extraFoods,
                    peanuts30g: !prev.extraFoods.peanuts30g
                  }
                }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  extraFoods.peanuts30g ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {extraFoods.peanuts30g ? '✅ Eaten' : 'Mark Eaten'}
              </button>
            </div>
          </div>

          {/* Soya Chunks */}
          <div className={`p-3 rounded-xl border transition-all ${
            extraFoods.soyaChunks30g ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-sm text-white">Soya Chunks (Dry 30g)</p>
                <p className="text-xs text-slate-400">Boiled in kettle + mix in dinner</p>
                <span className="text-xs text-emerald-400 font-medium block mt-1">+105 kcal • +15.5g protein</span>
              </div>
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  extraFoods: {
                    ...prev.extraFoods,
                    soyaChunks30g: !prev.extraFoods.soyaChunks30g
                  }
                }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  extraFoods.soyaChunks30g ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {extraFoods.soyaChunks30g ? '✅ Eaten' : 'Mark Eaten'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Daily 3-Eggs Rule */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Egg className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">3 Daily Eggs (Pre-budgeted Essentials)</h3>
              <p className="text-xs text-slate-400">Paid from ₹12,500 living allocation (NOT counted in ₹2,000 grocery cap)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-white">{totalEggsToday} / 3 Eggs</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  standaloneEggs: Math.max(0, prev.standaloneEggs - 1)
                }))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-xs w-6 text-center text-amber-400">{standaloneEggs}</span>
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  standaloneEggs: Math.min(5, prev.standaloneEggs + 1)
                }))}
                className="p-1 hover:bg-slate-800 rounded text-slate-300"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {curryEggsCount > 0 ? (
          <div className="mt-3 bg-sky-950/30 border border-sky-500/30 rounded-xl p-3 text-xs text-sky-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span><strong>Curry Egg detected:</strong> 1 egg was in curry. Eat <strong>{Math.max(0, 3 - curryEggsCount)} boiled eggs</strong> today to hit your 3-egg goal without double counting cost.</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 mt-2">Standard day: 3 boiled eggs = ~225 kcal, 19.5g complete protein.</p>
        )}
      </section>

      {/* 4. Hostel Meals Logging (No Scale) */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-400" />
            Hostel Meals (No Scale Required)
          </h3>
          <p className="text-xs text-slate-400">Log via simple katoris (~200ml) and piece counters</p>
        </div>

        {/* Breakfast */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5 text-amber-400" /> Breakfast
            </span>
            <span className="text-slate-400">{breakfastCalories} kcal • {breakfastProtein}g protein</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {HOSTEL_BREAKFAST_OPTIONS.map(opt => {
              const isSelected = selectedBreakfastPreset === opt.id || breakfast.name === opt.name;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleBreakfastPresetSelect(opt.id)}
                  className={`p-2 rounded-lg text-left border text-xs transition ${
                    isSelected 
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white font-medium' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <p className="font-semibold truncate">{opt.name.split('(')[0]}</p>
                  <p className="text-[11px] text-slate-500">~{opt.calories} kcal</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lunch */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" /> Lunch
            </span>
            <span className="text-slate-400">{lunchCalories} kcal • {lunchProtein}g protein</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Rice */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">White Rice</p>
                <p className="text-[11px] text-slate-500">180 kcal/katori</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, riceKatoris: Math.max(0, prev.lunch.riceKatoris - 0.5) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-xs w-8 text-center text-emerald-400">{lunch.riceKatoris} kat</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, riceKatoris: prev.lunch.riceKatoris + 0.5 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Veg Curry */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Veg Curry</p>
                <p className="text-[11px] text-slate-500">140 kcal/katori</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, curryKatoris: Math.max(0, prev.lunch.curryKatoris - 0.5) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-xs w-8 text-center text-emerald-400">{lunch.curryKatoris} kat</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, curryKatoris: prev.lunch.curryKatoris + 0.5 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Dal */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Dal / Sambar</p>
                <p className="text-[11px] text-slate-500">150 kcal/katori</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, dalKatoris: Math.max(0, prev.lunch.dalKatoris - 0.5) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-xs w-8 text-center text-emerald-400">{lunch.dalKatoris} kat</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, dalKatoris: prev.lunch.dalKatoris + 0.5 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dinner */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-amber-400" /> Dinner
            </span>
            <span className="text-slate-400">{dinnerCalories} kcal • {dinnerProtein}g protein</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Chapatis */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Chapatis</p>
                <p className="text-[11px] text-slate-500">110 kcal/pc</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, chapatis: Math.max(0, prev.dinner.chapatis - 1) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-xs text-emerald-400">{dinner.chapatis} pcs</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, chapatis: prev.dinner.chapatis + 1 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Rice */}
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Dinner Rice</p>
                <p className="text-[11px] text-slate-500">180 kcal/kat</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, riceKatoris: Math.max(0, prev.dinner.riceKatoris - 0.5) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-xs text-emerald-400">{dinner.riceKatoris} kat</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    dinner: { ...prev.dinner, riceKatoris: prev.dinner.riceKatoris + 0.5 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-300"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Chicken Curry Toggle */}
            <button
              onClick={() => setDailyLog(prev => ({
                ...prev,
                dinner: {
                  ...prev.dinner,
                  hasChickenCurry: !prev.dinner.hasChickenCurry,
                  hasEggCurry: false
                }
              }))}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition ${
                dinner.hasChickenCurry ? 'bg-emerald-500/15 border-emerald-500/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-white">Chicken Curry</p>
                <p className="text-[11px] text-slate-500">1 pc (+18g pro)</p>
              </div>
              <span className="text-[11px] font-bold mt-2 text-emerald-400">
                {dinner.hasChickenCurry ? '✅ Included' : '+ Add'}
              </span>
            </button>

            {/* Egg Curry Toggle */}
            <button
              onClick={() => setDailyLog(prev => ({
                ...prev,
                dinner: {
                  ...prev.dinner,
                  hasEggCurry: !prev.dinner.hasEggCurry,
                  hasChickenCurry: false
                }
              }))}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition ${
                dinner.hasEggCurry ? 'bg-sky-500/15 border-sky-500/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <p className="text-xs font-semibold text-white">Egg Curry</p>
                <p className="text-[11px] text-slate-500">1 egg in gravy</p>
              </div>
              <span className="text-[11px] font-bold mt-2 text-sky-400">
                {dinner.hasEggCurry ? '✅ 1 Curry Egg' : '+ Add'}
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
