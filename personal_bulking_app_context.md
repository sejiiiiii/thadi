# Personal Bulking & Nutrition Tracker — Project Context

> **Purpose:** This document is an AI-ready brief for building a personalized daily food, calorie, protein, grocery, and budget tracking app. It summarizes the user's stated circumstances, the meal plan developed in conversation, estimates and assumptions, and requirements for a future app. Treat it as initial context, **not** as verified medical advice or a live-price database.
>
> **Last conversation context:** October 2026. Currency: INR (₹). Location: central Mangaluru (Mangalore), Karnataka, India. The user's stated location is central Mangaluru **for work/living purposes**; do not replace it with an automatically inferred device location.

## 1. User profile and situation

| Attribute | Value | Confidence |
|---|---|---|
| Age | 22 years | User-stated |
| Sex | Male | User-stated |
| Height | 170 cm | User-stated |
| Body weight at start | 55 kg | User-stated |
| Location | Lives/works in Mangalore Central (central Mangaluru), Karnataka | User-stated |
| Work schedule | Works 6 days per week | User-stated |
| Accommodation | Hostel | User-stated |
| Kitchen/induction/kettle access | Unknown | Needs confirmation |
| Refrigerator access | Unknown | Needs confirmation |
| Food weighing scale | Does not have one | User-stated |
| Body weighing scale access | Not confirmed; may be able to use a gym scale | Needs confirmation |
| Gym | Has a gym membership | User-stated |
| Gym schedule and physical activity at work | Unknown | Needs confirmation |
| Creatine | Uses/budgets for creatine | User-stated |
| Goal | Gain weight and muscle by achieving an appropriate calorie surplus (lean bulk) | User-stated + conversational recommendation |

### Financial constraints (hard requirements)

- Monthly income: **₹25,000**.
- **₹12,500/month** is reserved for essential needs and already **includes egg expenses, gym membership, and creatine**. Do not add these costs to the new-food budget.
- User identifies **₹7,500/month** as leisure money and is willing to allocate **up to ₹2,000 of that amount** to *extra foods* for bulking.
- **HARD CAP: ₹2,000/month in actual additional grocery spending**, even in **31-day months**. Do not assume the cap increases for a longer month.
- At the planned monthly purchase amounts below, **₹1,896** is allocated and **₹104** remains unspent as a buffer.
- The remaining ₹5,500 of the leisure allocation (₹7,500 − ₹2,000) should not be treated as available for this app's grocery plan without explicit user permission.
- The rest of the income allocation was not described: do not infer how it is spent.

## 2. What the user normally eats (included in existing living expenses)

Meals are typical hostel preparations. The user has **not weighed portions**; macros are approximate and will vary by recipe, rice quantity, curry ingredients, and oil used.

### Breakfast (one of these, varies day to day)

User said servings generally fill **about half a standard plate**; this is an informal visual description, not a measured weight.

| Breakfast option | Working calorie estimate | Working protein estimate | Notes |
|---|---:|---:|---|
| Poori bhaji (assumed 2–3 pooris) | 350–550 kcal | 7–12 g | Oil and portion size vary |
| Dosa (3) with accompaniment | 400–550 kcal | 10–16 g | Chutney/sambar assumptions |
| Poha | 200–350 kcal | 4–8 g | Half-plate estimate |
| Upma | 220–380 kcal | 4–8 g | Half-plate estimate |
| Pasta | 250–450 kcal | 7–13 g | Recipe-dependent |
| Egg curry (1 egg and gravy only) | 140–250 kcal | 7–10 g | Count accompanying rice/roti separately if eaten |

### Lunch

- Typically **rice with vegetable curry**.
- Previous working estimate: **400–650 kcal, 8–14 g protein** per whole lunch.
- This assumed around 1.5–2.5 standard cups cooked rice and a serving of curry; this is **not a user-confirmed quantity**.

### Dinner

- Typically **rice or chapati with chicken curry, egg curry, or vegetable curry**.
- If egg curry is served, the user typically has **one egg in the curry**.
- If chicken curry is served, the user typically has **one chicken piece**. Its edible meat weight is unknown; do not equate a bone-in piece with a fixed protein value.

| Dinner type | Working calorie estimate | Working protein estimate |
|---|---:|---:|
| Rice/chapati + vegetable curry | 400–700 kcal | 9–16 g |
| Rice/chapati + 1-egg curry | 450–700 kcal | 14–20 g |
| Rice/chapati + one chicken piece in curry | 450–750 kcal | 16–28 g |

### Daily eggs — important double-counting rule

- The user plans to **eat 3 eggs every day**, paid from the **existing essentials allocation**, not the ₹2,000 budget.
- Previous conversation interpreted these **3 eggs as *additional* to any egg eaten in hostel curry**. Under that interpretation, if egg curry provides 1 egg, the total that day can be **4 eggs**.
- This interpretation is **not definitively confirmed**: the app should ask once whether the daily goal of 3 eggs **includes or excludes curry eggs**.
- Approximate nutrition for **3 eggs**: **210–240 kcal and 18–21 g protein**.
- Log eggs separately or count them once inside a composite curry recipe. **Never double-count the same egg.**
- Egg, gym and creatine costs are **outside** the extra-food budget regardless of where eggs are consumed.

### Earlier whole-day intake estimate

- Broad estimated baseline with regular meals and 3 eggs: around **1,600–2,100 kcal and 45–70 g protein/day** on many days. Highly uncertain, not a verified average.
- One **illustrative** day was estimated as:
  - Breakfast: 3 dosas with accompaniment → **430 kcal, 12 g protein**.
  - Lunch: rice + vegetable curry → **550 kcal, 12 g protein**.
  - Dinner: rice + one-piece chicken curry → **590 kcal, 20 g protein**.
  - 3 additional eggs → **225 kcal, 19 g protein**.
  - **Illustrative baseline total: 1,795 kcal, 63 g protein.**
- Do **not** treat this example as the actual average or as something logged by the user.

## 3. Current additional-food bulking plan (the core app preset)

This is **on top of** hostel breakfast/lunch/dinner and the separately budgeted 3 eggs.

| Extra item | Daily quantity | Approx. kcal | Approx. protein | Recommended timing |
|---|---:|---:|---:|---|
| Nandini toned milk | 500 ml total | 300 kcal | 16.5 g | 250 ml at breakfast + 250 ml in evening; **drink all at once if no fridge** |
| Regular bananas | 2 medium bananas | 200 kcal | 2.5 g | 1 at breakfast + 1 at work |
| Raw peanuts (roasted before eating) | 30 g | 170 kcal | 7.5 g | Afternoon work snack |
| Soya chunks | 30 g **dry weight**, then cooked | 105 kcal | 15.5 g | With dinner |
| **Daily total (extra only)** | | **775 kcal** | **42 g** | |

**Notes:** Values are rounded estimates and depend on actual brands, milk fat percentage, banana size and serving size. Soya should be cooked; **30 g is the dry amount, not cooked weight**. If no food scale is available, use pre-portioned packs or approximate the number of equal servings from a 1 kg pack; allow users to replace estimates with label-based figures. Peanuts/soya may have food-allergy or tolerance considerations.

### Target starting nutrition and progress

- Suggested initial **total daily calorie target** (normal food + 3 eggs + add-ons): **2,400–2,700 kcal**. This is a **starting estimate**, not a measured TDEE/maintenance value.
- Suggested **total daily protein target**: **90–110 g** across all foods, not just the add-ons.
- Suggested weight-gain trend: **approximately 0.15–0.30 kg per week**; prioritize a measured weight trend rather than rigidly forcing an extra 775 kcal if already gaining too fast.
- Illustrative day with add-ons: **1,795 + 775 = 2,570 kcal**, **63 + 42 = 105 g protein**. Example only.
- Compare average morning weights every ~2 weeks:
  - Not gaining: check meal consistency, and if appropriate increase portions (e.g. rice from existing meals).
  - Gaining around 0.15–0.30 kg/week: continue.
  - Gaining more rapidly: consider modest reduction (e.g. remove a banana) and review trend.
- Weight may temporarily rise because of water retention when starting creatine; don't equate every increase with muscle gain.
- The app should avoid presenting calorie targets as precise medical facts. Allow manual adjustment.

## 4. Grocery budget — strict ceiling, including 31-day months

These are **maximum allowed planning prices, not guaranteed current market prices**. The AI originally discussed comparing local central-Mangaluru shops and online listings, but those are **not verified live checkout prices**. Prices and stock should be editable in the app.

| Extra product | Planned purchase per 31-day month | Assumed max unit price | Monthly budget |
|---|---|---:|---:|
| Nandini toned milk | 31 × 500 ml pouches | ₹30 / 500 ml | ₹930 |
| Regular bananas | 62 bananas (2/day) | ₹8 / banana | ₹496 |
| Raw peanuts | 1 × 1 kg bulk pack | ₹260 / kg | ₹260 |
| Soya chunks | 1 × 1 kg bulk pack | ₹210 / kg | ₹210 |
| **Total actual purchase allowance** | | | **₹1,896** |
| **Buffer below hard ₹2,000 cap** | | | **₹104** |

### Daily cost versus upfront cash outlay

- Approximate **daily consumption cost** based on 30 g each of peanuts and soya:
  - Milk: ₹30.00/day
  - Bananas: ₹16.00/day
  - Peanuts: 30 g × ₹260/kg = **₹7.80/day**
  - Soya: 30 g × ₹210/kg = **₹6.30/day**
  - **Total = ₹60.10 per day**.
- In a 31-day month, planned portions consume **930 g each** of peanuts and soya, leaving about **70 g each** from their 1 kg packs.
- **Important accounting distinction:** ₹60.10 × 31 = **₹1,863.10 worth of consumed food**, whereas **₹1,896 is the planned actual cash spending** because full 1 kg packs are bought. For enforcing the budget, use **purchase transactions**, not consumption costs, and account for leftover inventory.
- If actual prices exceed the planning limits, **do not silently exceed ₹2,000**. Show an over-budget warning and require a cheaper equivalent, modified quantity or updated plan.
- Exclude the already-budgeted eggs, gym, and creatine from this cap.

## 5. Shopping schedule / replenishment

A suggested month-long pattern, allowing for freshness and bulk purchases:

| When | Buy | Maximum spending |
|---|---|---:|
| Week 1 | 1 kg peanuts + 1 kg soya (₹470), plus 7 days of milk/bananas (₹322) | **₹792** |
| Week 2 | 7 days of milk/bananas | **₹322** |
| Week 3 | 7 days of milk/bananas | **₹322** |
| Week 4 | 7 days of milk/bananas | **₹322** |
| Final 3 days of a 31-day month | 3 days of milk/bananas | **₹138** |
| **Total** | | **₹1,896** |

Practical frequency:

- **Peanuts + soya:** bulk purchase approximately once per month; store in airtight dry containers.
- **Milk:** ideally buy 500 ml fresh **daily** if there is no refrigerator. If consumed in two sittings, safe storage/refrigeration matters; otherwise drink the full 500 ml together.
- **Bananas:** buy every **2–3 days** to reduce spoilage; plan **2 per day**.
- Treat “weekly ₹322” as a **budget for 7 days of perishable food**, **not** an instruction to purchase and store seven days' worth of milk at room temperature.
- For a 30-day month or partial month, generate the schedule automatically. If unopened pantry inventory rolls over, carry its cost and remaining grams forward.

### Shops / platforms previously mentioned for price comparison

- Fathima Stores / Central Market area, Hampankatta, Mangaluru — possible bulk grocery comparison.
- DMart, Attavar, Mangaluru — possible discount packaged groceries.
- Misbah Supermarket / Falnir Road, Mangaluru — possible local restock.
- BigBasket — previously mentioned for soya chunks and peanuts.
- These are **leads, not claims about currently verified opening hours, pricing, inventory, serviceability or the cheapest shop**.
- The original preference is to compare **offline Mangaluru stores** and **online grocery markets** while accounting for fees and final delivered price. Price comparison is optional for a basic first app version and requires fresh user input or live integrations.

## 6. No-scale food tracking method (central product need)

The user lives in a hostel and has **no food weighing scale**. Tracking needs **portion-based inputs** with editable uncertainty instead of demanding grams for every hostel meal.

### Useful approximate portion references

| Food | Simple portion | Approx. kcal | Approx. protein |
|---|---|---:|---:|
| Cooked rice | 1 level ~200 ml katori | 170–200 | ~4 g |
| Medium chapati | 1 piece | 100–120 | ~3 g |
| Medium dosa | 1 piece | 125–170 | ~3–4 g |
| Boiled egg | 1 egg | ~75 | ~6–7 g |
| Vegetable curry | 1 katori | 100–220 | ~2–5 g |
| Dal | 1 katori | 120–200 | ~6–10 g |
| Banana | 1 medium | ~100 | ~1 g |
| Peanuts | 1 small handful (approx. 30 g) | ~170 | ~7–8 g |

User can calibrate the **capacity** of a katori with a **500 ml water bottle**: if the bottle fills the bowl 2.5 times, bowl capacity is around 200 ml. This does **not** make different foods weigh the same; all food-specific macros remain approximate.

### Recommended logging workflow

1. Select **breakfast** from saved hostel presets: poori bhaji, 3 dosas, poha, upma, pasta, egg curry, or custom.
2. Log **lunch** with a number of katoris of cooked rice + a curry type and portions.
3. Log **dinner** as katoris of rice or number of chapatis, plus vegetable/egg/chicken curry. For chicken, allow **small/medium/large edible portion** or manual correction; bone-in pieces vary.
4. Log **3 eggs** without duplicating any curry eggs.
5. Use four one-tap checkboxes/counters for **milk 500 ml, 2 bananas, 30 g peanuts, 30 g dry soya chunks**, with partial amounts where necessary.
6. Display **calories and protein consumed**, amount **remaining to target**, and **budget/inventory impact**.
7. Use daily/weekly history. Compare **weekly average body weight**, if/when a weight source becomes available.
8. Allow updating nutrition data from package labels and users' preferred recipes; never assume the hostel uses a standard recipe or exact oil quantity.

### Uncertainty management

- Provide an easy option to enter a **range** or **portion size** (small/normal/large), especially for hostel curries and half-plate food.
- “1 piece chicken” has unknown edible meat content; avoid an unjustifiably precise protein number.
- Food labels and user-created recipes outrank generic entries when available.
- Be transparent: calculated macros are estimates; don't communicate a false sense of precision.

## 7. App goals and proposed feature set

### Core MVP (based on the user's request)

- **Daily dashboard:** date; calorie total vs editable target; protein total vs editable target; completion status of the four extra foods and three eggs.
- **Quick meal logging:** selectable hostel breakfasts, rice/curry lunch, rice/chapati/curry dinner, plus optional manual foods; support piece, katori, cup, ml, handful, and approximate dry-gram portions.
- **Preset bulk plan:** add-on schedule + approximate macro values + reminders if desired.
- **Budget tracker:** **₹2,000/month hard cap on actual purchases** of add-on foods; remaining balance; warning before purchase would exceed cap; separate `essential/excluded` classification for eggs, gym and creatine.
- **Inventory/shopping list:** bulk pantry items, daily perishables, monthly planned purchase quantities, next purchase date, actual vs planned unit prices, and leftover inventory.
- **Progress:** historic calories/protein per day, streaks or adherence, morning weight if entered, weekly average weight, change over time.
- **Fast mobile UX:** easy one-handed tracking around a six-day work schedule, few taps, clean typography; a concise summary that can be copied/shared to WhatsApp.
- **Editable profile/settings:** body weight, meal options, target range, egg-counting interpretation, prices, market/brand, preferred portion size, work/gym schedule, cooking/fridge facilities.

### Potential later additions (ideas, not yet requested requirements)

- Grocery invoice/receipt entry or barcode scanning.
- Custom recipes, Indian food database and package nutrition imports.
- Reordering notifications and price comparisons across markets.
- Phone home-screen widgets, offline-first storage, CSV export/backup.
- More complete macro/micronutrient tracking once calorie/protein habits are established.

## 8. Suggested starter data model (conceptual)

Use these as entity boundaries, not necessarily as final database tables:

- `UserProfile`: age, sex, heightCm, startingWeightKg, locale, timezone=`Asia/Kolkata`, diet context, activity, gym schedule, kitchen/fridge access.
- `NutritionGoal`: dateEffective, caloriesTargetMin/Max, proteinTargetMin/Max, desiredWeeklyGainKg, userOverrides.
- `Food`: id, name, brand, defaultServingQuantity, defaultServingUnit, caloriesPerServing, proteinGPerServing, source (`label`, `estimated`, `user_defined`), estimateConfidence.
- `MealTemplate`: breakfast/lunch/dinner/extra and components with default portions.
- `FoodLog`: date, time/meal, foodId or recipeId, portionValue, portionUnit, caloriesEstimate, proteinEstimate, note, whether counted toward add-on plan.
- `Budget`: period start/end, hardCapInr=2000, category=`extra_bulking_food`, purchases and computed spend.
- `Purchase`: date, item, paidAmountInr, quantity, unit, store/channel, budgetCategory, optional receipt or note.
- `Inventory`: item, quantityRemaining, unit, purchaseLot, expiry, storage notes.
- `ShoppingReminder`: item, frequency, nextDueDate, plannedQuantity, expectedMaxPrice.
- `WeightEntry`: date, weightKg, measurement conditions, optional weekly average.

**System invariants / guardrails:**

- **Never** count the user’s already-budgeted 3 eggs, gym membership or creatine against the ₹2,000 extra-food ceiling.
- **Never** count an egg twice (separate boiled egg + egg contained in a curry).
- **Never** confuse monthly *food consumed cost* with *cash spent on bulk packs*.
- **Never** imply that the ₹1,896 plan is guaranteed at a real checkout; actual local prices and delivery charges need confirmation.
- Do not rely on precise mass units when the user does not have a scale; allow portion-based estimates.
- Do not mistake the suggested `2,400–2,700 kcal` range for a personally measured energy expenditure.
- Always allow user edits, especially when the app learns portion sizes or actual packages.

## 9. Suggested preset records (illustrative JSON)

The values below are deliberately approximate, chosen for consistency with the conversation:

```json
{
  "currency": "INR",
  "timezone": "Asia/Kolkata",
  "monthlyExtraFoodCap": 2000,
  "calorieTargetRangePerDay": [2400, 2700],
  "proteinTargetRangeGramsPerDay": [90, 110],
  "excludedFromExtraBudget": ["eggs", "gym_membership", "creatine", "hostel_meals"],
  "additionalFoodPlan": [
    {
      "id": "toned_milk",
      "label": "Toned milk",
      "dailyQuantity": 500,
      "unit": "ml",
      "dailyCaloriesEstimated": 300,
      "dailyProteinGramsEstimated": 16.5,
      "purchaseSize": 500,
      "purchaseUnit": "ml",
      "maximumPricePerPurchaseInr": 30,
      "purchaseFrequency": "daily"
    },
    {
      "id": "banana",
      "label": "Regular banana",
      "dailyQuantity": 2,
      "unit": "piece",
      "dailyCaloriesEstimated": 200,
      "dailyProteinGramsEstimated": 2.5,
      "maximumPricePerPurchaseInr": 8,
      "purchaseFrequency": "every_2_to_3_days"
    },
    {
      "id": "peanut",
      "label": "Peanuts",
      "dailyQuantity": 30,
      "unit": "g",
      "dailyCaloriesEstimated": 170,
      "dailyProteinGramsEstimated": 7.5,
      "purchaseSize": 1000,
      "purchaseUnit": "g",
      "maximumPricePerPurchaseInr": 260,
      "purchaseFrequency": "monthly_bulk"
    },
    {
      "id": "soya_chunks",
      "label": "Soya chunks (uncooked dry weight)",
      "dailyQuantity": 30,
      "unit": "g_dry",
      "dailyCaloriesEstimated": 105,
      "dailyProteinGramsEstimated": 15.5,
      "purchaseSize": 1000,
      "purchaseUnit": "g",
      "maximumPricePerPurchaseInr": 210,
      "purchaseFrequency": "monthly_bulk"
    }
  ],
  "estimatedDailyExtraTotals": {
    "calories": 775,
    "proteinGrams": 42,
    "consumedCostInr": 60.1
  },
  "planned31DayPurchaseSpendInr": 1896,
  "planned31DayBufferInr": 104
}
```

## 10. Questions not yet answered

An AI should **not block building an MVP** on these; use sensible editable defaults, then ask the user only when a feature truly requires it.

1. Do the 3 daily eggs **exclude** the one egg in a curry, or is the curry egg included in the 3?
2. What are the user's specific work hours and workout schedule? Is the job active or mostly seated?
3. Does the hostel have a fridge and access to hot water, induction, kettle or cooking facilities? Can soya chunks actually be prepared there?
4. Does the gym have a body-weight scale the user can use weekly?
5. What's the real-world serving volume of the hostel's katori/plate? How often do breakfast and dinner options occur?
6. What milk brand/label is consistently available, and what are the **actual local checkout prices** and package sizes?
7. What platform/stack should be used for the app (mobile web/PWA, Android, etc.)? No technology stack was specified in this conversation.
8. Any food allergies/intolerances (peanut, soy, dairy) or relevant dietary restrictions? Not provided.

## 11. Definition of a successful first version

The user should be able to open the app on a working day and, in under a minute:

1. Log their chosen breakfast and estimated katoris/pieces for lunch and dinner.
2. Mark three eggs and each of the four extra foods consumed (full or partial servings).
3. See a **realistic estimated calorie and protein total** against an editable lean-bulk target.
4. See the **actual ₹2,000 monthly extra-food spending balance** and the next milk/banana or bulk-shopping task.
5. Review recent eating patterns and, as weight measurements become available, whether the routine supports gradual weight gain.

**Overall design principle:** Low-friction, honest about estimates, adapted to Indian hostel food, and strict about the **₹2,000/month** extra-food spend.
