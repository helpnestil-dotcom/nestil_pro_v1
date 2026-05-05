'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { LoaderCircle, User, Coffee, Cigarette, Utensils, Dog, Calendar, DollarSign, MapPin, Briefcase } from 'lucide-react';

const flatmateSchema = z.object({
  gender: z.enum(['Male', 'Female', 'Other']),
  age: z.coerce.number().min(18).max(100),
  occupation: z.string().min(2, "Occupation is required"),
  budget: z.string().min(1, "Budget range is required"),
  location: z.string().min(2, "Preferred location is required"),
  diet: z.enum(['Veg', 'Non-Veg', 'Vegan']),
  smoking: z.enum(['No', 'Occasionally', 'Yes']),
  drinking: z.enum(['No', 'Occasionally', 'Yes']),
  pets: z.enum(['No', 'Yes']),
  moveInDate: z.string().min(1, "Approx move-in date is required"),
  about: z.string().min(20, "Tell us a bit more about yourself (min 20 chars)"),
  isSearching: z.boolean().default(true),
});

export default function FlatmateProfileForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof flatmateSchema>>({
    resolver: zodResolver(flatmateSchema),
    defaultValues: {
      gender: 'Male',
      age: 25,
      occupation: '',
      budget: '',
      location: '',
      diet: 'Veg',
      smoking: 'No',
      drinking: 'No',
      pets: 'No',
      moveInDate: '',
      about: '',
      isSearching: true,
    },
  });

  useEffect(() => {
    async function loadFlatmateProfile() {
      if (!user || !firestore) return;
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.flatmateProfile) {
            form.reset(data.flatmateProfile);
          }
        }
      } catch (error) {
        console.error("Error loading flatmate profile:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadFlatmateProfile();
  }, [user, firestore, form]);

  const onSubmit = async (values: z.infer<typeof flatmateSchema>) => {
    if (!user || !firestore) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, { flatmateProfile: values }, { merge: true });
      toast({ title: 'Profile Updated!', description: 'Your flatmate matching preferences have been saved.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-none shadow-sm bg-slate-50/50">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Lifestyle & Matching
            </CardTitle>
            <CardDescription>Fill this to find flatmates with similar habits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Age</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-slate-400" /> Occupation</FormLabel>
                    <FormControl><Input placeholder="e.g. Software Engineer" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-400" /> Monthly Budget Range</FormLabel>
                    <FormControl><Input placeholder="e.g. ₹8,000 - ₹12,000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> Preferred Location</FormLabel>
                    <FormControl><Input placeholder="e.g. Bellandur, Bengaluru" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moveInDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Expected Move-in</FormLabel>
                    <FormControl><Input placeholder="e.g. Mid October" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <FormField
                control={form.control}
                name="diet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5" /> Diet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Veg">Veg</SelectItem>
                        <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="smoking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><Cigarette className="w-3.5 h-3.5" /> Smoking</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Occasionally">Occasionally</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="drinking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><Coffee className="w-3.5 h-3.5" /> Drinking</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Occasionally">Occasionally</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5"><Dog className="w-3.5 h-3.5" /> Pets</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Your Lifestyle</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. I work late shifts, keep the place clean, and prefer a quiet environment on weekends." 
                      className="min-h-[100px] resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Mention things that matter to you in a flatmate.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isSearching"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-black text-slate-800">Show in Matching Feed</FormLabel>
                    <FormDescription className="text-[10px]">Your profile will be visible to potential flatmates.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving} className="w-full h-12 font-black shadow-lg shadow-primary/20">
              {isSaving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : null}
              {isSaving ? 'Saving Profile...' : 'Save Lifestyle Preferences'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
