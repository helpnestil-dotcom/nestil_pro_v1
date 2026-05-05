'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoaderCircle, FileText, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { PropertyRequirement } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminRequirementsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const requirementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'property_requirements'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: requirements, isLoading } = useCollection<PropertyRequirement>(requirementsQuery);

  const formatDate = (dateObj: any) => {
    if (!dateObj) return 'N/A';
    if (typeof dateObj === 'string') return format(new Date(dateObj), 'dd MMM yyyy');
    if (dateObj.seconds) return format(fromUnixTime(dateObj.seconds), 'dd MMM yyyy, hh:mm a');
    return 'N/A';
  };

  const handleDelete = async (id: string) => {
    if (!firestore) return;
    setProcessingId(id);
    try {
      await deleteDoc(doc(firestore, 'property_requirements', id));
      toast({ title: 'Requirement Deleted' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete.' });
    } finally {
      setProcessingId(null);
    }
  };

  const notifyUser = async (userId: string, title: string, body: string, url: string) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, body, url }),
      });
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (!firestore) return;
    setProcessingId(id);
    try {
      let newStatus;
      if (currentStatus === 'pending' || currentStatus === 'closed') {
        newStatus = 'active';
      } else {
        newStatus = 'closed';
      }
      await updateDoc(doc(firestore, 'property_requirements', id), { status: newStatus });

      // Notify the seeker
      const req = requirements?.find(r => r.id === id);
      if (req && req.userId && newStatus === 'active') {
        await notifyUser(
          req.userId,
          "Requirement Activated! 🚀",
          `Your requirement for a ${req.propertyType} in ${req.area} is now live on the Demand Feed.`,
          `/requirements`
        );
      }
      
      toast({ title: `Requirement is now ${newStatus}` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update status.' });
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-xl">
               <FileText className="h-6 w-6 text-primary" /> 
             </div>
             Demand Feed Moderation
          </h1>
          <p className="text-slate-500 font-medium mt-1">Review and manage property requirements posted by seekers.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-white text-slate-900 border-slate-200 font-bold px-4 py-1.5 rounded-xl shadow-sm">
             {requirements?.length || 0} Total Requirements
           </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {requirements && requirements.length > 0 ? (
          requirements.map((req) => (
            <Card key={req.id} className="border-none shadow-xl shadow-slate-200/50 overflow-hidden group hover:scale-[1.01] transition-all duration-300">
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Seeker Info */}
                <div className="p-6 md:w-1/4 bg-slate-50/50">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black border border-primary/20">
                       {req.name ? req.name.charAt(0).toUpperCase() : '?'}
                     </div>
                     <div>
                        <h3 className="font-black text-slate-900 truncate">{req.name}</h3>
                        <p className="text-xs text-slate-500 font-bold">{req.whatsappNumber}</p>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">Status</span>
                        <Badge variant="outline" className={cn(
                          "font-bold text-[10px] px-2 py-0.5 rounded-lg border-0 shadow-sm",
                          req.status === 'active' ? 'bg-emerald-500 text-white' : 
                          req.status === 'pending' ? 'bg-amber-500 text-white' :
                          'bg-slate-400 text-white'
                        )}>
                          {req.status}
                        </Badge>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-bold uppercase tracking-widest">Created</span>
                        <span className="font-bold text-slate-500">{formatDate(req.createdAt)}</span>
                     </div>
                  </div>
                </div>

                {/* Requirement Details */}
                <div className="p-6 flex-1 bg-white">
                   <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-slate-900 text-[10px] font-black uppercase tracking-tighter">
                         {req.purpose}
                      </Badge>
                      <span className="text-slate-300">•</span>
                      <span className="text-sm font-black text-slate-700">{req.propertyType}</span>
                   </div>
                   
                   <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {req.area}, {req.city}
                   </h3>

                   <div className="flex flex-wrap gap-2 mt-4">
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-black">
                         Budget: ₹{req.budget.toLocaleString()}
                      </div>
                      {req.securityDeposit && (
                         <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black">
                            Deposit: ₹{req.securityDeposit.toLocaleString()}
                         </div>
                      )}
                      {req.preferences?.furnishing && req.preferences.furnishing !== 'Unfurnished' && (
                         <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 text-xs font-black">
                            {req.preferences.furnishing}
                         </div>
                      )}
                   </div>
                </div>

                {/* Actions */}
                <div className="p-6 md:w-1/5 bg-slate-50/30 flex flex-col justify-center gap-3">
                   <Button 
                     className={cn(
                       "w-full font-bold rounded-xl h-11 shadow-lg transition-all",
                       req.status === 'active' 
                        ? "bg-amber-500 hover:bg-amber-600 shadow-amber-100" 
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                     )}
                     onClick={() => toggleStatus(req.id, req.status)}
                     disabled={processingId === req.id}
                   >
                     {processingId === req.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : (req.status === 'active' ? <XCircle className="h-4 w-4 mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />)}
                     {req.status === 'active' ? 'Deactivate' : 'Activate'}
                   </Button>

                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="w-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold rounded-xl h-10" disabled={processingId === req.id}>
                           <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                       <AlertDialogHeader>
                         <AlertDialogTitle className="text-xl font-black">Are you absolutely sure?</AlertDialogTitle>
                         <AlertDialogDescription className="font-medium">
                           This will permanently delete the requirement for <span className="text-slate-900 font-bold">{req.name}</span>.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                         <AlertDialogAction onClick={() => handleDelete(req.id)} className="bg-rose-600 hover:bg-rose-700 rounded-xl font-bold">Delete Requirement</AlertDialogAction>
                       </AlertDialogFooter>
                     </AlertDialogContent>
                   </AlertDialog>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center shadow-xl shadow-slate-100 border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No requirements found</h3>
            <p className="text-slate-500 mt-2 font-medium">New property requirements will appear here for review.</p>
          </div>
        )}
      </div>
    </div>
  );
}

