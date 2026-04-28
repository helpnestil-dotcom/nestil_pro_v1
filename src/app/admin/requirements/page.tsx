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

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (!firestore) return;
    setProcessingId(id);
    try {
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      await updateDoc(doc(firestore, 'property_requirements', id), { status: newStatus });
      toast({ title: `Status changed to ${newStatus}` });
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Demand Feed Moderation</h1>
          <p className="text-muted-foreground mt-1">Review and manage property requirements posted by seekers.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            Property Requirements
          </CardTitle>
          <CardDescription className="ml-11">
            Manage what seekers have posted on the Demand Feed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seeker Details</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirements && requirements.length > 0 ? (
                requirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/20">
                          {req.name ? req.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{req.name}</div>
                          <div className="text-sm text-muted-foreground font-medium">{req.whatsappNumber}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{formatDate(req.createdAt)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="text-primary">{req.purpose}</span>
                        <span className="text-slate-300">•</span>
                        <span>{req.propertyType}</span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1">{req.area}, {req.city}</div>
                      <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                        Budget: ₹{req.budget.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                       <Badge variant="outline" className={req.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2 py-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        disabled={processingId === req.id}
                        onClick={() => toggleStatus(req.id, req.status)}
                        className={`h-8 w-8 ${req.status === 'active' ? 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200' : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`}
                        title={req.status === 'active' ? 'Close Requirement' : 'Activate Requirement'}
                      >
                        {processingId === req.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : (req.status === 'active' ? <XCircle className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />)}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-red-50 hover:text-red-600 hover:border-red-200" disabled={processingId === req.id} title="Delete">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>Permanently delete this requirement post? This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(req.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="h-24 text-center">No requirements posted yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
