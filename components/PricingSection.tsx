"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";

interface PricingSectionProps {
  onSelectPlan?: (planName: string) => void;
}

export function PricingSection({ onSelectPlan }: PricingSectionProps) {
  const plans = [
    {
      name: "Free",
      price: "₦0",
      description: "For individuals and quick link sharing.",
      features: [
        "Unlimited short links",
        "Instant 307 redirects",
        "Local file-based JSON storage",
        "QR Code generation & PNG download",
        "Standard click tracking",
      ],
      popular: false,
      buttonText: "Current Plan",
    },
    {
      name: "Pro",
      price: "₦5,000",
      period: "/month",
      description: "For creators, marketers, and power users.",
      features: [
        "Everything in Free",
        "Custom branded slugs",
        "Detailed click analytics & referrers",
        "No expiration on short links",
        "Priority redirect routing",
      ],
      popular: true,
      buttonText: "Get Pro",
    },
    {
      name: "Team",
      price: "₦15,000",
      period: "/month",
      description: "For growing teams and businesses.",
      features: [
        "Everything in Pro",
        "Custom domains (yourbrand.link)",
        "Team access & shared workspace",
        "REST API access with high limits",
        "Dedicated email support",
      ],
      popular: false,
      buttonText: "Get Team",
    },
  ];

  return (
    <section id="pricing" className="w-full max-w-6xl mx-auto px-6 pt-16 pb-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-base text-slate-500">
          Start for free today with instant file-based JSON storage. Upgrade to Pro for ₦5,000/mo or Team for ₦15,000/mo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-3xl p-8 transition-all ${
              plan.popular
                ? "bg-white border-2 border-sky-400 shadow-xl shadow-sky-500/10"
                : "bg-white/80 border border-slate-200/80 shadow-xs hover:shadow-md"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0b1329] text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-sky-400 fill-sky-400" />
                Most Popular
              </span>
            )}

            <h3 className="text-2xl font-black text-slate-900">{plan.name}</h3>
            <p className="text-sm text-slate-500 mt-2 min-h-[40px]">{plan.description}</p>

            <div className="mt-6 mb-8 flex items-baseline">
              <span className="text-5xl font-black text-slate-900">{plan.price}</span>
              {plan.period && (
                <span className="text-sm text-slate-400 font-semibold ml-1.5">
                  {plan.period}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan && onSelectPlan(plan.name)}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                plan.popular
                  ? "bg-[#0b1329] hover:bg-black text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              {plan.buttonText}
            </button>

            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                What&apos;s included
              </p>
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
