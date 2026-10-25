import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { generateWhatsAppSummary } from '../utils/nutritionEngine';

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

  const breakfastCal = dailyLog.breakfast.calories || 0;
  const breakfastPro = dailyLog.breakfast.protein || 0;

  const lunchCal = Math.round(
    (dailyLog.lunch.riceKatoris * 180) + 
    (dailyLog.lunch.curryKatoris * 140) + 
    (dailyLog.lunch.dalKatoris * 150)
  );
  const lunchPro = parseFloat((
    (dailyLog.lunch.riceKatoris * 3.8) + 
    (dailyLog.lunch.curryKatoris * 3.5) + 
    (dailyLog.lunch.dalKatoris * 7.0)
  ).toFixed(1));

  const dinnerCal = Math.round(
    (dailyLog.dinner.riceKatoris * 180) + 
    (dailyLog.dinner.chapatis * 110) + 
    (dailyLog.dinner.hasChickenCurry ? 260 : 0) + 
    (dailyLog.dinner.hasEggCurry ? 180 : 0) + 
    (dailyLog.dinner.hasVegCurry ? 130 : 0)
  );
  const dinnerPro = parseFloat((
    (dailyLog.dinner.riceKatoris * 3.8) + 
    (dailyLog.dinner.chapatis * 3.2) + 
    (dailyLog.dinner.hasChickenCurry ? 18.0 : 0) + 
    (dailyLog.dinner.hasEggCurry ? 8.5 : 0) + 
    (dailyLog.dinner.hasVegCurry ? 3.0 : 0)
  ).toFixed(1));

  const eggCal = dailyLog.standaloneEggs * 75;
  const eggPro = parseFloat((dailyLog.standaloneEggs * 6.5).toFixed(1));

  const milkCal = dailyLog.extraFoods.milk500ml ? 300 : (dailyLog.extraFoods.milk250ml ? 150 : 0);
  const milkPro = dailyLog.extraFoods.milk500ml ? 16.5 : (dailyLog.extraFoods.milk250ml ? 8.2 : 0);
  const bananaCal = dailyLog.extraFoods.bananasCount * 100;
  const bananaPro = dailyLog.extraFoods.bananasCount * 1.25;
  const peanutCal = dailyLog.extraFoods.peanuts30g ? 170 : 0;
  const peanutPro = dailyLog.extraFoods.peanuts30g ? 7.5 : 0;
  const soyaCal = dailyLog.extraFoods.soyaChunks30g ? 105 : 0;
  const soyaPro = dailyLog.extraFoods.soyaChunks30g ? 15.5 : 0;

  const totalCal = breakfastCal + lunchCal + dinnerCal + eggCal + milkCal + bananaCal + peanutCal + soyaCal;
  const totalPro = parseFloat((breakfastPro + lunchPro + dinnerPro + eggPro + milkPro + bananaPro + peanutPro + soyaPro).toFixed(1));

  const summaryText = `*Thadi (തടി) Bulking Log — ${todayStr}* 🏋️‍♂️
━━━━━━━━━━━━━━━━━━━━
🔥 *Calories:* ${totalCal} / ${targetCalories} kcal (${Math.round((totalCal / targetCalories) * 100)}%)
💪 *Protein:* ${totalPro} / ${targetProtein}g (${Math.round((totalPro / targetProtein) * 100)}%)
🥚 *Eggs:* ${dailyLog.standaloneEggs + (dailyLog.dinner.hasEggCurry ? 1 : 0)} / 3 daily eggs
━━━━━━━━━━━━━━━━━━━━
🥛 *Daily Add-ons Check:*
• Nandini Milk: ${dailyLog.extraFoods.milk500ml ? '✅ 500ml' : (dailyLog.extraFoods.milk250ml ? '✅ 250ml' : '❌ Missed')}
• Bananas: ${dailyLog.extraFoods.bananasCount >= 2 ? `✅ ${dailyLog.extraFoods.bananasCount} pcs` : '❌ Missed'}
• Peanuts: ${dailyLog.extraFoods.peanuts30g ? '✅ 30g' : '❌ Missed'}
• Soya Chunks: ${dailyLog.extraFoods.soyaChunks30g ? '✅ 30g (kettle boiled)' : '❌ Missed'}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">WhatsApp Daily Summary</h3>
            <p className="text-xs text-slate-400">തടി • Bulk progress summary</p>
          </div>
        </div>

        <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
          {summaryText}
        </pre>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-900/30"
          >
            <Share2 className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
