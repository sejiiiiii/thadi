// Default Context and Data Store for Thadi

export const DEFAULT_USER_PROFILE = {
  name: 'User',
  age: 22,
  sex: 'male',
  heightCm: 170,
  weightKg: 55,
  activityLevel: 'moderately_active', // 6-day work schedule + gym
  goal: 'lean_bulk',
  targetWeightGainKgPerWeek: 0.25,
  monthlyIncome: 25000,
  essentialsBudget: 12500, // Covers eggs, gym, creatine, room
  leisureBudget: 7500,
  extraFoodHardCap: 2000, // Strict maximum grocery spend
  hostelHasKettle: true,
  hostelHasFridge: false,
  dailyEggsGoal: 3,
  location: {
    city: 'Mangaluru',
    area: 'Mangalore Central (Hampankatta / Falnir)',
    lat: 12.8698,
    lng: 74.8430
  }
};

export const SOMATOTYPE_QUIZ_QUESTIONS = [
  {
    id: 'wrist_test',
    question: 'Wrist Test: Wrap your thumb and middle finger of one hand around your opposite wrist:',
    options: [
      { text: 'Thumb and middle finger easily overlap by a margin', type: 'ectomorph', score: 3 },
      { text: 'Thumb and middle finger just touch each other', type: 'mesomorph', score: 2 },
      { text: 'Thumb and middle finger do not touch at all', type: 'endomorph', score: 1 }
    ]
  },
  {
    id: 'body_frame',
    question: 'How would you naturally describe your bone structure and shoulders?',
    options: [
      { text: 'Narrow shoulders, slender limbs, delicate bone structure', type: 'ectomorph', score: 3 },
      { text: 'Broad shoulders, athletic frame, rectangular torso', type: 'mesomorph', score: 2 },
      { text: 'Wider waist and hips, thicker joints, rounded frame', type: 'endomorph', score: 1 }
    ]
  },
  {
    id: 'weight_history',
    question: 'When eating a normal diet without tracking, what happens to your weight?',
    options: [
      { text: 'Very hard to gain weight; I stay skinny even when eating large meals', type: 'ectomorph', score: 3 },
      { text: 'Easy to gain or lose weight depending on how I train', type: 'mesomorph', score: 2 },
      { text: 'Gain weight quickly, especially body fat around the belly', type: 'endomorph', score: 1 }
    ]
  },
  {
    id: 'metabolism',
    question: 'How is your daily energy and appetite rhythm?',
    options: [
      { text: 'Fast metabolism, get full quickly, tend to fidget or stay warm', type: 'ectomorph', score: 3 },
      { text: 'Balanced appetite, steady energy levels throughout the day', type: 'mesomorph', score: 2 },
      { text: 'Strong appetite, crave carb/sugar rich foods, slower digestion', type: 'endomorph', score: 1 }
    ]
  }
];

export const SOMATOTYPE_INFO = {
  ectomorph: {
    title: 'Ectomorph (Lean Gainer / "Hardgainer")',
    tagline: 'High metabolic rate, slender bone frame, requires deliberate calorie surplus to build muscle',
    description: 'You burn calories at a high rate and your body tends to resist weight gain. For muscle growth, you need dense, liquid and easy-to-digest calories (like milk, peanuts, bananas, and boiled soya) and should avoid skipping meals.',
    surplusAdvice: '+300 to +400 kcal surplus above maintenance',
    idealProtein: '1.8 – 2.0g per kg of bodyweight (90 – 110g)'
  },
  mesomorph: {
    title: 'Mesomorph (Athletic Responder)',
    tagline: 'Moderate frame, responsive muscle development with efficient calorie partitioning',
    description: 'You build muscle with moderate calorie surpluses and drop fat relatively easily when adjusting activity.',
    surplusAdvice: '+200 to +300 kcal surplus',
    idealProtein: '1.6 – 1.8g per kg of bodyweight'
  },
  endomorph: {
    title: 'Endomorph (Storage Efficient)',
    tagline: 'Sturdier frame, slower metabolic clearance, stores energy easily',
    description: 'Focus on clean high-protein sources, complex carbs, and a controlled surplus (+150 to +250 kcal) to avoid excess fat accumulation.',
    surplusAdvice: '+150 to +250 kcal surplus',
    idealProtein: '2.0g+ per kg of bodyweight'
  }
};

// Curated Mangalore Extra Bulking Plan Preset (Context Document §3 & §4)
export const DEFAULT_SAVED_DISHES = [
  // Breakfasts
  {
    id: 'dish_bread_omelette',
    name: 'Bread Omelette (2 eggs + 2 slices)',
    category: 'Breakfast',
    portion: '1 serving (2 slices + 2 eggs)',
    calories: 320,
    protein: 15.0,
    isEggCurry: false,
    notes: 'Quick hostel breakfast / street stall'
  },
  {
    id: 'dish_egg_bhurji_pav',
    name: 'Egg Bhurji (2 eggs) with Bread / Pav',
    category: 'Breakfast',
    portion: '1 plate',
    calories: 310,
    protein: 14.5,
    isEggCurry: false,
    notes: '2 scrambled eggs with onion & spices'
  },
  {
    id: 'dish_puttu_kadala',
    name: 'Puttu with Kadala Curry',
    category: 'Breakfast',
    portion: '1 cup puttu + 1 bowl kadala',
    calories: 390,
    protein: 11.5,
    isEggCurry: false,
    notes: 'Kerala/coastal staple with black chickpeas'
  },
  {
    id: 'dish_neer_dosa',
    name: 'Neer Dosa (3 pieces) with Chutney',
    category: 'Breakfast',
    portion: '3 pieces',
    calories: 260,
    protein: 4.5,
    isEggCurry: false,
    notes: 'Mangalorean light rice crepes'
  },
  {
    id: 'dish_oats_milk_banana',
    name: 'Oats with Milk & Sliced Banana',
    category: 'Breakfast',
    portion: '1 bowl (~250ml)',
    calories: 350,
    protein: 12.0,
    isEggCurry: false,
    notes: 'Quick kettle breakfast in hostel room'
  },
  // Curries & Gravies (Lunch / Dinner)
  {
    id: 'dish_dal_tadka',
    name: 'Hostel Dal Tadka / Yellow Dal',
    category: 'Curries / Dal',
    portion: '1 katori (~200ml)',
    calories: 160,
    protein: 7.5,
    isEggCurry: false,
    notes: 'Thick yellow lentils with jeera garlic tadka'
  },
  {
    id: 'dish_chana_masala',
    name: 'Chana Masala / Chickpea Curry',
    category: 'Curries / Dal',
    portion: '1 katori (~200ml)',
    calories: 210,
    protein: 9.0,
    isEggCurry: false,
    notes: 'High fiber and plant protein'
  },
  {
    id: 'dish_rajma_masala',
    name: 'Rajma Masala (Kidney Beans Curry)',
    category: 'Curries / Dal',
    portion: '1 katori (~200ml)',
    calories: 220,
    protein: 9.5,
    isEggCurry: false,
    notes: 'Protein-rich legume curry'
  },
  {
    id: 'dish_soya_curry',
    name: 'Soya Chunks Curry / Gravy',
    category: 'Curries / Dal',
    portion: '1 katori (~200ml)',
    calories: 180,
    protein: 16.0,
    isEggCurry: false,
    notes: 'Hostel mess soya curry or kettle prepared'
  },
  {
    id: 'dish_paneer_curry',
    name: 'Paneer Masala / Matar Paneer',
    category: 'Curries / Dal',
    portion: '1 katori (~200ml)',
    calories: 260,
    protein: 11.0,
    isEggCurry: false,
    notes: 'Hostel special veg menu'
  },
  {
    id: 'dish_chicken_sukka',
    name: 'Mangalore Chicken Sukka',
    category: 'Non-Veg',
    portion: '1 plate / serving',
    calories: 250,
    protein: 21.0,
    isEggCurry: false,
    notes: 'Dry coconut roasted chicken'
  },
  {
    id: 'dish_fish_curry',
    name: 'Mangalorean Fish Curry (Meen Gassi)',
    category: 'Non-Veg',
    portion: '1 bowl with 1 piece fish',
    calories: 190,
    protein: 17.0,
    isEggCurry: false,
    notes: 'Coconut tamarind gravy with mackerel / sardine'
  },
  {
    id: 'dish_egg_curry_hostel',
    name: 'Mess Egg Curry (2 eggs in gravy)',
    category: 'Non-Veg',
    portion: '1 bowl (2 eggs)',
    calories: 230,
    protein: 14.0,
    isEggCurry: true,
    notes: '2 boiled eggs in spicy onion-tomato gravy'
  },
  // Snacks & Add-ons
  {
    id: 'dish_peanut_butter_toast',
    name: 'Peanut Butter Toast (2 slices + 32g PB)',
    category: 'Snacks',
    portion: '2 slices',
    calories: 340,
    protein: 13.0,
    isEggCurry: false,
    notes: 'Calorie-dense hostel bulking snack'
  },
  {
    id: 'dish_sprouts_salad',
    name: 'Moong Sprouts Usli / Chaat',
    category: 'Snacks',
    portion: '1 cup (~150g)',
    calories: 150,
    protein: 9.0,
    isEggCurry: false,
    notes: 'Light protein snack with lime & salt'
  },
  {
    id: 'dish_roasted_chana_snack',
    name: 'Roasted Chana / Bhuna Chana (50g)',
    category: 'Snacks',
    portion: '1 fistful (~50g)',
    calories: 190,
    protein: 10.5,
    isEggCurry: false,
    notes: 'Crunchy dry hostel snack, high protein'
  }
];

// Helper to create an empty, unlogged clean daily log (all 0s)
export const createEmptyDailyLog = () => ({
  breakfast: { name: '', calories: 0, protein: 0, isCustom: false, isEggCurry: false },
  lunch: { riceKatoris: 0, curryKatoris: 0, dalKatoris: 0 },
  dinner: { riceKatoris: 0, chapatis: 0, hasChickenCurry: false, hasEggCurry: false, hasVegCurry: false },
  extraFoods: {
    milk500ml: false,
    milk250ml: false,
    bananasCount: 0,
    peanuts30g: false,
    soyaChunks30g: false
  },
  standaloneEggs: 0,
  customItems: []
});

// Curated Mangalore Extra Bulking Plan Preset (Context Document §3 & §4)
export const MANGALORE_CURATED_PRESET = [
  {
    id: 'nandini_toned_milk',
    name: 'Nandini Toned Milk (Blue Pouch)',
    dailyQty: 500,
    dailyUnit: 'ml',
    timing: '250ml Breakfast + 250ml Evening (or all at once)',
    dailyCalories: 300,
    dailyProtein: 16.5,
    purchasePackSize: 500,
    purchaseUnit: 'ml pouch',
    unitPriceInr: 30,
    monthlyPlannedQty: 31,
    monthlyTotalSpend: 930,
    frequency: 'Daily fresh purchase (no fridge needed)',
    notes: 'Karnataka Milk Federation (KMF) official staple. Toned 3.0% fat, 8.5% SNF.'
  },
  {
    id: 'regular_bananas',
    name: 'Regular Fresh Bananas (Robusta / Cavendish)',
    dailyQty: 2,
    dailyUnit: 'pieces',
    timing: '1 with breakfast + 1 at work/pre-workout',
    dailyCalories: 200,
    dailyProtein: 2.5,
    purchasePackSize: 1,
    purchaseUnit: 'banana',
    unitPriceInr: 8,
    monthlyPlannedQty: 62,
    monthlyTotalSpend: 496,
    frequency: 'Buy every 2–3 days (to prevent over-ripening)',
    notes: 'Cheap, rich in potassium, gentle carbs for hostel mornings.'
  },
  {
    id: 'raw_peanuts',
    name: 'Raw Peanuts / Groundnuts',
    dailyQty: 30,
    dailyUnit: 'g (approx 1 handful)',
    timing: 'Afternoon work snack / tea time',
    dailyCalories: 170,
    dailyProtein: 7.5,
    purchasePackSize: 1000,
    purchaseUnit: 'g bulk pack',
    unitPriceInr: 260,
    monthlyPlannedQty: 1, // 1kg pack per month
    monthlyTotalSpend: 260,
    frequency: 'Monthly bulk buy',
    notes: 'Roast lightly in pan or eat raw/soaked. Dense healthy fats & protein.'
  },
  {
    id: 'soya_chunks',
    name: 'Soya Chunks (Fortune / Local Wholesale)',
    dailyQty: 30,
    dailyUnit: 'g dry weight',
    timing: 'With dinner (steeped/boiled in electric kettle)',
    dailyCalories: 105,
    dailyProtein: 15.5,
    purchasePackSize: 1000,
    purchaseUnit: 'g bulk pack',
    unitPriceInr: 210,
    monthlyPlannedQty: 1, // 1kg pack per month
    monthlyTotalSpend: 210,
    frequency: 'Monthly bulk buy',
    notes: 'Kettle prep: Boil water in electric kettle, pour over chunks in a bowl, soak 10 min, squeeze & add to curry.'
  }
];

// Indian High-Protein Budget Food Pool for Algorithmic Optimizer
export const BUDGET_FOOD_POOL = [
  {
    id: 'soya_chunks',
    name: 'Soya Chunks',
    costPerKg: 210,
    packSizeG: 1000,
    caloriesPer100g: 345,
    proteinPer100g: 52.0,
    defaultDailyG: 30,
    minDailyG: 20,
    maxDailyG: 50,
    shelfLifeDays: 180,
    prepDifficulty: 'Easy (Kettle hot water soak)',
    category: 'Plant Protein'
  },
  {
    id: 'raw_peanuts',
    name: 'Peanuts / Groundnuts',
    costPerKg: 260,
    packSizeG: 1000,
    caloriesPer100g: 567,
    proteinPer100g: 25.8,
    defaultDailyG: 30,
    minDailyG: 25,
    maxDailyG: 60,
    shelfLifeDays: 90,
    prepDifficulty: 'None (Ready to eat / dry roast)',
    category: 'Nuts & Seeds'
  },
  {
    id: 'toned_milk',
    name: 'Toned Milk (500ml pouch)',
    costPerKg: 60, // ₹30 per 500ml
    packSizeG: 500, // ml
    caloriesPer100g: 60, // per 100ml
    proteinPer100g: 3.3, // per 100ml
    defaultDailyG: 500,
    minDailyG: 250,
    maxDailyG: 1000,
    shelfLifeDays: 1,
    prepDifficulty: 'None (Drink straight)',
    category: 'Dairy'
  },
  {
    id: 'bananas',
    name: 'Bananas',
    costPerKg: 60, // ~₹8 per banana (~120g)
    packSizeG: 1000,
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    defaultDailyG: 200, // 2 bananas
    minDailyG: 100,
    maxDailyG: 300,
    shelfLifeDays: 4,
    prepDifficulty: 'None (Peel and eat)',
    category: 'Fruit / Carbs'
  },
  {
    id: 'roasted_chana_sattu',
    name: 'Roasted Chana / Sattu',
    costPerKg: 180,
    packSizeG: 1000,
    caloriesPer100g: 410,
    proteinPer100g: 22.0,
    defaultDailyG: 40,
    minDailyG: 30,
    maxDailyG: 80,
    shelfLifeDays: 120,
    prepDifficulty: 'None (Mix in water/milk)',
    category: 'Legumes / Sattu'
  },
  {
    id: 'rolled_oats',
    name: 'Rolled Oats',
    costPerKg: 190,
    packSizeG: 1000,
    caloriesPer100g: 389,
    proteinPer100g: 13.5,
    defaultDailyG: 40,
    minDailyG: 30,
    maxDailyG: 70,
    shelfLifeDays: 180,
    prepDifficulty: 'Easy (Soak in hot kettle water/milk)',
    category: 'Whole Grains'
  },
  {
    id: 'curd_dahi',
    name: 'Packaged Curd / Dahi (400g pouch)',
    costPerKg: 85, // ₹34 per 400g
    packSizeG: 400,
    caloriesPer100g: 62,
    proteinPer100g: 3.5,
    defaultDailyG: 200,
    minDailyG: 150,
    maxDailyG: 400,
    shelfLifeDays: 3,
    prepDifficulty: 'None',
    category: 'Dairy'
  }
];

// Hostel Meal Presets (Context Document §2 & §6)
export const HOSTEL_BREAKFAST_OPTIONS = [
  { id: 'poori_bhaji', name: 'Poori Bhaji (2–3 pooris + potato bhaji)', calories: 450, protein: 9, defaultServing: '1 plate' },
  { id: 'dosa_sambar', name: 'Dosa (3 medium) with Sambar & Chutney', calories: 430, protein: 12, defaultServing: '3 dosas' },
  { id: 'poha', name: 'Poha with Peanuts', calories: 280, protein: 6, defaultServing: '1 medium plate' },
  { id: 'upma', name: 'Rava Upma with Chutney', calories: 300, protein: 6, defaultServing: '1 medium plate' },
  { id: 'pasta', name: 'Hostel Masala Pasta', calories: 350, protein: 10, defaultServing: '1 plate' },
  { id: 'egg_curry_breakfast', name: 'Egg Curry (1 egg + gravy with bread/rice)', calories: 200, protein: 8, defaultServing: '1 bowl', hasCurryEgg: true }
];

export const HOSTEL_LUNCH_COMPONENTS = [
  { id: 'rice', name: 'Cooked White Rice', caloriesPerUnit: 180, proteinPerUnit: 3.8, unit: 'katori (~200ml)', defaultCount: 2 },
  { id: 'veg_curry', name: 'Mixed Vegetable Curry / Sambar', caloriesPerUnit: 140, proteinPerUnit: 3.5, unit: 'katori', defaultCount: 1 },
  { id: 'dal', name: 'Dal Tadka / Moong Dal', caloriesPerUnit: 150, proteinPerUnit: 7.0, unit: 'katori', defaultCount: 0 }
];

export const HOSTEL_DINNER_COMPONENTS = [
  { id: 'rice_dinner', name: 'Cooked White Rice', caloriesPerUnit: 180, proteinPerUnit: 3.8, unit: 'katori', defaultCount: 1.5 },
  { id: 'chapati', name: 'Wheat Chapati / Roti', caloriesPerUnit: 110, proteinPerUnit: 3.2, unit: 'piece', defaultCount: 2 },
  { id: 'chicken_curry', name: 'Chicken Curry (1 piece with gravy)', caloriesPerUnit: 260, proteinPerUnit: 18.0, unit: 'serving', defaultCount: 0 },
  { id: 'egg_curry_dinner', name: 'Egg Curry (1 egg in gravy)', caloriesPerUnit: 180, proteinPerUnit: 8.5, unit: 'serving (1 egg)', defaultCount: 0, hasCurryEgg: true },
  { id: 'veg_curry_dinner', name: 'Vegetable Curry', caloriesPerUnit: 130, proteinPerUnit: 3.0, unit: 'katori', defaultCount: 1 }
];

// Offline & Verified Store Database for Mangaluru Central
export const MANGALORE_STORES = [
  {
    id: 'fathima_stores',
    name: 'Fathima Stores / Central Market',
    area: 'Hampankatta, Central Mangaluru',
    lat: 12.8682,
    lng: 74.8423,
    type: 'Wholesale Grocery & Dry Fruits',
    specialty: 'Cheapest 1kg raw peanuts & bulk soya chunks',
    pricingTier: 'Wholesale / Lowest Price',
    notes: 'Walkable from Hampankatta signal. Best price for nuts and legumes in Mangalore.'
  },
  {
    id: 'dmart_attavar',
    name: 'DMart Ready / Supermarket',
    area: 'Attavar, Mangaluru',
    lat: 12.8615,
    lng: 74.8458,
    type: 'Discount Supermarket Chain',
    specialty: 'Branded soya chunks (Fortune 1kg), oats, peanut butter',
    pricingTier: 'Budget Retail Discount',
    notes: 'Good discounts on packaged 1kg Fortune soya chunks and staples.'
  },
  {
    id: 'misbah_supermarket',
    name: 'Misbah Supermarket',
    area: 'Falnir Road, Mangaluru',
    lat: 12.8647,
    lng: 74.8491,
    type: 'Local Supermarket',
    specialty: 'Quick grocery replenishment, dairy, fresh eggs',
    pricingTier: 'Standard Retail',
    notes: 'Very convenient for evening grocery pickups near Falnir.'
  },
  {
    id: 'nandini_parlour_balmatta',
    name: 'KMF Nandini Milk Parlour',
    area: 'Balmatta / Hampankatta Road',
    lat: 12.8711,
    lng: 74.8465,
    type: 'Official Dairy Booth',
    specialty: 'Fresh Nandini Toned Milk 500ml pouches (₹30), curd',
    pricingTier: 'Official MRP (No Markup)',
    notes: 'Opens early morning (6 AM) & late evening. Guaranteed fresh stock without markup.'
  },
  {
    id: 'central_market_veg',
    name: 'Mangalore Central Fruit & Veg Market',
    area: 'Bhavanthi Street, Hampankatta',
    lat: 12.8669,
    lng: 74.8402,
    type: 'Wholesale Produce Market',
    specialty: 'Fresh bananas by the dozen (₹40–₹50/dozen, ~₹3.5–₹4/pc)',
    pricingTier: 'Farmer / Wholesale Produce',
    notes: 'Buy Robusta bananas here every 3 days for maximum savings vs single retail shops.'
  }
];

// Quick-Commerce Search Deep Link Generators
export const QUICK_COMMERCE_PRODUCTS = [
  {
    id: 'qc_milk',
    name: 'Nandini Toned Milk (500ml)',
    category: 'Dairy',
    targetPrice: 30,
    searchTerms: {
      blinkit: 'Nandini Toned Fresh Milk 500 ml',
      swiggy: 'Nandini Toned Milk 500ml',
      zepto: 'Nandini Toned Milk',
      bigbasket: 'Nandini Toned Fresh Milk 500 ml'
    }
  },
  {
    id: 'qc_bananas',
    name: 'Fresh Bananas (Robusta / Yelakki)',
    category: 'Fruits',
    targetPrice: 40,
    searchTerms: {
      blinkit: 'Robusta Banana 500g',
      swiggy: 'Robusta Banana',
      zepto: 'Fresh Banana Robusta',
      bigbasket: 'Fresh Robusta Banana'
    }
  },
  {
    id: 'qc_soya',
    name: 'Fortune Soya Chunks (1 kg)',
    category: 'Bulk Protein',
    targetPrice: 210,
    searchTerms: {
      blinkit: 'Fortune Soya Chunks 1 kg',
      swiggy: 'Fortune Soya Chunks 1kg',
      zepto: 'Fortune Soya Chunks',
      bigbasket: 'Fortune Soya Chunks 1 kg'
    }
  },
  {
    id: 'qc_peanuts',
    name: 'Raw Peanuts / Groundnuts (1 kg)',
    category: 'Healthy Fats & Protein',
    targetPrice: 260,
    searchTerms: {
      blinkit: 'Raw Peanuts 1 kg',
      swiggy: 'Raw Peanuts Groundnuts 1kg',
      zepto: 'Raw Peanuts 1kg',
      bigbasket: 'Raw Peanuts 1 kg'
    }
  },
  {
    id: 'qc_eggs',
    name: 'White Farm Eggs (30 pack tray)',
    category: 'Budget Protein',
    targetPrice: 210,
    searchTerms: {
      blinkit: 'Eggs 30 pieces tray',
      swiggy: 'Fresh White Eggs 30 pack',
      zepto: 'Eggs 30 pack',
      bigbasket: 'Farm Fresh White Eggs 30 pcs'
    }
  },
  {
    id: 'qc_creatine',
    name: 'Creatine Monohydrate (100g / 250g)',
    category: 'Gym Supplement',
    targetPrice: 650,
    searchTerms: {
      blinkit: 'Creatine Monohydrate 100g',
      swiggy: 'Creatine Monohydrate',
      zepto: 'Creatine Monohydrate',
      bigbasket: 'MuscleBlaze Creatine Monohydrate'
    }
  }
];

export function getQuickCommerceLinks(searchQuery) {
  const encoded = encodeURIComponent(searchQuery);
  return {
    blinkit: `https://blinkit.com/s/?q=${encoded}`,
    swiggy: `https://www.swiggy.com/instamart/search?custom_back=true&query=${encoded}`,
    zepto: `https://www.zeptonow.com/search?q=${encoded}`,
    bigbasket: `https://www.bigbasket.com/ps/?q=${encoded}`,
    zomato: `https://www.zomato.com/search?q=${encoded}`
  };
}

export const FOOD_BASE_CATEGORIES = [
  { id: 'water_veg', name: 'Watery / Clear Veg', calPer100ml: 45, proPer100ml: 1.2, example: 'Rasam, sambar, clear veg curry' },
  { id: 'thick_veg', name: 'Thick Veg / Coconut Curry', calPer100ml: 85, proPer100ml: 2.5, example: 'Avial, kurma, mixed veg kootu' },
  { id: 'dal_legume', name: 'Dal / Chana / Rajma', calPer100ml: 120, proPer100ml: 6.0, example: 'Toor dal, chana masala, moong' },
  { id: 'chicken_meat', name: 'Chicken / Fish / Meat Curry', calPer100ml: 160, proPer100ml: 11.5, example: 'Hostel chicken gravy with 2 pcs' },
  { id: 'paneer_rich', name: 'Paneer / Rich Gravy', calPer100ml: 190, proPer100ml: 8.5, example: 'Paneer butter masala, rich gravy' },
  { id: 'bread_flatbread', name: 'Bread / Roti / Parotta', isPieceBase: true, calPerPiece: 110, proPerPiece: 3.2, example: 'Roti, puri, Kerala parotta' }
];

export const PORTION_SIZES = [
  { id: 'small_half_katori', label: 'Half Katori (~100ml)', volumeMl: 100, pieceCount: 1, desc: 'Small serving (cupped hand)' },
  { id: 'standard_bowl', label: '1 Standard Bowl (~200ml)', volumeMl: 200, pieceCount: 2, desc: 'Standard hostel katori (fist size)' },
  { id: 'heaping_plate', label: 'Large / Heaping Bowl (~350ml)', volumeMl: 350, pieceCount: 3, desc: 'Double serving (two open hands)' }
];

