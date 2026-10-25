import React, { useState } from 'react';
import { 
  User, Activity, Scale, Heart, Flame, Dumbbell, 
  HelpCircle, Sparkles, Coffee, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { 
  SOMATOTYPE_QUIZ_QUESTIONS, SOMATOTYPE_INFO, DEFAULT_USER_PROFILE 
} from '../data/defaultData';
import { calculateBMI, calculateTDEEAndBulk } from '../utils/nutritionEngine';

export default function ProfileTab({ 
  userProfile, 
  setUserProfile, 
  weightHistory, 
  setWeightHistory 
}) {
  const [activeQuizStep, setActiveQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(true);
  const [detectedType, setDetectedType] = useState('ectomorph');
  const [newWeightInput, setNewWeightInput] = useState('');

  const bmiData = calculateBMI(userProfile.weightKg, userProfile.heightCm);
  const tdeeData = calculateTDEEAndBulk(userProfile);

  const handleAnswerSelect = (questionId, option) => {
    const updated = { ...quizAnswers, [questionId]: option };
    setQuizAnswers(updated);

    if (activeQuizStep < SOMATOTYPE_QUIZ_QUESTIONS.length - 1) {
      setActiveQuizStep(activeQuizStep + 1);
    } else {
      let ectoCount = 0;
      let mesoCount = 0;
      let endoCount = 0;
      Object.values(updated).forEach(opt => {
        if (opt.type === 'ectomorph') ectoCount++;
        else if (opt.type === 'mesomorph') mesoCount++;
        else if (opt.type === 'endomorph') endoCount++;
      });

      let finalType = 'ectomorph';
      if (mesoCount > ectoCount && mesoCount >= endoCount) finalType = 'mesomorph';
      else if (endoCount > ectoCount && endoCount > mesoCount) finalType = 'endomorph';

      setDetectedType(finalType);
      setQuizCompleted(true);
    }
  };

  const handleAddWeight = (e) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!val || val < 30 || val > 150) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = { date: todayStr, weight: val };

    setWeightHistory(prev => [newEntry, ...prev]);
    setUserProfile(prev => ({ ...prev, weightKg: val }));
    setNewWeightInput('');
  };

  const somato = SOMATOTYPE_INFO[detectedType];

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* 1. Header & Vitals */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          Metabolic & Body Assessment
        </span>
        <h2 className="text-xl font-bold text-white mt-1">Body Metrics & TDEE</h2>
        <p className="text-xs text-slate-400">Personalized to 22M • 170cm • 55kg lean bulking target</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Age & Sex</span>
            <span className="text-sm font-bold text-white">{userProfile.age} yrs • Male</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Height</span>
            <span className="text-sm font-bold text-white">{userProfile.heightCm} cm</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Current Weight</span>
            <span className="text-sm font-bold text-emerald-400">{userProfile.weightKg} kg</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">BMI</span>
            <span className={`text-sm font-bold ${bmiData.color}`}>{bmiData.bmi} ({bmiData.category.split('(')[0]})</span>
          </div>
        </div>
      </section>

      {/* 2. Somatotype (Body Type) Diagnosis */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Body Type Diagnosis</h3>
          </div>
          <button
            onClick={() => {
              setQuizCompleted(false);
              setActiveQuizStep(0);
              setQuizAnswers({});
            }}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium"
          >
            Retake Quiz
          </button>
        </div>

        {!quizCompleted ? (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Question {activeQuizStep + 1} of {SOMATOTYPE_QUIZ_QUESTIONS.length}</span>
              <span className="font-semibold text-emerald-400">Step {activeQuizStep + 1}</span>
            </div>
            <h4 className="font-semibold text-xs text-slate-100">
              {SOMATOTYPE_QUIZ_QUESTIONS[activeQuizStep].question}
            </h4>

            <div className="space-y-2 pt-1">
              {SOMATOTYPE_QUIZ_QUESTIONS[activeQuizStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(SOMATOTYPE_QUIZ_QUESTIONS[activeQuizStep].id, opt)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-xs text-slate-200 transition flex items-center justify-between group"
                >
                  <span>{opt.text}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Diagnosis Result
              </span>
              <h4 className="text-base font-bold text-white mt-1">{somato.title}</h4>
              <p className="text-xs text-emerald-300 font-medium">{somato.tagline}</p>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {somato.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
              <div className="text-xs">
                <span className="text-slate-500 block">Surplus Recommendation:</span>
                <span className="font-bold text-amber-400">{somato.surplusAdvice}</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-500 block">Optimal Protein Intake:</span>
                <span className="font-bold text-emerald-400">{somato.idealProtein}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. TDEE Breakdown */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-base">Energy Expenditure & Targets</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">BMR</span>
            <span className="text-base font-bold text-white">{tdeeData.bmr}</span>
            <span className="text-[10px] text-slate-600 block">kcal at rest</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Maintenance (TDEE)</span>
            <span className="text-base font-bold text-slate-200">~{tdeeData.maintenance}</span>
            <span className="text-[10px] text-slate-600 block">daily burn</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Lean Bulk Surplus</span>
            <span className="text-base font-bold text-amber-400">+{tdeeData.surplus}</span>
            <span className="text-[10px] text-slate-600 block">kcal surplus</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Target Bulking Goal</span>
            <span className="text-base font-black text-emerald-400">{tdeeData.bulkCalorieTarget}</span>
            <span className="text-[10px] text-slate-600 block">kcal / day</span>
          </div>
        </div>
      </section>

      {/* 4. Kettle Hostel Cooking Tips */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Coffee className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white text-base">Electric Kettle Hostel Cooking Tips</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <p className="font-semibold text-emerald-300">1. Soya Chunks Steeping</p>
            <p className="text-slate-400 leading-relaxed">
              Never put dry soya chunks inside the kettle. Boil water in the kettle, pour into a bowl with 30g soya chunks, cover with a plate for 8–10 mins, squeeze dry and mix into hostel curry.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <p className="font-semibold text-emerald-300">2. Hard Boiled Eggs</p>
            <p className="text-slate-400 leading-relaxed">
              Lower eggs gently into cold water in the kettle. Boil until it switches off, then let them sit in the hot water for 10 minutes.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <p className="font-semibold text-emerald-300">3. Milk Warming</p>
            <p className="text-slate-400 leading-relaxed">
              Place the sealed 500ml milk pouch directly into a bowl of kettle hot water for 3–5 minutes to warm it evenly without a stove.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Morning Weight Trend Log */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-400" />
            Morning Weight Trend Log
          </h3>
          <p className="text-xs text-slate-400">Aim for a steady trend of ~0.15 to 0.30 kg per week</p>
        </div>

        <form onSubmit={handleAddWeight} className="flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 55.4 (kg)"
            value={newWeightInput}
            onChange={(e) => setNewWeightInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition"
          >
            Log Weight
          </button>
        </form>

        <div className="space-y-1 pt-1">
          {weightHistory.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">{item.date}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">{item.weight} kg</span>
                {idx < weightHistory.length - 1 && (
                  <span className={`text-[11px] font-semibold ${
                    item.weight >= weightHistory[idx + 1].weight ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {item.weight >= weightHistory[idx + 1].weight ? '+' : ''}{(item.weight - weightHistory[idx + 1].weight).toFixed(1)} kg
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
