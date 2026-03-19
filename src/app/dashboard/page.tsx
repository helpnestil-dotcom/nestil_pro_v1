'use client'; 

import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useUser();
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
  
  const isLoading = isLoadingProperties || isLoadingFavorites;

  if (!user) return null;

  return (
    <div>
      <h1 className="text-xl font-bold mb-2">Welcome, {user.displayName || user.email}!</h1>
      <p className="text-muted-foreground mb-8">Here's a summary of your account.</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><List /> My Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-bold">{propertiesCount}</p>
            )}
            <p className="text-xs text-muted-foreground">properties listed</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/dashboard/my-properties">Manage Properties</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart /> Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <p className="text-2xl font-bold">{favoritesCount}</p>
            )}
            <p className="text-xs text-muted-foreground">properties saved</p>
             <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/favorites">View Favorites</Link>
            </Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageSquare /> Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">new messages</p>
             <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/dashboard/visit-requests">Check Inquiries</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <div className="mt-8 text-center">
        <Button asChild size="lg" variant="accent">
          <Link href="/post-property">Post a New Property</Link>
        </Button>
       </div>
    </div>
  );
}
