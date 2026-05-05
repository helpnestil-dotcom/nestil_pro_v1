'use client'; 

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { List, Heart, MessageSquare, ShieldCheck, Truck, BadgeCheck, Building2, Briefcase, Plus, Bell, User, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotificationToggle } from "@/components/notification-toggle";
import { useFavorites } from "@/hooks/use-favorites";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MobileDashboard() {
  const { user, profile, isLoading: isProfileLoading } = useUserProfile();
  const firestore = useFirestore();

  const myPropertiesQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'properties'), where('ownerId', '==', user.uid));
  }, [firestore, user?.uid]);
  const { data: myProperties, isLoading: isLoadingProperties } = useCollection(myPropertiesQuery);
  const propertiesCount = myProperties?.length || 0;

  const { favoriteIds, isLoadingFavorites } = useFavorites();
  const favoritesCount = favoriteIds.size;
  
  const isLoading = isLoadingProperties || isLoadingFavorites || isProfileLoading;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section with Purple Gradient */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 pt-12 pb-14 px-5 relative overflow-hidden rounded-b-[40px] shadow-lg">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">Welcome back,</p>
            <h1 className="text-2xl font-black text-white tracking-tight">{user.displayName || user.email?.split('@')[0]}</h1>
            
            <div className="mt-3 flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                profile?.role === 'Worker' ? "bg-indigo-500/20 text-indigo-200 border border-indigo-400/30" :
                profile?.role === 'Agent' ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30" :
                profile?.role === 'Builder' ? "bg-blue-500/20 text-blue-200 border border-blue-400/30" :
                "bg-white/10 text-white border border-white/20"
              )}>
                {profile?.role === 'Worker' && <Truck className="w-3.5 h-3.5" />}
                {profile?.role === 'Agent' && <ShieldCheck className="w-3.5 h-3.5" />}
                {profile?.role === 'Builder' && <Building2 className="w-3.5 h-3.5" />}
                {(!profile?.role || profile?.role === 'Owner') && <User className="w-3.5 h-3.5" />}
                {profile?.role || 'Property Owner'}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full h-10 w-10">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-4">
        {/* Main Stat Card */}
        {profile?.role === 'Worker' ? (
          <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-indigo-100/50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">Application Status</p>
              <h2 className="text-3xl font-black text-indigo-600">ACTIVE</h2>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-primary/10 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mb-1">
                {profile?.role === 'Builder' ? 'Active Projects' : 'My Properties'}
              </p>
              {isLoading ? (
                <Skeleton className="h-10 w-16 mt-1" />
              ) : (
                <h2 className="text-4xl font-black text-slate-800">{propertiesCount}</h2>
              )}
            </div>
            <Link href="/dashboard/my-properties" className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
               <ChevronRight className="w-6 h-6 text-primary" />
            </Link>
          </div>
        )}

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {profile?.role === 'Worker' ? (
            <>
              <Link href="/dashboard/profile" className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col gap-3 active:bg-slate-50">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center"><Truck className="w-5 h-5 text-emerald-600" /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Area</p>
                  <p className="font-bold text-slate-800 line-clamp-1">{(profile as any).city || 'National'}</p>
                </div>
              </Link>
              <Link href="/dashboard/shifting-jobs" className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col gap-3 active:bg-slate-50">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"><MessageSquare className="w-5 h-5 text-slate-600" /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Job History</p>
                  <p className="font-bold text-slate-800">0</p>
                </div>
              </Link>
            </>
          ) : (
            <>
              {profile?.role === 'Agent' ? (
                <Link href="/dashboard/leads" className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[24px] p-5 shadow-md flex flex-col gap-3 relative overflow-hidden group active:scale-[0.98] transition-transform">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"><BadgeCheck className="w-5 h-5 text-white" /></div>
                  <div className="relative z-10">
                    <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Lead Credits</p>
                    <p className="font-bold text-white text-xl">Unlimited</p>
                  </div>
                </Link>
              ) : (
                <Link href="/favorites" className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col gap-3 active:bg-slate-50">
                  <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center"><Heart className="w-5 h-5 text-pink-500" /></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Favorites</p>
                    {isLoading ? <Skeleton className="h-6 w-8 mt-1" /> : <p className="font-bold text-slate-800 text-xl">{favoritesCount}</p>}
                  </div>
                </Link>
              )}
              
              <Link href="/dashboard/visit-requests" className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col gap-3 active:bg-slate-50">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-500" /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inquiries</p>
                  <p className="font-bold text-slate-800 text-xl">0</p>
                </div>
              </Link>
            </>
          )}
        </div>

        {/* Settings & Notifications */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 mt-6 space-y-4">
          <h3 className="text-[10px] font-black tracking-widest uppercase text-slate-400">System</h3>
          <div className="pt-2 flex items-center justify-between">
             <NotificationToggle />
          </div>
          
          <div className="border-t border-slate-100 pt-4 mt-2">
            <Button 
              variant="outline" 
              className="w-full justify-between h-12 rounded-xl text-slate-600 font-medium bg-slate-50 border-none hover:bg-slate-100"
              onClick={async () => {
                try {
                  const response = await fetch('/api/notifications/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user?.uid,
                      title: "Demo Notification 🔔",
                      body: "Great! Your push notifications are working perfectly on mobile.",
                      url: "/dashboard"
                    }),
                  });
                  const data = await response.json();
                  if (data.success) toast.success("Test notification sent!");
                  else toast.error("Failed to send: " + (data.message || "No registered devices"));
                } catch (e) {
                  toast.error("Error sending test notification");
                }
              }}
            >
              Test Push Notification
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>

      </div>

      {/* Floating Action Button */}
      {profile?.role !== 'Worker' && (
        <div className="fixed bottom-24 right-5 z-50">
          <Link href="/post-property">
            <div className="h-16 w-16 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-xl shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white border-4 border-white">
              <Plus className="w-8 h-8" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
