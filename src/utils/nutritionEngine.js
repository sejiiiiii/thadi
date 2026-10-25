// Nutrition and Bulking Mathematical Engine for Thadi

/**
 * Calculate Body Mass Index (BMI) and categorization
 */
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return { bmi: 0, category: 'Unknown', color: 'text-slate-400' };
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = parseFloat(bmi.toFixed(1));

  let category = 'Normal';
  let color = 'text-emerald-400';

  if (rounded < 18.5) {
    category = 'Underweight';
    color = 'text-amber-400';
  } else if (rounded >= 18.5 && rounded < 20.0) {
    category = 'Lean / Low-Normal (Prime for Lean Bulk)';
    color = 'text-amber-300';
  } else if (rounded >= 20.0 && rounded < 24.9) {
    category = 'Normal / Healthy Weight';
    color = 'text-emerald-400';
  } else if (rounded >= 25.0 && rounded < 29.9) {
    category = 'Overweight';
    color = 'text-orange-400';
  } else {
    category = 'Obese';
    color = 'text-red-400';
  }

  return { bmi: rounded, category, color };
}

/**
 * Calculate Basal Metabolic Rate (BMR) via Mifflin-St Jeor equation
 * Men: 10 x weight(kg) + 6.25 x height(cm) - 5 x age(y) + 5
 */
export function calculateBMR(weightKg, heightCm, age, sex = 'male') {
  if (!weightKg || !heightCm || !age) return 1500;
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  bmr = sex === 'male' ? bmr + 5 : bmr - 161;
  return Math.round(bmr);
}

/**
 * Activity Multipliers:
 * Sedentary: 1.2
 * Lightly active (1-3 days): 1.375
 * Moderately active (3-5 days / 6-day work + gym): 1.55
 * Very active (6-7 days hard training): 1.725
 */
export const ACTIVITY_MULTIPLIERS = {
  sedentary: { label: 'Sedentary (desk job, minimal movement)', factor: 1.2 },
  lightly_active: { label: 'Lightly Active (1-3 gym days/week)', factor: 1.375 },
  moderately_active: { label: 'Moderately Active (6-day work schedule + gym sessions)', factor: 1.55 },
  very_active: { label: 'Very Active (Heavy physical work + intense daily lifting)', factor: 1.725 }
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE) and Lean Bulk calorie target
 */
export function calculateTDEEAndBulk(profile) {
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.sex);
  const factor = ACTIVITY_MULTIPLIERS[profile.activityLevel]?.factor || 1.55;
  const maintenance = Math.round(bmr * factor);

  // Target surplus for 0.20 - 0.30 kg/week lean gain:
  // 1 kg body tissue approx 7,700 kcal. 0.25 kg/week = ~275 kcal/day surplus.
  const recommendedSurplus = 350; // Conservative lean bulk surplus
  const bulkCalorieTarget = maintenance + recommendedSurplus;

  // Total daily protein target: 1.8g to 2.0g per kg of bodyweight
  const minProtein = Math.round(profile.weightKg * 1.8); // ~99g for 55kg
  const maxProtein = Math.round(profile.weightKg * 2.0); // ~110g for 55kg

  return {
    bmr,
    maintenance,
    surplus: recommendedSurplus,
    bulkCalorieTarget,
    targetCalorieRange: [bulkCalorieTarget - 100, bulkCalorieTarget + 150],
    proteinTargetRange: [minProtein, maxProtein],
    recommendedDailyGainKg: 0.25
  };
}

/**
 * Algorithmic Cost-per-Protein / Calorie Diet Optimizer
 * Optimizes food quantities from the Indian budget pool given an arbitrary monthly budget cap
 */
export function optimizeBudgetDiet(monthlyBudgetCapInr = 2000, daysInMonth = 31) {
  const maxSpend = Math.max(800, Number(monthlyBudgetCapInr) || 2000);
  
  // High efficiency staple ranking (cost per gram of protein):
  // 1. Soya chunks: ~520g protein / kg @ ₹210 -> ₹0.40 / g protein
  // 2. Raw peanuts: ~258g protein / kg @ ₹260 -> ₹1.00 / g protein
  // 3. Toned milk: ~33g protein / liter @ ₹60 -> ₹1.81 / g protein
  // 4. Roasted chana / sattu: ~220g protein / kg @ ₹180 -> ₹0.81 / g protein
  // 5. Rolled oats: ~135g protein / kg @ ₹190 -> ₹1.40 / g protein
  // 6. Bananas: Carbs & calories @ ~₹8/banana

  // Base allocation strategy to balance micronutrients, digestion, and hostel kettle prep:
  let milkSpend = 0;
  let milkPouches = 0;
  let bananaSpend = 0;
  let bananaCount = 0;
  let peanutPacks = 0;
  let peanutSpend = 0;
  let soyaPacks = 0;
  let soyaSpend = 0;
  let sattuPacks = 0;
  let sattuSpend = 0;

  let remaining = maxSpend;

  // 1. Core bulk dry packs (1kg soya chunks + 1kg peanuts = ₹470)
  if (remaining >= 470) {
    soyaPacks = 1;
    soyaSpend = 210;
    peanutPacks = 1;
    peanutSpend = 260;
    remaining -= 470;
  } else if (remaining >= 210) {
    soyaPacks = 1;
    soyaSpend = 210;
    remaining -= 210;
  }

  // 2. Nandini Milk allocation (Priority for liquid calories and complete protein)
  // Max 1 pouch/day (31 pouches @ ₹30 = ₹930)
  const maxPossibleMilkPouches = Math.min(daysInMonth, Math.floor(remaining / 30));
  if (maxPossibleMilkPouches >= 15) {
    // Can afford daily or alternate-day milk
    milkPouches = maxPossibleMilkPouches;
    milkSpend = milkPouches * 30;
    remaining -= milkSpend;
  } else if (maxPossibleMilkPouches > 0) {
    milkPouches = maxPossibleMilkPouches;
    milkSpend = milkPouches * 30;
    remaining -= milkSpend;
  }

  // 3. Bananas for quick carbs & potassium
  const maxPossibleBananas = Math.min(daysInMonth * 2, Math.floor(remaining / 8));
  if (maxPossibleBananas > 0) {
    bananaCount = maxPossibleBananas;
    bananaSpend = bananaCount * 8;
    remaining -= bananaSpend;
  }

  // 4. Any leftover buffer > ₹180 can add Roasted Chana/Sattu bulk pack
  if (remaining >= 180) {
    sattuPacks = 1;
    sattuSpend = 180;
    remaining -= sattuSpend;
  }

  const totalCashSpend = milkSpend + bananaSpend + peanutSpend + soyaSpend + sattuSpend;
  const cashBuffer = maxSpend - totalCashSpend;

  // Compute daily consumed macros based on portions:
  // Daily soya: 1000g / 31 days = ~32g/day (or capped at 30g)
  const dailySoyaG = soyaPacks > 0 ? Math.round(1000 / daysInMonth) : 0;
  const dailyPeanutG = peanutPacks > 0 ? Math.round(1000 / daysInMonth) : 0;
  const dailyMilkMl = milkPouches > 0 ? Math.round((milkPouches * 500) / daysInMonth) : 0;
  const dailyBananas = bananaCount > 0 ? parseFloat((bananaCount / daysInMonth).toFixed(1)) : 0;
  const dailySattuG = sattuPacks > 0 ? Math.round(1000 / daysInMonth) : 0;

  // Daily macro calculation
  const dailyCalories = Math.round(
    (dailySoyaG * 3.45) +
    (dailyPeanutG * 5.67) +
    (dailyMilkMl * 0.60) +
    (dailyBananas * 100) +
    (dailySattuG * 4.10)
  );

  const dailyProtein = parseFloat((
    (dailySoyaG * 0.52) +
    (dailyPeanutG * 0.258) +
    (dailyMilkMl * 0.033) +
    (dailyBananas * 1.2) +
    (dailySattuG * 0.22)
  ).toFixed(1));

  const dailyConsumedCost = parseFloat((
    (dailySoyaG * 0.21) +
    (dailyPeanutG * 0.26) +
    (dailyMilkMl * 0.06) +
    (dailyBananas * 8) +
    (dailySattuG * 0.18)
  ).toFixed(2));

  return {
    monthlyBudgetCap: maxSpend,
    totalCashSpend,
    cashBuffer,
    isOverBudget: totalCashSpend > maxSpend,
    items: [
      { id: 'milk', name: 'Nandini Toned Milk', buyQty: `${milkPouches} pouches (500ml)`, dailyServing: `${dailyMilkMl} ml/day`, spend: milkSpend, calories: Math.round(dailyMilkMl * 0.6), protein: (dailyMilkMl * 0.033).toFixed(1) },
      { id: 'bananas', name: 'Fresh Bananas', buyQty: `${bananaCount} pcs`, dailyServing: `${dailyBananas} pcs/day`, spend: bananaSpend, calories: Math.round(dailyBananas * 100), protein: (dailyBananas * 1.2).toFixed(1) },
      { id: 'peanuts', name: 'Raw Peanuts Bulk', buyQty: `${peanutPacks} kg`, dailyServing: `${dailyPeanutG} g/day`, spend: peanutSpend, calories: Math.round(dailyPeanutG * 5.67), protein: (dailyPeanutG * 0.258).toFixed(1) },
      { id: 'soya', name: 'Soya Chunks Bulk', buyQty: `${soyaPacks} kg`, dailyServing: `${dailySoyaG} g dry/day`, spend: soyaSpend, calories: Math.round(dailySoyaG * 3.45), protein: (dailySoyaG * 0.52).toFixed(1) },
      ...(sattuPacks > 0 ? [{ id: 'sattu', name: 'Roasted Chana / Sattu', buyQty: `${sattuPacks} kg`, dailyServing: `${dailySattuG} g/day`, spend: sattuSpend, calories: Math.round(dailySattuG * 4.1), protein: (dailySattuG * 0.22).toFixed(1) }] : [])
    ],
    dailyTotals: {
      calories: dailyCalories,
      protein: dailyProtein,
      cost: dailyConsumedCost
    }
  };
}

/**
 * Generate formatted WhatsApp summary of the day
 */
export function generateWhatsAppSummary(dateStr, totals, targetCalories, targetProtein, budgetSpent, budgetCap) {
  return `*Thadi Bulking Log — ${dateStr}* 🏋️‍♂️
━━━━━━━━━━━━━━━━━━━━
🔥 *Calories:* ${totals.calories} / ${targetCalories} kcal (${Math.round((totals.calories / targetCalories) * 100)}%)
💪 *Protein:* ${totals.protein} / ${targetProtein}g (${Math.round((totals.protein / targetProtein) * 100)}%)
🥚 *Eggs:* ${totals.eggs} / 3 daily eggs
━━━━━━━━━━━━━━━━━━━━
🥛 *Add-on Food Check:*
• Nandini Milk: ${totals.milkConsumed ? '✅ 500ml' : '❌ Missed'}
• Bananas: ${totals.bananasConsumed ? '✅ 2 pcs' : '❌ Missed'}
• Peanuts: ${totals.peanutsConsumed ? '✅ 30g' : '❌ Missed'}
• Soya Chunks: ${totals.soyaConsumed ? '✅ 30g (kettle boiled)' : '❌ Missed'}
━━━━━━━━━━━━━━━━━━━━
💰 *Grocery Spending:* ₹${budgetSpent} / ₹${budgetCap} hard cap
*Thadi App — Personalized Lean Bulking*`;
}
