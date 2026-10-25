import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import TrackerTab from './components/TrackerTab';
import PlannerTab from './components/PlannerTab';
import StoreMapTab from './components/StoreMapTab';
import QuickCommerceTab from './components/QuickCommerceTab';
import ProfileTab from './components/ProfileTab';
import WhatsAppExportModal from './components/WhatsAppExportModal';

import { DEFAULT_USER_PROFILE } from './data/defaultData';
import { calculateTDEEAndBulk } from './utils/nutritionEngine';
import { auth, db, isConfigured } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState('tracker');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('thadi_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  // Weight History
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

  // Today's Date String
  const todayKey = new Date().toISOString().split('T')[0];

  // Daily Food Log
  const [dailyLog, setDailyLog] = useState(() => {
    const saved = localStorage.getItem(`thadi_log_${todayKey}`);
    return saved ? JSON.parse(saved) : {
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
    };
  });

  // 1. Firebase Auth Listener
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // 2. Firestore Sync Listener (Loads user data from Cloud when logged in)
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
        if (data.dailyLogs && data.dailyLogs[todayKey]) {
          setDailyLog(data.dailyLogs[todayKey]);
          localStorage.setItem(`thadi_log_${todayKey}`, JSON.stringify(data.dailyLogs[todayKey]));
        }
      }
    }, (err) => {
      console.warn("Firestore sync warning:", err);
      setIsSyncing(false);
    });

    return unsubscribe;
  }, [currentUser, todayKey]);

  // 3. Save to LocalStorage + Push to Firestore
  useEffect(() => {
    localStorage.setItem('thadi_user_profile', JSON.stringify(userProfile));
    if (currentUser && db) {
      setDoc(doc(db, 'users', currentUser.uid), { profile: userProfile }, { merge: true }).catch(console.error);
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    localStorage.setItem('thadi_weight_history', JSON.stringify(weightHistory));
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
    localStorage.setItem(`thadi_log_${todayKey}`, JSON.stringify(dailyLog));
    if (currentUser && db) {
      setDoc(doc(db, 'users', currentUser.uid), { 
        dailyLogs: { [todayKey]: dailyLog } 
      }, { merge: true }).catch(console.error);
    }
  }, [dailyLog, todayKey, currentUser]);

  // Calculated Targets
  const tdeeData = calculateTDEEAndBulk(userProfile);
  const targetCalories = tdeeData.bulkCalorieTarget;
  const targetProtein = tdeeData.proteinTargetRange[1];

  // Reactive Calorie & Protein Sums
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

  const todayCalories = breakfastCal + lunchCal + dinnerCal + eggCal + milkCal + bananaCal + peanutCal + soyaCal;
  const todayProtein = parseFloat((breakfastPro + lunchPro + dinnerPro + eggPro + milkPro + bananaPro + peanutPro + soyaPro).toFixed(1));

  const budgetSpent = 1896;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Navigation Tabs */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Views */}
        {activeTab === 'tracker' && (
          <TrackerTab
            dailyLog={dailyLog}
            setDailyLog={setDailyLog}
            targetCalories={targetCalories}
            targetProtein={targetProtein}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerTab
            budgetCap={budgetCap}
            setBudgetCap={setBudgetCap}
          />
        )}

        {activeTab === 'map' && (
          <StoreMapTab />
        )}

        {activeTab === 'delivery' && (
          <QuickCommerceTab />
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
        dailyLog={dailyLog}
        targetCalories={targetCalories}
        targetProtein={targetProtein}
        budgetSpent={budgetSpent}
        budgetCap={budgetCap}
      />
    </div>
  );
}
