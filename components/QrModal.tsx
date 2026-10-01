"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, X, ExternalLink, Copy, Check } from "lucide-react";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  code: string;
}

export function QrModal({ isOpen, onClose, url, code }: QrModalProps) {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && url) {
      QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#0f172a",
          light: "#ffffff",
        },
      })
        .then(setDataUrl)
        .catch(console.error);
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `forge-qr-${code}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
          <ExternalLink className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">QR Code for /{code}</h3>
        <p className="text-xs text-slate-500 text-center mb-4 max-w-xs truncate">
          {url}
        </p>

        {dataUrl ? (
          <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-inner mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dataUrl}
              alt={`QR Code for ${url}`}
              className="w-56 h-56 rounded-lg"
            />
          </div>
        ) : (
          <div className="w-56 h-56 flex items-center justify-center bg-slate-50 rounded-xl mb-5">
            <span className="text-sm text-slate-400">Generating QR...</span>
          </div>
        )}

        <div className="flex w-full gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy Link"}
          </button>

          <button
            onClick={handleDownload}
            disabled={!dataUrl}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
