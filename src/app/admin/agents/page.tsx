'use client';

import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useToast } from '@/hooks/use-toast';
import { AgentData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, LoaderCircle } from 'lucide-react';

export default function AdminAgentsPage() {
  const { toast } = useToast();
  const [agentsSnap, loading] = useCollection(collection(db, 'agents'));
  const agents = agentsSnap?.docs.map(d => ({ id: d.id, ...d.data() } as AgentData)) || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    experienceYears: '',
    imageUrl: '',
    description: '',
    location: '',
  });

  const handleOpenDialog = (agent?: AgentData) => {
    if (agent) {
      setEditingId(agent.id);
      setFormData({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        company: agent.company || '',
        experienceYears: agent.experienceYears?.toString() || '',
        imageUrl: agent.imageUrl || '',
        description: agent.description || '',
        location: agent.location || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', email: '', phone: '', company: '', experienceYears: '', imageUrl: '', description: '', location: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : 0,
        imageUrl: formData.imageUrl,
        description: formData.description,
        location: formData.location,
        isVerified: true,
        ...(editingId ? {} : { createdAt: new Date().toISOString() })
      };

      if (editingId) {
        await updateDoc(doc(db, 'agents', editingId), data);
        toast({ title: 'Agent Updated' });
      } else {
        await addDoc(collection(db, 'agents'), data);
        toast({ title: 'Agent Added' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error saving agent' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this agent?")) return;
    try {
      await deleteDoc(doc(db, 'agents', id));
      toast({ title: 'Agent Deleted' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error deleting agent' });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><LoaderCircle className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Agents</h1>
          <p className="text-muted-foreground">Add and edit agent profiles shown on the public pages.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}><Plus className="mr-2 h-4 w-4" /> Add Agent</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <Input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              <Input placeholder="Company / Agency" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
              <Input type="number" placeholder="Experience (Years)" value={formData.experienceYears} onChange={e => setFormData({...formData, experienceYears: e.target.value})} />
              <Input placeholder="Image URL (Profile Photo)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <Input placeholder="Location / City" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              <Textarea placeholder="About the Agent" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle className="animate-spin h-4 w-4 mr-2" /> : null}
                {editingId ? 'Update Agent' : 'Save Agent'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agents</CardTitle>
          <CardDescription>A list of all verified agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map(agent => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">{agent.email}</div>
                    <div className="text-xs text-muted-foreground">{agent.phone}</div>
                  </TableCell>
                  <TableCell>{agent.company || '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(agent)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(agent.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {agents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No agents found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
