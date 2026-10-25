import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import TrackerTab from './components/TrackerTab';
import CalendarTab from './components/CalendarTab';
import PlannerTab from './components/PlannerTab';
import ProfileTab from './components/ProfileTab';
import WhatsAppExportModal from './components/WhatsAppExportModal';

import { DEFAULT_USER_PROFILE } from './data/defaultData';
import { calculateTDEEAndBulk } from './utils/nutritionEngine';
import { auth, db, isConfigured } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState('tracker'); // 'tracker' | 'calendar' | 'planner' | 'profile'
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Authentication
  const [currentUser, setCurrentUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Date selection (Defaults to today)
  const todayKey = new Date().toISOString().split('T')[0];
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('thadi_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  // Weight History (Flexible / Weekly logging)
  const [weightHistory, setWeightHistory] = useState(() => {
    const saved = localStorage.getItem('thadi_weight_history');
    return saved ? JSON.parse(saved) : [
      { date: '2026-10-25', weight: 55.0 }
    ];
  });

  // Budget Cap
  const [budgetCap, setBudgetCap] = useState(() => {
    const saved = localStorage.getItem('thadi_budget_cap');
    return saved ? Number(saved) : 2000;
  });

  // Master Daily Logs Store: { [dateKey]: logData }
  const [allDailyLogs, setAllDailyLogs] = useState(() => {
    const saved = localStorage.getItem('thadi_all_daily_logs');
    if (saved) return JSON.parse(saved);

    // Default starting today log
    return {
      [todayKey]: {
        breakfast: { name: 'Dosa (3 medium) with Sambar', calories: 430, protein: 12, isEggCurry: false },
        lunch: { riceKatoris: 2, curryKatoris: 1, dalKatoris: 0 },
        dinner: { riceKatoris: 1.5, chapatis: 2, hasChickenCurry: false, hasEggCurry: false, hasVegCurry: true },
        extraFoods: {
          milk500ml: true,
          milk250ml: false,
          bananasCount: 2,
          peanuts30g: true,
          soyaChunks30g: true
        },
        standaloneEggs: 3
      }
    };
  });

  // Active day's log
  const currentDailyLog = allDailyLogs[selectedDateKey] || {
    breakfast: { name: 'Poori Bhaji', calories: 450, protein: 9, isEggCurry: false },
    lunch: { riceKatoris: 2, curryKatoris: 1, dalKatoris: 0 },
    dinner: { riceKatoris: 1.5, chapatis: 2, hasChickenCurry: false, hasEggCurry: false, hasVegCurry: true },
    extraFoods: {
      milk500ml: false,
      milk250ml: false,
      bananasCount: 0,
      peanuts30g: false,
      soyaChunks30g: false
    },
    standaloneEggs: 3
  };

  const handleUpdateCurrentDayLog = (updater) => {
    setAllDailyLogs(prev => {
      const existing = prev[selectedDateKey] || currentDailyLog;
      const updated = typeof updater === 'function' ? updater(existing) : updater;
      return {
        ...prev,
        [selectedDateKey]: updated
      };
    });
  };

  // 1. Firebase Auth Listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // 2. Cloud Firestore Real-time Sync
  useEffect(() => {
    if (!currentUser || !db) return;

    setIsSyncing(true);
    const userDocRef = doc(db, 'users', currentUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      setIsSyncing(false);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profile) {
          setUserProfile(data.profile);
          localStorage.setItem('thadi_user_profile', JSON.stringify(data.profile));
        }
        if (data.weightHistory) {
          setWeightHistory(data.weightHistory);
          localStorage.setItem('thadi_weight_history', JSON.stringify(data.weightHistory));
        }
        if (data.budgetCap) {
          setBudgetCap(data.budgetCap);
          localStorage.setItem('thadi_budget_cap', data.budgetCap.toString());
        }
        if (data.allDailyLogs) {
          setAllDailyLogs(data.allDailyLogs);
          localStorage.setItem('thadi_all_daily_logs', JSON.stringify(data.allDailyLogs));
        }
      }
    }, (err) => {
      console.warn("Firestore sync notice:", err);
      setIsSyncing(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // 3. Save to LocalStorage + Push to Firestore
  useEffect(() => {
    localStorage.setItem('thadi_user_profile', JSON.stringify(userProfile));
    if (currentUser && db) {
      setDoc(doc(db, 'users', currentUser.uid), { profile: userProfile }, { merge: true }).catch(console.error);
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    localStorage.setItem('thadi_weight_history', JSON.stringify(weightHistory));
    if (weightHistory.length > 0 && weightHistory[0].weight !== userProfile.weightKg) {
      setUserProfile(prev => ({ ...prev, weightKg: weightHistory[0].weight }));
    }
    if (currentUser && db) {
      setDoc(doc(db, 'users', currentUser.uid), { weightHistory }, { merge: true }).catch(console.error);
    }
  }, [weightHistory, currentUser]);

  useEffect(() => {
    localStorage.setItem('thadi_budget_cap', budgetCap.toString());
    if (currentUser && db) {
      setDoc(doc(db, 'users', currentUser.uid), { budgetCap }, { merge: true }).catch(console.error);
    }
  }, [budgetCap, currentUser]);

  useEffect(() => {
    localStorage.setItem('thadi_all_daily_logs', JSON.stringify(allDailyLogs));
    if (currentUser && db) {
      setDoc(doc(db, 'users', currentUser.uid), { allDailyLogs }, { merge: true }).catch(console.error);
    }
  }, [allDailyLogs, currentUser]);

  // Target Calculations
  const tdeeData = calculateTDEEAndBulk(userProfile);
  const targetCalories = tdeeData.bulkCalorieTarget; // ~2600 kcal
  const targetProtein = tdeeData.proteinTargetRange[1]; // ~110g

  // Reactive Calorie & Protein Sums for selected day
  const bCal = currentDailyLog.breakfast?.calories || 0;
  const bPro = currentDailyLog.breakfast?.protein || 0;

  const lCal = Math.round(
    ((currentDailyLog.lunch?.riceKatoris || 0) * 180) + 
    ((currentDailyLog.lunch?.curryKatoris || 0) * 140) + 
    ((currentDailyLog.lunch?.dalKatoris || 0) * 150)
  );
  const lPro = parseFloat((
    ((currentDailyLog.lunch?.riceKatoris || 0) * 3.8) + 
    ((currentDailyLog.lunch?.curryKatoris || 0) * 3.5) + 
    ((currentDailyLog.lunch?.dalKatoris || 0) * 7.0)
  ).toFixed(1));

  const dCal = Math.round(
    ((currentDailyLog.dinner?.riceKatoris || 0) * 180) + 
    ((currentDailyLog.dinner?.chapatis || 0) * 110) + 
    (currentDailyLog.dinner?.hasChickenCurry ? 260 : 0) + 
    (currentDailyLog.dinner?.hasEggCurry ? 180 : 0) + 
    (currentDailyLog.dinner?.hasVegCurry ? 130 : 0)
  );
  const dPro = parseFloat((
    ((currentDailyLog.dinner?.riceKatoris || 0) * 3.8) + 
    ((currentDailyLog.dinner?.chapatis || 0) * 3.2) + 
    (currentDailyLog.dinner?.hasChickenCurry ? 18.0 : 0) + 
    (currentDailyLog.dinner?.hasEggCurry ? 8.5 : 0) + 
    (currentDailyLog.dinner?.hasVegCurry ? 3.0 : 0)
  ).toFixed(1));

  const eggCal = (currentDailyLog.standaloneEggs || 0) * 75;
  const eggPro = parseFloat(((currentDailyLog.standaloneEggs || 0) * 6.5).toFixed(1));

  const milkCal = currentDailyLog.extraFoods?.milk500ml ? 300 : (currentDailyLog.extraFoods?.milk250ml ? 150 : 0);
  const milkPro = currentDailyLog.extraFoods?.milk500ml ? 16.5 : (currentDailyLog.extraFoods?.milk250ml ? 8.2 : 0);
  const bananaCal = (currentDailyLog.extraFoods?.bananasCount || 0) * 100;
  const bananaPro = (currentDailyLog.extraFoods?.bananasCount || 0) * 1.25;
  const peanutCal = currentDailyLog.extraFoods?.peanuts30g ? 170 : 0;
  const peanutPro = currentDailyLog.extraFoods?.peanuts30g ? 7.5 : 0;
  const soyaCal = currentDailyLog.extraFoods?.soyaChunks30g ? 105 : 0;
  const soyaPro = currentDailyLog.extraFoods?.soyaChunks30g ? 15.5 : 0;

  const todayCalories = bCal + lCal + dCal + eggCal + milkCal + bananaCal + peanutCal + soyaCal;
  const todayProtein = parseFloat((bPro + lPro + dPro + eggPro + milkPro + bananaPro + peanutPro + soyaPro).toFixed(1));

  const budgetSpent = 1896;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header */}
      <Header
        todayCalories={todayCalories}
        targetCalories={targetCalories}
        todayProtein={todayProtein}
        targetProtein={targetProtein}
        budgetSpent={budgetSpent}
        budgetCap={budgetCap}
        currentUser={currentUser}
        isSyncing={isSyncing}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Navigation Tabs (Google Material pill style) */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Views */}
        {activeTab === 'tracker' && (
          <TrackerTab
            dailyLog={currentDailyLog}
            setDailyLog={handleUpdateCurrentDayLog}
            selectedDateKey={selectedDateKey}
            setSelectedDateKey={setSelectedDateKey}
            targetCalories={targetCalories}
            targetProtein={targetProtein}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarTab
            allDailyLogs={allDailyLogs}
            selectedDateKey={selectedDateKey}
            setSelectedDateKey={(date) => {
              setSelectedDateKey(date);
              setActiveTab('tracker');
            }}
            targetCalories={targetCalories}
            targetProtein={targetProtein}
            weightHistory={weightHistory}
            setWeightHistory={setWeightHistory}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerTab
            budgetCap={budgetCap}
            setBudgetCap={setBudgetCap}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            weightHistory={weightHistory}
            setWeightHistory={setWeightHistory}
          />
        )}
      </main>

      {/* WhatsApp Export Modal */}
      <WhatsAppExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        dailyLog={currentDailyLog}
        targetCalories={targetCalories}
        targetProtein={targetProtein}
        budgetSpent={budgetSpent}
        budgetCap={budgetCap}
      />
    </div>
  );
}
