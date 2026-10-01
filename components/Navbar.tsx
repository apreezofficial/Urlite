"use client";

import React, { useState } from "react";
import { Link2, LogOut, User as UserIcon } from "lucide-react";

interface NavbarProps {
  onPasteClick?: () => void;
  onPricingClick?: () => void;
  onLoginClick?: () => void;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export function Navbar({ 
  onPasteClick, 
  onPricingClick, 
  onLoginClick,
  user,
  onLogout 
}: NavbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="w-full max-w-[1240px] mx-auto px-8 pt-7 pb-4 flex items-center justify-between relative z-20">
      {/* Brand Logo - UrLite */}
      <div className="flex items-center">
        <a href="/" className="text-[18px] font-black tracking-tight text-black hover:opacity-85 transition-opacity">
          UrLite
        </a>
      </div>

      {/* Center Navigation Links */}
      <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-slate-700">
        <a href="/" className="hover:text-black transition-colors">
          Home
        </a>
        <a
          href="#pricing"
          onClick={(e) => {
            if (onPricingClick) {
              e.preventDefault();
              onPricingClick();
            }
          }}
          className="hover:text-black transition-colors"
        >
          Pricing
        </a>
        {user && (
          <a href="/dashboard" className="hover:text-black transition-colors">
            Dashboard
          </a>
        )}
      </nav>

      {/* Right Side Actions */}
      <div className="flex items-center gap-5">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-[12px] font-bold text-slate-800 hover:text-black bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-full shadow-xs cursor-pointer transition-all"
            >
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px]">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="text-[13px] font-medium text-slate-700 hover:text-black transition-colors cursor-pointer"
          >
            Log in
          </button>
        )}

        <button
          type="button"
          onClick={onPasteClick}
          className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-black active:scale-[0.98] text-white text-[11px] font-bold tracking-wider px-3.5 py-2 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          <Link2 className="w-3.5 h-3.5 text-slate-300" />
          <span>PASTE URL</span>
        </button>
      </div>
    </header>
  );
}
