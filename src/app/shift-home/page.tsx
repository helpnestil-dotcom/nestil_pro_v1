'use client';

import { useState } from 'react';
import { Truck, MapPin, Package, Users, Phone, User, CheckCircle2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ShiftHomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-green-100">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Request Received!</h2>
              <p className="text-slate-500">
                Thank you for choosing Nestil Home Shifting. Our packing and moving experts will call you shortly on +91 {formData.phone} to confirm the details.
              </p>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <button onClick={() => setIsSuccess(false)}>Book Another Shift</button>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_40%)] pointer-events-none"></div>
        <div className="container px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 text-indigo-700 text-sm font-semibold mb-6">
            <Truck className="w-4 h-4" /> Trusted Packers & Movers
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-getx font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Stress-Free <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Home Shifting</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Moving to a new city or just down the street? Let our verified professionals handle the heavy lifting, packing, and transportation.
          </p>
          <div className="mt-8 flex justify-center gap-4 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Verified Staff</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Safe Transport</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Best Prices</span>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="container px-4 py-8 max-w-5xl md:-mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-slate-100 rounded-2xl overflow-hidden">
               <div className="bg-indigo-600 p-1"></div>
               <CardHeader className="bg-white pb-4 border-b">
                 <CardTitle className="text-2xl font-bold flex items-center gap-2">
                   Plan Your Move <Truck className="w-6 h-6 text-indigo-500" />
                 </CardTitle>
                 <CardDescription className="text-base">
                   Fill in your shifting details and get an instant callback with quotes.
                 </CardDescription>
               </CardHeader>
               <CardContent className="p-6 sm:p-8 bg-slate-50/50">
                 <form onSubmit={handleSubmit} className="space-y-8">
                   
                   {/* Locations */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2 text-slate-700">
                       <MapPin className="w-5 h-5 text-indigo-500" /> Route Details
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="source" className="font-medium">Moving From (Source) *</Label>
                          <Input 
                            id="source" name="source" placeholder="E.g. Madhapur, Hyderabad" required 
                            value={formData.source} onChange={handleChange}
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination" className="font-medium">Moving To (Destination) *</Label>
                          <Input 
                            id="destination" name="destination" placeholder="E.g. Gachibowli, Hyderabad" required 
                            value={formData.destination} onChange={handleChange}
                            className="bg-white"
                          />
                        </div>
                     </div>
                   </div>

                   {/* Logistics */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2 text-slate-700">
                       <Truck className="w-5 h-5 text-indigo-500" /> Shifting Requirements
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date" className="font-medium">Preferred Moving Date *</Label>
                          <Input 
                            type="date" id="date" name="date" required 
                            value={formData.date} onChange={handleChange}
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="vehicleType" className="font-medium">Type of Vehicle Needed *</Label>
                          <Select required onValueChange={(val) => handleSelectChange('vehicleType', val)}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Vehicle" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tata_ace">Tata Ace / Mini Truck (1 BHK)</SelectItem>
                              <SelectItem value="pickup_truck">Pickup Truck / Bolero</SelectItem>
                              <SelectItem value="medium_truck">Medium Truck (14ft) (2 BHK)</SelectItem>
                              <SelectItem value="large_truck">Large Truck (17ft+) (3+ BHK)</SelectItem>
                              <SelectItem value="not_sure">Not Sure - Need Guidance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="labourCount" className="font-medium">Number of Labourers Required *</Label>
                          <Select required onValueChange={(val) => handleSelectChange('labourCount', val)}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Labours" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">0 - Only Transport Required</SelectItem>
                              <SelectItem value="1">1 Person (For small items)</SelectItem>
                              <SelectItem value="2">2 Persons (Standard 1 BHK)</SelectItem>
                              <SelectItem value="3">3 Persons (Standard 2 BHK)</SelectItem>
                              <SelectItem value="4_plus">4+ Persons (Large Moves)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                     </div>
                   </div>

                   {/* Services */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2 text-slate-700">
                       <Package className="w-5 h-5 text-indigo-500" /> Additional Services
                     </h3>
                     <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Packing Materials & Service</Label>
                            <p className="text-sm text-slate-500">We will bring boxes, bubble wrap, and pack your items safely.</p>
                          </div>
                          <Switch 
                            checked={formData.requiresPacking} 
                            onCheckedChange={(checked) => handleSwitchChange('requiresPacking', checked)} 
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
                          <div className="space-y-0.5">
                            <Label className="text-base">Unpacking & Placement</Label>
                            <p className="text-sm text-slate-500">We will unpack boxes and place furniture in your new home.</p>
                          </div>
                          <Switch 
                            checked={formData.requiresUnpacking} 
                            onCheckedChange={(checked) => handleSwitchChange('requiresUnpacking', checked)} 
                          />
                        </div>
                     </div>
                   </div>

                   {/* Contact */}
                   <div className="space-y-4">
                     <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2 text-slate-700">
                       <User className="w-5 h-5 text-indigo-500" /> Your Contact Details
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-medium">Full Name *</Label>
                          <Input 
                            id="name" name="name" placeholder="John Doe" required 
                            value={formData.name} onChange={handleChange}
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="font-medium">Phone Number *</Label>
                          <Input 
                            id="phone" name="phone" type="tel" placeholder="10-digit number" required 
                            value={formData.phone} onChange={handleChange}
                            className="bg-white"
                            pattern="[0-9]{10}"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                           <Label htmlFor="details" className="font-medium">Any specific details? (Optional)</Label>
                           <Textarea 
                             id="details" name="details" 
                             placeholder="E.g. Shifting from 3rd floor without lift, heavy fridge included..."
                             value={formData.details} onChange={handleChange}
                             className="bg-white resize-none"
                             rows={3}
                           />
                        </div>
                     </div>
                   </div>

                   <Button type="submit" disabled={isSubmitting} size="lg" className="w-full text-lg font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 h-14 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                     {isSubmitting ? 'Submitting Request...' : 'Get Quotes Now'}
                   </Button>

                 </form>
               </CardContent>
            </Card>
          </div>

          {/* Sidebar CTA */}
          <div className="space-y-6">
              <Card className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg border-0 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                  <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2 text-white">
                          <Users className="w-5 h-5" /> Join Our Team
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <p className="text-indigo-100 text-sm">
                          Are you a professional packer, driver, or labourer looking for work? Register with Nestil to get daily verified shifting leads in your city.
                      </p>
                      <div className="flex flex-col gap-3">
                        <Button asChild variant="secondary" className="w-full font-bold">
                            <Link href="/shift-home/register-worker">Register as Worker</Link>
                        </Button>
                        <Link href="/shift-home/login" className="text-xs text-center text-indigo-200 hover:text-white underline underline-offset-4 cursor-pointer">
                            Already a partner? Login to Partner Portal
                        </Link>
                      </div>
                  </CardContent>
              </Card>

              <Card className="bg-white border-slate-100 shadow-sm">
                  <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                          <Phone className="w-5 h-5 text-emerald-500" /> Need Help?
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-slate-500 mb-4">
                          Have questions about our shifting process? Call our support team directly.
                      </p>
                      <a href="tel:+919492060040" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 border-emerald-500 text-emerald-600 font-bold hover:bg-emerald-50 transition-colors">
                          +91 94920 60040
                      </a>
                  </CardContent>
              </Card>
          </div>

        </div>
      </section>
    </div>
  );
}
