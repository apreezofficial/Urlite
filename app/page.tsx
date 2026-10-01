import { Suspense } from "react";
import { UrlShortenerApp } from "@/components/UrlShortenerApp";

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
        </div>
      }
    >
      <UrlShortenerApp />
    </Suspense>
  );
}
