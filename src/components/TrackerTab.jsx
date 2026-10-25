import React, { useState } from 'react';
import { 
  Flame, Dumbbell, Egg, Check, Plus, Minus, 
  HelpCircle, Utensils, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, 
  Sparkles, X, Wand2, Info, CheckCircle2, Share2, AlertCircle 
} from 'lucide-react';
import { HOSTEL_BREAKFAST_OPTIONS, FOOD_BASE_CATEGORIES, PORTION_SIZES } from '../data/defaultData';

export default function TrackerTab({ 
  dailyLog, 
  setDailyLog, 
  selectedDateKey,
  setSelectedDateKey,
  targetCalories, 
  targetProtein,
  onOpenExport
}) {
  const [isBreakfastPickerOpen, setIsBreakfastPickerOpen] = useState(false);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
  const [showPortionGuide, setShowPortionGuide] = useState(false);

  // Estimator state
  const [selectedBaseId, setSelectedBaseId] = useState('dal_legume');
  const [selectedPortionId, setSelectedPortionId] = useState('standard_bowl');
  const [isExtraOily, setIsExtraOily] = useState(false);
  const [customDishName, setCustomDishName] = useState('');
  const [customDishCalories, setCustomDishCalories] = useState(190);
  const [customDishProtein, setCustomDishProtein] = useState(9);
  const [customDishPortion, setCustomDishPortion] = useState('1 Standard Bowl (~200ml)');

  const { 
    breakfast = { name: 'Dosa (3 medium) with Sambar', calories: 430, protein: 12, isEggCurry: false }, 
    lunch = { riceKatoris: 2, curryKatoris: 1, dalKatoris: 0 }, 
    dinner = { riceKatoris: 1.5, chapatis: 2, hasChickenCurry: false, hasEggCurry: false, hasVegCurry: true }, 
    extraFoods = { milk500ml: true, milk250ml: false, bananasCount: 2, peanuts30g: true, soyaChunks30g: true }, 
    standaloneEggs = 3,
    customItems = [] 
  } = dailyLog || {};

  // Auto-calculate macros for visual estimator
  const computeVisualEstimate = (baseId, portionId, oily) => {
    const base = FOOD_BASE_CATEGORIES.find(b => b.id === baseId) || FOOD_BASE_CATEGORIES[2];
    const portion = PORTION_SIZES.find(p => p.id === portionId) || PORTION_SIZES[1];

    let cal = 0;
    let pro = 0;

    if (base.isPieceBase) {
      cal = Math.round(portion.pieceCount * 110);
      pro = parseFloat((portion.pieceCount * 3.2).toFixed(1));
    } else {
      const vol = portion.volumeMl;
      cal = Math.round((vol / 100) * base.calPer100ml);
      pro = parseFloat(((vol / 100) * base.proPer100ml).toFixed(1));
    }

    if (oily) cal += 60;

    return { cal, pro, portionLabel: portion.label };
  };

  const handleBaseChange = (baseId) => {
    setSelectedBaseId(baseId);
    const est = computeVisualEstimate(baseId, selectedPortionId, isExtraOily);
    setCustomDishCalories(est.cal);
    setCustomDishProtein(est.pro);
    setCustomDishPortion(est.portionLabel);
  };

  const handlePortionChange = (portionId) => {
    setSelectedPortionId(portionId);
    const est = computeVisualEstimate(selectedBaseId, portionId, isExtraOily);
    setCustomDishCalories(est.cal);
    setCustomDishProtein(est.pro);
    setCustomDishPortion(est.portionLabel);
  };

  const handleOilToggle = (oily) => {
    setIsExtraOily(oily);
    const est = computeVisualEstimate(selectedBaseId, selectedPortionId, oily);
    setCustomDishCalories(est.cal);
    setCustomDishProtein(est.pro);
  };

  // Curry eggs check & double counting prevention
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

  const bananaCal = (extraFoods.bananasCount || 0) * 100;
  const bananaPro = parseFloat(((extraFoods.bananasCount || 0) * 1.25).toFixed(1));

  const peanutCal = extraFoods.peanuts30g ? 170 : 0;
  const peanutPro = extraFoods.peanuts30g ? 7.5 : 0;

  const soyaCal = extraFoods.soyaChunks30g ? 105 : 0;
  const soyaPro = extraFoods.soyaChunks30g ? 15.5 : 0;

  const extraCalories = milkCal + bananaCal + peanutCal + soyaCal;
  const extraProtein = parseFloat((milkPro + bananaPro + peanutPro + soyaPro).toFixed(1));

  const customItemsCalories = customItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const customItemsProtein = parseFloat(customItems.reduce((acc, it) => acc + (Number(it.protein) || 0), 0).toFixed(1));

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + eggCalories + extraCalories + customItemsCalories;
  const totalProtein = parseFloat((breakfastProtein + lunchProtein + dinnerProtein + eggProtein + extraProtein + customItemsProtein).toFixed(1));

  const calPercentage = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const proPercentage = Math.min(100, Math.round((totalProtein / targetProtein) * 100));

  // Date Navigation
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

  // Handlers for Add Custom Dish
  const handleAddCustomFood = (e) => {
    e.preventDefault();
    if (!customDishName.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: customDishName.trim(),
      portion: customDishPortion,
      calories: Number(customDishCalories) || 0,
      protein: Number(customDishProtein) || 0
    };

    setDailyLog(prev => ({
      ...prev,
      customItems: [...(prev.customItems || []), newItem]
    }));

    setIsCustomFoodModalOpen(false);
    setCustomDishName('');
  };

  const handleRemoveCustomItem = (id) => {
    setDailyLog(prev => ({
      ...prev,
      customItems: (prev.customItems || []).filter(it => it.id !== id)
    }));
  };

  return (
    <div className="space-y-4 pb-28 animate-fadeIn max-w-md md:max-w-xl mx-auto">
      {/* 1. Date Header Pill Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-2xl border border-white/[0.08] shadow-sm">
        <button
          onClick={() => changeDateBy(-1)}
          className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-center transition active:scale-90"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-white">{formattedDate}</span>
          {isToday && (
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Today
            </span>
          )}
        </div>

        <button
          onClick={() => changeDateBy(1)}
          className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-center transition active:scale-90"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Hero Energy Gauge Card (Double-Bezel Architecture) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-xl">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Daily Energy & Protein
              </span>
              <div className="flex items-baseline gap-2 pt-1">
                <h1 className="text-3xl font-black text-white font-mono tracking-tight">{totalCalories}</h1>
                <span className="text-xs text-slate-400 font-medium">/ {targetCalories} kcal</span>
              </div>
            </div>

            {/* + Add Food Button in Hero Header */}
            <button
              onClick={() => setIsCustomFoodModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all duration-200 active:scale-95 shadow-md shadow-emerald-950 flex items-center gap-1.5"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>+ Add Dish</span>
            </button>
          </div>

          {/* Calorie Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-medium">Calorie Target</span>
              <span className="font-mono font-bold text-amber-400">{calPercentage}%</span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${calPercentage}%` }}
              />
            </div>
          </div>

          {/* Protein Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protein Goal ({totalProtein}g / {targetProtein}g)</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">{proPercentage}%</span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${proPercentage}%` }}
              />
            </div>
          </div>

          {/* Status Chip */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${
              totalCalories >= targetCalories ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              <span>
                {totalCalories >= targetCalories 
                  ? `In Bulking Surplus 🔥 (+${totalCalories - targetCalories} kcal)` 
                  : `${targetCalories - totalCalories} kcal remaining to hit surplus`}
              </span>
            </div>

            <button
              onClick={() => setShowPortionGuide(!showPortionGuide)}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 underline"
            >
              <Info className="w-3 h-3" />
              <span>Hostel Portions Guide</span>
            </button>
          </div>
        </div>
      </div>

      {/* Optional Hostel Portion Helper Card */}
      {showPortionGuide && (
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/[0.08] text-xs text-slate-300 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>No-Scale Hostel Portion Estimator</span>
            </span>
            <button onClick={() => setShowPortionGuide(false)} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/[0.06]">
              <span className="font-bold text-white block">1 Katori / Bowl (~200ml)</span>
              <span className="text-slate-400">Equal to your closed fist size (Rice ~180 kcal, Dal ~150 kcal).</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-white/[0.06]">
              <span className="font-bold text-white block">1 Half Katori (~100ml)</span>
              <span className="text-slate-400">Cupped hand volume. Ideal for thick gravies and curries.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Daily Bulking Staples Matrix (The 4 Hostel Pillars + 3 Eggs) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Hostel Daily Bulking Staples</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Tap to Quick Log</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* 1. Nandini Toned Milk (500ml / 250ml) */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">🥛 Nandini Milk</span>
                <span className="text-xs font-bold text-white">
                  {extraFoods.milk500ml ? '500 ml (+300 kcal)' : (extraFoods.milk250ml ? '250 ml (+150 kcal)' : 'None')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: { ...prev.extraFoods, milk500ml: !prev.extraFoods.milk500ml, milk250ml: false }
                  }))}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 ${
                    extraFoods.milk500ml
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  500ml
                </button>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: { ...prev.extraFoods, milk250ml: !prev.extraFoods.milk250ml, milk500ml: false }
                  }))}
                  className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 ${
                    extraFoods.milk250ml
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-white/[0.06]'
                  }`}
                >
                  250ml
                </button>
              </div>
            </div>

            {/* 2. Bananas Stepper */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">🍌 Ripe Bananas</span>
                <span className="text-xs font-bold text-white">{extraFoods.bananasCount || 0} bananas</span>
              </div>
              <div className="flex items-center justify-between bg-slate-950 rounded-xl px-2 py-1 border border-white/[0.06]">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: { ...prev.extraFoods, bananasCount: Math.max(0, (prev.extraFoods.bananasCount || 0) - 1) }
                  }))}
                  className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-xs text-white">{extraFoods.bananasCount || 0}</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: { ...prev.extraFoods, bananasCount: (prev.extraFoods.bananasCount || 0) + 1 }
                  }))}
                  className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 3. Roasted Peanuts */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">🥜 Peanuts (30g)</span>
                <span className="text-xs font-bold text-white">
                  {extraFoods.peanuts30g ? '1 Handful (+170 kcal)' : 'Not taken'}
                </span>
              </div>
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  extraFoods: { ...prev.extraFoods, peanuts30g: !prev.extraFoods.peanuts30g }
                }))}
                className={`w-full py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 ${
                  extraFoods.peanuts30g
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {extraFoods.peanuts30g ? '✓ Logged' : 'Log 30g'}
              </button>
            </div>

            {/* 4. Soya Chunks (Kettle steeped) */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">🌱 Soya Chunks (30g)</span>
                <span className="text-xs font-bold text-white">
                  {extraFoods.soyaChunks30g ? '15.5g Protein' : 'Not taken'}
                </span>
              </div>
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  extraFoods: { ...prev.extraFoods, soyaChunks30g: !prev.extraFoods.soyaChunks30g }
                }))}
                className={`w-full py-1.5 rounded-xl text-[10px] font-bold transition active:scale-95 ${
                  extraFoods.soyaChunks30g
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {extraFoods.soyaChunks30g ? '✓ Logged' : 'Log 30g'}
              </button>
            </div>

            {/* 5. 3 Daily Boiled Eggs */}
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] flex flex-col justify-between space-y-2 col-span-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">🥚 Boiled Eggs (Target: 3/day)</span>
                  <span className="text-xs font-bold text-white">
                    {standaloneEggs} standalone eggs ({standaloneEggs * 75} kcal • {(standaloneEggs * 6.5).toFixed(1)}g pro)
                  </span>
                </div>
                {curryEggsCount > 0 && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    +{curryEggsCount} in curry
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between bg-slate-950 rounded-xl px-2 py-1 border border-white/[0.06]">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    standaloneEggs: Math.max(0, (prev.standaloneEggs || 0) - 1)
                  }))}
                  className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-xs text-white">
                  {standaloneEggs} Eggs ({totalEggsToday} Total)
                </span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    standaloneEggs: (prev.standaloneEggs || 0) + 1
                  }))}
                  className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Meals Timeline Cards */}
      <div className="space-y-3">
        {/* Breakfast Card */}
        <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
          <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Breakfast</span>
                <h4 className="text-sm font-bold text-white">{breakfast.name}</h4>
              </div>
              <button
                onClick={() => setIsBreakfastPickerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-emerald-400 border border-white/[0.06] transition active:scale-95"
              >
                Change
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white font-bold">{breakfast.calories} kcal</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">{breakfast.protein}g protein</span>
            </div>
          </div>
        </div>

        {/* Lunch Card */}
        <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
          <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lunch (Hostel Mess)</span>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-white font-bold">{lunchCalories} kcal</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{lunchProtein}g protein</span>
                </div>
              </div>
            </div>

            {/* Steppers for Rice, Curry, Dal */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              {/* Rice */}
              <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-white/[0.06] text-center space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Rice (bowls)</span>
                <div className="flex items-center justify-between bg-slate-950 rounded-xl px-1.5 py-1">
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      lunch: { ...prev.lunch, riceKatoris: Math.max(0, (prev.lunch?.riceKatoris || 0) - 0.5) }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  <span className="font-mono font-bold text-white text-xs">{lunch.riceKatoris}</span>
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      lunch: { ...prev.lunch, riceKatoris: (prev.lunch?.riceKatoris || 0) + 0.5 }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Curry */}
              <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-white/[0.06] text-center space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Curry (bowls)</span>
                <div className="flex items-center justify-between bg-slate-950 rounded-xl px-1.5 py-1">
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      lunch: { ...prev.lunch, curryKatoris: Math.max(0, (prev.lunch?.curryKatoris || 0) - 0.5) }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  <span className="font-mono font-bold text-white text-xs">{lunch.curryKatoris}</span>
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      lunch: { ...prev.lunch, curryKatoris: (prev.lunch?.curryKatoris || 0) + 0.5 }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Dal */}
              <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-white/[0.06] text-center space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Dal (bowls)</span>
                <div className="flex items-center justify-between bg-slate-950 rounded-xl px-1.5 py-1">
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      lunch: { ...prev.lunch, dalKatoris: Math.max(0, (prev.lunch?.dalKatoris || 0) - 0.5) }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  <span className="font-mono font-bold text-white text-xs">{lunch.dalKatoris}</span>
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      lunch: { ...prev.lunch, dalKatoris: (prev.lunch?.dalKatoris || 0) + 0.5 }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dinner Card */}
        <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
          <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dinner (Hostel Mess)</span>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-white font-bold">{dinnerCalories} kcal</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{dinnerProtein}g protein</span>
                </div>
              </div>
            </div>

            {/* Steppers for Rice & Chapatis */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-white/[0.06] text-center space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Rice (bowls)</span>
                <div className="flex items-center justify-between bg-slate-950 rounded-xl px-1.5 py-1">
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      dinner: { ...prev.dinner, riceKatoris: Math.max(0, (prev.dinner?.riceKatoris || 0) - 0.5) }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  <span className="font-mono font-bold text-white text-xs">{dinner.riceKatoris}</span>
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      dinner: { ...prev.dinner, riceKatoris: (prev.dinner?.riceKatoris || 0) + 0.5 }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-white/[0.06] text-center space-y-1">
                <span className="text-[10px] text-slate-400 block font-medium">Chapatis (pieces)</span>
                <div className="flex items-center justify-between bg-slate-950 rounded-xl px-1.5 py-1">
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      dinner: { ...prev.dinner, chapatis: Math.max(0, (prev.dinner?.chapatis || 0) - 1) }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-3 h-3 mx-auto" />
                  </button>
                  <span className="font-mono font-bold text-white text-xs">{dinner.chapatis}</span>
                  <button
                    onClick={() => setDailyLog(prev => ({
                      ...prev,
                      dinner: { ...prev.dinner, chapatis: (prev.dinner?.chapatis || 0) + 1 }
                    }))}
                    className="w-5 h-5 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            {/* Curry Type Toggles */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  dinner: {
                    ...prev.dinner,
                    hasChickenCurry: !prev.dinner.hasChickenCurry,
                    hasEggCurry: false,
                    hasVegCurry: prev.dinner.hasChickenCurry ? true : false
                  }
                }))}
                className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                  dinner.hasChickenCurry
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-white/[0.06]'
                }`}
              >
                🍗 Chicken
              </button>

              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  dinner: {
                    ...prev.dinner,
                    hasEggCurry: !prev.dinner.hasEggCurry,
                    hasChickenCurry: false,
                    hasVegCurry: prev.dinner.hasEggCurry ? true : false
                  }
                }))}
                className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                  dinner.hasEggCurry
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-white/[0.06]'
                }`}
              >
                🥚 Egg Curry
              </button>

              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  dinner: {
                    ...prev.dinner,
                    hasVegCurry: true,
                    hasChickenCurry: false,
                    hasEggCurry: false
                  }
                }))}
                className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                  dinner.hasVegCurry && !dinner.hasChickenCurry && !dinner.hasEggCurry
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-white/[0.06]'
                }`}
              >
                🥗 Veg
              </button>
            </div>
          </div>
        </div>

        {/* Custom Items / Unknown Curries Logged */}
        {customItems.length > 0 && (
          <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
            <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Discovered Foods & Custom Curries
              </span>
              <div className="space-y-1.5">
                {customItems.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-white/[0.06] flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.portion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right font-mono">
                        <span className="font-bold text-white block">{item.calories} kcal</span>
                        <span className="text-[10px] text-emerald-400">{item.protein}g pro</span>
                      </div>
                      <button
                        onClick={() => handleRemoveCustomItem(item.id)}
                        className="w-6 h-6 rounded-lg text-slate-500 hover:text-rose-400 flex items-center justify-center transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Breakfast Selection Modal Drawer */}
      {isBreakfastPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/[0.1] rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">Select Breakfast</h3>
                <p className="text-xs text-slate-400">Common Mangaluru mess breakfast options</p>
              </div>
              <button
                onClick={() => setIsBreakfastPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
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
                        isEggCurry: opt.isEggCurry
                      }
                    }));
                    setIsBreakfastPickerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition active:scale-95 ${
                    breakfast.name === opt.name
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950 border-white/[0.06] text-slate-300 hover:border-white/[0.15]'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs text-white">{opt.name}</p>
                    <p className="text-[10px] text-slate-400">{opt.portion}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-xs text-emerald-400 block">{opt.calories} kcal</span>
                    <span className="text-[10px] text-slate-400">{opt.protein}g pro</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Visual 3-Tap Macro Estimator Modal (For Unknown Dishes) */}
      {isCustomFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/[0.1] rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">Visual Macro Estimator</h3>
                <p className="text-xs text-slate-400">Estimate any unknown curry or dish in 3 taps</p>
              </div>
              <button
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Dish Name */}
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">1. Dish Name</label>
              <input
                type="text"
                placeholder="e.g. Mixed Veg Curry, Rajma, Sambar..."
                value={customDishName}
                onChange={(e) => setCustomDishName(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {['Hostel Veg Curry', 'Dal Tadka', 'Chicken Gravy', 'Egg Roast', 'Kerala Parotta'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setCustomDishName(sug)}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/[0.05]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Base Category */}
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">2. Base Texture</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FOOD_BASE_CATEGORIES.map((base) => {
                  const isSelected = selectedBaseId === base.id;
                  return (
                    <button
                      key={base.id}
                      type="button"
                      onClick={() => handleBaseChange(base.id)}
                      className={`p-2.5 rounded-2xl border text-left text-xs transition active:scale-95 ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/40' 
                          : 'bg-slate-950 border-white/[0.06] text-slate-300 hover:border-white/[0.15]'
                      }`}
                    >
                      <p className="font-bold text-xs truncate">{base.name.split('/')[0]}</p>
                      <p className="text-[10px] text-slate-400 truncate">{base.example}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Portion Size */}
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">3. Portion Size</label>
              <div className="grid grid-cols-3 gap-1.5">
                {PORTION_SIZES.map((p) => {
                  const isSelected = selectedPortionId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePortionChange(p.id)}
                      className={`p-2 rounded-2xl border text-center text-xs transition active:scale-95 ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold' 
                          : 'bg-slate-950 border-white/[0.06] text-slate-300'
                      }`}
                    >
                      <span className="block font-bold text-[11px]">{p.label.split('(')[0]}</span>
                      <span className="text-[9px] text-slate-400">{p.volumeMl ? `${p.volumeMl}ml` : 'pcs'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Extra Oily toggle */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-white block">Extra Oily / Restaurant Gravy?</span>
                <span className="text-[10px] text-slate-400">+60 kcal cooking oil</span>
              </div>
              <button
                type="button"
                onClick={() => handleOilToggle(!isExtraOily)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                  isExtraOily ? 'bg-amber-500 text-slate-950' : 'bg-slate-850 text-slate-400 border border-white/[0.08]'
                }`}
              >
                {isExtraOily ? 'Extra Oil' : 'Normal'}
              </button>
            </div>

            {/* Output Calculation Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Macros:</span>
                <span className="text-xs font-bold text-white">{customDishPortion}</span>
              </div>
              <div className="text-right font-mono">
                <span className="text-base font-black text-emerald-400 block">{customDishCalories} kcal</span>
                <span className="text-xs text-slate-300">{customDishProtein}g protein</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="flex-1 py-3 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomFood}
                disabled={!customDishName.trim()}
                className="flex-1 py-3 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-md shadow-emerald-950 disabled:opacity-50"
              >
                Add to Day's Intake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
