import React from 'react';
import { Share2, LogIn, LogOut, Sparkles } from 'lucide-react';
import { loginWithGoogle, logoutUser, isConfigured } from '../firebase';

export default function Header({ 
  todayCalories, 
  targetCalories, 
  todayProtein, 
  targetProtein, 
  currentUser,
  onOpenExport 
}) {
  const handleSignIn = async () => {
    try {
      if (!isConfigured) {
        alert("Firebase credentials are being configured in .env.local. You can continue tracking locally or connect Firebase for Google Cloud Sync!");
        return;
      }
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      alert("Sign-in error: " + err.message);
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
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-2xl border-b border-white/[0.08] px-4 py-3">
      <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-slate-900 border border-white/[0.1] p-1 flex items-center justify-center shadow-sm">
            <img src="/Thadi_logo_SVG.svg" alt="Thadi" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white">Thadi</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                തടി
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block -mt-0.5">Bulk on a Budget</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* WhatsApp Export */}
          <button
            onClick={onOpenExport}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/[0.08] flex items-center justify-center text-slate-300 transition active:scale-90"
            title="Export daily progress to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Google Sign-in */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-900 pl-1.5 pr-2 py-1 rounded-full border border-white/[0.08]">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Avatar" 
                  className="w-5 h-5 rounded-full object-cover border border-emerald-500/50"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] font-bold text-white">
                  {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                </div>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Cloud Synced" />
              <button
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white p-0.5 transition"
                title="Sign out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition active:scale-95 shadow-md shadow-emerald-950 flex items-center gap-1.5"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
