'use client';

import { useState } from 'react';
import { collection, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoaderCircle, CheckCircle, XCircle, Trash2, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';

const formatDateLocal = (date: any) => {
    if (!date) return 'N/A';
    try {
        if (typeof date === 'string') {
            return format(new Date(date), 'dd/MM/yyyy');
        }
        if (date?.seconds) {
            return format(fromUnixTime(date.seconds), 'dd/MM/yyyy');
        }
        return format(new Date(date), 'dd/MM/yyyy');
    } catch (e) {
        return 'N/A';
    }
};

interface ShiftingWorker {
  id: string;
  name: string;
  phone: string;
  city: string;
  role: string;
  experience: string;
  status: string;
  registeredAt: any;
}

export default function AdminShiftingWorkersPage() {
  const { toast } = useToast();
  
  const q = query(collection(db, 'shiftingWorkers'), orderBy('registeredAt', 'desc'));
  const [workersSnap, loading] = useCollection(q);
  const workers = workersSnap?.docs.map(d => ({ id: d.id, ...d.data() } as ShiftingWorker)) || [];

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'shiftingWorkers', id), { status: newStatus });
      toast({ title: `Worker profile marked as ${newStatus}` });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error updating worker status' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this worker application? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'shiftingWorkers', id));
      toast({ title: 'Application Deleted' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error deleting application' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-emerald-500">Verified</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Pending Review</Badge>;
    }
  };

  if (loading) return <div className="flex justify-center p-12"><LoaderCircle className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
               <Briefcase className="h-6 w-6 text-white" /> 
             </div>
             Partner Applications
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage incoming requests from Home Shifting professionals.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-white text-slate-900 border-slate-200 font-bold px-4 py-1.5 rounded-xl shadow-sm">
             {workers.length} Total Applicants
           </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {workers.map(worker => (
          <Card key={worker.id} className="border-none shadow-xl shadow-slate-200/50 overflow-hidden group hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Applicant Info */}
              <div className="p-6 md:w-1/4 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                     {worker.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-black text-slate-900 truncate">{worker.name}</h3>
                      <p className="text-xs text-slate-500 font-bold">{worker.phone}</p>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Status</span>
                      {getStatusBadge(worker.status)}
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Joined</span>
                      <span className="font-black text-slate-700">{formatDateLocal(worker.registeredAt)}</span>
                   </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="p-6 flex-1 bg-white">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Primary Location</p>
                          <p className="text-sm font-bold text-slate-700 capitalize flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                            {worker.city}
                          </p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Applied Role</p>
                          <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 text-[10px] font-black border-indigo-100 uppercase">
                             {worker.role}
                          </Badge>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Experience Level</p>
                          <p className="text-sm font-black text-slate-700">
                             {worker.experience?.replace('_to_', '-').replace('_plus', '+ ')}
                          </p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Verification Status</p>
                          <p className="text-xs font-bold text-slate-500 italic">
                             {worker.status === 'verified' ? 'Profile fully verified.' : 'Application pending background check.'}
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="p-6 md:w-1/5 bg-slate-50/30 flex flex-col justify-center gap-3">
                {worker.status === 'pending_verification' ? (
                    <>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 shadow-lg shadow-emerald-100 transition-all" onClick={() => handleUpdateStatus(worker.id, 'verified')}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Verify
                        </Button>
                        <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl h-11 transition-all" onClick={() => handleUpdateStatus(worker.id, 'rejected')}>
                          <XCircle className="h-4 w-4 mr-2" /> Reject
                        </Button>
                    </>
                ) : (
                    <div className="text-center py-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Decision</p>
                       <p className={cn(
                          "text-sm font-bold capitalize mt-1",
                          worker.status === 'verified' ? 'text-emerald-600' : 'text-rose-600'
                       )}>
                          {worker.status}
                       </p>
                    </div>
                )}
                <Button variant="ghost" className="w-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold rounded-xl h-10 mt-auto" onClick={() => handleDelete(worker.id)}>
                   <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {workers.length === 0 && (
          <div className="bg-white rounded-3xl p-20 text-center shadow-xl shadow-slate-100 border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No applicants yet</h3>
            <p className="text-slate-500 mt-2 font-medium">When people apply as shifting partners, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

