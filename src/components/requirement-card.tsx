import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Calendar, IndianRupee, MessageCircle, User, Info, Heart, Share2, ChevronRight, Download } from "lucide-react";
import { PropertyRequirement } from "@/lib/types";
import { format, fromUnixTime } from "date-fns";
import { useRequirementFavorites } from "@/hooks/use-requirement-favorites";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function RequirementCard({ requirement }: { requirement: PropertyRequirement }) {
  const { favoriteIds, toggleFavorite } = useRequirementFavorites();
  const isFavorited = favoriteIds.has(requirement.id);
  const { toast } = useToast();

  const getDate = (createdAt: any) => {
    if (!createdAt) return "Recently";
    if (typeof createdAt === 'string') return format(new Date(createdAt), "MMM d, yyyy");
    if (createdAt.seconds) return format(fromUnixTime(createdAt.seconds), "MMM d, yyyy");
    return "Recently";
  };

  const whatsappMessage = encodeURIComponent(
    `Hi ${requirement.name}, I saw your Nestil requirement post for a ${requirement.propertyType} in ${requirement.city}. I have a property that might interest you!`
  );

  const handleShare = async () => {
    const shareData = {
      title: `Nestil Requirement: ${requirement.propertyType} in ${requirement.area}`,
      text: `Check out this property requirement on Nestil: ${requirement.name} is looking for a ${requirement.propertyType} in ${requirement.area}, ${requirement.city}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast({
          title: "Link Copied!",
          description: "Requirement details copied to clipboard.",
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      toast({
        title: "Preparing PDF...",
        description: "Please wait a moment.",
      });
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default as any;
      const { jsPDF } = await import('jspdf');
      
      const cardElement = document.getElementById(`requirement-card-${requirement.id}`);
      if (!cardElement) return;

      // Temporarily hide the action buttons during capture
      const actionButtons = cardElement.querySelector('.action-buttons');
      if (actionButtons) (actionButtons as HTMLElement).style.display = 'none';

      const canvas = await html2canvas(cardElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      if (actionButtons) (actionButtons as HTMLElement).style.display = 'flex';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`nestil-requirement-${requirement.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "Could not generate PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card id={`requirement-card-${requirement.id}`} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-slate-200 rounded-3xl group bg-white relative">
      {/* Action Buttons */}
      <div className="action-buttons absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => toggleFavorite(requirement.id, isFavorited)}
          className={cn(
            "p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm border",
            isFavorited 
              ? "bg-red-50 border-red-100 text-red-500" 
              : "bg-white/80 border-white text-slate-400 hover:text-red-500 hover:bg-white"
          )}
          title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-4 h-4 transition-transform duration-300", isFavorited && "fill-current scale-110")} />
        </button>
        <button
          onClick={handleShare}
          className="p-2.5 rounded-full backdrop-blur-md bg-white/80 border border-white text-slate-400 hover:text-primary hover:bg-white transition-all duration-300 shadow-sm"
          title="Share requirement"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDownloadPdf}
          className="p-2.5 rounded-full backdrop-blur-md bg-white/80 border border-white text-slate-400 hover:text-primary hover:bg-white transition-all duration-300 shadow-sm"
          title="Download as PDF"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <CardContent className="p-5 sm:p-7">
        <div className="flex justify-between items-start mb-4 sm:mb-5">
          <div className="pr-10 sm:pr-12"> {/* Space for buttons */}
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Badge variant={requirement.purpose === 'Rent' ? 'default' : 'secondary'} className="rounded-lg px-2 sm:px-3 py-1 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                {requirement.purpose}
              </Badge>
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 rounded-lg px-2 sm:px-3 py-1 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
                {requirement.propertyType}
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors">
              Needs {requirement.propertyType} in {requirement.area}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 mt-2 sm:mt-3 text-xs sm:text-sm font-bold">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
              </div>
              {requirement.area}, {requirement.city}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 my-5 sm:my-7 bg-slate-50/50 p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
          
          <div className="flex flex-col gap-1 sm:gap-1.5 relative z-10">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
              <User className="w-3 h-3 text-primary" /> Seeker
            </span>
            <span className="font-black text-sm sm:text-base text-slate-800">{requirement.name}</span>
          </div>
          <div className="flex flex-col gap-1 sm:gap-1.5 relative z-10">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-primary" /> Move In
            </span>
            <span className="font-black text-sm sm:text-base text-slate-800">{requirement.moveInDate}</span>
          </div>
          
          <div className="flex flex-col gap-2 col-span-2 relative z-10 mt-1 sm:mt-2">
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3 h-3 text-primary" /> Preferences
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {requirement.preferences?.tenantType && (
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white border border-slate-100 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black text-slate-600 shadow-sm">
                  {requirement.preferences.tenantType}
                </span>
              )}
              {requirement.preferences?.furnishing && (
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white border border-slate-100 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black text-slate-600 shadow-sm">
                  {requirement.preferences.furnishing}
                </span>
              )}
              {requirement.preferences?.parking && (
                <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white border border-slate-100 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-black text-slate-600 shadow-sm">
                  Parking
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-5 sm:mb-7">
            <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center">
                    <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    {requirement.budget.toLocaleString('en-IN')}
                </div>
            </div>
            {requirement.securityDeposit && (
              <>
                <div className="h-8 sm:h-10 w-[1px] bg-slate-100" />
                <div className="flex flex-col">
                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Deposit</span>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 flex items-center">
                        <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        {requirement.securityDeposit.toLocaleString('en-IN')}
                    </div>
                </div>
              </>
            )}
            <div className="h-8 sm:h-10 w-[1px] bg-slate-100" />
            <div className="flex flex-col text-right">
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted</span>
                <span className="text-xs sm:text-sm font-black text-slate-600">{getDate(requirement.createdAt)}</span>
            </div>
        </div>

        {requirement.description && (
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer mb-5 sm:mb-8 bg-slate-50/50 hover:bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 transition-colors group">
                <p className="text-[13px] text-slate-600 font-medium line-clamp-2 leading-relaxed mb-2">
                  {requirement.description}
                </p>
                <div className="text-[11px] font-bold text-primary flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  Read full description <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[90vw] max-h-[80vh] overflow-y-auto rounded-2xl">
              <DialogHeader>
                <DialogTitle>Requirement Details</DialogTitle>
                <DialogDescription>
                  Additional details provided by the seeker.
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100 whitespace-pre-wrap">
                {requirement.description}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <Button 
          className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20 bg-[#25D366] hover:bg-[#1ebd5b] text-white border-0 text-sm sm:text-base"
          onClick={() => window.open(`https://wa.me/91${requirement.whatsappNumber}?text=${whatsappMessage}`, '_blank')}
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-2.5" />
          Contact via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}

export function RequirementCardSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200 rounded-3xl">
      <CardContent className="p-5 sm:p-7">
        <div className="flex justify-between mb-5 sm:mb-6">
            <div className="space-y-3 w-2/3">
                <div className="h-5 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
                <div className="h-8 w-full bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-50 animate-pulse"></div>
        </div>
        <div className="h-28 sm:h-32 w-full bg-slate-50 rounded-[20px] sm:rounded-[24px] animate-pulse mb-5 sm:mb-6"></div>
        <div className="h-12 w-full bg-slate-100 rounded-xl sm:rounded-2xl animate-pulse"></div>
      </CardContent>
    </Card>
  );
}
