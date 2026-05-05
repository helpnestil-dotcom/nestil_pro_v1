'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ArrowRight, Home, Building2, Users, Target, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  // Form State
  const [officeLocation, setOfficeLocation] = useState('');
  const [budget, setBudget] = useState([8000, 15000]);
  const [accommodationType, setAccommodationType] = useState('Any');
  const [lookingFor, setLookingFor] = useState('Any');
  const [genderPreference, setGenderPreference] = useState('Any');

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-0 md:rounded-[32px] md:shadow-2xl md:border md:border-slate-100 overflow-hidden relative">
        
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 pt-20 flex flex-col items-center text-center space-y-10"
            >
              <h1 className="text-3xl font-black text-primary tracking-tighter">nestil</h1>
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  Find your perfect home in a new city in 48 hours
                </h2>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  For Job Seekers. By Nestil.
                </p>
              </div>
              
              <div className="relative w-full aspect-square max-w-[240px]">
                 <Image src="https://img.icons8.com/illustrations/external-fauzidea-flat-fauzidea/256/external-traveler-holidays-fauzidea-flat-fauzidea.png" fill sizes="100vw" className="object-contain" alt="Welcome" />
              </div>

              <div className="w-full space-y-3">
                <Button 
                    onClick={nextStep}
                    className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 text-sm"
                >
                  I'm New to City
                </Button>
                <Button 
                    variant="outline"
                    onClick={() => router.push('/')}
                    className="w-full h-14 border-slate-200 text-slate-600 font-black rounded-2xl text-sm"
                >
                  I Already Live Here
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: OFFICE LOCATION */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 pt-12 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900">Where is your office located?</h2>
                <p className="text-xs text-slate-400 font-bold">This helps us show you the best areas to live</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  placeholder="Bellandur, Bangalore" 
                  value={officeLocation}
                  onChange={(e) => setOfficeLocation(e.target.value)}
                  className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50/50 focus-visible:ring-primary focus-visible:bg-white transition-all text-base font-bold"
                />
              </div>

              <div className="w-full aspect-[4/3] rounded-3xl bg-slate-100 relative overflow-hidden border border-slate-200 shadow-inner">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <MapPin className="w-10 h-10 text-primary animate-bounce fill-primary/20" />
                        <div className="w-4 h-4 bg-primary/20 rounded-full blur-sm mx-auto -mt-2" />
                    </div>
                 </div>
                 {/* Dummy Map Overlay */}
                 <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.google.com/maps/vt/pb=!1m4!1m3!1i13!2i5945!3i3694!2m3!1e0!2sm!3i636043180!3m17!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m3!1e12!2b1!4b1!45m2!1e0!2i81!50m1!1e2!51m26!1i4111425!2i4111429!2i4111463!4i1!5i1!7i20!8i240!12i12!13i50!17i200!18i15!20i25!22i1!23i1!25i1!26i2!27i1!28i1!48m1!1e1!61m1!1e1!67m1!1e1!102m1!1e1!120m4!2m3!1e1!2e1!3f1!127m1!1e1")' }} />
              </div>

              <Button 
                onClick={nextStep}
                disabled={!officeLocation}
                className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* STEP 3: AREA SUGGESTIONS */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 pt-12 space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900">Best areas near your office</h2>
                <p className="text-xs text-slate-400 font-bold">Based on travel time & rent</p>
              </div>

              <div className="space-y-3">
                {[
                    { name: 'Bellandur', time: '15 min', rent: '₹8K - ₹15K', bestMatch: true },
                    { name: 'Whitefield', time: '25 min', rent: '₹7K - ₹14K' },
                    { name: 'Marathahalli', time: '20 min', rent: '₹7K - ₹15K' },
                    { name: 'Koramangala', time: '30 min', rent: '₹10K - ₹18K' },
                ].map((area) => (
                    <div key={area.name} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-primary transition-all cursor-pointer">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-slate-800">{area.name}</h3>
                                {area.bestMatch && (
                                    <span className="px-2 py-0.5 bg-green-500 text-white text-[9px] font-black uppercase rounded-md">Best Match</span>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {area.time} • {area.rent}
                            </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                ))}
              </div>

              <Button 
                onClick={nextStep}
                className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20"
              >
                See Listings
              </Button>
            </motion.div>
          )}

          {/* STEP 4: PREFERENCES */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 pt-12 space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900">Tell us your preferences</h2>
                <p className="text-xs text-slate-400 font-bold">We'll show you the perfect matches</p>
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Budget</Label>
                    <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-md">
                        ₹{budget[0]} - ₹{budget[1]}
                    </span>
                </div>
                <Slider 
                    value={budget} 
                    min={5000} 
                    max={30000} 
                    step={500} 
                    onValueChange={setBudget} 
                />
              </div>

              {/* Accommodation Type */}
              <div className="space-y-4">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Accommodation Type</Label>
                <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                    {['Any', 'Flat', 'PG/Hostel', 'Room'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setAccommodationType(type)}
                            className={cn(
                                "flex-1 py-2 text-[11px] font-black rounded-xl transition-all",
                                accommodationType === type ? "bg-white text-primary shadow-sm" : "text-slate-500"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
              </div>

              {/* Looking For */}
              <div className="space-y-4">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Looking For</Label>
                <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                    {['Any', 'Single Room', 'Shared Room'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setLookingFor(type)}
                            className={cn(
                                "flex-1 py-2 text-[11px] font-black rounded-xl transition-all",
                                lookingFor === type ? "bg-white text-primary shadow-sm" : "text-slate-500"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-4">
                <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Gender Preference</Label>
                <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
                    {['Any', 'Male', 'Female'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setGenderPreference(type)}
                            className={cn(
                                "flex-1 py-2 text-[11px] font-black rounded-xl transition-all",
                                genderPreference === type ? "bg-white text-primary shadow-sm" : "text-slate-500"
                            )}
                        >
                            {type}
                        </button>
                    ))}
                </div>
              </div>

              <Button 
                onClick={() => router.push('/properties')}
                className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20"
              >
                Show My Matches
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROGRESS INDICATOR */}
        {step > 1 && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[2, 3, 4].map((s) => (
                    <div 
                        key={s} 
                        className={cn(
                            "h-1.5 w-8 rounded-full transition-all",
                            step >= s ? "bg-primary" : "bg-slate-100"
                        )} 
                    />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

// Helper
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
