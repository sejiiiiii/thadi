import React, { useState } from 'react';
import { Flame, Dumbbell, Wallet, Share2, LogIn, LogOut, Cloud, CloudOff, Check, User as UserIcon } from 'lucide-react';
import { loginWithGoogle, logoutUser, isConfigured } from '../firebase';

export default function Header({ 
  todayCalories, 
  targetCalories, 
  todayProtein, 
  targetProtein, 
  budgetSpent, 
  budgetCap, 
  currentUser,
  isSyncing,
  onOpenExport 
}) {
  const [authError, setAuthError] = useState(null);
  const calPercent = Math.min(100, Math.round((todayCalories / targetCalories) * 100));
  const proPercent = Math.min(100, Math.round((todayProtein / targetProtein) * 100));
  const remainingBudget = Math.max(0, budgetCap - budgetSpent);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      if (!isConfigured) {
        alert("Firebase environment variables are not configured yet. You can run Thadi in offline/localStorage mode right now, or add your Firebase keys to .env.local for Google Cloud Sync!");
        return;
      }
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setAuthError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Malayalam Origin */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/30 flex items-center justify-center p-1 shadow-sm">
            <img src="/Thadi_logo_SVG.svg" alt="Thadi Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Thadi
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wide">
                  തടി • Bulk
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Personalized Bulking & Budget Diet</p>
          </div>
        </div>

        {/* Quick Stats & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Calorie & Protein Chips */}
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center gap-1 text-amber-400">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-200">{todayCalories}</span>
              <span className="text-slate-500 text-[11px]">/{targetCalories} kcal</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1 text-emerald-400">
              <Dumbbell className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-200">{todayProtein}</span>
              <span className="text-slate-500 text-[11px]">/{targetProtein}g</span>
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center gap-1 text-slate-300">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">₹{remainingBudget}</span>
              <span className="text-slate-500 text-[11px]">left</span>
            </div>
          </div>

          {/* WhatsApp Export */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium transition active:scale-95"
            title="Export daily progress to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Share</span>
          </button>

          {/* Google Auth Status / Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || "User"} 
                  className="w-6 h-6 rounded-full border border-emerald-500/50"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <span className="text-xs font-medium text-slate-200 hidden lg:inline max-w-[100px] truncate">
                {currentUser.displayName?.split(' ')[0] || "Logged In"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Cloud Synced" />
              <button
                onClick={handleSignOut}
                className="text-slate-400 hover:text-slate-200 p-0.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition active:scale-95 shadow-sm shadow-emerald-900/30"
              title="Sign in with Google to sync data across devices"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
