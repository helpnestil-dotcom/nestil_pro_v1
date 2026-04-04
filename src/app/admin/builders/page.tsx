'use client';

import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useToast } from '@/hooks/use-toast';
import { BuilderData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus, LoaderCircle } from 'lucide-react';

export default function AdminBuildersPage() {
  const { toast } = useToast();
  const [buildersSnap, loading] = useCollection(collection(db, 'builders'));
  const builders = buildersSnap?.docs.map(d => ({ id: d.id, ...d.data() } as BuilderData)) || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    establishedYear: '',
    imageUrl: '',
    description: '',
  });

  const handleOpenDialog = (builder?: BuilderData) => {
    if (builder) {
      setEditingId(builder.id);
      setFormData({
        companyName: builder.companyName,
        contactPerson: builder.contactPerson,
        email: builder.email,
        phone: builder.phone,
        website: builder.website || '',
        establishedYear: builder.establishedYear?.toString() || '',
        imageUrl: builder.imageUrl || '',
        description: builder.description || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        companyName: '', contactPerson: '', email: '', phone: '', website: '', establishedYear: '', imageUrl: '', description: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : 0,
        imageUrl: formData.imageUrl,
        description: formData.description,
        isVerified: true,
        ...(editingId ? {} : { createdAt: new Date().toISOString() })
      };

      if (editingId) {
        await updateDoc(doc(db, 'builders', editingId), data);
        toast({ title: 'Builder Updated' });
      } else {
        await addDoc(collection(db, 'builders'), data);
        toast({ title: 'Builder Added' });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error saving builder' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this builder?")) return;
    try {
      await deleteDoc(doc(db, 'builders', id));
      toast({ title: 'Builder Deleted' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error deleting builder' });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><LoaderCircle className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Builders</h1>
          <p className="text-muted-foreground">Add and edit builder profiles shown on the public pages.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}><Plus className="mr-2 h-4 w-4" /> Add Builder</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Builder' : 'Add New Builder'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <Input placeholder="Company Name" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required />
              <Input placeholder="Contact Person" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} required />
              <Input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              <Input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              <Input placeholder="Website URL" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
              <Input type="number" placeholder="Established Year" value={formData.establishedYear} onChange={e => setFormData({...formData, establishedYear: e.target.value})} />
              <Input placeholder="Image URL (Company Logo)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
              <Textarea placeholder="About the Builder" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <LoaderCircle className="animate-spin h-4 w-4 mr-2" /> : null}
                {editingId ? 'Update Builder' : 'Save Builder'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Builders</CardTitle>
          <CardDescription>A list of all verified builders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {builders.map(builder => (
                <TableRow key={builder.id}>
                  <TableCell className="font-medium">{builder.companyName}</TableCell>
                  <TableCell>
                    <div className="text-sm">{builder.email}</div>
                    <div className="text-xs text-muted-foreground">{builder.phone}</div>
                  </TableCell>
                  <TableCell>{builder.contactPerson}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(builder)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(builder.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {builders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No builders found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
