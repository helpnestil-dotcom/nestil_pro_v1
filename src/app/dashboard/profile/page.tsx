import { useUserProfile } from '@/hooks/use-user-profile';
import { useCloudinaryUpload } from '@/hooks/use-cloudinary-upload';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { LoaderCircle, Camera, User, Building2, MapPin, Briefcase } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email(),
  phone: z.string().min(10, "Invalid phone number."),
  imageUrl: z.string().optional(),
  // Professional fields
  company: z.string().optional(),
  experience: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export default function ProfilePage() {
  const { user, profile, isLoading: isProfileLoading } = useUserProfile();
  const { uploadImages, isUploading } = useCloudinaryUpload();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      imageUrl: '',
      company: '',
      experience: '',
      location: '',
      description: '',
    },
  });

  // Sync profile data to form
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || user?.displayName || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        imageUrl: profile.imageUrl || user?.photoURL || '',
        company: (profile as any).company || '',
        experience: (profile as any).experience || '',
        location: (profile as any).location || '',
        description: (profile as any).description || '',
      });
    }
  }, [profile, user, form]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const results = await uploadImages(files);
    
    // Check for errors
    const errorResult = results.find(p => p.error);
    if (errorResult) {
        toast({
            variant: 'destructive',
            title: 'Upload Error',
            description: errorResult.error,
        });
        return;
    }

    if (results.length > 0) {
      form.setValue('imageUrl', results[0].url);
      toast({ title: 'Image Uploaded', description: 'Your new profile photo is ready. Click "Save Changes" to apply.' });
    }
  };

  const handleProfileUpdate = async (values: z.infer<typeof profileSchema>) => {
    if (!user || !firestore) return;
    setIsSaving(true);

    try {
      // Update Auth profile
      if (values.name !== user.displayName || values.imageUrl !== user.photoURL) {
        await updateProfile(user, { 
            displayName: values.name,
            photoURL: values.imageUrl 
        });
      }

      // Update Firestore profile
      const userDocRef = doc(firestore, 'users', user.uid);
      const updateData: any = {
        name: values.name,
        phone: values.phone,
        imageUrl: values.imageUrl,
      };

      // Add professional fields if they exist
      if (values.company) updateData.company = values.company;
      if (values.experience) updateData.experience = values.experience;
      if (values.location) updateData.location = values.location;
      if (values.description) updateData.description = values.description;

      await updateDoc(userDocRef, updateData);

      toast({ title: 'Profile Updated', description: 'Your changes have been saved successfully.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isProfileLoading) {
      return (
          <div className="flex items-center justify-center p-24">
              <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
          </div>
      );
  }

  const isProfessional = profile?.role === 'Agent' || profile?.role === 'Builder';

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-8">
          
          {/* Profile Picture Section */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg">Profile Identity</CardTitle>
              <CardDescription>This image will be shown on your listings and profile.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
                <div className="relative group cursor-pointer" onClick={handleImageClick}>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-100 flex items-center justify-center">
                    {form.watch('imageUrl') ? (
                      <Image 
                        src={form.watch('imageUrl')!} 
                        alt="Profile" 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-slate-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                      <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{profile?.name || 'Your Name'}</h3>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">{profile?.role}</Badge>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleImageClick} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  <p className="text-xs text-muted-foreground">Recommended: Square image, at least 400x400px.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Info */}
          <Card className="border-none shadow-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="E.g. John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input type="tel" placeholder="10-digit number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" disabled {...field} /></FormControl>
                    <FormDescription>Email cannot be changed directly for security.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Professional Details (Conditional) */}
          {(isProfessional || profile?.role === 'Worker') && (
            <Card className="border-none shadow-sm bg-indigo-50/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-indigo-600" />
                    Professional Information
                </CardTitle>
                <CardDescription>These details are shown on your professional profile and listings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Company / Agency Name</FormLabel>
                        <FormControl><Input placeholder="E.g. Nestil Realty" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> Primary Location</FormLabel>
                        <FormControl><Input placeholder="E.g. Hyderabad, TS" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl><Input placeholder="E.g. 5+ Years" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Bio / About Yourself</FormLabel>
                      <FormControl><Textarea placeholder="Describe your expertise and services..." className="min-h-[120px] resize-none" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="ghost" onClick={() => form.reset()}>Discard Changes</Button>
            <Button type="submit" disabled={isSaving || isUploading} className="px-8 font-bold">
              {isSaving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin"/> : null}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
