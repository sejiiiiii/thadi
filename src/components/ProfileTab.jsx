import React, { useState } from 'react';
import { 
  User, Activity, Scale, Heart, Flame, Dumbbell, 
  HelpCircle, Sparkles, Coffee, ShieldCheck, ChevronRight, CheckCircle2 
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
    <div className="space-y-4 pb-28 animate-fadeIn max-w-md md:max-w-xl mx-auto">
      {/* 1. Vitals Hero Card (Double-Bezel Architecture) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-xl">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Hostel Bulking Vitals
              </span>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">Profile & Somatotype</h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Calibrated for 22yo Male in Central Mangaluru • 6-day work schedule + Gym
          </p>

          {/* 4 Metric Vitals Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Age & Sex</span>
              <p className="text-sm font-bold text-white mt-0.5">{userProfile.age} yrs • M</p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Height</span>
              <p className="text-sm font-bold text-white mt-0.5">{userProfile.heightCm} cm</p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Weight</span>
              <p className="text-sm font-black text-emerald-400 font-mono mt-0.5">{userProfile.weightKg} kg</p>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">BMI Metric</span>
              <p className={`text-sm font-black font-mono mt-0.5 ${bmiData.color}`}>{bmiData.bmi}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Somatotype Diagnosis (Body Type) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">Somatotype Assessment</h3>
            </div>
            <button
              onClick={() => {
                setQuizCompleted(false);
                setActiveQuizStep(0);
                setQuizAnswers({});
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold transition active:scale-95"
            >
              {quizCompleted ? 'Retake Quiz' : 'Reset'}
            </button>
          </div>

          {!quizCompleted ? (
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-white/[0.06] space-y-3">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Question {activeQuizStep + 1} of {SOMATOTYPE_QUIZ_QUESTIONS.length}</span>
                <span className="font-bold text-emerald-400">Step {activeQuizStep + 1}</span>
              </div>
              <h4 className="font-bold text-xs text-white">
                {SOMATOTYPE_QUIZ_QUESTIONS[activeQuizStep].question}
              </h4>

              <div className="space-y-2 pt-1">
                {SOMATOTYPE_QUIZ_QUESTIONS[activeQuizStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(SOMATOTYPE_QUIZ_QUESTIONS[activeQuizStep].id, opt)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-white/[0.06] hover:border-emerald-500/50 text-xs text-slate-200 transition flex items-center justify-between group active:scale-98"
                  >
                    <span>{opt.text}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-white">{somato.title}</h4>
                  <p className="text-xs text-emerald-400 font-semibold">{somato.tagline}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {somato.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Surplus Rule:</span>
                  <span className="font-bold text-amber-400">{somato.surplusAdvice}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Protein Target:</span>
                  <span className="font-bold text-emerald-400">{somato.idealProtein}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. TDEE & Target Energy Breakdown */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Daily Calorie Target Breakdown</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Basal Metabolic Rate</span>
              <p className="text-base font-black text-white font-mono mt-0.5">{tdeeData.bmr} kcal</p>
              <span className="text-[9px] text-slate-500 block">Resting Burn</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Maintenance (TDEE)</span>
              <p className="text-base font-black text-slate-300 font-mono mt-0.5">~{tdeeData.maintenance} kcal</p>
              <span className="text-[9px] text-slate-500 block">6d Work + Gym</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Lean Bulk Surplus</span>
              <p className="text-base font-black text-amber-400 font-mono mt-0.5">+{tdeeData.surplus} kcal</p>
              <span className="text-[9px] text-amber-500/80 block">+0.25 kg/week</span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-2xl border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 font-medium block">Daily Bulking Goal</span>
              <p className="text-base font-black text-emerald-400 font-mono mt-0.5">{tdeeData.bulkCalorieTarget} kcal</p>
              <span className="text-[9px] text-emerald-500/80 block">Target to Hit</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Electric Kettle Hostel Cooking Masterclass */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">Hostel Electric Kettle Hacks</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] space-y-1">
              <span className="font-bold text-emerald-300 text-xs">1. Soya Chunks Steeping (No Burn Method)</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Never put dry soya chunks inside the kettle itself. Boil water in kettle, pour into a bowl containing 30g soya chunks, cover with a lid for 8–10 mins. Squeeze dry and mix into hostel curry.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] space-y-1">
              <span className="font-bold text-emerald-300 text-xs">2. 3 Hard Boiled Eggs</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Place 3 eggs into the kettle with cold water. Switch it on. Once auto-off kicks in, leave the eggs inside the hot water for 10 minutes to finish cooking.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/70 border border-white/[0.06] space-y-1">
              <span className="font-bold text-emerald-300 text-xs">3. Milk Pouch Water Bath</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Do not pour milk inside the kettle. Fill a mug or bowl with boiled kettle water, submerge the sealed 500ml Nandini packet for 3 minutes to warm it evenly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
