'use client';

import { useState } from 'react';
import { collection, updateDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoaderCircle, CheckCircle, XCircle, Trash2, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-indigo-600" /> Shifting Requests
          </h1>
          <p className="text-muted-foreground">Manage customer queries for Home Shifting.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Requests</CardTitle>
          <CardDescription>A list of all incoming shifting inquiries.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Vehicle & Workers</TableHead>
                <TableHead>Date & Services</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="font-medium">{request.name}</div>
                    <div className="text-sm text-muted-foreground">{request.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm"><strong>From:</strong> {request.source}</div>
                    <div className="text-sm"><strong>To:</strong> {request.destination}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm capitalize">{request.vehicleType?.replace('_', ' ')}</div>
                    <div className="text-xs text-muted-foreground">Labours: {request.labourCount}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{request.date}</div>
                    <div className="text-xs text-muted-foreground">
                        {request.requiresPacking && 'Packing, '}
                        {request.requiresUnpacking && 'Unpacking'}
                        {!request.requiresPacking && !request.requiresUnpacking && 'Transport Only'}
                    </div>
                  </TableCell>
                  <TableCell>
                     {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {request.status === 'pending' && (
                        <>
                            <Button variant="ghost" size="icon" className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleUpdateStatus(request.id, 'approved')} title="Approve & Quote Sent">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleUpdateStatus(request.id, 'rejected')} title="Reject">
                              <XCircle className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600" onClick={() => handleDelete(request.id)} title="Delete Request">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">No shifting requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
