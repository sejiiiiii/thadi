import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

export default function WhatsAppExportModal({ 
  isOpen, 
  onClose, 
  dailyLog, 
  targetCalories, 
  targetProtein, 
  budgetSpent, 
  budgetCap 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('en-IN', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  const breakfastCal = dailyLog?.breakfast?.calories || 0;
  const breakfastPro = dailyLog?.breakfast?.protein || 0;

  const lunchCal = Math.round(
    ((dailyLog?.lunch?.riceKatoris || 0) * 180) + 
    ((dailyLog?.lunch?.curryKatoris || 0) * 140) + 
    ((dailyLog?.lunch?.dalKatoris || 0) * 150)
  );
  const lunchPro = parseFloat((
    ((dailyLog?.lunch?.riceKatoris || 0) * 3.8) + 
    ((dailyLog?.lunch?.curryKatoris || 0) * 3.5) + 
    ((dailyLog?.lunch?.dalKatoris || 0) * 7.0)
  ).toFixed(1));

  const dinnerCal = Math.round(
    ((dailyLog?.dinner?.riceKatoris || 0) * 180) + 
    ((dailyLog?.dinner?.chapatis || 0) * 110) + 
    (dailyLog?.dinner?.hasChickenCurry ? 260 : 0) + 
    (dailyLog?.dinner?.hasEggCurry ? 180 : 0) + 
    (dailyLog?.dinner?.hasVegCurry ? 130 : 0)
  );
  const dinnerPro = parseFloat((
    ((dailyLog?.dinner?.riceKatoris || 0) * 3.8) + 
    ((dailyLog?.dinner?.chapatis || 0) * 3.2) + 
    (dailyLog?.dinner?.hasChickenCurry ? 18.0 : 0) + 
    (dailyLog?.dinner?.hasEggCurry ? 8.5 : 0) + 
    (dailyLog?.dinner?.hasVegCurry ? 3.0 : 0)
  ).toFixed(1));

  const eggCal = (dailyLog?.standaloneEggs || 0) * 75;
  const eggPro = parseFloat(((dailyLog?.standaloneEggs || 0) * 6.5).toFixed(1));

  const milkCal = dailyLog?.extraFoods?.milk500ml ? 300 : (dailyLog?.extraFoods?.milk250ml ? 150 : 0);
  const milkPro = dailyLog?.extraFoods?.milk500ml ? 16.5 : (dailyLog?.extraFoods?.milk250ml ? 8.2 : 0);
  const bananaCal = (dailyLog?.extraFoods?.bananasCount || 0) * 100;
  const bananaPro = (dailyLog?.extraFoods?.bananasCount || 0) * 1.25;
  const peanutCal = dailyLog?.extraFoods?.peanuts30g ? 170 : 0;
  const peanutPro = dailyLog?.extraFoods?.peanuts30g ? 7.5 : 0;
  const soyaCal = dailyLog?.extraFoods?.soyaChunks30g ? 105 : 0;
  const soyaPro = dailyLog?.extraFoods?.soyaChunks30g ? 15.5 : 0;

  const customItemsList = (dailyLog?.customItems || []).filter(it => it.meal !== 'breakfast');
  const customCal = customItemsList.reduce((acc, it) => acc + (Number(it.calories) || 0), 0);
  const customPro = customItemsList.reduce((acc, it) => acc + (Number(it.protein) || 0), 0);

  const totalCal = breakfastCal + lunchCal + dinnerCal + eggCal + milkCal + bananaCal + peanutCal + soyaCal + customCal;
  const totalPro = parseFloat((breakfastPro + lunchPro + dinnerPro + eggPro + milkPro + bananaPro + peanutPro + soyaPro + customPro).toFixed(1));

  const breakfastStatus = dailyLog?.breakfast?.name && dailyLog?.breakfast?.calories > 0
    ? `• Breakfast: ${dailyLog.breakfast.name} (${dailyLog.breakfast.calories} kcal, ${dailyLog.breakfast.protein}g pro)${dailyLog.breakfast.isCustom ? ' [Custom]' : ''}`
    : '• Breakfast: Skipped / Not Logged';

  const customItemsText = customItemsList.length > 0 
    ? `\n━━━━━━━━━━━━━━━━━━━━\n🍽️ *Custom Added Dishes / Curries:*\n` + customItemsList.map(it => `• [${(it.meal || 'extra').toUpperCase()}] ${it.name} (${it.portion}): +${it.calories} kcal, +${it.protein}g`).join('\n')
    : '';

  const summaryText = `*Thadi (തടി) Bulking Log — ${todayStr}* 🏋️‍♂️
━━━━━━━━━━━━━━━━━━━━
🔥 *Calories:* ${totalCal} / ${targetCalories} kcal (${Math.round((totalCal / targetCalories) * 100)}%)
💪 *Protein:* ${totalPro} / ${targetProtein}g (${Math.round((totalPro / targetProtein) * 100)}%)
🥚 *Eggs:* ${(dailyLog?.standaloneEggs || 0) + (dailyLog?.dinner?.hasEggCurry ? 1 : 0) + (dailyLog?.breakfast?.isEggCurry ? 1 : 0)} / 3 daily eggs
━━━━━━━━━━━━━━━━━━━━
🍳 *Meals Breakdown:*
${breakfastStatus}
• Lunch: ${dailyLog?.lunch?.riceKatoris || 0} rice, ${dailyLog?.lunch?.curryKatoris || 0} curry, ${dailyLog?.lunch?.dalKatoris || 0} dal (${lunchCal} kcal)
• Dinner: ${dailyLog?.dinner?.riceKatoris || 0} rice, ${dailyLog?.dinner?.chapatis || 0} roti (${dinnerCal} kcal)
━━━━━━━━━━━━━━━━━━━━
🥛 *Daily Staples Check:*
• Nandini Milk: ${dailyLog?.extraFoods?.milk500ml ? '✅ 500ml' : (dailyLog?.extraFoods?.milk250ml ? '✅ 250ml' : '❌ Missed')}
• Bananas: ${(dailyLog?.extraFoods?.bananasCount || 0) >= 2 ? `✅ ${dailyLog?.extraFoods?.bananasCount} pcs` : (dailyLog?.extraFoods?.bananasCount ? `⚠️ ${dailyLog?.extraFoods?.bananasCount} pcs` : '❌ Missed')}
• Peanuts: ${dailyLog?.extraFoods?.peanuts30g ? '✅ 30g' : '❌ Missed'}
• Soya Chunks: ${dailyLog?.extraFoods?.soyaChunks30g ? '✅ 30g (kettle steeped)' : '❌ Missed'}${customItemsText}
━━━━━━━━━━━━━━━━━━━━
💰 *Grocery Spending:* ₹${budgetSpent} / ₹${budgetCap} hard cap
*Thadi App — തടി • Lean Bulking*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-white/[0.1] rounded-3xl w-full max-w-md p-5 shadow-2xl relative space-y-3.5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">WhatsApp Daily Summary</h3>
            <p className="text-xs text-slate-400">തടി • Bulk progress export</p>
          </div>
        </div>

        <pre className="bg-slate-950 p-4 rounded-2xl border border-white/[0.06] text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
          {summaryText}
        </pre>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/[0.08] rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-950"
          >
            <Share2 className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
