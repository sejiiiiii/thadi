import React, { useState } from 'react';
import { 
  Zap, Search, ExternalLink, Edit3, ShoppingCart, 
  ArrowUpRight, Check, AlertCircle, Sparkles 
} from 'lucide-react';
import { QUICK_COMMERCE_PRODUCTS, getQuickCommerceLinks } from '../data/defaultData';

export default function QuickCommerceTab() {
  const [products, setProducts] = useState(QUICK_COMMERCE_PRODUCTS);
  const [customSearch, setCustomSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [customGeneratedLinks, setCustomGeneratedLinks] = useState(null);

  const handleGenerateCustomLinks = (e) => {
    e.preventDefault();
    if (!customSearch.trim()) return;
    setCustomGeneratedLinks(getQuickCommerceLinks(customSearch.trim()));
  };

  const handlePriceUpdate = (id, newPrice) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, targetPrice: Number(newPrice) || p.targetPrice } : p));
    setEditingId(null);
  };

  return (
    <div className="space-y-5 pb-20 md:pb-6">
      {/* 1. Header & Custom Search */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
          Instant Delivery Deep Links
        </span>
        <h2 className="text-xl font-bold text-white mt-1">Quick Commerce & Online Orders</h2>
        <p className="text-xs text-slate-400">1-Tap search queries on Blinkit, Swiggy Instamart, Zepto, BigBasket & Zomato</p>

        {/* Custom Search Box */}
        <form onSubmit={handleGenerateCustomLinks} className="mt-3.5 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search any product (e.g. Sattu, Peanut Butter, Oats)..."
            value={customSearch}
            onChange={(e) => setCustomSearch(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search All Apps</span>
          </button>
        </form>

        {/* Custom Generated Results */}
        {customGeneratedLinks && (
          <div className="mt-3 p-3 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-300">Quick Links for "{customSearch}":</span>
              <button 
                onClick={() => setCustomGeneratedLinks(null)}
                className="text-slate-500 hover:text-slate-300 text-[11px]"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <a
                href={customGeneratedLinks.blinkit}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-md bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-semibold flex items-center gap-1"
              >
                <span>Blinkit</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={customGeneratedLinks.swiggy}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-md bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center gap-1"
              >
                <span>Swiggy</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={customGeneratedLinks.zepto}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1"
              >
                <span>Zepto</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={customGeneratedLinks.bigbasket}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
              >
                <span>BigBasket</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
              <a
                href={customGeneratedLinks.zomato}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1"
              >
                <span>Zomato</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* 2. Core Bulking Items Grid */}
      <section className="space-y-3">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
          Core Diet Items & 1-Click Search Links
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((p) => {
            return (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {p.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{p.name}</h4>
                  </div>

                  <div className="text-right">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        defaultValue={p.targetPrice}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePriceUpdate(p.id, e.target.value);
                        }}
                        onBlur={(e) => handlePriceUpdate(p.id, e.target.value)}
                        className="w-16 bg-slate-950 border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-white"
                        autoFocus
                      />
                    ) : (
                      <div 
                        onClick={() => setEditingId(p.id)}
                        className="cursor-pointer group flex items-center gap-1 justify-end"
                        title="Click to update price from your actual receipt"
                      >
                        <span className="text-sm font-bold text-emerald-400">₹{p.targetPrice}</span>
                        <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                    )}
                    <span className="text-[10px] text-slate-500 block">Est. max price</span>
                  </div>
                </div>

                {/* 1-Tap Search Buttons */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    <a
                      href={`https://blinkit.com/s/?q=${encodeURIComponent(p.searchTerms.blinkit)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded-md bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Blinkit</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>

                    <a
                      href={`https://www.swiggy.com/instamart/search?custom_back=true&query=${encodeURIComponent(p.searchTerms.swiggy)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded-md bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Swiggy</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>

                    <a
                      href={`https://www.zeptonow.com/search?q=${encodeURIComponent(p.searchTerms.zepto)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>Zepto</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>

                    <a
                      href={`https://www.bigbasket.com/ps/?q=${encodeURIComponent(p.searchTerms.bigbasket)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-between"
                    >
                      <span>BigBasket</span>
                      <ArrowUpRight className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
