import React, { useState } from 'react';
import { 
  Flame, Dumbbell, Egg, Check, Plus, Minus, 
  Utensils, ChevronLeft, ChevronRight, 
  Sparkles, X, Wand2, Info, Share2, Edit3, 
  BookOpen, Trash2, RotateCcw, Search, BookmarkCheck, ArrowRight
} from 'lucide-react';
import { HOSTEL_BREAKFAST_OPTIONS, FOOD_BASE_CATEGORIES, PORTION_SIZES } from '../data/defaultData';

export default function TrackerTab({ 
  dailyLog, 
  setDailyLog, 
  selectedDateKey,
  setSelectedDateKey,
  targetCalories, 
  targetProtein,
  savedDishes = [],
  setSavedDishes = () => {},
  onResetDay = () => {},
  onOpenExport
}) {
  const [isBreakfastPickerOpen, setIsBreakfastPickerOpen] = useState(false);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [showPortionGuide, setShowPortionGuide] = useState(false);

  // Target meal for adding custom item: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  const [targetMeal, setTargetMeal] = useState('lunch');

  // Estimator Mode: 'library' (quick pick) | 'visual' (3-tap wizard) | 'manual' (exact numbers)
  const [estimatorMode, setEstimatorMode] = useState('library');

  // Estimator / Custom Item state
  const [selectedBaseId, setSelectedBaseId] = useState('dal_legume');
  const [selectedPortionId, setSelectedPortionId] = useState('standard_bowl');
  const [isExtraOily, setIsExtraOily] = useState(false);
  const [customDishName, setCustomDishName] = useState('');
  const [customDishCalories, setCustomDishCalories] = useState(190);
  const [customDishProtein, setCustomDishProtein] = useState(9);
  const [customDishPortion, setCustomDishPortion] = useState('1 Standard Bowl (~200ml)');
  const [saveToLibraryCheckbox, setSaveToLibraryCheckbox] = useState(true);
  const [customDishCategory, setCustomDishCategory] = useState('Curries / Dal');
  const [customDishIsEgg, setCustomDishIsEgg] = useState(false);

  // Library modal search & category filters
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryFilterCategory, setLibraryFilterCategory] = useState('All');

  // Destructure daily log with clean 0 defaults
  const { 
    breakfast = { name: '', calories: 0, protein: 0, isCustom: false, isEggCurry: false }, 
    lunch = { riceKatoris: 0, curryKatoris: 0, dalKatoris: 0 }, 
    dinner = { riceKatoris: 0, chapatis: 0, hasChickenCurry: false, hasEggCurry: false, hasVegCurry: false }, 
    extraFoods = { milk500ml: false, milk250ml: false, bananasCount: 0, peanuts30g: false, soyaChunks30g: false }, 
    standaloneEggs = 0,
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

  // Open modal pre-focused on a meal
  const openAddModalForMeal = (meal, preferredMode = 'library') => {
    setTargetMeal(meal);
    setEstimatorMode(preferredMode);
    setCustomDishName('');
    setCustomDishCategory(meal === 'breakfast' ? 'Breakfast' : (meal === 'snack' ? 'Snacks' : 'Curries / Dal'));
    setCustomDishIsEgg(false);
    setSaveToLibraryCheckbox(true);

    const est = computeVisualEstimate(selectedBaseId, selectedPortionId, isExtraOily);
    setCustomDishCalories(est.cal);
    setCustomDishProtein(est.pro);
    setCustomDishPortion(est.portionLabel);
    setIsCustomFoodModalOpen(true);
  };

  // Filter custom items by meal (Breakfast is tracked directly in breakfast object, but filter safely)
  const lunchCustomItems = customItems.filter(it => it.meal === 'lunch');
  const dinnerCustomItems = customItems.filter(it => it.meal === 'dinner');
  const snackCustomItems = customItems.filter(it => it.meal === 'snack' || (!it.meal && it.meal !== 'breakfast'));

  // Curry eggs check & double counting prevention
  const curryEggsCount = (dinner.hasEggCurry ? 1 : 0) + (breakfast.isEggCurry ? 1 : 0);
  const totalEggsToday = standaloneEggs + curryEggsCount;

  // Base Breakfast status
  const hasBreakfastLogged = Boolean(breakfast?.name && breakfast?.calories > 0);
  const isBreakfastCustom = Boolean(breakfast?.isCustom);
  const totalBreakfastCal = breakfast.calories || 0;
  const totalBreakfastPro = parseFloat((breakfast.protein || 0).toFixed(1));

  // Lunch calculations
  const baseLunchCal = Math.round(
    ((lunch.riceKatoris || 0) * 180) + 
    ((lunch.curryKatoris || 0) * 140) + 
    ((lunch.dalKatoris || 0) * 150)
  );
  const baseLunchPro = parseFloat((
    ((lunch.riceKatoris || 0) * 3.8) + 
    ((lunch.curryKatoris || 0) * 3.5) + 
    ((lunch.dalKatoris || 0) * 7.0)
  ).toFixed(1));
  const customLunchCal = lunchCustomItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const customLunchPro = parseFloat(lunchCustomItems.reduce((acc, it) => acc + (Number(it.protein) || 0), 0).toFixed(1));
  const totalLunchCal = baseLunchCal + customLunchCal;
  const totalLunchPro = parseFloat((baseLunchPro + customLunchPro).toFixed(1));

  // Dinner calculations
  const baseDinnerCal = Math.round(
    ((dinner.riceKatoris || 0) * 180) + 
    ((dinner.chapatis || 0) * 110) + 
    (dinner.hasChickenCurry ? 260 : 0) + 
    (dinner.hasEggCurry ? 180 : 0) + 
    (dinner.hasVegCurry ? 130 : 0)
  );
  const baseDinnerPro = parseFloat((
    ((dinner.riceKatoris || 0) * 3.8) + 
    ((dinner.chapatis || 0) * 3.2) + 
    (dinner.hasChickenCurry ? 18.0 : 0) + 
    (dinner.hasEggCurry ? 8.5 : 0) + 
    (dinner.hasVegCurry ? 3.0 : 0)
  ).toFixed(1));
  const customDinnerCal = dinnerCustomItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const customDinnerPro = parseFloat(dinnerCustomItems.reduce((acc, it) => acc + (Number(it.protein) || 0), 0).toFixed(1));
  const totalDinnerCal = baseDinnerCal + customDinnerCal;
  const totalDinnerPro = parseFloat((baseDinnerPro + customDinnerPro).toFixed(1));

  // Extra snacks & staples
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

  const customSnackCal = snackCustomItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const customSnackPro = parseFloat(snackCustomItems.reduce((acc, it) => acc + (Number(it.protein) || 0), 0).toFixed(1));

  // Non-breakfast custom items for total
  const nonBreakfastCustomItems = customItems.filter(it => it.meal !== 'breakfast');
  const allCustomCal = nonBreakfastCustomItems.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const allCustomPro = parseFloat(nonBreakfastCustomItems.reduce((acc, it) => acc + (Number(it.protein) || 0), 0).toFixed(1));

  const totalCalories = totalBreakfastCal + baseLunchCal + baseDinnerCal + eggCalories + extraCalories + allCustomCal;
  const totalProtein = parseFloat((totalBreakfastPro + baseLunchPro + baseDinnerPro + eggProtein + extraProtein + allCustomPro).toFixed(1));

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

  // Save dish to reusable library
  const saveDishToLibrary = (dish) => {
    const exists = savedDishes.some(d => d.name.toLowerCase() === dish.name.toLowerCase());
    if (!exists) {
      const newSaved = [
        {
          id: 'custom_' + Date.now().toString(),
          name: dish.name,
          category: dish.category || (dish.meal === 'breakfast' ? 'Breakfast' : (dish.meal === 'snack' ? 'Snacks' : 'Curries / Dal')),
          portion: dish.portion || '1 serving',
          calories: Number(dish.calories) || 0,
          protein: Number(dish.protein) || 0,
          isEggCurry: Boolean(dish.isEggCurry),
          notes: 'Custom saved dish'
        },
        ...savedDishes
      ];
      setSavedDishes(newSaved);
    }
  };

  // Delete dish from library
  const handleDeleteFromLibrary = (dishId) => {
    setSavedDishes(prev => prev.filter(d => d.id !== dishId));
  };

  // Quick-Add a dish directly from Library to Today's target meal
  const handleAddLibraryDishToDay = (dish, meal = targetMeal) => {
    if (meal === 'breakfast') {
      // Replaces breakfast completely!
      setDailyLog(prev => ({
        ...prev,
        breakfast: {
          name: dish.name,
          portion: dish.portion,
          calories: Number(dish.calories) || 0,
          protein: Number(dish.protein) || 0,
          isCustom: true,
          isEggCurry: Boolean(dish.isEggCurry)
        }
      }));
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: dish.name,
        portion: dish.portion,
        calories: Number(dish.calories) || 0,
        protein: Number(dish.protein) || 0,
        meal: meal,
        category: dish.category
      };
      setDailyLog(prev => ({
        ...prev,
        customItems: [...(prev.customItems || []), newItem]
      }));
    }
    setIsCustomFoodModalOpen(false);
  };

  // Submit custom dish created in modal
  const handleAddCustomFood = (e) => {
    e?.preventDefault();
    if (!customDishName.trim()) return;

    const dishPayload = {
      name: customDishName.trim(),
      portion: customDishPortion,
      calories: Number(customDishCalories) || 0,
      protein: Number(customDishProtein) || 0,
      meal: targetMeal,
      category: customDishCategory,
      isEggCurry: customDishIsEgg
    };

    if (saveToLibraryCheckbox) {
      saveDishToLibrary(dishPayload);
    }

    if (targetMeal === 'breakfast') {
      // Replaces breakfast completely!
      setDailyLog(prev => ({
        ...prev,
        breakfast: {
          name: dishPayload.name,
          portion: dishPayload.portion,
          calories: dishPayload.calories,
          protein: dishPayload.protein,
          isCustom: true,
          isEggCurry: dishPayload.isEggCurry
        }
      }));
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: dishPayload.name,
        portion: dishPayload.portion,
        calories: dishPayload.calories,
        protein: dishPayload.protein,
        meal: targetMeal,
        category: dishPayload.category
      };
      setDailyLog(prev => ({
        ...prev,
        customItems: [...(prev.customItems || []), newItem]
      }));
    }

    setIsCustomFoodModalOpen(false);
    setCustomDishName('');
  };

  const handleClearBreakfast = () => {
    setDailyLog(prev => ({
      ...prev,
      breakfast: { name: '', calories: 0, protein: 0, isCustom: false, isEggCurry: false }
    }));
  };

  const handleRemoveCustomItem = (id) => {
    setDailyLog(prev => ({
      ...prev,
      customItems: (prev.customItems || []).filter(it => it.id !== id)
    }));
  };

  const handleResetDayPrompt = () => {
    if (window.confirm(`Reset all logged foods for ${formattedDate} back to 0?`)) {
      onResetDay();
    }
  };

  // Filtered dishes for library view / picker
  const filteredDishes = savedDishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(librarySearch.toLowerCase()) ||
                          (dish.category && dish.category.toLowerCase().includes(librarySearch.toLowerCase()));
    const matchesCategory = libraryFilterCategory === 'All' || 
                            dish.category === libraryFilterCategory ||
                            (libraryFilterCategory === 'Breakfast' && dish.category === 'Breakfast') ||
                            (libraryFilterCategory === 'Curries / Dal' && (dish.category === 'Curries / Dal' || dish.category === 'Curry')) ||
                            (libraryFilterCategory === 'Non-Veg' && dish.category === 'Non-Veg') ||
                            (libraryFilterCategory === 'Snacks' && dish.category === 'Snacks');
    return matchesSearch && matchesCategory;
  });

  const categoriesList = ['All', 'Curries / Dal', 'Breakfast', 'Non-Veg', 'Snacks'];

  return (
    <div className="space-y-4 pb-28 animate-fadeIn max-w-md md:max-w-xl mx-auto">
      {/* 1. Date Header Pill Bar with Reset Day Button */}
      <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-2xl border border-white/[0.08] shadow-sm">
        <button
          onClick={() => changeDateBy(-1)}
          className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-center transition active:scale-90"
          title="Previous day"
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

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetDayPrompt}
            className="px-2 py-1 rounded-xl text-[10px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition flex items-center gap-1"
            title="Reset day logs to 0"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => changeDateBy(1)}
            className="w-8 h-8 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-center transition active:scale-90"
            title="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Hero Energy Gauge Card */}
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

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsLibraryModalOpen(true)}
                className="px-3 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/[0.08] font-bold text-xs transition active:scale-95 flex items-center gap-1.5"
                title="Manage reusable dishes library"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Dishes</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full font-mono">
                  {savedDishes.length}
                </span>
              </button>

              <button
                onClick={() => openAddModalForMeal('lunch', 'library')}
                className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all duration-200 active:scale-95 shadow-md shadow-emerald-950 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dish</span>
              </button>
            </div>
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

      {/* 3. Daily Bulking Staples Matrix (Starts 100% clean / 0 each day) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Hostel Daily Bulking Staples</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Tap to Log</span>
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
                    extraFoods: { ...prev.extraFoods, milk500ml: !prev.extraFoods?.milk500ml, milk250ml: false }
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
                    extraFoods: { ...prev.extraFoods, milk250ml: !prev.extraFoods?.milk250ml, milk500ml: false }
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
                    extraFoods: { ...prev.extraFoods, bananasCount: Math.max(0, (prev.extraFoods?.bananasCount || 0) - 1) }
                  }))}
                  className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center active:scale-90"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono font-bold text-xs text-white">{extraFoods.bananasCount || 0}</span>
                <button
                  onClick={() => setDailyLog(prev => ({
                    ...prev,
                    extraFoods: { ...prev.extraFoods, bananasCount: (prev.extraFoods?.bananasCount || 0) + 1 }
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
                  extraFoods: { ...prev.extraFoods, peanuts30g: !prev.extraFoods?.peanuts30g }
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
                  extraFoods: { ...prev.extraFoods, soyaChunks30g: !prev.extraFoods?.soyaChunks30g }
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
        {/* ===================== BREAKFAST CARD ===================== */}
        <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
          <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Breakfast</span>
                  {hasBreakfastLogged && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isBreakfastCustom 
                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' 
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isBreakfastCustom ? 'Custom Dish' : 'Hostel Option'}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {hasBreakfastLogged ? breakfast.name : 'No breakfast logged yet'}
                </h4>
                {hasBreakfastLogged && breakfast.portion && (
                  <p className="text-[10px] text-slate-400">{breakfast.portion}</p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5">
                {!hasBreakfastLogged ? (
                  <>
                    <button
                      onClick={() => setIsBreakfastPickerOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-200 border border-white/[0.08] transition active:scale-95"
                    >
                      Hostel Option
                    </button>
                    <button
                      onClick={() => openAddModalForMeal('breakfast', 'library')}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 transition active:scale-95 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Custom Dish</span>
                    </button>
                  </>
                ) : (
                  <>
                    {isBreakfastCustom ? (
                      <button
                        onClick={() => openAddModalForMeal('breakfast', 'library')}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 border border-white/[0.06] transition active:scale-95"
                      >
                        Change
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsBreakfastPickerOpen(true)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-300 border border-white/[0.06] transition active:scale-95"
                      >
                        Change
                      </button>
                    )}
                    <button
                      onClick={() => openAddModalForMeal('breakfast', 'library')}
                      className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-400 hover:text-white border border-white/[0.06] transition"
                      title="Switch to another custom dish"
                    >
                      Custom
                    </button>
                    <button
                      onClick={handleClearBreakfast}
                      className="w-7 h-7 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/[0.06] flex items-center justify-center transition"
                      title="Clear breakfast (didn't eat)"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Macros display */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-white font-bold">{totalBreakfastCal} kcal</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">{totalBreakfastPro}g protein</span>
              {!hasBreakfastLogged && (
                <span className="text-[10px] font-sans text-slate-500">
                  (0 kcal • Log when eaten)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ===================== LUNCH CARD ===================== */}
        <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
          <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lunch (Hostel Mess)</span>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-white font-bold">{totalLunchCal} kcal</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{totalLunchPro}g protein</span>
                </div>
              </div>

              <button
                onClick={() => openAddModalForMeal('lunch', 'library')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 transition active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Custom Curry / Dish</span>
              </button>
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
                  <span className="font-mono font-bold text-white text-xs">{lunch.riceKatoris || 0}</span>
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
                <span className="text-[10px] text-slate-400 block font-medium">Mess Curry (bowls)</span>
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
                  <span className="font-mono font-bold text-white text-xs">{lunch.curryKatoris || 0}</span>
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
                  <span className="font-mono font-bold text-white text-xs">{lunch.dalKatoris || 0}</span>
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

            {/* Custom items / curries added to Lunch */}
            {lunchCustomItems.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Custom Curries & Dishes Added:
                </span>
                <div className="space-y-1">
                  {lunchCustomItems.map(item => (
                    <div key={item.id} className="p-2 rounded-xl bg-slate-900 border border-white/[0.05] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{item.name}</span>
                        {item.portion && <span className="text-[10px] text-slate-400 ml-1.5 font-normal">({item.portion})</span>}
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-white font-bold">{item.calories} kcal</span>
                        <span className="text-emerald-400">{item.protein}g</span>
                        <button
                          onClick={() => handleRemoveCustomItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 ml-1"
                          title="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== DINNER CARD ===================== */}
        <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
          <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dinner (Hostel Mess)</span>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-white font-bold">{totalDinnerCal} kcal</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{totalDinnerPro}g protein</span>
                </div>
              </div>

              <button
                onClick={() => openAddModalForMeal('dinner', 'library')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 transition active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Custom Curry / Dish</span>
              </button>
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
                  <span className="font-mono font-bold text-white text-xs">{dinner.riceKatoris || 0}</span>
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
                  <span className="font-mono font-bold text-white text-xs">{dinner.chapatis || 0}</span>
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

            {/* Mess Curry Type Toggles */}
            <div className="flex items-center gap-1.5 pt-1">
              <button
                onClick={() => setDailyLog(prev => ({
                  ...prev,
                  dinner: {
                    ...prev.dinner,
                    hasChickenCurry: !prev.dinner?.hasChickenCurry,
                    hasEggCurry: false,
                    hasVegCurry: false
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
                    hasEggCurry: !prev.dinner?.hasEggCurry,
                    hasChickenCurry: false,
                    hasVegCurry: false
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
                    hasVegCurry: !prev.dinner?.hasVegCurry,
                    hasChickenCurry: false,
                    hasEggCurry: false
                  }
                }))}
                className={`flex-1 py-2 rounded-xl text-[11px] font-bold transition active:scale-95 ${
                  dinner.hasVegCurry
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 border border-white/[0.06]'
                }`}
              >
                🥗 Veg
              </button>
            </div>

            {/* Custom items added specifically to Dinner */}
            {dinnerCustomItems.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Custom Curries & Dishes Added:
                </span>
                <div className="space-y-1">
                  {dinnerCustomItems.map(item => (
                    <div key={item.id} className="p-2 rounded-xl bg-slate-900 border border-white/[0.05] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white">{item.name}</span>
                        {item.portion && <span className="text-[10px] text-slate-400 ml-1.5 font-normal">({item.portion})</span>}
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-white font-bold">{item.calories} kcal</span>
                        <span className="text-emerald-400">{item.protein}g</span>
                        <button
                          onClick={() => handleRemoveCustomItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5 ml-1"
                          title="Remove item"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SNACKS & EXTRA FOODS ===================== */}
        <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-sm">
          <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Extra Snacks & Add-ons</span>
                <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
                  <span className="text-white font-bold">{extraCalories + customSnackCal} kcal</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400 font-bold">{(extraProtein + customSnackPro).toFixed(1)}g protein</span>
                </div>
              </div>

              <button
                onClick={() => openAddModalForMeal('snack', 'library')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 transition active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Custom Snack</span>
              </button>
            </div>

            {/* Custom snacks list */}
            {snackCustomItems.length > 0 && (
              <div className="pt-2 border-t border-white/[0.06] space-y-1">
                {snackCustomItems.map(item => (
                  <div key={item.id} className="p-2 rounded-xl bg-slate-900 border border-white/[0.05] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{item.name}</span>
                      {item.portion && <span className="text-[10px] text-slate-400 ml-1.5 font-normal">({item.portion})</span>}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white font-bold">{item.calories} kcal</span>
                      <span className="text-emerald-400">{item.protein}g</span>
                      <button
                        onClick={() => handleRemoveCustomItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 ml-1"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Breakfast Selection Modal Drawer (Hostel Presets) */}
      {isBreakfastPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/[0.1] rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">Select Mess Breakfast</h3>
                <p className="text-xs text-slate-400">Replaces breakfast with this option</p>
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
                        portion: opt.defaultServing,
                        isCustom: false,
                        isEggCurry: Boolean(opt.hasCurryEgg)
                      }
                    }));
                    setIsBreakfastPickerOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition active:scale-95 ${
                    breakfast.name === opt.name && !isBreakfastCustom
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950 border-white/[0.06] text-slate-300 hover:border-white/[0.15]'
                  }`}
                >
                  <div>
                    <p className="font-bold text-xs text-white">{opt.name}</p>
                    <p className="text-[10px] text-slate-400">{opt.defaultServing}</p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-xs text-emerald-400 block">{opt.calories} kcal</span>
                    <span className="text-[10px] text-slate-400">{opt.protein}g pro</span>
                  </div>
                </button>
              ))}

              <div className="pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    setIsBreakfastPickerOpen(false);
                    openAddModalForMeal('breakfast', 'library');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-slate-850 hover:bg-slate-800 border border-dashed border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ate Something Else? Pick or Add Custom Dish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Smart Food Estimator & Custom Item Modal (Unified with Quick Library Tab) */}
      {isCustomFoodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/[0.1] rounded-3xl w-full max-w-sm p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">
                  {targetMeal === 'breakfast' ? 'Log Breakfast Dish' : `Add to ${targetMeal.charAt(0).toUpperCase() + targetMeal.slice(1)}`}
                </h3>
                <p className="text-xs text-slate-400">
                  {targetMeal === 'breakfast' ? 'Replaces breakfast dish (no double counting)' : 'Pick from library or estimate macros'}
                </p>
              </div>
              <button
                onClick={() => setIsCustomFoodModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Meal Switcher */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-white/[0.06] text-center text-[10px] font-bold">
              {['breakfast', 'lunch', 'dinner', 'snack'].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTargetMeal(m)}
                  className={`py-1.5 rounded-xl transition ${
                    targetMeal === m ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* Mode Switcher: Library vs Visual vs Manual */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-2xl border border-white/[0.06] text-center text-xs font-bold">
              <button
                type="button"
                onClick={() => setEstimatorMode('library')}
                className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                  estimatorMode === 'library' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>Library</span>
              </button>
              <button
                type="button"
                onClick={() => setEstimatorMode('visual')}
                className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                  estimatorMode === 'visual' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Wand2 className="w-3 h-3" />
                <span>Estimator</span>
              </button>
              <button
                type="button"
                onClick={() => setEstimatorMode('manual')}
                className={`py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
                  estimatorMode === 'manual' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Exact</span>
              </button>
            </div>

            {/* TAB 1: REUSABLE DISHES LIBRARY QUICK-PICK */}
            {estimatorMode === 'library' && (
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search saved dishes & curries..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setLibraryFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition ${
                        libraryFilterCategory === cat 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : 'bg-slate-950 text-slate-400 border border-white/[0.06] hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Dishes list */}
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {filteredDishes.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No matching dish found. Switch to "Estimator" or "Exact" tab to create one!
                    </div>
                  ) : (
                    filteredDishes.map(dish => (
                      <div
                        key={dish.id}
                        className="p-2.5 rounded-2xl bg-slate-950 border border-white/[0.06] hover:border-emerald-500/40 transition flex items-center justify-between"
                      >
                        <div className="pr-2">
                          <p className="font-bold text-xs text-white">{dish.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span>{dish.portion}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-mono font-bold">{dish.calories} kcal</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-mono font-bold">{dish.protein}g</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddLibraryDishToDay(dish, targetMeal)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition active:scale-95 shrink-0 flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer hint */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Want to create a new custom dish?</span>
                  <button
                    type="button"
                    onClick={() => setEstimatorMode('visual')}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    Use Estimator →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2 & 3: VISUAL ESTIMATOR OR EXACT INPUT */}
            {estimatorMode !== 'library' && (
              <div className="space-y-3">
                {/* Dish Name */}
                <div>
                  <label className="text-xs text-slate-300 block mb-1 font-semibold">Dish / Curry Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mixed Veg Curry, Rajma, Fish Fry, Parotta..."
                    value={customDishName}
                    onChange={(e) => setCustomDishName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  {/* Quick suggestions */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {['Hostel Veg Curry', 'Dal Tadka', 'Chicken Gravy', 'Egg Bhurji', 'Parotta', 'Puttu'].map((sug) => (
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

                {/* VISUAL 3-TAP ESTIMATOR MODE */}
                {estimatorMode === 'visual' ? (
                  <>
                    {/* Base Texture */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-semibold">Base Texture</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {FOOD_BASE_CATEGORIES.map((base) => {
                          const isSelected = selectedBaseId === base.id;
                          return (
                            <button
                              key={base.id}
                              type="button"
                              onClick={() => handleBaseChange(base.id)}
                              className={`p-2 rounded-2xl border text-left text-xs transition active:scale-95 ${
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

                    {/* Portion Size */}
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-semibold">Portion Size</label>
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
                  </>
                ) : (
                  /* EXACT INPUT MODE */
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1 font-semibold">Portion Description</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 plate, 2 pieces, 250ml"
                        value={customDishPortion}
                        onChange={(e) => setCustomDishPortion(e.target.value)}
                        className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1 font-semibold">Calories (kcal)</label>
                        <input
                          type="number"
                          placeholder="e.g. 250"
                          value={customDishCalories}
                          onChange={(e) => setCustomDishCalories(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-3.5 py-2 text-sm text-amber-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-300 block mb-1 font-semibold">Protein (g)</label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="e.g. 14.5"
                          value={customDishProtein}
                          onChange={(e) => setCustomDishProtein(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl px-3.5 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Provision to Save to Library checkbox */}
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Save to Custom Dishes List</span>
                      <span className="text-[10px] text-slate-400">Reuse anytime with 1 tap</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={saveToLibraryCheckbox}
                    onChange={(e) => setSaveToLibraryCheckbox(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-white/[0.2]"
                  />
                </div>

                {/* Output Calculation Banner */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {estimatorMode === 'visual' ? 'Estimated Macros:' : 'Custom Item Value:'}
                    </span>
                    <span className="text-xs font-bold text-white">{customDishPortion}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-black text-emerald-400 block">{customDishCalories} kcal</span>
                    <span className="text-xs text-slate-300">{customDishProtein}g protein</span>
                  </div>
                </div>

                {/* Actions */}
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
                    {targetMeal === 'breakfast' ? 'Set as Breakfast' : `Add to ${targetMeal.charAt(0).toUpperCase() + targetMeal.slice(1)}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Dedicated Reusable Custom Dishes Library Modal */}
      {isLibraryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-white/[0.1] rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-3.5 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">My Custom Dishes & Curries</h3>
                  <p className="text-xs text-slate-400">Save once, reuse every day ({savedDishes.length} saved)</p>
                </div>
              </div>
              <button
                onClick={() => setIsLibraryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search and Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search dishes, curries, dal, eggs..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-2xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibraryFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition ${
                      libraryFilterCategory === cat 
                        ? 'bg-emerald-500 text-slate-950 font-bold' 
                        : 'bg-slate-950 text-slate-400 border border-white/[0.06] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Dishes List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
              {filteredDishes.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <Utensils className="w-6 h-6 mx-auto text-slate-600" />
                  <p>No dishes match your filter.</p>
                </div>
              ) : (
                filteredDishes.map(dish => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/[0.06] hover:border-emerald-500/30 transition flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-white truncate">{dish.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-white/[0.05]">
                          {dish.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{dish.portion}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-mono font-bold">{dish.calories} kcal</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono font-bold">{dish.protein}g protein</span>
                      </div>
                    </div>

                    {/* Quick actions for dish */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLibraryModalOpen(false);
                          handleAddLibraryDishToDay(dish, 'lunch');
                        }}
                        className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 border border-white/[0.06] transition"
                        title="Add to today's lunch"
                      >
                        + Lunch
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsLibraryModalOpen(false);
                          handleAddLibraryDishToDay(dish, 'dinner');
                        }}
                        className="px-2 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-slate-300 border border-white/[0.06] transition"
                        title="Add to today's dinner"
                      >
                        + Dinner
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteFromLibrary(dish.id)}
                        className="w-7 h-7 rounded-xl hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 flex items-center justify-center transition"
                        title="Delete from custom list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Add New Dish directly into library */}
            <div className="pt-2 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => {
                  setIsLibraryModalOpen(false);
                  openAddModalForMeal('lunch', 'visual');
                }}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-950"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Custom Dish or Curry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
