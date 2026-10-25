import React, { useState } from 'react';
import { 
  Zap, Search, ExternalLink, Edit3, ShoppingCart, 
  ArrowUpRight, Check, AlertCircle, Sparkles 
} from 'lucide-react';
import { QUICK_COMMERCE_PRODUCTS, getQuickCommerceLinks } from '../data/defaultData';

export default function QuickCommerceTab() {
  const [products, setProducts] = useState(QUICK_COMMERCE_PRODUCTS);
  const [customSearch, setCustomSearch] = useState('');
  const [customGeneratedLinks, setCustomGeneratedLinks] = useState(null);

  const handleGenerateCustomLinks = (e) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    setCustomGeneratedLinks(getQuickCommerceLinks(customSearch.trim()));
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Card (Double Bezel) */}
      <div className="bg-slate-900/60 p-1 rounded-3xl border border-white/[0.08] shadow-md">
        <div className="bg-slate-950/80 rounded-[calc(1.5rem-2px)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                10-Min Fast Delivery
              </span>
              <h3 className="font-extrabold text-sm text-white mt-1">Quick Commerce Deep Links</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            One-tap direct search across Blinkit, Swiggy Instamart, Zepto, BigBasket & Zomato.
          </p>

          {/* Search Input */}
          <form onSubmit={handleGenerateCustomLinks} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search Sattu, Peanut Butter, Oats..."
              value={customSearch}
              onChange={(e) => setCustomSearch(e.target.value)}
              className="flex-1 bg-slate-900 border border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs transition active:scale-95 shadow-md shadow-emerald-950"
            >
              Search
            </button>
          </form>

          {/* Custom Search Result Pills */}
          {customGeneratedLinks && (
            <div className="p-3 bg-slate-900 rounded-2xl border border-emerald-500/30 space-y-2 animate-fadeIn">
              <span className="text-[11px] font-bold text-emerald-400 block">
                Open "{customSearch}" in:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <a
                  href={customGeneratedLinks.blinkit}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <span>Blinkit</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href={customGeneratedLinks.swiggy}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-orange-500/15 text-orange-300 border border-orange-500/30 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <span>Swiggy</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href={customGeneratedLinks.zepto}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <span>Zepto</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <a
                  href={customGeneratedLinks.bigbasket}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 active:scale-95"
                >
                  <span>BigBasket</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Preset Products Cards */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 px-1">
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
          <span>Curated Bulking Products</span>
        </h4>

        <div className="grid grid-cols-1 gap-2">
          {products.map((item) => {
            const links = getQuickCommerceLinks(item.searchTerms.blinkit);
            return (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs">{item.name}</h5>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded-md border border-white/[0.06]">
                    ~₹{item.targetPrice}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                  <a
                    href={links.blinkit}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[11px] font-bold text-amber-400 border border-white/[0.06] flex items-center gap-1 shrink-0 active:scale-95"
                  >
                    <span>Blinkit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={links.swiggy}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[11px] font-bold text-orange-400 border border-white/[0.06] flex items-center gap-1 shrink-0 active:scale-95"
                  >
                    <span>Swiggy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={links.zepto}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[11px] font-bold text-purple-400 border border-white/[0.06] flex items-center gap-1 shrink-0 active:scale-95"
                  >
                    <span>Zepto</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={links.bigbasket}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-[11px] font-bold text-emerald-400 border border-white/[0.06] flex items-center gap-1 shrink-0 active:scale-95"
                  >
                    <span>BigBasket</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
