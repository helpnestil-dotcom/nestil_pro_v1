'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Sparkles, Send } from 'lucide-react';
import { locationData as staticLocationData } from '@/lib/locations';
import { motion } from 'framer-motion';
import Link from 'next/link';

const requirementSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  purpose: z.enum(['Rent', 'Buy', 'Sale', 'Lease']),
  budget: z.number().min(1000, 'Budget must be at least ₹1,000'),
  securityDeposit: z.number().optional(),
  moveInDate: z.string().min(1, 'Move in date is required'),
  whatsappNumber: z.string().min(10, 'Valid WhatsApp number required').regex(/^[0-9]+$/, 'Only numbers allowed'),
  description: z.string().optional(),
  furnishing: z.enum(['Furnished', 'Semi-furnished', 'Unfurnished']).optional(),
  parking: z.boolean().default(false),
  tenantType: z.enum(['Family', 'Bachelor', 'Anyone']).default('Anyone'),
});

export default function PostRequirementPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof requirementSchema>>({
    resolver: zodResolver(requirementSchema),
    defaultValues: {
      name: '',
      state: 'Andhra Pradesh',
      city: '',
      area: '',
      propertyType: '',
      purpose: 'Rent',
      budget: 15000,
      moveInDate: '',
      whatsappNumber: '',
      description: '',
      furnishing: undefined,
      parking: false,
      tenantType: 'Anyone',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/post-requirement');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (user && !form.getValues('name')) {
      form.setValue('name', user.displayName || '');
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof requirementSchema>) => {
    if (!user || !firestore) return;

    setIsSubmitting(true);
    try {
      const docData = {
        userId: user.uid,
        name: values.name,
        state: values.state,
        city: values.city,
        area: values.area,
        propertyType: values.propertyType,
        purpose: values.purpose,
        budget: values.budget,
        moveInDate: values.moveInDate,
        whatsappNumber: values.whatsappNumber,
        description: values.description || '',
        preferences: {
          furnishing: values.furnishing,
          parking: values.parking,
          tenantType: values.tenantType,
        },
        ...(values.securityDeposit ? { securityDeposit: values.securityDeposit } : {}),
        status: 'active',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, 'property_requirements'), docData);
      
      toast({
        title: 'Requirement Posted! 🎉',
        description: 'Owners and agents will contact you directly on WhatsApp.',
      });
      
      router.push('/requirements');
    } catch (error) {
      console.error('Error posting requirement:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to post your requirement. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]"><LoaderCircle className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const watchedState = form.watch('state');
  const availableDistricts = staticLocationData.find(s => s.name === watchedState)?.districts || []; 

  return (
    <div className="bg-[#fafbfc] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8 text-center">
            <div className="flex justify-center mb-8">
               <div className="inline-flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
                  <button className="px-6 py-2.5 text-sm font-black rounded-xl bg-white text-primary shadow-sm ring-1 ring-slate-200/50 cursor-default">
                     Looking for Home
                  </button>
                  <Link href="/post-property" className="px-6 py-2.5 text-sm font-bold rounded-xl text-slate-500 hover:text-slate-700 transition-colors">
                     List Your Property
                  </Link>
               </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Post Your Requirement</h1>
            <p className="text-slate-500 font-medium mt-2">Let owners and brokers bring the best properties directly to your WhatsApp.</p>
        </div>

        <Card className="border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 border-b pb-2">What are you looking for?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Purpose</Label>
                        <Select onValueChange={(val) => form.setValue('purpose', val as any)} defaultValue={form.getValues('purpose')}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Rent">Rent</SelectItem>
                                <SelectItem value="Buy">Buy</SelectItem>
                                <SelectItem value="Sale">Sale</SelectItem>
                                <SelectItem value="Lease">Lease</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Property Type</Label>
                        <Select onValueChange={(val) => form.setValue('propertyType', val)}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="e.g., 1 BHK Flat, Office..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1 BHK Flat">1 BHK Flat</SelectItem>
                                <SelectItem value="2 BHK Flat">2 BHK Flat</SelectItem>
                                <SelectItem value="3 BHK Flat">3 BHK Flat</SelectItem>
                                <SelectItem value="Independent House">Independent House</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="PG">PG</SelectItem>
                                <SelectItem value="Co-living">Co-living</SelectItem>
                                <SelectItem value="Flat Sharing">Flat Sharing</SelectItem>
                                <SelectItem value="Commercial Space">Commercial Space</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.formState.errors.propertyType && <p className="text-red-500 text-xs">{form.formState.errors.propertyType.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">State</Label>
                        <Select onValueChange={(val) => { form.setValue('state', val); form.setValue('city', ''); form.setValue('area', ''); }} defaultValue={form.getValues('state')}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                                {staticLocationData.map(s => (
                                    <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.state && <p className="text-red-500 text-xs">{form.formState.errors.state.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">City</Label>
                        <Select onValueChange={(val) => { form.setValue('city', val); form.setValue('area', ''); }} value={form.watch('city')} disabled={!watchedState}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableDistricts.map(d => (
                                    <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.city && <p className="text-red-500 text-xs">{form.formState.errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Preferred Area</Label>
                        <Input {...form.register('area')} placeholder="e.g., Bellandur" className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                        {form.formState.errors.area && <p className="text-red-500 text-xs">{form.formState.errors.area.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Max Budget (₹)</Label>
                        <Input type="number" {...form.register('budget', { valueAsNumber: true })} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                        {form.formState.errors.budget && <p className="text-red-500 text-xs">{form.formState.errors.budget.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Security Deposit (₹)</Label>
                        <Input type="number" {...form.register('securityDeposit', { valueAsNumber: true })} placeholder="Optional" className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Move-in Date</Label>
                        <Input type="date" {...form.register('moveInDate')} className="h-12 rounded-xl bg-slate-50 border-slate-200 uppercase" />
                        {form.formState.errors.moveInDate && <p className="text-red-500 text-xs">{form.formState.errors.moveInDate.message}</p>}
                    </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-black text-slate-900 border-b pb-2">Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Furnishing</Label>
                        <Select onValueChange={(val) => form.setValue('furnishing', val as any)} defaultValue={form.getValues('furnishing')}>
                            <SelectTrigger className="h-[54px] rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Furnished">Furnished</SelectItem>
                                <SelectItem value="Semi-furnished">Semi-furnished</SelectItem>
                                <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                        <Label className="font-bold text-slate-700 cursor-pointer" htmlFor="parking">Needs Parking</Label>
                        <Switch id="parking" checked={form.watch('parking')} onCheckedChange={(val) => form.setValue('parking', val)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Tenant Type</Label>
                        <Select onValueChange={(val) => form.setValue('tenantType', val as 'Family' | 'Bachelor' | 'Anyone')} defaultValue="Anyone">
                            <SelectTrigger className="h-[54px] rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Anyone">Anyone</SelectItem>
                                <SelectItem value="Family">Family</SelectItem>
                                <SelectItem value="Bachelor">Bachelor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-black text-slate-900 border-b pb-2">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">Your Name</Label>
                        <Input {...form.register('name')} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                        {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="font-bold text-slate-700">WhatsApp Number</Label>
                        <div className="flex">
                            <div className="h-12 px-3 flex items-center justify-center bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl font-bold text-slate-500">+91</div>
                            <Input {...form.register('whatsappNumber')} placeholder="9876543210" className="h-12 rounded-r-xl rounded-l-none bg-slate-50 border-slate-200 flex-1" />
                        </div>
                        {form.formState.errors.whatsappNumber && <p className="text-red-500 text-xs">{form.formState.errors.whatsappNumber.message}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Additional Details (Optional)</Label>
                    <Textarea {...form.register('description')} placeholder="Any specific requirements? (e.g., Near IT Park, specific facing, ground floor only)" className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200" />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-xl font-black text-lg bg-slate-900 hover:bg-primary text-white shadow-xl shadow-primary/20 transition-all duration-300">
                {isSubmitting ? <LoaderCircle className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5 mr-2" /> Post Requirement</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
