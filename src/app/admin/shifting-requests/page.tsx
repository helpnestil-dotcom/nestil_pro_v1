'use client';

import { useState } from 'react';
import { collection, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoaderCircle, CheckCircle, XCircle, Trash2, Truck, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ShiftingRequest {
  id: string;
  source: string;
  destination: string;
  date: string;
  vehicleType: string;
  labourCount: string;
  requiresPacking: boolean;
  requiresUnpacking: boolean;
  name: string;
  phone: string;
  details: string;
  status: string;
  createdAt: any;
}

export default function AdminShiftingRequestsPage() {
  const { toast } = useToast();
  
  // Create a query that orders by createdAt descending
  const q = query(collection(db, 'homeShiftingRequests'), orderBy('createdAt', 'desc'));
  const [requestsSnap, loading] = useCollection(q);
  const requests = requestsSnap?.docs.map(d => ({ id: d.id, ...d.data() } as ShiftingRequest)) || [];

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'homeShiftingRequests', id), { status: newStatus });
      toast({ title: `Request marked as ${newStatus}` });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error updating status' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this request? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, 'homeShiftingRequests', id));
      toast({ title: 'Request Deleted' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error deleting request' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
    }
  };

  if (loading) return <div className="flex justify-center p-12"><LoaderCircle className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
               <Truck className="h-6 w-6 text-white" /> 
             </div>
             Shifting Requests
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage customer queries for Home Shifting services.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="bg-white text-slate-900 border-slate-200 font-bold px-4 py-1.5 rounded-xl shadow-sm">
             {requests.length} Total Requests
           </Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {requests.map(request => (
          <Card key={request.id} className="border-none shadow-xl shadow-slate-200/50 overflow-hidden group hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Customer Info */}
              <div className="p-6 md:w-1/4 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                     {request.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="font-black text-slate-900 truncate">{request.name}</h3>
                      <p className="text-xs text-slate-500 font-bold">{request.phone}</p>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Status</span>
                      {getStatusBadge(request.status)}
                   </div>
                   <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Vehicle</span>
                      <span className="font-black text-slate-700 capitalize">{request.vehicleType?.replace(/_/g, ' ')}</span>
                   </div>
                </div>
              </div>

              {/* Route & Details */}
              <div className="p-6 flex-1 bg-white relative">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-3">
                       <div className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Pick Up</p>
                          <p className="text-sm font-bold text-slate-700">{request.source}</p>
                       </div>
                       <div className="relative pl-6">
                          <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-rose-500" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Destination</p>
                          <p className="text-sm font-bold text-slate-700">{request.destination}</p>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date & Workers</p>
                          <p className="text-sm font-bold text-slate-700">{request.date} • {request.labourCount} Labours</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Additional Services</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                             {request.requiresPacking && <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[10px] border-blue-100">Packing</Badge>}
                             {request.requiresUnpacking && <Badge variant="secondary" className="bg-violet-50 text-violet-600 text-[10px] border-violet-100">Unpacking</Badge>}
                             {!request.requiresPacking && !request.requiresUnpacking && <Badge variant="outline" className="text-[10px]">Basic Transport</Badge>}
                          </div>
                       </div>
                    </div>
                 </div>

                 {request.details && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Customer Details</p>
                       <p className="text-sm text-slate-600 font-medium italic">"{request.details}"</p>
                    </div>
                 )}
              </div>

              {/* Actions */}
              <div className="p-6 md:w-1/5 bg-slate-50/30 flex flex-col justify-center gap-3">
                {request.status === 'pending' ? (
                    <>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 shadow-lg shadow-emerald-100 transition-all" onClick={() => handleUpdateStatus(request.id, 'approved')}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Approve
                        </Button>
                        <Button variant="outline" className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 font-bold rounded-xl h-11 transition-all" onClick={() => handleUpdateStatus(request.id, 'rejected')}>
                          <XCircle className="h-4 w-4 mr-2" /> Reject
                        </Button>
                    </>
                ) : (
                    <div className="text-center py-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Action</p>
                       <p className="text-sm font-bold text-slate-700 capitalize mt-1">{request.status}</p>
                    </div>
                )}
                <Button variant="ghost" className="w-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 font-bold rounded-xl h-10 mt-auto" onClick={() => handleDelete(request.id)}>
                   <Trash2 className="h-4 w-4 mr-2" /> Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {requests.length === 0 && (
          <div className="bg-white rounded-3xl p-20 text-center shadow-xl shadow-slate-100 border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No requests yet</h3>
            <p className="text-slate-500 mt-2 font-medium">When customers inquire about shifting, they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

