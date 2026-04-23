'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoaderCircle, MessageSquare, Trash2 } from 'lucide-react';
import { format, fromUnixTime } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Mail as MailIcon, Briefcase } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  sentAt: { seconds: number; nanoseconds: number } | null;
  isRead: boolean;
};

type InvestorRequest = {
  id: string;
  name: string;
  email: string;
  organization: string;
  message: string;
  createdAt: { seconds: number; nanoseconds: number } | null;
  status: string;
};

  const { data: messages, isLoading: isMessagesLoading } = useCollection<ContactMessage>(messagesQuery);

  const investorQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'investor_requests'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: investorRequests, isLoading: isInvestorsLoading } = useCollection<InvestorRequest>(investorQuery);

  const formatDate = (dateObj: { seconds: number } | null) => {
    if (!dateObj) return 'N/A';
    return format(fromUnixTime(dateObj.seconds), 'dd MMM yyyy, hh:mm a');
  };

  const handleDeleteMessage = async (id: string) => {
    if (!firestore) return;
    setProcessingId(id);
    try {
      await deleteDoc(doc(firestore, 'contactMessages', id));
      toast({ title: 'Message Deleted' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the message.' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteInvestor = async (id: string) => {
    if (!firestore) return;
    setProcessingId(id);
    try {
      await deleteDoc(doc(firestore, 'investor_requests', id));
      toast({ title: 'Investor Request Deleted' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the request.' });
    } finally {
      setProcessingId(null);
    }
  };

  if (isMessagesLoading || isInvestorsLoading) {
    return <div className="flex justify-center items-center h-64"><LoaderCircle className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Messages & Inquiries</h1>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <MailIcon className="h-4 w-4" /> Contact
          </TabsTrigger>
          <TabsTrigger value="investor" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Investors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare /> Contact Messages
              </CardTitle>
              <CardDescription>
                Messages submitted through the general contact form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">From</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-[180px]">Received</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages && messages.length > 0 ? (
                    messages.map((msg) => (
                      <TableRow key={msg.id}>
                        <TableCell>
                          <div className="font-medium">{msg.name}</div>
                          <div className="text-sm text-muted-foreground">{msg.email}</div>
                        </TableCell>
                        <TableCell className="whitespace-pre-wrap">{msg.message}</TableCell>
                        <TableCell>{formatDate(msg.sentAt)}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" disabled={processingId === msg.id}>
                                {processingId === msg.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>Permanently delete this message?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMessage(msg.id)} className="bg-destructive">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">No messages yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" /> Investor Inquiries
              </CardTitle>
              <CardDescription>
                Professionals interested in investing or partnering with Nestil.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Investor Details</TableHead>
                    <TableHead>Inquiry Message</TableHead>
                    <TableHead className="w-[180px]">Submitted</TableHead>
                    <TableHead className="text-right w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investorRequests && investorRequests.length > 0 ? (
                    investorRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <div className="font-bold text-slate-900">{req.name}</div>
                          <div className="flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-tight mt-0.5">
                            <Briefcase className="h-3 w-3" /> {req.organization}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{req.email}</div>
                        </TableCell>
                        <TableCell className="whitespace-pre-wrap text-sm italic text-slate-600">
                          {req.message || "Requested pitch deck (No specific message)"}
                        </TableCell>
                        <TableCell>{formatDate(req.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Button variant="ghost" size="icon" disabled={processingId === req.id}>
                                {processingId === req.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Request?</AlertDialogTitle>
                                <AlertDialogDescription>Permanently remove this investor inquiry?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteInvestor(req.id)} className="bg-destructive">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="h-24 text-center">No investor requests yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
