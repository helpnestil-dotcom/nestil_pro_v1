'use client'; 

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, Heart, MessageSquare, ShieldCheck, Truck, BadgeCheck, Building2, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationToggle } from "@/components/notification-toggle";
import { useFavorites } from "@/hooks/use-favorites";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";


export default function DashboardPage() {
  const { user, profile, isLoading: isProfileLoading } = useUserProfile();
  const firestore = useFirestore();

  // Get user's properties count
  const myPropertiesQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'properties'), where('ownerId', '==', user.uid));
  }, [firestore, user?.uid]);
  const { data: myProperties, isLoading: isLoadingProperties } = useCollection(myPropertiesQuery);
  const propertiesCount = myProperties?.length || 0;

  // Get user's favorites count
  const { favoriteIds, isLoadingFavorites } = useFavorites();
  const favoritesCount = favoriteIds.size;
  
  const isLoading = isLoadingProperties || isLoadingFavorites || isProfileLoading;

  if (!user) return null;

  // Custom views for different roles
  if (profile?.role === 'Worker') {
      return (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold italic tracking-tight uppercase">Welcome, {user.displayName || user.email}!</h1>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100"><Truck className="w-3 h-3 mr-1"/> Verified Worker</Badge>
          </div>
          <p className="text-muted-foreground mb-4 text-lg">Partner Dashboard • Shifting Services</p>
          
          <div className="mb-8 max-w-md">
            <NotificationToggle />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-50 to-white overflow-hidden group">
              <div className="h-1 bg-indigo-500 w-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors"><Briefcase /> Application Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-black text-indigo-600">ACTIVE</p>
                <p className="text-xs text-muted-foreground">Verification status: Level 1 Completed</p>
                <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl border-indigo-200">
                  <Link href="/dashboard/application">View Details</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-emerald-50 to-white overflow-hidden group">
               <div className="h-1 bg-emerald-500 w-full"></div>
               <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-emerald-600 transition-colors"><Truck /> Service Area</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-black text-emerald-600">{(profile as any).city || 'National'}</p>
                <p className="text-xs text-muted-foreground">Primary working location</p>
                 <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl border-emerald-200">
                  <Link href="/dashboard/profile">Update City</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-slate-50 to-white overflow-hidden group">
               <div className="h-1 bg-slate-500 w-full"></div>
               <CardHeader>
                <CardTitle className="flex items-center gap-2 group-hover:text-slate-600 transition-colors"><MessageSquare /> Job History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-black text-slate-700">0</p>
                <p className="text-xs text-muted-foreground">Shifting jobs completed</p>
                 <Button asChild variant="outline" size="sm" className="mt-4 rounded-xl">
                  <Link href="/dashboard/shifting-jobs">View Job Board</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.displayName || user.email}!</h1>
        {profile?.role === 'Agent' && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200"><ShieldCheck className="w-3 h-3 mr-1"/> Certified Agent</Badge>}
        {profile?.role === 'Builder' && <Badge className="bg-blue-100 text-blue-700 border-blue-200"><Building2 className="w-3 h-3 mr-1"/> Verified Builder</Badge>}
      </div>
      <p className="text-muted-foreground mb-4">Role: <span className="font-semibold text-slate-900">{profile?.role || 'Owner'}</span> Dashboard Overview</p>
      
      <div className="mb-8 max-w-md">
        <div className="space-y-4">
          <NotificationToggle />
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-primary">Notification Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-white hover:bg-primary hover:text-white transition-all"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/notifications/send', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user?.uid,
                        title: "Demo Notification 🔔",
                        body: "Great! Your push notifications are working perfectly.",
                        url: "/dashboard"
                      }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      toast.success("Test notification sent!");
                    } else {
                      toast.error("Failed to send: " + (data.message || "No registered devices"));
                    }
                  } catch (e) {
                    toast.error("Error sending test notification");
                  }
                }}
              >
                Send Test Notification
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold text-slate-800">
                {profile?.role === 'Builder' ? <Building2 className="h-5 w-5 text-blue-500" /> : <List className="h-5 w-5 text-primary" />} 
                {profile?.role === 'Builder' ? 'My Projects' : 'My Properties'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-3xl font-black text-slate-900">{propertiesCount}</p>
            )}
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">
                {profile?.role === 'Builder' ? 'Active Projects' : 'Properties Listed'}
            </p>
            <Button asChild variant="secondary" size="sm" className="mt-6 w-full rounded-xl font-bold">
              <Link href="/dashboard/my-properties">Manage {profile?.role === 'Builder' ? 'Projects' : 'Listings'}</Link>
            </Button>
          </CardContent>
        </Card>

        {profile?.role === 'Agent' ? (
             <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-emerald-50 to-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bold text-slate-800"><BadgeCheck className="h-5 w-5 text-emerald-500" /> Lead Credits</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-black text-emerald-600">FREE</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">unlimited leads active</p>
                    <Button asChild variant="outline" size="sm" className="mt-6 w-full rounded-xl font-bold border-emerald-200">
                    <Link href="/dashboard/leads">Access Leads</Link>
                    </Button>
                </CardContent>
            </Card>
        ) : (
            <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-bold text-slate-800"><Heart className="h-5 w-5 text-pink-500" /> Favorites</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                    <Skeleton className="h-8 w-12" />
                    ) : (
                    <p className="text-3xl font-black text-slate-900">{favoritesCount}</p>
                    )}
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">Properties Saved</p>
                    <Button asChild variant="secondary" size="sm" className="mt-6 w-full rounded-xl font-bold">
                    <Link href="/favorites">View Favorites</Link>
                    </Button>
                </CardContent>
            </Card>
        )}

         <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-bold text-slate-800"><MessageSquare className="h-5 w-5 text-indigo-500" /> Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900">0</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-1">New Message Inquiries</p>
             <Button asChild variant="secondary" size="sm" className="mt-6 w-full rounded-xl font-bold">
              <Link href="/dashboard/visit-requests">Check History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <div className="mt-12 text-center">
        <Button asChild size="lg" className="rounded-2xl h-14 px-10 font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-gradient-to-r from-primary to-indigo-600 border-none">
          <Link href="/post-property">
            {profile?.role === 'Builder' ? 'Add New Project' : 'Post a New Property'}
          </Link>
        </Button>
       </div>
    </div>
  );
}
