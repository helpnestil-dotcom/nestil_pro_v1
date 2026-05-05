'use client';

import { useState } from 'react';
import { Truck, MapPin, Package, Users, Phone, User, CheckCircle2, Home, Calendar, ChevronRight, Shield, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import Link from 'next/link';
import { sendAdminNotification } from '@/lib/email';

export default function ShiftHomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    date: '',
    vehicleType: '',
    labourCount: '',
    requiresPacking: false,
    requiresUnpacking: false,
    name: '',
    phone: '',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'homeShiftingRequests'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      try {
        await sendAdminNotification({
          type: 'Home Shifting Request',
          userName: formData.name,
          userPhone: formData.phone,
          location: `From: ${formData.source} To: ${formData.destination}`,
          details: `Vehicle: ${formData.vehicleType}, Labours: ${formData.labourCount}, Packing: ${formData.requiresPacking}, Unpacking: ${formData.requiresUnpacking}, Details: ${formData.details}`,
        });
      } catch (emailError) {
        console.error('Email notification failed but request was saved:', emailError);
      }

      setIsSuccess(true);
      toast.success('Request submitted successfully! Our team will contact you soon.');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-5 pb-24">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-800">Request Received!</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Thank you for choosing Nestil Home Shifting. Our packing and moving experts will call you shortly on <span className="font-bold text-slate-700">+91 {formData.phone}</span> to confirm the details.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Button asChild className="w-full h-12 rounded-2xl bg-primary font-bold text-sm">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-2xl font-bold text-sm" onClick={() => { setIsSuccess(false); setStep(1); }}>
              Book Another Shift
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Mobile Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-5 pt-14 pb-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold tracking-wide">
            <Truck className="w-3.5 h-3.5" /> TRUSTED PACKERS & MOVERS
          </div>
          <h1 className="text-[28px] font-black leading-tight tracking-tight">
            Stress-Free<br />Home Shifting
          </h1>
          <p className="text-white/70 text-sm font-medium leading-relaxed">
            Let our verified professionals handle the heavy lifting, packing, and transportation.
          </p>

          {/* Trust Badges */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80">
              <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-green-300" />
              </div>
              Verified
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80">
              <div className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center">
                <Shield className="w-3 h-3 text-blue-300" />
              </div>
              Insured
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/80">
              <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center">
                <Star className="w-3 h-3 text-amber-300" />
              </div>
              4.8★
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${step >= s ? 'bg-primary' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-[10px] font-bold ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>Route</span>
          <span className={`text-[10px] font-bold ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>Details</span>
          <span className={`text-[10px] font-bold ${step >= 3 ? 'text-primary' : 'text-slate-400'}`}>Contact</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 pt-2 space-y-6">

        {/* Step 1: Route */}
        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-right-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Route Details</h3>
                <p className="text-[11px] text-slate-400 font-medium">Where are you moving?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source" className="text-xs font-bold text-slate-600">Moving From *</Label>
                <Input
                  id="source" name="source" placeholder="E.g. Madhapur, Hyderabad" required
                  value={formData.source} onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium placeholder:text-slate-300"
                />
              </div>

              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-primary rotate-90" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination" className="text-xs font-bold text-slate-600">Moving To *</Label>
                <Input
                  id="destination" name="destination" placeholder="E.g. Gachibowli, Hyderabad" required
                  value={formData.destination} onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs font-bold text-slate-600">Preferred Date *</Label>
                <Input
                  type="date" id="date" name="date" required
                  value={formData.date} onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium"
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!formData.source || !formData.destination || !formData.date}
              className="w-full h-12 rounded-2xl bg-primary font-bold text-sm shadow-lg shadow-primary/20"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2: Shifting Requirements */}
        {step === 2 && (
          <div className="space-y-5 animate-in slide-in-from-right-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Shifting Details</h3>
                <p className="text-[11px] text-slate-400 font-medium">What do you need?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600">Vehicle Type *</Label>
                <Select required onValueChange={(val) => handleSelectChange('vehicleType', val)}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium">
                    <SelectValue placeholder="Select Vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tata_ace">Tata Ace / Mini Truck (1 BHK)</SelectItem>
                    <SelectItem value="pickup_truck">Pickup Truck / Bolero</SelectItem>
                    <SelectItem value="medium_truck">Medium Truck 14ft (2 BHK)</SelectItem>
                    <SelectItem value="large_truck">Large Truck 17ft+ (3+ BHK)</SelectItem>
                    <SelectItem value="not_sure">Not Sure - Need Guidance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600">Labourers Required *</Label>
                <Select required onValueChange={(val) => handleSelectChange('labourCount', val)}>
                  <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium">
                    <SelectValue placeholder="Select Labours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">0 - Only Transport</SelectItem>
                    <SelectItem value="1">1 Person (Small items)</SelectItem>
                    <SelectItem value="2">2 Persons (Standard 1 BHK)</SelectItem>
                    <SelectItem value="3">3 Persons (Standard 2 BHK)</SelectItem>
                    <SelectItem value="4_plus">4+ Persons (Large Moves)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Packing Services */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-4 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Package className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Packing Service</p>
                      <p className="text-[10px] text-slate-400">Boxes, bubble wrap & safe packing</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.requiresPacking}
                    onCheckedChange={(checked) => handleSwitchChange('requiresPacking', checked)}
                  />
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <Home className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Unpacking & Placement</p>
                      <p className="text-[10px] text-slate-400">Unpack and arrange at new home</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.requiresUnpacking}
                    onCheckedChange={(checked) => handleSwitchChange('requiresUnpacking', checked)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-2xl font-bold text-sm">
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.vehicleType || !formData.labourCount}
                className="flex-1 h-12 rounded-2xl bg-primary font-bold text-sm shadow-lg shadow-primary/20"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <div className="space-y-5 animate-in slide-in-from-right-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                <User className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Contact Details</h3>
                <p className="text-[11px] text-slate-400 font-medium">How can we reach you?</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold text-slate-600">Full Name *</Label>
                <Input
                  id="name" name="name" placeholder="Your full name" required
                  value={formData.name} onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold text-slate-600">Phone Number *</Label>
                <Input
                  id="phone" name="phone" type="tel" placeholder="10-digit number" required
                  value={formData.phone} onChange={handleChange}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 text-sm font-medium placeholder:text-slate-300"
                  pattern="[0-9]{10}"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details" className="text-xs font-bold text-slate-600">Additional Notes (Optional)</Label>
                <Textarea
                  id="details" name="details"
                  placeholder="E.g. Shifting from 3rd floor without lift, heavy fridge..."
                  value={formData.details} onChange={handleChange}
                  className="rounded-xl bg-slate-50 border-slate-200 text-sm font-medium placeholder:text-slate-300 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-2xl font-bold text-sm">
                Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.phone}
                className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-sm shadow-lg shadow-violet-200"
              >
                {isSubmitting ? 'Submitting...' : 'Get Quotes'}
              </Button>
            </div>
          </div>
        )}
      </form>

      {/* Bottom Cards */}
      <div className="px-5 pt-8 space-y-4">
        {/* Join Team Card */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full -mr-14 -mt-14" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <h3 className="text-base font-black">Join Our Team</h3>
            </div>
            <p className="text-violet-200 text-xs leading-relaxed">
              Are you a professional packer, driver, or labourer? Register with Nestil to get daily verified shifting leads.
            </p>
            <Button asChild variant="secondary" size="sm" className="rounded-xl font-bold text-xs h-10 w-full">
              <Link href="/shift-home/register-worker">Register as Worker</Link>
            </Button>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Need Help?</h3>
                <p className="text-[10px] text-slate-400 font-medium">Call our support team</p>
              </div>
            </div>
            <a href="tel:+919492060040" className="px-4 py-2 rounded-xl border-2 border-green-500 text-green-600 text-xs font-bold hover:bg-green-50 transition-colors">
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
