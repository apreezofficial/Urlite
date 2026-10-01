"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { LinkItem } from "@/lib/db";
import { Database, Copy, Trash2, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardApp() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("urllite_user");
    if (saved) {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
      fetchLinks(parsedUser.email);
    } else {
      router.push("/");
    }
  }, [router]);

  const fetchLinks = async (email: string) => {
    setLoadingLinks(true);
    try {
      const res = await fetch(`/api/links?email=${encodeURIComponent(email)}`);
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

  const handleLogout = () => {
    localStorage.removeItem("urllite_user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen forge-sky-bg overflow-x-hidden flex flex-col font-sans">
      <div className="light-rays" />
      
      <Navbar
        onPasteClick={() => router.push("/")}
        onPricingClick={() => router.push("/#pricing")}
        onLoginClick={() => {}}
        user={user}
        onLogout={handleLogout}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 mt-8 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 rounded-full hover:bg-white/50 transition-colors text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Dashboard</h1>
            <button onClick={() => fetchLinks(user.email)} className="text-sm font-bold px-4 py-2 bg-white/60 hover:bg-white text-sky-600 hover:text-sky-700 rounded-xl transition-colors cursor-pointer shadow-sm">Refresh</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 p-6 rounded-3xl shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Total Links</div>
            <div className="text-4xl font-black text-slate-900">{links.length}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 p-6 rounded-3xl shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Total Clicks</div>
            <div className="text-4xl font-black text-slate-900">{links.reduce((acc, link) => acc + (link.clicks || 0), 0)}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 p-6 rounded-3xl shadow-sm">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Storage Engine</div>
            <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-500" />
              JSON File
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 rounded-3xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 flex items-center justify-between bg-white/50">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Your Saved Links</h3>
              <p className="text-sm text-slate-500 mt-1">Managed and persisted locally</p>
            </div>
            <div className="px-3 py-1.5 bg-sky-100 text-sky-700 rounded-full text-sm font-bold">{links.length}</div>
          </div>
          
          {loadingLinks ? (
            <div className="p-12 text-center text-sm text-slate-500 font-medium animate-pulse">Loading your links...</div>
          ) : links.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <p className="text-slate-500 mb-4">You haven't created any links yet.</p>
              <Link href="/" className="px-5 py-2.5 bg-[#0b1329] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer">
                Create a Short Link
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500">
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Short Link</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Original Destination</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Clicks</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {links.map((link) => (
                    <tr key={link.code} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-sky-600">
                        <a href={`/${link.code}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                          /{link.code}
                          <ExternalLink className="w-3 h-3 text-sky-400" />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-[250px] truncate" title={link.originalUrl}>
                        {link.originalUrl}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        <span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{link.clicks || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(link.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              navigator.clipboard.writeText(`${window.location.origin}/${link.code}`);
                              alert("Copied!");
                            }
                          }}
                          className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Copy Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.code)}
                          className="text-rose-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Link"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <footer className="w-full border-t border-slate-200/50 bg-white/40 py-6 mt-auto relative z-10 text-center text-xs text-slate-400">
        <p>© {new Date().getFullYear()} UrLite. All rights reserved.</p>
      </footer>
    </div>
  );
}
