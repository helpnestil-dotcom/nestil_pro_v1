
'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Image from 'next/image';
import { CalendarIcon, CheckCircle, XCircle, Clock, Download, Users, Ban, Trash2, MoreVertical, Filter, Search, Edit, Home, LoaderCircle, BedDouble, Bath, Expand, MapPin, Archive, Eye, DollarSign } from "lucide-react";
import { Sparkles } from "lucide-react";
import type { Property, PropertyOwner } from "@/lib/types";
import Link from "next/link";
import { format, fromUnixTime } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// 1. Standard Firebase Functions
import { collection, doc, updateDoc, deleteDoc, query, where, getDoc, getCountFromServer, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// 2. React Firebase Hooks
import { useCollection } from 'react-firebase-hooks/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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


function AdminSkeleton() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-96" />
      <Skeleton className="h-96" />
    </div>
  );
}

// PDF Template Component - This will be rendered off-screen
const PropertyPdfCard = ({ property, owner, innerRef }: { property: Property | null, owner: PropertyOwner | null, innerRef: React.Ref<HTMLDivElement> }) => {
    if (!property || !owner) return null;

    const photoUrl = property.photos && property.photos.length > 0 ? property.photos[0] : 'https://placehold.co/800x600/e2e8f0/e2e8f0?text=No+Image';
    const maskedPhone = owner.phone ? `******${owner.phone.slice(-4)}` : 'N/A';

    return (
        <div ref={innerRef} className="w-[595px] bg-white text-gray-800 fixed -z-10 -left-[9999px] font-sans">
            {/* Page Wrapper */}
            <div className="min-h-[842px] flex flex-col"> 
                {/* Header */}
                <header className="bg-primary text-primary-foreground p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Home className="h-8 w-8" />
                        <span className="text-3xl font-bold">Nestil</span>
                    </div>
                    <p className="text-sm">www.nestil.in</p>
                </header>

                {/* Main content */}
                <main className="p-8 flex-grow">
                    {/* Image */}
                    <img src={photoUrl} crossOrigin="anonymous" className="w-full h-64 object-cover rounded-xl shadow-lg border-4 border-white" alt={property.title} />

                    {/* Title & Price */}
                    <div className="mt-6 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-primary">{property.title}</h1>
                            <p className="text-muted-foreground mt-1 flex items-center gap-2">
                                <MapPin className="h-4 w-4"/>
                                {property.address}, {property.city}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">{property.listingFor === 'Rent' ? 'For Rent' : 'For Sale'}</p>
                            <p className="text-3xl font-bold text-accent">
                                ₹{property.price.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                    
                    {/* Details Section */}
                    <div className="mt-8 grid grid-cols-3 gap-6 text-center bg-secondary/50 p-4 rounded-lg">
                         <div className="flex flex-col items-center gap-1">
                            <BedDouble className="h-7 w-7 text-primary" />
                            <p className="font-bold text-lg">{property.bhk || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">BHK</p>
                        </div>
                         <div className="flex flex-col items-center gap-1">
                            <Bath className="h-7 w-7 text-primary" />
                            <p className="font-bold text-lg">{property.baths || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">Baths</p>
                        </div>
                         <div className="flex flex-col items-center gap-1">
                            <Expand className="h-7 w-7 text-primary" />
                            <p className="font-bold text-lg">{property.areaSqFt ? property.areaSqFt.toLocaleString('en-IN') : 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">sqft</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-primary border-b-2 border-primary/20 pb-2">About this property</h2>
                        <p className="text-foreground/80 mt-3 text-sm leading-relaxed">
                            {property.description.substring(0, 400)}{property.description.length > 400 ? '...' : ''}
                        </p>
                    </div>
                </main>
                
                {/* Footer */}
                <footer className="mt-auto p-6 bg-secondary/30">
                    <div className="flex justify-between items-center">
                         <div>
                            <p className="font-bold text-lg text-primary">Contact {owner.isAgent ? 'Agent' : 'Owner'}</p>
                            <p className="text-foreground">{owner.name} - {maskedPhone}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs text-muted-foreground">Property ID: {property.id}</p>
                             <p className="text-xs text-muted-foreground">Visit Nestil.in for more details</p>
                         </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}


export default function AdminPage() {
  const { toast } = useToast();

  const pdfRef = useRef<HTMLDivElement>(null);
  const [pdfProperty, setPdfProperty] = useState<{ property: Property, owner: PropertyOwner } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [processingPropertyId, setProcessingPropertyId] = useState<string | null>(null);

  const [propertySearch, setPropertySearch] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('all');
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [previewProperty, setPreviewProperty] = useState<Property | null>(null);

  const [summaryCounts, setSummaryCounts] = useState({ total: 0, active: 0, soldRented: 0 });
  const [countsLoading, setCountsLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
        setCountsLoading(true);
        try {
            const allPropsCol = collection(db, 'properties');
            const totalPromise = getCountFromServer(allPropsCol);
            const activePromise = getCountFromServer(query(allPropsCol, where('listingStatus', '==', 'approved')));
            const soldPromise = getCountFromServer(query(allPropsCol, where('listingStatus', '==', 'sold')));
            const rentedPromise = getCountFromServer(query(allPropsCol, where('listingStatus', '==', 'rented')));

            const [totalSnap, activeSnap, soldSnap, rentedSnap] = await Promise.all([totalPromise, activePromise, soldPromise, rentedPromise]);
            
            setSummaryCounts({
                total: totalSnap.data().count,
                active: activeSnap.data().count,
                soldRented: soldSnap.data().count + rentedSnap.data().count,
            });

        } catch (e) {
            console.error("Error fetching summary counts", e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not load summary statistics.'});
        } finally {
            setCountsLoading(false);
        }
    }
    fetchCounts();
  }, [toast]);


  useEffect(() => {
    const generatePdf = async () => {
        if (pdfProperty && pdfRef.current) {
            setIsGeneratingPdf(true);
            try {
                const canvas = await html2canvas(pdfRef.current, {
                    useCORS: true,
                    scale: 2, // Higher scale for better quality
                    backgroundColor: '#ffffff',
                });
                const imgData = canvas.toDataURL('image/png');
                
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${pdfProperty.property.title.replace(/\s/g, '_')}_nestil.pdf`);

                toast({
                    title: "PDF Generated",
                    description: "Your property PDF has been downloaded."
                });
            } catch (e) {
                console.error("Error generating PDF", e);
                toast({
                    variant: "destructive",
                    title: "PDF Generation Failed",
                    description: "Could not download the property PDF. Check console for details.",
                });
            } finally {
                setPdfProperty(null); // Reset after generation
                setIsGeneratingPdf(false);
            }
        }
    };
    generatePdf();
  }, [pdfProperty, toast]);

  const handleDownloadPdfClick = async (property: Property) => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    const privateDocRef = doc(db, 'propertyPrivateDetails', property.id);
    const privateDocSnap = await getDoc(privateDocRef);

    if (privateDocSnap.exists()) {
        const owner = privateDocSnap.data() as PropertyOwner;
        setPdfProperty({ property, owner });
    } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find owner details for this property.' });
        setIsGeneratingPdf(false);
    }
  }

  // FIX: Use standard useMemo and pass the 'db' instance directly
  const pendingPropertiesQuery = useMemo(() => {
    return query(collection(db, 'properties'), where('listingStatus', '==', 'pending'));
  }, []);

  const [pendingSnap, pendingLoading] = useCollection(pendingPropertiesQuery);
  const pendingProperties = pendingSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));

  // FIX: Main table query
  const tableQuery = useMemo(() => {
      let q = query(collection(db, 'properties'));
      if (propertyStatusFilter !== 'all') {
          q = query(q, where('listingStatus', '==', propertyStatusFilter));
      }
      if (propertyTypeFilter !== 'all') {
          q = query(q, where('listingFor', '==', propertyTypeFilter.toLowerCase()));
      }
      if (date?.from) {
        const fromDate = new Date(date.from);
        fromDate.setHours(0, 0, 0, 0);
        q = query(q, where('dateAdded', '>=', fromDate.toISOString()));
      }
      if (date?.to) {
        const toDate = new Date(date.to);
        toDate.setHours(23, 59, 59, 999);
        q = query(q, where('dateAdded', '<=', toDate.toISOString()));
      }
      // Add a default sort order. This is also required by Firestore when using range filters.
      q = query(q, orderBy('dateAdded', 'desc'));
      return q;
  }, [propertyStatusFilter, propertyTypeFilter, date]);

  const [tableSnap, tableLoading] = useCollection(tableQuery);
  const tableProperties = tableSnap?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));

  const filteredProperties = useMemo(() => {
    if (!tableProperties) return [];
    
    let props = tableProperties;

    if (propertyStatusFilter === 'all') {
        props = props.filter((p: Property) => p.listingStatus !== 'archived');
    }

    if (propertySearch) {
        props = props.filter((prop: Property) => 
            prop.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
            prop.address.toLowerCase().includes(propertySearch.toLowerCase())
        );
    }

    return props;
  }, [tableProperties, propertySearch, propertyStatusFilter]);
  
  if (pendingLoading || tableLoading || countsLoading) {
      return <AdminSkeleton />;
  }

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

  const handleApprove = async (id: string) => {
    setProcessingPropertyId(id);
    const propRef = doc(db, 'properties', id);
    try {
      await updateDoc(propRef, { isApproved: true, listingStatus: 'approved' });
      
      // Get property data to notify owner
      const propSnap = await getDoc(propRef);
      if (propSnap.exists()) {
        const propData = propSnap.data();
        await notifyUser(
          propData.ownerId,
          "Property Approved! 🏠",
          `Your listing "${propData.title}" is now live on Nestil Pro.`,
          `/properties/${id}`
        );
      }

      toast({ title: "Property Approved", description: "The listing is now live." });
    } catch (error) {
      console.error("Error approving property:", error);
      toast({ variant: "destructive", title: "Approval Failed", description: "Could not approve the property." });
    } finally {
      setProcessingPropertyId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingPropertyId(id);
    const propRef = doc(db, 'properties', id);
    try {
      await updateDoc(propRef, { isApproved: false, listingStatus: 'rejected' });
      toast({ title: "Property Rejected" });
    } catch (error) {
      console.error("Error rejecting property:", error);
      toast({ variant: "destructive", title: "Rejection Failed", description: "Could not reject the property." });
    } finally {
      setProcessingPropertyId(null);
    }
  };

  const handleArchiveProperty = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to archive this property? It will be hidden from public view but not permanently deleted.")) return;
    setProcessingPropertyId(propertyId);
    const propRef = doc(db, 'properties', propertyId);
    try {
      await updateDoc(propRef, { listingStatus: 'archived' });
      toast({ title: "Property Archived", description: "The property listing has been archived." });
    } catch (error) {
      console.error("Error archiving property:", error);
      toast({ variant: "destructive", title: "Archive Failed", description: "Could not archive the property." });
    } finally {
      setProcessingPropertyId(null);
    }
  };
  
  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this property? This action cannot be undone.")) return;
    setProcessingPropertyId(propertyId);
    const propRef = doc(db, 'properties', propertyId);
    const privatePropRef = doc(db, 'propertyPrivateDetails', propertyId);
    try {
      await deleteDoc(propRef);
      await deleteDoc(privatePropRef);
      toast({ title: "Property Deleted", description: "The property has been permanently removed." });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete the property." });
    } finally {
      setProcessingPropertyId(null);
    }
  };
  
  const handleMarkAsSoldRented = async (property: Property) => {
      const newStatus = property.listingStatus === 'sold' || property.listingStatus === 'rented' ? 'approved' : (property.listingFor === 'Rent' ? 'rented' : 'sold');
      setProcessingPropertyId(property.id);
      const propRef = doc(db, 'properties', property.id);
      try {
        await updateDoc(propRef, { listingStatus: newStatus });
        toast({ title: "Status Updated", description: `Property marked as ${newStatus}.` });
      } catch (error) {
        console.error("Error updating property status:", error);
        toast({ variant: "destructive", title: "Update Failed", description: "Could not update property status." });
      } finally {
        setProcessingPropertyId(null);
      }
  };

  const handleTogglePaidStatus = async (property: Property) => {
    const newPaidStatus = !property.isPaid;
    setProcessingPropertyId(property.id);
    const propRef = doc(db, 'properties', property.id);
    try {
      await updateDoc(propRef, { isPaid: newPaidStatus });
      toast({ title: "Status Updated", description: `Property marked as ${newPaidStatus ? 'Paid' : 'Unpaid'}.` });
    } catch (error) {
      console.error("Error updating paid status:", error);
      toast({ variant: "destructive", title: "Update Failed", description: "Could not update paid status." });
    } finally {
      setProcessingPropertyId(null);
    }
  };

  
  const handlePromoteToAd = async (propertyId: string) => {
    setProcessingPropertyId(propertyId);
    const propRef = doc(db, 'properties', propertyId);
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    
    try {
      await updateDoc(propRef, {
        adStatus: 'approved',
        adExpiry: Timestamp.fromDate(expiry),
        featured: true
      });
      toast({ title: "Property Promoted", description: "Live as a 24-hour featured ad." });
    } catch (error) {
      console.error("Error promoting property:", error);
      toast({ variant: "destructive", title: "Promotion Failed" });
    } finally {
      setProcessingPropertyId(null);
    }
  };

  const handlePropertyCsvDownload = () => {
    if (!tableProperties) return;

    // Sort properties by date added, newest first
    const sortedProperties = [...tableProperties].sort((a, b) => {
        try {
            const dateA = new Date(a.dateAdded).getTime();
            const dateB = new Date(b.dateAdded).getTime();
            if (isNaN(dateA) || isNaN(dateB)) return 0;
            return dateB - dateA;
        } catch (e) {
            return 0; // if date is invalid, don't sort
        }
    });

    const headers = ['id', 'title', 'listingFor', 'propertyType', 'price', 'city', 'address', 'pincode', 'areaSqFt', 'bhk', 'listingStatus', 'dateAdded', 'ownerId'];
    
    const escapeCsvCell = (cell: string | number | boolean | undefined | null) => {
      if (cell === null || cell === undefined) return '';
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };

    const csvContent = [
      headers.join(','),
      ...sortedProperties.map(prop => [
        prop.id,
        prop.title,
        prop.listingFor,
        prop.propertyType,
        prop.price,
        prop.city,
        prop.address,
        prop.pincode,
        prop.areaSqFt,
        prop.bhk,
        prop.listingStatus,
        prop.dateAdded,
        prop.ownerId,
      ].map(v => escapeCsvCell(v)).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];

    link.setAttribute('href', url);
    link.setAttribute('download', `nestil_properties_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (typeof date === 'string') {
      return format(new Date(date), 'dd/MM/yyyy');
    }
    if (date.seconds) {
      return format(fromUnixTime(date.seconds), 'dd/MM/yyyy');
    }
    return 'Invalid Date';
  };

  return (
    <div className="container py-12">
      <PropertyPdfCard property={pdfProperty?.property || null} owner={pdfProperty?.owner || null} innerRef={pdfRef} />
      
      <Dialog open={!!previewProperty} onOpenChange={(isOpen) => !isOpen && setPreviewProperty(null)}>
        <DialogContent className="max-w-4xl w-full">
            {previewProperty && (() => {
              const validPhotos = (previewProperty.photos || []);
              return (
                <>
                    <DialogHeader>
                        <DialogTitle>{previewProperty.title}</DialogTitle>
                        <DialogDescription>
                            <MapPin className="inline-block h-4 w-4 mr-1" />
                            {previewProperty.address}, {previewProperty.city}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[75vh] overflow-y-auto pr-4">
                        <div className="space-y-4">
                            {validPhotos.length > 0 ? (
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {validPhotos.map((photo, index) => (
                                        <CarouselItem key={index}>
                                            <div className="aspect-video relative">
                                                <Image src={photo} alt={`Property image ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover rounded-md"/>
                                            </div>
                                        </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="ml-14" />
                                    <CarouselNext className="mr-14" />
                                </Carousel>
                            ) : (
                                <div className="aspect-video bg-muted rounded-md flex items-center justify-center text-muted-foreground">No photos</div>
                            )}
                            
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Key Details</CardTitle></CardHeader>
                                <CardContent className="grid grid-cols-3 gap-4 text-center">
                                     <div className="flex flex-col items-center gap-1">
                                        <BedDouble className="h-6 w-6 text-primary" />
                                        <p className="font-bold">{previewProperty.bhk || 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">BHK</p>
                                    </div>
                                     <div className="flex flex-col items-center gap-1">
                                        <Bath className="h-6 w-6 text-primary" />
                                        <p className="font-bold">{previewProperty.baths || 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">Baths</p>
                                    </div>
                                     <div className="flex flex-col items-center gap-1">
                                        <Expand className="h-6 w-6 text-primary" />
                                        <p className="font-bold">{previewProperty.areaSqFt ? previewProperty.areaSqFt.toLocaleString('en-IN') : 'N/A'}</p>
                                        <p className="text-xs text-muted-foreground">sqft</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-4">
                            <Card>
                                 <CardHeader><CardTitle className="text-lg">Price Details</CardTitle></CardHeader>
                                 <CardContent className="space-y-2">
                                    <p className="text-3xl font-bold text-primary">₹{previewProperty.price.toLocaleString('en-IN')}</p>
                                    {previewProperty.listingFor === 'Rent' && <p className="text-sm text-muted-foreground">/month</p>}
                                    <p className="text-sm">Maintenance: ₹{(previewProperty.maintenance || 0).toLocaleString('en-IN')} /month</p>
                                    {previewProperty.listingFor === 'Rent' && <p className="text-sm">Deposit: ₹{(previewProperty.deposit || 0).toLocaleString('en-IN')}</p>}
                                 </CardContent>
                            </Card>
                            <Card>
                                 <CardHeader><CardTitle className="text-lg">Description</CardTitle></CardHeader>
                                 <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{previewProperty.description}</p></CardContent>
                            </Card>
                            <Card>
                                 <CardHeader><CardTitle className="text-lg">Amenities</CardTitle></CardHeader>
                                 <CardContent className="flex flex-wrap gap-2">
                                    {(previewProperty.amenities || []).length > 0 ? (
                                        (previewProperty.amenities || []).map(a => <Badge key={a} variant="secondary">{a}</Badge>)
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No amenities listed.</p>
                                    )}
                                 </CardContent>
                            </Card>
                        </div>
                    </div>
                     <DialogFooter className="sm:justify-between items-center border-t pt-4">
                        <div className="text-xs text-muted-foreground">
                            <p>Property ID: {previewProperty.id}</p>
                            <p>Owner ID: {previewProperty.ownerId}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => { handleReject(previewProperty.id); setPreviewProperty(null); }}>Reject</Button>
                            <Button onClick={() => { handleApprove(previewProperty.id); setPreviewProperty(null); }}>Approve</Button>
                        </div>
                    </DialogFooter>
                </>
              )
            })()}
        </DialogContent>
    </Dialog>
      
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium">Real-time property moderation & system overview.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button onClick={handlePropertyCsvDownload} variant="outline" className="rounded-xl font-bold bg-white shadow-sm border-slate-200">
                <Download className="w-4 h-4 mr-2" /> Export CSV
             </Button>
          </div>
        </div>
      </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="border-none shadow-xl shadow-blue-500/5 bg-gradient-to-br from-white to-blue-50/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><Users className="h-12 w-12 text-blue-600" /></div>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-blue-600/70">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{summaryCounts.total}</div>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Lifetime submissions</p>
            </CardContent>
        </Card>
        
        <Card className="border-none shadow-xl shadow-emerald-500/5 bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><CheckCircle className="h-12 w-12 text-emerald-600" /></div>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-600/70">Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{summaryCounts.active}</div>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Currently visible</p>
            </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-amber-500/5 bg-gradient-to-br from-white to-amber-50/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><Clock className="h-12 w-12 text-amber-600" /></div>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-amber-600/70">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{pendingProperties?.length || 0}</div>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Requires review</p>
            </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-indigo-500/5 bg-gradient-to-br from-white to-indigo-50/30 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform"><DollarSign className="h-12 w-12 text-indigo-600" /></div>
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-600/70">Sold/Rented</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-black text-slate-900">{summaryCounts.soldRented}</div>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Successful closures</p>
            </CardContent>
        </Card>
       </div>


      <Card className="mb-10 border-none shadow-xl shadow-slate-200/50 overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black text-slate-900">Pending Approval</CardTitle>
              <CardDescription className="font-medium text-slate-500">
                New submissions requiring your immediate attention.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold px-3 py-1">
               {pendingProperties?.length || 0} Awaiting Review
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
            {pendingProperties && pendingProperties.length > 0 ? (
                <div className="divide-y divide-slate-100">
                    {pendingProperties.map((prop: Property) => (
                        <div key={prop.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6 group">
                            {/* Property Thumbnail */}
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative border-2 border-white shadow-sm">
                                {prop.photos?.[0] ? (
                                    <Image src={prop.photos[0]} alt={prop.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <Home className="w-8 h-8 text-slate-300 absolute center" />
                                )}
                            </div>

                            {/* Property Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-slate-900 text-[10px] h-5 px-2 uppercase font-black tracking-tighter">
                                        {prop.listingFor}
                                    </Badge>
                                    <span className="text-xs font-bold text-slate-400">Added {formatDateLocal(prop.dateAdded)}</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-primary transition-colors">{prop.title}</h3>
                                <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {prop.address}, {prop.city}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md transition-all" onClick={() => setPreviewProperty(prop)}>
                                    <Eye className="h-5 w-5 text-slate-400" />
                                </Button>
                                <Button variant="outline" className="flex-1 md:flex-none h-10 px-6 rounded-xl font-bold border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all" onClick={() => handleApprove(prop.id)} disabled={processingPropertyId === prop.id}>
                                    {processingPropertyId === prop.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                    Approve
                                </Button>
                                <Button variant="outline" className="flex-1 md:flex-none h-10 px-6 rounded-xl font-bold border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all" onClick={() => handleReject(prop.id)} disabled={processingPropertyId === prop.id}>
                                    {processingPropertyId === prop.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                                    Reject
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">Queue is Clear!</h3>
                    <p className="text-slate-500 text-sm">No properties are currently pending approval.</p>
                </div>
            )}
        </CardContent>
      </Card>

      
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <CardTitle>All Listings</CardTitle>
                    <CardDescription>View and manage all property listings.</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full md:w-auto md:justify-end">
                    <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search title or area..." className="pl-10 w-full sm:w-48" value={propertySearch} onChange={(e) => setPropertySearch(e.target.value)} />
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Filter by date added</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <Select value={propertyStatusFilter} onValueChange={setPropertyStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Active Listings</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="sale">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                            <SelectItem value="lease">For Lease</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handlePropertyCsvDownload} className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Download CSV
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead className="hidden sm:table-cell">Owner ID</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {filteredProperties && filteredProperties.map((prop: Property) => (
                  <TableRow key={prop.id}>
                    <TableCell className="font-medium">{prop.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                        <div>{prop.ownerId}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">₹{prop.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                        <div className="flex flex-col gap-1">
                           <Badge variant={
                               prop.listingStatus === 'approved' ? 'default' : 
                               prop.listingStatus === 'pending' ? 'secondary' :
                               prop.listingStatus === 'sold' || prop.listingStatus === 'rented' ? 'outline' : 
                               prop.listingStatus === 'archived' ? 'secondary' :
                               'destructive'
                            } className="capitalize flex items-center gap-1 w-fit">
                               {prop.listingStatus === 'approved' && <CheckCircle className="h-3 w-3" />}
                               {prop.listingStatus === 'pending' && <Clock className="h-3 w-3" />}
                               {prop.listingStatus === 'rejected' && <XCircle className="h-3 w-3" />}
                               {prop.listingStatus === 'archived' && <Archive className="h-3 w-3" />}
                               {prop.listingStatus}
                           </Badge>
                           {prop.isPaid && <Badge variant='secondary' className="capitalize flex items-center gap-1 w-fit"><DollarSign className="h-3 w-3" />Paid</Badge>}
                               {prop.featured && (
                                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 capitalize flex items-center gap-1 w-fit text-[10px]">
                                    <Sparkles className="h-3 w-3" />
                                    Featured {(prop as any).adExpiry && `(Until ${formatDateLocal((prop as any).adExpiry)})`}
                                </Badge>
                               )}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={(isGeneratingPdf && pdfProperty?.property.id === prop.id) || processingPropertyId === prop.id}>
                                {(isGeneratingPdf && pdfProperty?.property.id === prop.id) || processingPropertyId === prop.id ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/post-property?edit=${prop.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleMarkAsSoldRented(prop)}
                                disabled={processingPropertyId === prop.id}
                            >
                                {processingPropertyId === prop.id ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                {prop.listingStatus === 'sold' || prop.listingStatus === 'rented' ? 'Mark as Available' : 'Mark as Sold/Rented'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleTogglePaidStatus(prop)}
                                disabled={processingPropertyId === prop.id}
                            >
                                {processingPropertyId === prop.id ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
                                {prop.isPaid ? 'Mark as Unpaid' : 'Mark as Paid'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleDownloadPdfClick(prop)}
                                disabled={isGeneratingPdf || processingPropertyId === prop.id}
                            >
                                {isGeneratingPdf && pdfProperty?.property.id === prop.id ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-amber-600 focus:text-amber-600 cursor-pointer font-black"
                                onClick={() => handlePromoteToAd(prop.id)}
                                disabled={processingPropertyId === prop.id}
                            >
                                {processingPropertyId === prop.id ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                {prop.featured ? 'Renew 24h Spotlight' : 'Boost: 24h Spotlight'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-orange-600 focus:text-orange-600 cursor-pointer"
                                onClick={() => handleArchiveProperty(prop.id)}
                                disabled={processingPropertyId === prop.id}
                            >
                                {processingPropertyId === prop.id ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 cursor-pointer"
                                onClick={() => handleDeleteProperty(prop.id)}
                                disabled={processingPropertyId === prop.id}
                            >
                                {processingPropertyId === prop.id ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
// trigger build

    
