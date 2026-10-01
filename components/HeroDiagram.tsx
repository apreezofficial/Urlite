"use client";

import React, { useState, useRef } from "react";
import { Link2, Zap, Check, Copy, ExternalLink, QrCode, Sparkles, Share2 } from "lucide-react";
import { LinkItem } from "@/lib/db";
import { QrModal } from "./QrModal";

interface HeroDiagramProps {
  onCreated: (link: LinkItem) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  userEmail?: string;
}

export function HeroDiagram({ onCreated, inputRef, userEmail }: HeroDiagramProps) {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [showSlugInput, setShowSlugInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createdLink, setCreatedLink] = useState<LinkItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const fallbackRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || fallbackRef;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: url.trim(),
          customCode: customSlug.trim() || undefined,
          ownerEmail: userEmail
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to shorten URL");
        setLoading(false);
        return;
      }

      setCreatedLink(data.link);
      onCreated(data.link);
      setUrl("");
      setCustomSlug("");
      setShowSlugInput(false);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFullShortUrl = (code: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/${code}`;
    }
    return `/${code}`;
  };

  const handleCopyLink = () => {
    if (!createdLink) return;
    const full = getFullShortUrl(createdLink.code);
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-[1040px] mx-auto px-4 mt-6">
      {/* SVG Diagram Canvas containing both the Circuit Lines and the Platform Nodes */}
      <div className="relative w-full aspect-[1000/340] max-h-[360px] hidden md:block select-none">
        <svg
          viewBox="0 0 1000 340"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for soft drop shadow */}
          <defs>
            <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.07" />
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.04" />
            </filter>
            <filter id="boxShadow" x="-10%" y="-20%" width="120%" height="150%">
              <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.05" />
            </filter>
          </defs>

          {/* ================= OUTER CIRCUIT LINES ================= */}
          {/* Left Circuit Tracks */}
          {/* Top-Left to YouTube: from (220, 170) curving to (120, 75) */}
          <path
            d="M 220 170 C 180 170, 155 75, 120 75"
            stroke="#cbd5e1"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Mid-Left to Instagram: from (220, 170) straight to (85, 170) */}
          <path
            d="M 220 170 L 85 170"
            stroke="#cbd5e1"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Bottom-Left to Facebook: from (220, 170) curving to (155, 275) */}
          <path
            d="M 220 170 C 190 170, 180 275, 155 275"
            stroke="#cbd5e1"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* Center Circuit Boundary wrapping around the card */}
          {/* Left bracket */}
          <path
            d="M 270 142 C 240 142, 220 152, 220 170 C 220 188, 240 198, 270 198"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Right bracket */}
          <path
            d="M 730 142 C 760 142, 780 152, 780 170 C 780 188, 760 198, 730 198"
            stroke="#e2e8f0"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right Circuit Tracks */}
          {/* Top-Right to Bag/Shopify: from (780, 170) curving to (880, 75) */}
          <path
            d="M 780 170 C 820 170, 845 75, 880 75"
            stroke="#cbd5e1"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Mid-Right to TikTok: from (780, 170) straight to (915, 170) */}
          <path
            d="M 780 170 L 915 170"
            stroke="#cbd5e1"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Bottom-Right to Facebook: from (780, 170) curving to (845, 275) */}
          <path
            d="M 780 170 C 810 170, 820 275, 845 275"
            stroke="#cbd5e1"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* ================= 6 PLATFORM CIRCLE NODES ================= */}

          {/* 1. TOP-LEFT: Web Node at (120, 75) */}
          <g transform="translate(120, 75)">
            <circle r="21" fill="#ffffff" filter="url(#nodeShadow)" stroke="#f1f5f9" strokeWidth="1" />
            <g transform="translate(-9, -9)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" x2="22" y1="12" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </g>
          </g>

          {/* 2. MID-LEFT: Instagram Node at (85, 170) */}
          <g transform="translate(85, 170)">
            <circle r="21" fill="#ffffff" filter="url(#nodeShadow)" stroke="#f1f5f9" strokeWidth="1" />
            <g transform="translate(-9, -9)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </g>
          </g>

          {/* 3. BOTTOM-LEFT: Facebook Node at (155, 275) */}
          <g transform="translate(155, 275)">
            <circle r="21" fill="#ffffff" filter="url(#nodeShadow)" stroke="#f1f5f9" strokeWidth="1" />
            <g transform="translate(-8, -8)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0f172a">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </g>
          </g>

          {/* 4. TOP-RIGHT: Shopify/Store Node at (880, 75) */}
          <g transform="translate(880, 75)">
            <circle r="21" fill="#ffffff" filter="url(#nodeShadow)" stroke="#f1f5f9" strokeWidth="1" />
            <g transform="translate(-9, -9)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </g>
          </g>

          {/* 5. MID-RIGHT: TikTok Node at (915, 170) */}
          <g transform="translate(915, 170)">
            <circle r="21" fill="#ffffff" filter="url(#nodeShadow)" stroke="#f1f5f9" strokeWidth="1" />
            <g transform="translate(-9, -9)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48 6.3 6.3 0 0 0 1.86-4.48V8.71a8.31 8.31 0 0 0 4.91 1.58v-3.6z"/>
              </svg>
            </g>
          </g>

          {/* 6. BOTTOM-RIGHT: Facebook Node at (845, 275) */}
          <g transform="translate(845, 275)">
            <circle r="21" fill="#ffffff" filter="url(#nodeShadow)" stroke="#f1f5f9" strokeWidth="1" />
            <g transform="translate(-8, -8)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0f172a">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </g>
          </g>
        </svg>

        {/* Central HTML Input Card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[490px]">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-[13px] pl-3.5 pr-1.5 py-1.5 border border-[#38bdf8] shadow-[0_4px_24px_rgba(56,189,248,0.12)] transition-all"
          >
            <div className="flex items-center gap-1.5 text-slate-400 select-none shrink-0 pr-1">
              <Link2 className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] font-normal text-slate-400">https:/</span>
            </div>

            <input
              ref={activeInputRef}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="paste any long link or URL..."
              className="w-full bg-transparent text-[13px] text-slate-700 placeholder-slate-400 focus:outline-hidden font-normal px-1"
              required
            />

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0b1329] hover:bg-[#020617] active:scale-[0.98] text-white rounded-[10px] font-medium text-[12px] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
              )}
              <span>Shorten URL</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Input Card */}
      <div className="block md:hidden my-6">
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white rounded-xl p-2 border border-[#38bdf8] shadow-sm"
        >
          <div className="flex items-center gap-1 text-slate-400 pl-1 shrink-0">
            <Link2 className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">https:/</span>
          </div>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="paste any long URL..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden px-1.5"
            required
          />

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="shrink-0 flex items-center gap-1 px-3.5 py-2 bg-[#0b1329] text-white rounded-lg text-xs font-medium cursor-pointer"
          >
            <Zap className="w-3 h-3 text-white fill-white" />
            <span>Shorten</span>
          </button>
        </form>
      </div>

      {/* Subtitle Caption underneath input matching reference */}
      <p className="text-center text-[12px] text-slate-400 font-normal tracking-normal -mt-1 md:-mt-2">
        Works on social bios, Shopify stores, and web links. Instant 307 redirect.
      </p>

      {/* Error Alert */}
      {errorMsg && (
        <div className="max-w-md mx-auto mt-4 p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-center animate-in fade-in">
          {errorMsg}
        </div>
      )}

      {/* Generated Short Link Result Card */}
      {createdLink && (
        <div className="mt-8 max-w-xl mx-auto bg-white rounded-2xl p-5 border border-sky-200/80 shadow-xl shadow-sky-500/5 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Short URL Ready & Saved to JSON
              </span>
            </div>

            <button
              onClick={() => setShowQr(true)}
              className="text-xs font-semibold text-slate-600 hover:text-sky-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="truncate">
              <span className="text-xs font-mono font-bold text-sky-700 select-all">
                {getFullShortUrl(createdLink.code)}
              </span>
              <p className="text-[11px] text-slate-400 truncate mt-0.5" title={createdLink.originalUrl}>
                Target: {createdLink.originalUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1329] hover:bg-black text-white text-xs font-medium rounded-lg transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <a
                href={`/${createdLink.code}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 bg-white border border-slate-200 text-slate-600 hover:text-black rounded-lg transition-colors"
                title="Test redirect"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {createdLink && (
        <QrModal
          isOpen={showQr}
          onClose={() => setShowQr(false)}
          url={getFullShortUrl(createdLink.code)}
          code={createdLink.code}
        />
      )}
    </div>
  );
}
