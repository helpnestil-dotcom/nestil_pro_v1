'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Zap, 
  Sparkles, 
  Clipboard, 
  MessageSquare, 
  Download, 
  Trash2, 
  Home, 
  CheckCircle2, 
  ArrowRight,
  Copy,
  Plus,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';

// --- Types ---

type TemplateId = 'low_visibility' | 'intro_call' | 'followup' | 'feature_promo' | 'expired_listing' | 'competitor_switch' | 'flatmate_intro' | 'flatmate_vibe' | 'flatmate_urgent';

type Template = {
  id: TemplateId;
  icon: any;
  title: string;
  badge: string;
  desc: string;
  color: string;
};

type SavedLead = {
  id: string;
  name: string;
  platform: string;
  propType: string;
  location: string;
  contact: string;
  template: string;
  language: string;
  tone: string;
  message: string;
  date: string;
};

// --- Data ---

const TEMPLATES: Template[] = [
  { id: 'low_visibility', icon: Zap, title: 'Low Visibility Alert', badge: 'OUTREACH', desc: 'Tell owners their listing has low reach & offer Nestil.', color: 'text-orange-500 bg-orange-50' },
  { id: 'intro_call', icon: Sparkles, title: 'Introduction', badge: 'INTRO', desc: 'Warm first-time intro to Nestil for property owners.', color: 'text-emerald-500 bg-emerald-50' },
  { id: 'followup', icon: MessageSquare, title: 'Follow-Up', badge: 'FOLLOW-UP', desc: 'Re-engage owners who haven\'t responded yet.', color: 'text-amber-500 bg-amber-50' },
  { id: 'feature_promo', icon: Sparkles, title: 'Feature Promo', badge: 'PROMO', desc: 'Showcase Nestil\'s key features like analytics.', color: 'text-violet-500 bg-violet-50' },
  { id: 'expired_listing', icon: Trash2, title: 'Expired Listing', badge: 'RE-ENGAGE', desc: 'Reach owners whose listing is old or stale.', color: 'text-rose-500 bg-rose-50' },
  { id: 'competitor_switch', icon: ArrowRight, title: 'Switch to Nestil', badge: 'SWITCH', desc: 'Convince owners on competitors to move to Nestil.', color: 'text-blue-500 bg-blue-50' },
];

const FLATMATE_TEMPLATES: Template[] = [
  { id: 'flatmate_intro', icon: Users, title: 'Flatmate Intro', badge: 'MATCH', desc: 'First contact for a potential flatmate match.', color: 'text-pink-500 bg-pink-50' },
  { id: 'flatmate_vibe', icon: Sparkles, title: 'Vibe Check', badge: 'VIBE', desc: 'Detailed intro about lifestyle and expectations.', color: 'text-purple-500 bg-purple-50' },
  { id: 'flatmate_urgent', icon: Zap, title: 'Urgent Move-In', badge: 'URGENT', desc: 'Fast-track communication for immediate needs.', color: 'text-amber-500 bg-amber-50' },
];

const TONES = ['Professional', 'Friendly', 'Urgent'];
const LANGUAGES = [
  { id: 'english', label: '🇬🇧 English' },
  { id: 'hinglish', label: '🇮🇳 Hinglish' },
  { id: 'telugu', label: '🌺 Telugu' },
  { id: 'tamil', label: '🌴 Tamil' },
  { id: 'kannada', label: '🌟 Kannada' }
];

export default function ScriptGeneratorPage() {
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedTmpl, setSelectedTmpl] = useState<TemplateId>('low_visibility');
  const [tone, setTone] = useState('Professional');
  const [lang, setLang] = useState('english');
  const [ownerName, setOwnerName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [platform, setPlatform] = useState('');
  const [propType, setPropType] = useState('property');
  const [outreachType, setOutreachType] = useState<'property' | 'flatmate'>('property');
  const [propLocation, setPropLocation] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [generatedMsg, setGeneratedMsg] = useState('');
  const [savedLeads, setSavedLeads] = useState<SavedLead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Parser State
  const [isParserOpen, setIsParserOpen] = useState(true);
  const [flatAdInput, setFlatAdInput] = useState('');
  const [parsedMsg, setParsedMsg] = useState('');
  const [parsedContact, setParsedContact] = useState('');
  const [parsedChips, setParsedChips] = useState<{k: string, v: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('nestil_saved_leads');
    if (saved) setSavedLeads(JSON.parse(saved));
  }, []);

  const saveToLocal = (leads: SavedLead[]) => {
    localStorage.setItem('nestil_saved_leads', JSON.stringify(leads));
  };

  // --- Logic ---

  const handleGenerate = () => {
    const nameStr = ownerName ? `Hello ${ownerName},` : 'Hello,';
    const locStr = propLocation ? ` in ${propLocation}` : '';
    const platStr = platform || 'another platform';
    const sign = `\n\nRegards,\n${agentName || 'Team Nestil'}${contactNum ? `\n📞 ${contactNum}` : ''}`;

    let msg = '';
    
    if (outreachType === 'flatmate') {
      if (selectedTmpl === 'flatmate_intro') {
        msg = `${nameStr}\n\nI saw your post looking for a flatmate${locStr}. I'm also looking for a place and thought we might be a good match!\n\nI'm using **Nestil** to find compatible flatmates based on lifestyle and habits. Would you be open to a quick chat to see if our vibes match?${sign}`;
      } else if (selectedTmpl === 'flatmate_vibe') {
        msg = `${nameStr}\n\nHey! I'm interested in the flatmate opening${locStr}. A bit about me: I'm a professional, value cleanliness, and respect privacy but also enjoy an occasional weekend hangout.\n\nI found your profile on Nestil and liked the lifestyle preferences you mentioned. Let me know if you'd like to connect!${sign}`;
      } else {
        msg = `${nameStr}\n\nI'm looking for a flatmate${locStr} urgently and your profile looks like a great fit! I'm ready to move in as soon as possible. Can we discuss the details today?${sign}`;
      }
    } else {
      if (selectedTmpl === 'low_visibility') {
        msg = `${nameStr}\n\nWe recently noticed your ${propType} advertisement on ${platStr}${locStr}. It's a great step to list online!\n\nHowever, listings on ${platStr} often receive limited visibility — meaning genuine buyers may never find yours.\n\nAt **Nestil**, we offer:\n✅ High search visibility & priority placement\n✅ Direct buyer contact — zero middlemen\n✅ Verified, serious inquiries only\n✅ Real-time analytics on your listing\n\nWe'd love to feature your ${propType}${locStr} on Nestil.${sign}`;
      } else {
        msg = `${nameStr}\n\nWelcome to **Nestil**! 🎉\n\nYour ${propType}${locStr} deserves the spotlight — zero middlemen, real buyers, faster results. Ready to get started?${sign}`;
      }
    }

    setGeneratedMsg(msg);
    toast.success("Script generated successfully!");
  };

  const handleSaveLead = () => {
    if (!generatedMsg) return;
    const newLead: SavedLead = {
      id: Date.now().toString(),
      name: ownerName || '—',
      platform: platform || '—',
      propType: propType || '—',
      location: propLocation || '—',
      contact: contactNum || '—',
      template: (outreachType === 'property' ? TEMPLATES : FLATMATE_TEMPLATES).find(t => t.id === selectedTmpl)?.title || 'Custom',
      language: LANGUAGES.find(l => l.id === lang)?.label || '',
      tone,
      message: generatedMsg,
      date: new Date().toLocaleString()
    };

    const updated = [newLead, ...savedLeads];
    setSavedLeads(updated);
    saveToLocal(updated);
    toast.success("Lead saved successfully!");
  };

  const handleDeleteLead = (id: string) => {
    const updated = savedLeads.filter(l => l.id !== id);
    setSavedLeads(updated);
    saveToLocal(updated);
    toast.success("Lead deleted");
  };

  const handleExport = () => {
    if (savedLeads.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(savedLeads);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "Nestil_Leads.xlsx");
    toast.success("Exported to Excel!");
  };

  const parseFlatAd = () => {
    if (!flatAdInput.trim()) {
      toast.error("Please paste a flat ad first");
      return;
    }

    const lines = flatAdInput.split('\n');
    const bhkMatch = flatAdInput.match(/(\d\s*BHK)/i);
    const rentMatch = flatAdInput.match(/Rent[:\s]+([₹Rs. ]*\d[\d,k\.]+)/i);
    const contactMatch = flatAdInput.match(/([6-9]\d{9})/);

    const bhk = bhkMatch ? bhkMatch[0] : 'Flat';
    const rent = rentMatch ? rentMatch[0] : 'Contact for Rent';
    const contact = contactMatch ? contactMatch[0] : '';

    const chips = [
      { k: 'Property', v: bhk },
      { k: 'Rent', v: rent },
      { k: 'Contact', v: contact }
    ];

    setParsedChips(chips);
    setParsedContact(contact);
    
    const msg = `Hi! 👋\n\nI'm interested in the *${bhk}* listing you posted.\n\n💵 *${rent}*\n\nCould you please share more details? Is it still available? I'd love to schedule a visit!\n\nThank you!`;
    setParsedMsg(msg);
    toast.success("Parsed successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
               <Zap className="h-6 w-6 text-white" /> 
             </div>
             Script Generator
          </h1>
          <p className="text-slate-500 font-medium mt-1">Generate high-converting outreach scripts for property owners.</p>
        </div>
      </div>

      <Tabs defaultValue="generator" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
          <TabsTrigger value="generator" className="flex items-center gap-2 font-bold">
            <Sparkles className="h-4 w-4" /> Generator
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2 font-bold">
            <Clipboard className="h-4 w-4" /> Saved Scripts ({savedLeads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-8 animate-in fade-in duration-500">
          
          {/* Smart Parser Banner */}
          <Card className={cn(
            "border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative transition-all duration-300",
            isParserOpen ? "ring-2 ring-primary/50" : ""
          )}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
            
            <CardHeader className="cursor-pointer select-none border-b border-white/5" onClick={() => setIsParserOpen(!isParserOpen)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                     <Home className="h-6 w-6" />
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <CardTitle className="text-lg font-black tracking-tight">Flat Ad → WhatsApp Msg</CardTitle>
                       <Badge className="bg-primary text-white border-none font-black text-[10px] tracking-widest px-2 py-0.5">NEW</Badge>
                     </div>
                     <CardDescription className="text-slate-400 font-medium">Paste any ad and get a ready-to-send WhatsApp message instantly.</CardDescription>
                   </div>
                </div>
                <div className={cn("p-2 transition-transform duration-300", isParserOpen ? "rotate-180" : "")}>
                   <Zap className="h-5 w-5 text-slate-500" />
                </div>
              </div>
            </CardHeader>

            {isParserOpen && (
              <CardContent className="p-6 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <Textarea 
                  className="bg-white/5 border-white/10 text-slate-100 min-h-[120px] focus:ring-primary/50"
                  placeholder="Paste your flat ad here... (e.g. 2BHK Koramangala, Rent 25k, Contact 9876543210)"
                  value={flatAdInput}
                  onChange={(e) => setFlatAdInput(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button className="bg-primary hover:bg-primary/90 font-black" onClick={parseFlatAd}>
                    ✨ Generate Msg
                  </Button>
                  <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => setFlatAdInput('')}>
                    Clear
                  </Button>
                </div>

                {parsedMsg && (
                  <div className="mt-4 p-5 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {parsedChips.map((chip, i) => (
                        <Badge key={i} variant="outline" className="bg-white/5 border-white/10 text-primary-foreground font-bold">
                          <span className="text-primary mr-1">{chip.k}:</span> {chip.v}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                      {parsedMsg}
                    </div>
                    <div className="flex gap-2 pt-2">
                       <Button size="sm" variant="secondary" className="font-bold flex items-center gap-2" onClick={() => {
                          navigator.clipboard.writeText(parsedMsg);
                          toast.success("Copied!");
                       }}>
                         <Copy className="h-4 w-4" /> Copy
                       </Button>
                       <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={() => {
                          window.open(`https://wa.me/${parsedContact}?text=${encodeURIComponent(parsedMsg)}`, '_blank');
                       }}>
                         Open in WhatsApp
                       </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Main Generator Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Template Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Mode</h3>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
                   <button 
                    onClick={() => { setOutreachType('property'); setSelectedTmpl('low_visibility'); }}
                    className={cn("flex-1 py-2 rounded-xl text-xs font-black transition-all", outreachType === 'property' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                   >
                     Property Owner
                   </button>
                   <button 
                    onClick={() => { setOutreachType('flatmate'); setSelectedTmpl('flatmate_intro'); }}
                    className={cn("flex-1 py-2 rounded-xl text-xs font-black transition-all", outreachType === 'flatmate' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                   >
                     Flatmate
                   </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Choose Template</h3>
                {(outreachType === 'property' ? TEMPLATES : FLATMATE_TEMPLATES).map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isActive = selectedTmpl === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => setSelectedTmpl(tmpl.id)}
                      className={cn(
                        "w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all duration-200 border",
                        isActive 
                          ? "bg-white border-primary shadow-xl shadow-primary/5 scale-[1.02] ring-1 ring-primary/20" 
                          : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
                      )}
                    >
                      <div className={cn("p-3 rounded-xl shrink-0", tmpl.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{tmpl.title}</span>
                          <Badge variant="outline" className="text-[9px] font-black tracking-widest px-1.5 py-0 border-slate-200">{tmpl.badge}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{tmpl.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generator Form & Output */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", (outreachType === 'property' ? TEMPLATES : FLATMATE_TEMPLATES).find(t=>t.id===selectedTmpl)?.color)}>
                           {(() => {
                             const tmpl = (outreachType === 'property' ? TEMPLATES : FLATMATE_TEMPLATES).find(t=>t.id===selectedTmpl);
                             if (!tmpl) return null;
                             const Icon = tmpl.icon;
                             return <Icon className="h-4 w-4" />;
                           })()}
                        </div>
                        <CardTitle className="text-base font-black tracking-tight">{(outreachType === 'property' ? TEMPLATES : FLATMATE_TEMPLATES).find(t=>t.id===selectedTmpl)?.title}</CardTitle>
                     </div>
                     <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none font-black">{(outreachType === 'property' ? TEMPLATES : FLATMATE_TEMPLATES).find(t=>t.id===selectedTmpl)?.badge}</Badge>
                   </div>
                </CardHeader>
                <CardContent className="p-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{outreachType === 'property' ? 'Owner Name' : 'Flatmate Name'}</Label>
                        <Input placeholder={outreachType === 'property' ? "e.g. Ramesh Garu" : "e.g. Rahul"} value={ownerName} onChange={e=>setOwnerName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</Label>
                        <Input placeholder="e.g. Priya, Nestil" value={agentName} onChange={e=>setAgentName(e.target.value)} />
                      </div>
                      {outreachType === 'property' && (
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Seen On Platform</Label>
                          <Select value={platform} onValueChange={setPlatform}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Platform" />
                            </SelectTrigger>
                            <SelectContent>
                               <SelectItem value="MagicBricks">MagicBricks</SelectItem>
                               <SelectItem value="99acres">99acres</SelectItem>
                               <SelectItem value="NoBroker">NoBroker</SelectItem>
                               <SelectItem value="Facebook">Facebook</SelectItem>
                               <SelectItem value="OLX">OLX</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className={cn("space-y-2", outreachType === 'flatmate' ? "md:col-span-1" : "")}>
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</Label>
                        <Input placeholder="e.g. Gachibowli, Hyd" value={propLocation} onChange={e=>setPropLocation(e.target.value)} />
                      </div>
                   </div>

                   <div className="mt-8 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tone</Label>
                        <div className="flex flex-wrap gap-2">
                          {TONES.map(t => (
                            <Button 
                              key={t}
                              variant={tone === t ? "default" : "outline"}
                              size="sm"
                              className={cn("rounded-xl font-bold", tone === t ? "bg-primary" : "text-slate-500")}
                              onClick={() => setTone(t)}
                            >
                              {t}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Language</Label>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map(l => (
                            <Button 
                              key={l.id}
                              variant={lang === l.id ? "default" : "outline"}
                              size="sm"
                              className={cn("rounded-xl font-bold", lang === l.id ? "bg-violet-600" : "text-slate-500")}
                              onClick={() => setLang(l.id)}
                            >
                              {l.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                   </div>

                   <Button className="w-full mt-10 h-14 rounded-2xl bg-slate-900 text-white font-black text-lg hover:bg-black shadow-2xl transition-all" onClick={handleGenerate}>
                      ⚡ Generate Outreach Message
                   </Button>
                </CardContent>
              </Card>

              {generatedMsg && (
                <Card className="border-none shadow-2xl shadow-primary/10 rounded-3xl overflow-hidden bg-white animate-in zoom-in-95 duration-300">
                   <CardHeader className="bg-primary/5 border-b border-primary/10">
                      <div className="flex items-center justify-between">
                         <CardTitle className="text-sm font-black text-primary uppercase tracking-widest">Generated Output</CardTitle>
                         <div className="text-[10px] font-bold text-slate-400">{generatedMsg.length} characters</div>
                      </div>
                   </CardHeader>
                   <CardContent className="p-8">
                      <div className="text-slate-700 whitespace-pre-wrap leading-relaxed font-medium bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        {generatedMsg}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                         <Button variant="outline" className="font-bold h-12 rounded-xl" onClick={() => {
                            navigator.clipboard.writeText(generatedMsg);
                            toast.success("Copied!");
                         }}>
                            <Copy className="h-4 w-4 mr-2" /> Copy
                         </Button>
                         <Button variant="outline" className="font-bold h-12 rounded-xl text-emerald-600 border-emerald-100 hover:bg-emerald-50" onClick={() => {
                            window.open(`https://wa.me/?text=${encodeURIComponent(generatedMsg)}`, '_blank');
                         }}>
                            <MessageSquare className="h-4 w-4 mr-2" /> WhatsApp
                         </Button>
                         <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20" onClick={handleSaveLead}>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Save Lead
                         </Button>
                      </div>
                   </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="animate-in fade-in duration-500">
           <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-8">
                 <div>
                   <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Saved Outreach Leads</CardTitle>
                   <CardDescription className="font-medium">Export this list to Excel for tracking and follow-ups.</CardDescription>
                 </div>
                 <div className="flex items-center gap-2">
                   <Input 
                    placeholder="Search by name, platform..." 
                    className="w-full md:w-64 bg-white"
                    value={searchQuery}
                    onChange={e=>setSearchQuery(e.target.value)}
                   />
                   <Button variant="outline" className="font-bold bg-white" onClick={handleExport}>
                     <Download className="h-4 w-4 mr-2" /> Export
                   </Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Owner</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Source</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Template</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Date</TableHead>
                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-400">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {savedLeads.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.platform.toLowerCase().includes(searchQuery.toLowerCase())).map((lead) => (
                        <TableRow key={lead.id} className="group hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <div className="font-bold text-slate-900">{lead.name}</div>
                            <div className="text-xs text-slate-500 font-medium">{lead.contact}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tighter">
                              {lead.platform}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-bold text-slate-700">{lead.template}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lead.language}</div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-400 font-medium">
                            {lead.date.split(',')[0]}
                          </TableCell>
                          <TableCell className="text-right">
                             <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-500" onClick={() => handleDeleteLead(lead.id)}>
                               <Trash2 className="h-4 w-4" />
                             </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {savedLeads.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium italic">
                            No leads saved yet. Start generating scripts to build your list.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
