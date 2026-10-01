"use client";

import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "./Navbar";
import { HeroDiagram } from "./HeroDiagram";
import { PricingSection } from "./PricingSection";
import { AuthModal } from "./AuthModal";
import { LinkItem } from "@/lib/db";
import { Link2, AlertCircle, Database, Copy, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function UrlShortenerApp() {
  const [notFoundSlug, setNotFoundSlug] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  // Load saved user session if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem("urllite_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const handleLoginSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    try {
      localStorage.setItem("urllite_user", JSON.stringify(userData));
    } catch {
      // Ignore
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLinks([]);
    try {
      localStorage.removeItem("urllite_user");
    } catch {
      // Ignore
    }
  };

  const fetchLinks = async () => {
    setLoadingLinks(true);
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLinks();
    } else {
      setLinks([]);
    }
  }, [user]);

  const handleDeleteLink = async (code: string) => {
    if (!confirm(`Delete short link /${code}?`)) return;
    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (res.ok) {
        setLinks(links.filter((l) => l.code !== code));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const nf = searchParams.get("not_found");
    if (nf) setNotFoundSlug(nf);
  }, [searchParams]);

  const handlePasteUrlClick = async () => {
    try {
      if (navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && inputRef.current) {
          inputRef.current.value = text;
          inputRef.current.focus();
          inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
          return;
        }
      }
    } catch {
      // Ignore clipboard read denial
    }

    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePricingScroll = () => {
    const el = document.getElementById("pricing");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen forge-sky-bg overflow-x-hidden flex flex-col font-sans">
      {/* Corner light rays atmospheric effect */}
      <div className="light-rays" />

      {/* Top Navbar: UrLite, Home, Pricing, Log in/Profile, PASTE URL */}
      <Navbar
        onPasteClick={handlePasteUrlClick}
        onPricingClick={handlePricingScroll}
        onLoginClick={() => setShowAuthModal(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* 404 Notification Banner if an unknown code was visited */}
      {notFoundSlug && (
        <div className="max-w-md mx-auto px-4 mt-2 relative z-30">
          <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Link <strong>/{notFoundSlug}</strong> was not found. Shorten your link below!</span>
            </div>
            <button onClick={() => setNotFoundSlug(null)} className="text-rose-500 font-bold ml-2 cursor-pointer">✕</button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-start pt-7 sm:pt-9 relative z-10 pb-6">
        {/* Social Proof Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-5 cursor-default">
          <div className="flex -space-x-1.5 overflow-hidden">
            <svg className="inline-block h-5 w-5 rounded-full ring-2 ring-white" viewBox="0 0 32 32">
              <rect width="32" height="32" fill="#fed7aa" />
              <circle cx="16" cy="13" r="6" fill="#ea580c" />
              <path d="M6 28 C6 21, 10 18, 16 18 C22 18, 26 21, 26 28 Z" fill="#9a3412" />
            </svg>
            <svg className="inline-block h-5 w-5 rounded-full ring-2 ring-white" viewBox="0 0 32 32">
              <rect width="32" height="32" fill="#bfdbfe" />
              <circle cx="16" cy="13" r="6" fill="#2563eb" />
              <path d="M6 28 C6 21, 10 18, 16 18 C22 18, 26 21, 26 28 Z" fill="#1e40af" />
            </svg>
            <svg className="inline-block h-5 w-5 rounded-full ring-2 ring-white" viewBox="0 0 32 32">
              <rect width="32" height="32" fill="#fbcfe8" />
              <circle cx="16" cy="13" r="6" fill="#db2777" />
              <path d="M6 28 C6 21, 10 18, 16 18 C22 18, 26 21, 26 28 Z" fill="#9d174d" />
            </svg>
          </div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-slate-800">
            LOVED BY 1M+ UrLite USERS
          </span>
        </div>

        {/* Hero Headline */}
        <div className="text-center px-4 max-w-2xl mx-auto">
          <h1 className="text-[42px] sm:text-[50px] md:text-[54px] font-black text-[#0b1329] tracking-tight leading-[1.08]">
            Paste a long link
            <br />
            Get short URLs
          </h1>

          <p className="mt-4 text-[13px] sm:text-[14px] md:text-[15px] text-[#64748b] max-w-lg mx-auto leading-normal font-normal">
            UrLite reads the link and creates clean, fast short URLs. You pick one.
            <br />
            No bloated redirects. No &ldquo;custom server.&rdquo; Links from a URL.
          </p>
        </div>

        {/* Dual Action Buttons */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {/* PASTE URL Button */}
          <button
            onClick={handlePasteUrlClick}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#0b1329] hover:bg-[#020617] active:scale-[0.98] text-white rounded-[10px] text-[12px] font-bold tracking-wide shadow-[0_12px_24px_-6px_rgba(11,19,41,0.35)] transition-all cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5 text-slate-300" />
            <span className="uppercase text-[11px] font-bold">PASTE URL</span>
          </button>

          {/* Pricing Button */}
          <button
            onClick={handlePricingScroll}
            className="px-5 py-2.5 text-slate-700 hover:text-black bg-white/70 hover:bg-white rounded-[10px] text-[12px] font-medium border border-slate-200/50 shadow-xs transition-colors cursor-pointer"
          >
            <span>Pricing</span>
          </button>
        </div>

        {/* Central Circuit Diagram with 6 Platform Nodes and Input Box */}
        <HeroDiagram
          onCreated={(link: LinkItem) => {
            // Note: Since dashboard is moved to its own page, we don't need to append links here anymore.
            // But we can show a success toast or just let the HeroDiagram show the created link card.
          }}
          inputRef={inputRef}
          userEmail={user?.email}
        />

        {/* Pricing Section with Pro at ₦5,000 and Team at ₦15,000 */}
        <PricingSection
          onSelectPlan={(plan) => {
            if (plan !== "Free" && !user) {
              setShowAuthModal(true);
            } else if (plan !== "Free") {
              alert(`Upgraded to ${plan} Plan! Welcome aboard, ${user?.name}.`);
            }
          }}
        />
      </main>

      {/* Clean Minimalist Footer without the removed technical text */}
      <footer className="w-full border-t border-slate-200/50 bg-white/40 py-6 relative z-10 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} UrLite. All rights reserved.</p>
      </footer>

      {/* Interactive Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
