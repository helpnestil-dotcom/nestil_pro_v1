'use client';

import { MobileListingHeader } from '@/components/mobile-listing-header';
import { Map, Calculator, ClipboardList, Truck, Building2, Search, ArrowRight, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function AssistantPage() {
  const tools = [
    { title: 'Area Guide', description: 'Best areas, rent range, travel time', icon: Map, color: 'text-indigo-600', bgColor: 'bg-indigo-50', href: '/assistant/area-guide' },
    { title: 'Budget Planner', description: 'Plan your budget smartly', icon: Calculator, color: 'text-purple-600', bgColor: 'bg-purple-50', href: '/assistant/budget' },
    { title: 'Moving Checklist', description: 'Everything you need for a smooth move', icon: ClipboardList, color: 'text-emerald-600', bgColor: 'bg-emerald-50', href: '/assistant/checklist' },
    { title: 'Helpful Services', description: 'Packers, Furniture, Internet & more', icon: Truck, color: 'text-orange-600', bgColor: 'bg-orange-50', href: '/assistant/services' },
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="md:hidden">
        <header className="px-5 pt-8 pb-6 bg-slate-50 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-black text-slate-900">New to Bangalore?</h1>
                <Button variant="ghost" size="icon" className="rounded-full bg-white">
                    <Info className="w-5 h-5 text-slate-400" />
                </Button>
            </div>
            <p className="text-sm text-slate-500 font-medium">Let us help you settle in faster, simpler & more reliably.</p>
        </header>

        <div className="px-5 py-8 space-y-8">
            {/* Main Tools Grid */}
            <div className="grid grid-cols-1 gap-4">
                {tools.map((tool) => (
                    <Link key={tool.title} href={tool.href}>
                        <Card className="border-slate-100 shadow-sm hover:border-primary transition-all active:scale-[0.98]">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${tool.bgColor} ${tool.color}`}>
                                        <tool.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="font-black text-slate-800 text-[15px]">{tool.title}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{tool.description}</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Featured Advice Section */}
            <div className="space-y-4">
                <h2 className="text-base font-black text-slate-900">Settling-in Guide</h2>
                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 space-y-4">
                    <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-primary fill-primary" />
                        <h3 className="font-black text-slate-800">Quick Tips for Newcomers</h3>
                    </div>
                    <ul className="space-y-3">
                        {[
                            'Choose an area near your office to save on travel.',
                            'Verify the owner and property before making any payments.',
                            'Check for basic amenities like water, power & parking.',
                            'Ask about maintenance and other hidden costs up front.'
                        ].map((tip, i) => (
                            <li key={i} className="flex gap-3 text-xs text-slate-600 font-medium leading-relaxed">
                                <span className="text-primary font-black">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Services Banner */}
            <div className="bg-slate-900 rounded-3xl p-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-white font-black text-lg">Professional Packers & Movers</h3>
                        <p className="text-slate-400 text-xs font-bold">Trusted shifting starting from ₹2,500</p>
                    </div>
                    <Button className="bg-white text-slate-900 font-black px-6 h-10 rounded-xl text-xs">
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-slate-900">City Assistant Coming Soon to Desktop</h1>
          <p className="text-slate-500">Please visit this page on your mobile device for the full assistant experience.</p>
        </div>
      </div>
    </div>
  );
}
