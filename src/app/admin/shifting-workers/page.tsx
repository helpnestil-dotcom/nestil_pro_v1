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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-indigo-600" /> Worker Applications
          </h1>
          <p className="text-muted-foreground">Manage incoming requests from people wanting to join the shifting team.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Applications</CardTitle>
          <CardDescription>A list of all Packers, Drivers, and Labourers who have applied.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map(worker => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-muted-foreground">{worker.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="capitalize">{worker.city}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{worker.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{worker.experience?.replace('_to_', '-').replace('_plus', '+ ')}</div>
                  </TableCell>
                  <TableCell>
                     {getStatusBadge(worker.status)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {worker.status === 'pending_verification' && (
                        <>
                            <Button variant="ghost" size="icon" className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleUpdateStatus(worker.id, 'verified')} title="Verify & Accept">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleUpdateStatus(worker.id, 'rejected')} title="Reject Application">
                              <XCircle className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600" onClick={() => handleDelete(worker.id)} title="Delete Application">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {workers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">No worker applications found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
