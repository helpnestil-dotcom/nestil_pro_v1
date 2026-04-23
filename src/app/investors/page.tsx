
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, Target, Rocket, Mail, Phone, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function InvestorsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,56,87,0.15),transparent_50%)] pointer-events-none"></div>
                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                            Investor Relations
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                            Build the Future of <span className="text-primary">Real Estate</span> with Us.
                        </h1>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                            Nestil is transforming how millions of Indians find their homes. Join us as we scale the most trusted zero-brokerage property ecosystem in India.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-14 px-8" asChild>
                                <Link href="#contact">Get in Touch</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl h-14 px-8" asChild>
                                <Link href="/about">Our Vision</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Metrics */}
            <section className="py-20">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Cities Covered', value: '26+', icon: Target },
                            { label: 'Active Users', value: '500K+', icon: Users },
                            { label: 'Properties Listed', value: '12K+', icon: TrendingUp },
                            { label: 'MoM Growth', value: '35%', icon: Rocket },
                        ].map((stat, i) => ( stat.icon && (
                            <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
                                <CardContent className="p-8 flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                        <stat.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-slate-800 mb-1">{stat.value}</div>
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </CardContent>
                            </Card>
                        )))}
                    </div>
                </div>
            </section>

            {/* Why Invest? */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Invest in Nestil?</h2>
                        <p className="text-slate-600">We are solving the fundamental trust and cost barriers in the Indian property market through technology and transparency.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">1</div>
                            <h3 className="text-xl font-bold text-slate-800">Scalable Business Model</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">A multi-revenue platform combining listings, premium services, and logistical solutions (Shift Home).</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                            <h3 className="text-xl font-bold text-slate-800">Tech-First Approach</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">Automated verification systems and smart matching algorithms ensure the highest lead quality.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
                            <h3 className="text-xl font-bold text-slate-800">Zero Brokerage Disruptor</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">Capturing the massive demand for direct owner-to-tenant transactions in India's growing urban centers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 bg-slate-50">
                <div className="container">
                    <div className="max-w-4xl mx-auto bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-12 text-white bg-primary">
                            <h2 className="text-3xl font-bold mb-6">Let's Talk Business.</h2>
                            <p className="text-white/80 mb-10 leading-relaxed">
                                We're looking for strategic partners who share our vision of redefining real estate in India. Reach out for our pitch deck and financial roadmap.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-white/60">Email Us</div>
                                        <div className="font-bold">investors@nestil.in</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase font-bold text-white/60">Call Directly</div>
                                        <div className="font-bold">+91 94920 60040</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 p-12 bg-white flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Request Pitch Deck</h3>
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Enter your name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Firm / Organization</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Company name" />
                                </div>
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-14 rounded-xl mt-4">
                                    Submit Request
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="py-10 border-t border-slate-200">
                <div className="container text-center">
                    <p className="text-sm text-slate-500">
                        Interested in other partnerships? <Link href="/contact" className="text-primary font-bold hover:underline">Contact Support</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}
