import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, IndianRupee, MessageCircle, User, Info, Heart, Share2 } from "lucide-react";
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

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-slate-200 rounded-3xl group bg-white relative">
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          onClick={() => toggleFavorite(requirement.id, isFavorited)}
          className={cn(
            "p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm border",
            isFavorited 
              ? "bg-red-50 border-red-100 text-red-500" 
              : "bg-white/80 border-white text-slate-400 hover:text-red-500 hover:bg-white"
          )}
        >
          <Heart className={cn("w-4 h-4 transition-transform duration-300", isFavorited && "fill-current scale-110")} />
        </button>
        <button
          onClick={handleShare}
          className="p-2.5 rounded-full backdrop-blur-md bg-white/80 border border-white text-slate-400 hover:text-primary hover:bg-white transition-all duration-300 shadow-sm"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <CardContent className="p-7">
        <div className="flex justify-between items-start mb-5">
          <div className="pr-12"> {/* Space for buttons */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant={requirement.purpose === 'Rent' ? 'default' : 'secondary'} className="rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider">
                {requirement.purpose}
              </Badge>
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider">
                {requirement.propertyType}
              </Badge>
            </div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors">
              Needs {requirement.propertyType} in {requirement.area}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-500 mt-3 text-sm font-bold">
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-primary" />
              </div>
              {requirement.area}, {requirement.city}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 my-7 bg-slate-50/50 p-5 rounded-[24px] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl" />
          
          <div className="flex flex-col gap-1.5 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
              <User className="w-3 h-3 text-primary" /> Seeker
            </span>
            <span className="font-black text-slate-800">{requirement.name}</span>
          </div>
          <div className="flex flex-col gap-1.5 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-primary" /> Move In
            </span>
            <span className="font-black text-slate-800">{requirement.moveInDate}</span>
          </div>
          
          <div className="flex flex-col gap-2 col-span-2 relative z-10 mt-2">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
              <Info className="w-3 h-3 text-primary" /> Preferences
            </span>
            <div className="flex flex-wrap gap-2">
              {requirement.preferences?.tenantType && (
                <span className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 shadow-sm">
                  {requirement.preferences.tenantType}
                </span>
              )}
              {requirement.preferences?.furnished && (
                <span className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 shadow-sm">
                  Furnished
                </span>
              )}
              {requirement.preferences?.parking && (
                <span className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 shadow-sm">
                  Parking
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-7">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</span>
                <div className="text-2xl font-black text-slate-900 flex items-center">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    {requirement.budget.toLocaleString('en-IN')}
                </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-100" />
            <div className="flex flex-col text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Posted</span>
                <span className="text-sm font-black text-slate-600">{getDate(requirement.createdAt)}</span>
            </div>
        </div>

        {requirement.description && (
          <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-2 leading-relaxed italic bg-slate-50/30 p-3 rounded-xl border border-slate-50">
            "{requirement.description}"
          </p>
        )}

        <Button 
          className="w-full h-14 rounded-2xl font-black tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-green-500/20 bg-[#25D366] hover:bg-[#1ebd5b] text-white border-0 text-base"
          onClick={() => window.open(`https://wa.me/91${requirement.whatsappNumber}?text=${whatsappMessage}`, '_blank')}
        >
          <MessageCircle className="w-5 h-5 mr-2.5" />
          Contact via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}

export function RequirementCardSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200 rounded-3xl">
      <CardContent className="p-7">
        <div className="flex justify-between mb-6">
            <div className="space-y-3 w-2/3">
                <div className="h-5 w-24 bg-slate-100 rounded-lg animate-pulse"></div>
                <div className="h-8 w-full bg-slate-100 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-50 animate-pulse"></div>
        </div>
        <div className="h-32 w-full bg-slate-50 rounded-[24px] animate-pulse mb-6"></div>
        <div className="h-12 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
      </CardContent>
    </Card>
  );
}
