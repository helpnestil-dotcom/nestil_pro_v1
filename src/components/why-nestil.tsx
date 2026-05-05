'use client';

import { CheckCircle2, MessageCircle, Truck, ShieldCheck } from 'lucide-react';

export function WhyNestil() {
  const reasons = [
    { icon: CheckCircle2, label: 'Verified Listings', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { icon: MessageCircle, label: 'Direct Chat No Brokers', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { icon: Truck, label: 'Fast Move-in', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { icon: ShieldCheck, label: 'Safe & Trusted', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  return (
    <div className="px-5 space-y-6 pb-24">
      <h2 className="text-base font-bold text-slate-900">Why choose Nestil?</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {reasons.map((reason) => (
          <div key={reason.label} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 bg-white">
            <div className={`p-2 rounded-xl ${reason.bgColor} ${reason.color}`}>
              <reason.icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 leading-tight">
              {reason.label}
            </span>
          </div>
        ))}
      </div>

      <button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
        <span className="text-xl">+</span>
        Post Property FREE
        <span className="text-[10px] opacity-80 font-bold block mt-1 ml-1">List your property and connect with genuine tenants</span>
      </button>
    </div>
  );
}
