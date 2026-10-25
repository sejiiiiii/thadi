import React, { useState } from 'react';
import { 
  Flame, Dumbbell, Egg, Check, Plus, Minus, 
  HelpCircle, Utensils, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, 
  Sparkles, X, PlusCircle, Wand2, Info 
} from 'lucide-react';
import { HOSTEL_BREAKFAST_OPTIONS } from '../data/defaultData';

// Visual base categories with standard values per 100ml/g
export const FOOD_BASE_CATEGORIES = [
  { id: 'chicken_fish', name: 'Chicken / Fish (Curry with meat)', calPer100ml: 140, proPer100ml: 11, icon: '🍗', example: 'Chicken curry, fish curry' },
  { id: 'paneer_soya', name: 'Paneer / Soya (Gravy)', calPer100ml: 150, proPer100ml: 9, icon: '🧀', example: 'Paneer butter masala, soya curry' },
  { id: 'dal_legume', name: 'Dal / Chana / Rajma / Sprouts', calPer100ml: 95, proPer100ml: 4.5, icon: '🍲', example: 'Dal tadka, rajma, chole' },
  { id: 'veg_curry', name: 'Veg Curry / Sambar / Rasam', calPer100ml: 65, proPer100ml: 1.8, icon: '🥗', example: 'Aloo gobi, mixed veg, sambar' },
  { id: 'rice_biryani', name: 'Cooked Rice / Pulao / Biryani', calPer100ml: 130, proPer100ml: 2.7, icon: '🍚', example: 'White rice, veg pulao, biryani' },
  { id: 'bread_roti', name: 'Roti / Chapati / Parotta', calPer100ml: 280, proPer100ml: 8.0, icon: '🫓', isPieceBase: true, example: 'Chapatis, rotis, parottas' },
  { id: 'fried_snack', name: 'Snack / Street Food / Fast Food', calPer100ml: 220, proPer100ml: 5.0, icon: '🍟', example: 'Samosa, maggi, egg puff, roll' }
];

// Portion multipliers based on standard utensils
export const PORTION_SIZES = [
  { id: 'small_bowl', label: 'Small Katori / Half Cup', volumeMl: 120, pieceCount: 1, desc: 'Small cup (~120 ml)' },
  { id: 'standard_bowl', label: 'Standard Hostel Bowl (Katori)', volumeMl: 200, pieceCount: 2, desc: 'Typical mess bowl (~200 ml)' },
  { id: 'large_bowl', label: 'Large Bowl / Deep Plate', volumeMl: 320, pieceCount: 3, desc: 'Heaped serving (~320 ml)' }
];

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
  const [showHandGuide, setShowHandGuide] = useState(false);
  const [isBreakfastPickerOpen, setIsBreakfastPickerOpen] = useState(false);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);

  // Estimator Mode: 'visual' (smart wizard) vs 'manual' (type numbers)
  const [estimatorMode, setEstimatorMode] = useState('visual');
  const [selectedBaseId, setSelectedBaseId] = useState('dal_legume');
  const [selectedPortionId, setSelectedPortionId] = useState('standard_bowl');
  const [isExtraOily, setIsExtraOily] = useState(false);

  // Custom food form state
  const [customDishName, setCustomDishName] = useState('');
  const [customDishCalories, setCustomDishCalories] = useState(190);
  const [customDishProtein, setCustomDishProtein] = useState(9);
  const [customDishPortion, setCustomDishPortion] = useState('1 bowl (~200ml)');

  const { 
    breakfast, 
    lunch, 
    dinner, 
    extraFoods, 
    standaloneEggs,
    customItems = [] 
  } = dailyLog;

  // Auto-calculate macros when visual wizard selections change
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

    if (oily) {
      cal += 60; // ~1 tsp extra cooking oil/ghee
    }

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

  const customItemsCalories = customItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const customItemsProtein = parseFloat(customItems.reduce((acc, it) => acc + (Number(it.protein) || 0), 0).toFixed(1));

  const totalCalories = breakfastCalories + lunchCalories + dinnerCalories + eggCalories + extraCalories + customItemsCalories;
  const totalProtein = parseFloat((breakfastProtein + lunchProtein + dinnerProtein + eggProtein + extraProtein + customItemsProtein).toFixed(1));

  const calPercentage = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const proPercentage = Math.min(100, Math.round((totalProtein / targetProtein) * 100));

  // Add Custom Food
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
      {/* 1. Date Switcher */}
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

      {/* 2. Hero Progress Card */}
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
                <span className="text-emerald-400 font-semibold">Lean bulk surplus achieved today! 🎉</span>
              ) : (
                <span><strong>{targetCalories - totalCalories} kcal</strong> needed today for clean muscle gain</span>
              )}
            </p>
          </div>

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

      {/* 3. The 4 Bulking Staples Checklist */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">The 4 Bulking Staples</h3>
            <p className="text-xs text-slate-400">+775 kcal and +42g protein (under ₹2,000/mo cap)</p>
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
          {/* Milk */}
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

          {/* Bananas */}
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

          {/* Peanuts */}
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

          {/* Soya Chunks */}
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
                <p className="text-[11px] text-slate-500">+105 kcal • 15.5g protein</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400">
              {extraFoods.soyaChunks30g ? 'Eaten' : '+ Add'}
            </span>
          </div>

          {/* Daily Eggs */}
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

      {/* 4. Hostel Meals & Custom Dishes */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-white text-base">Hostel Meals & Curries</h3>
            <p className="text-xs text-slate-400">Portions in standard <strong>bowls (katoris ≈ 200ml)</strong></p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHandGuide(!showHandGuide)}
              className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800"
            >
              <Info className="w-3 h-3 text-emerald-400" />
              <span>Hand Guide</span>
            </button>
            <button
              onClick={() => setIsCustomFoodModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold transition active:scale-95"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Estimate Any Dish</span>
            </button>
          </div>
        </div>

        {/* Hostel Hand & Utensil Visual Guide */}
        {showHandGuide && (
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
            <p className="font-semibold text-emerald-400">✋ Visual No-Scale Estimation Rule of Thumb:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-850">
                <span className="font-bold text-white block">1 Closed Fist ✊</span>
                <span className="text-slate-400">≈ 1 bowl rice (~180 kcal)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-850">
                <span className="font-bold text-white block">1 Palm ✋</span>
                <span className="text-slate-400">≈ 1 chicken/fish piece (~25g protein)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-850">
                <span className="font-bold text-white block">1 Cupped Hand 🫲</span>
                <span className="text-slate-400">≈ 1 handful peanuts (30g, ~170 kcal)</span>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-850">
                <span className="font-bold text-white block">1 Steel Katori 🥣</span>
                <span className="text-slate-400">≈ 200ml (2.5 bowls = 500ml bottle)</span>
              </div>
            </div>
          </div>
        )}

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

        {/* Lunch Steppers (Clear Bowls / Katoris metric!) */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Lunch</span>
            <span className="text-slate-300 font-semibold">{lunchCalories} kcal • {lunchProtein}g</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {/* Rice */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-slate-300 font-semibold block">Rice</span>
                <span className="text-[10px] text-slate-500">~200ml bowl</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-850">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, riceKatoris: Math.max(0, prev.lunch.riceKatoris - 0.5) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white text-xs">{lunch.riceKatoris} bowls</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, riceKatoris: prev.lunch.riceKatoris + 0.5 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Veg Curry */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-slate-300 font-semibold block">Veg Curry</span>
                <span className="text-[10px] text-slate-500">Mess curry</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-850">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, curryKatoris: Math.max(0, prev.lunch.curryKatoris - 0.5) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white text-xs">{lunch.curryKatoris} bowls</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, curryKatoris: prev.lunch.curryKatoris + 0.5 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Dal */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-slate-300 font-semibold block">Dal / Sambar</span>
                <span className="text-[10px] text-slate-500">Yellow dal</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-850">
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, dalKatoris: Math.max(0, prev.lunch.dalKatoris - 0.5) }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-bold text-white text-xs">{lunch.dalKatoris} bowls</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    lunch: { ...prev.lunch, dalKatoris: prev.lunch.dalKatoris + 0.5 }
                  }))}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400"
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
                <span className="font-bold text-white w-6 text-center">{dinner.chapatis} pcs</span>
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
                <span className="font-bold text-white w-6 text-center">{dinner.riceKatoris} bowls</span>
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

        {/* 5. Custom Logged Items List */}
        {customItems.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">
              Extra Added Dishes ({customItems.length}):
            </span>
            <div className="flex flex-wrap gap-2">
              {customItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-slate-950 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-xs flex items-center gap-2"
                >
                  <div>
                    <span className="font-semibold text-white">{item.name}</span>
                    <span className="text-slate-500 text-[10px] ml-1">({item.portion})</span>
                    <span className="text-emerald-400 text-[11px] font-mono ml-2">+{item.calories} kcal • +{item.protein}g</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveCustomItem(item.id)}
                    className="p-0.5 text-slate-500 hover:text-red-400 rounded transition"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Visual Portion & Macro Estimator Modal */}
      {isCustomFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-emerald-400" />
                  Smart Portion & Macro Estimator
                </h3>
                <p className="text-xs text-slate-400">Estimate any curry or dish in 3 visual taps</p>
              </div>
              <button 
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Dish Name */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">1. What dish are you eating?</label>
              <input
                type="text"
                placeholder="e.g. Fish Curry, Paneer Bhurji, Sambar, Maggi, Biryani..."
                value={customDishName}
                onChange={(e) => setCustomDishName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>

            {/* Step 2: What is the main food base? */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">2. What is the primary ingredient base?</label>
              <div className="grid grid-cols-2 gap-1.5">
                {FOOD_BASE_CATEGORIES.map((base) => {
                  const isSelected = selectedBaseId === base.id;
                  return (
                    <button
                      key={base.id}
                      type="button"
                      onClick={() => handleBaseChange(base.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-500 text-white font-semibold' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-base">{base.icon}</span>
                      <div className="truncate">
                        <p className="truncate text-xs font-semibold">{base.name.split('(')[0]}</p>
                        <p className="text-[10px] text-slate-500 truncate">{base.example}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Portion Size */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">3. How big is your portion?</label>
              <div className="grid grid-cols-3 gap-1.5">
                {PORTION_SIZES.map((p) => {
                  const isSelected = selectedPortionId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handlePortionChange(p.id)}
                      className={`p-2 rounded-xl border text-center text-xs transition ${
                        isSelected 
                          ? 'bg-emerald-500/15 border-emerald-500 text-white font-semibold' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="block font-semibold text-xs">{p.label.split('(')[0]}</span>
                      <span className="text-[10px] text-slate-500">{p.desc.split('(')[1]?.replace(')', '') || p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Oiliness check */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-white">Is it extra oily / hotel style?</span>
                <span className="text-[10px] text-slate-500 block">Adds ~60 kcal from extra oil/ghee</span>
              </div>
              <button
                type="button"
                onClick={() => handleOilToggle(!isExtraOily)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  isExtraOily ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-850 text-slate-400 hover:text-white'
                }`}
              >
                {isExtraOily ? 'Extra Oily (+60 kcal)' : 'Normal'}
              </button>
            </div>

            {/* Estimated result display */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Nutrition:</span>
                <span className="text-sm font-bold text-white">{customDishPortion}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400">{customDishCalories} kcal</span>
                <span className="text-xs text-slate-400 block">• {customDishProtein}g protein</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomFood}
                disabled={!customDishName.trim()}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-sm disabled:opacity-50"
              >
                Add to Daily Intake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
