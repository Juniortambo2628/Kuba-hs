"use client";

import { useState } from "react";
import { 
  Inbox, 
  MessageSquare, 
  Quote, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Mail,
  User,
  Zap,
  ArrowRight,
  ShieldAlert,
  Archive,
  Loader2,
  Star
} from "lucide-react";
import { useApiData } from "@/hooks/useApiData";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

interface UnifiedMessage {
    id: number;
    type: 'contact' | 'feedback' | 'quote';
    sender: string;
    subject: string;
    content: string;
    status: string;
    created_at: string;
    meta?: any;
}

export default function MessagingHubPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    
    // Fetch individual streams
    const { data: contactData, refetch: refetchContacts } = useApiData<any[]>("/api/admin/contact", { initialData: [] });
    const { data: feedbackData, refetch: refetchFeedback } = useApiData<any[]>("/api/admin/feedback", { initialData: [] });
    const { data: quoteData, refetch: refetchQuotes } = useApiData<any[]>("/api/admin/quotes", { initialData: [] });
    
    const { data: summary, isLoading: summaryLoading } = useApiData<any>("/api/admin/messages-summary", { initialData: null });

    // Normalize streams into a unified format
    const messages: UnifiedMessage[] = [
        ...(contactData || []).map(m => ({
            id: m.id,
            type: 'contact' as const,
            sender: m.name,
            subject: m.subject || 'General Inquiry',
            content: m.message,
            status: m.status,
            created_at: m.created_at,
            meta: { email: m.email, phone: m.phone }
        })),
        ...(feedbackData || []).map(f => ({
            id: f.id,
            type: 'feedback' as const,
            sender: f.user?.name || 'Anonymous User',
            subject: f.feedback_type || 'User Feedback',
            content: f.comment,
            status: f.status,
            created_at: f.created_at,
            meta: { rating: f.rating }
        })),
        ...(quoteData || []).map(q => ({
            id: q.id,
            type: 'quote' as const,
            sender: q.organization_name,
            subject: `RFP: ${q.service_category}`,
            content: q.description,
            status: q.status,
            created_at: q.created_at,
            meta: { contact: q.contact_person, email: q.email }
        }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const filteredMessages = messages.filter(m => {
        const matchesTab = activeTab === "all" || m.type === activeTab;
        const matchesSearch = 
            m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const [selectedMessage, setSelectedMessage] = useState<UnifiedMessage | null>(null);

    const handleUpdateStatus = async (msg: UnifiedMessage, newStatus: string) => {
        try {
            const endpoint = msg.type === 'contact' ? `/api/admin/contact/${msg.id}/status` :
                             msg.type === 'feedback' ? `/api/admin/feedback/${msg.id}` :
                             `/api/admin/quotes/${msg.id}/status`;
            
            await axiosInstance.patch(endpoint, { status: newStatus });
            toast.success("Status synchronized");
            refetchContacts();
            refetchFeedback();
            refetchQuotes();
            if (selectedMessage?.id === msg.id && selectedMessage?.type === msg.type) {
                setSelectedMessage({ ...selectedMessage, status: newStatus });
            }
        } catch (err) {
            toast.error("Cross-module synchronization failed");
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            <DashboardPageHeader 
                title="Messaging Control Room" 
                subtitle="High-speed aggregation of platform signals, inquiries, and user sentiment."
            />

            {/* Pulse Stats Overlay */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Pending", value: summary?.counts?.total || 0, icon: Inbox, color: "text-primary bg-primary/10" },
                    { label: "Support Tickets", value: summary?.counts?.contacts || 0, icon: Mail, color: "text-blue-600 bg-blue-50" },
                    { label: "Partner Quotes", value: summary?.counts?.quotes || 0, icon: Quote, color: "text-amber-600 bg-amber-50" },
                    { label: "User Feedback", value: summary?.counts?.feedback || 0, icon: MessageSquare, color: "text-emerald-600 bg-emerald-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none bg-card/60 backdrop-blur-sm shadow-sm rounded-2xl">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-black text-foreground mt-1">{stat.value}</p>
                            </div>
                            <div className={cn("p-3 rounded-xl", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[750px]">
                {/* Inbox List */}
                <div className="lg:col-span-4 flex flex-col h-full space-y-4">
                    <div className="space-y-4 px-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search all streams..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 bg-card/50 border-none rounded-2xl shadow-sm font-bold text-xs"
                            />
                        </div>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="bg-muted/50 p-1 rounded-2xl w-full">
                                <TabsTrigger value="all" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest">All</TabsTrigger>
                                <TabsTrigger value="contact" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest">Support</TabsTrigger>
                                <TabsTrigger value="quote" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest">Quotes</TabsTrigger>
                                <TabsTrigger value="feedback" className="flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest">Sentiment</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 px-2 custom-scrollbar pr-2">
                        {filteredMessages.map((msg) => (
                            <div 
                                key={`${msg.type}-${msg.id}`}
                                onClick={() => setSelectedMessage(msg)}
                                className={cn(
                                    "p-5 rounded-3xl cursor-pointer border transition-all relative group",
                                    selectedMessage?.id === msg.id && selectedMessage?.type === msg.type
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                                        : "bg-card/40 border-border hover:bg-card hover:border-border/80 shadow-sm"
                                )}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em]",
                                        selectedMessage?.id === msg.id && selectedMessage?.type === msg.type
                                            ? "bg-white/20" 
                                            : msg.type === 'quote' ? "bg-amber-500/10 text-amber-600" :
                                              msg.type === 'feedback' ? "bg-emerald-500/10 text-emerald-600" :
                                              "bg-blue-500/10 text-blue-600"
                                    )}>
                                        {msg.type}
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-bold uppercase",
                                        selectedMessage?.id === msg.id && selectedMessage?.type === msg.type ? "text-white/60" : "text-muted-foreground"
                                    )}>
                                        {new Date(msg.created_at).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                                <h4 className="text-[13px] font-black mb-1 truncate">{msg.sender}</h4>
                                <p className={cn(
                                    "text-[11px] font-bold truncate opacity-80",
                                    selectedMessage?.id === msg.id && selectedMessage?.type === msg.type ? "text-white" : "text-foreground"
                                )}>{msg.subject}</p>
                                <div className={cn(
                                    "mt-3 pt-3 border-t text-[10px] font-bold uppercase tracking-widest flex items-center justify-between",
                                    selectedMessage?.id === msg.id && selectedMessage?.type === msg.type ? "border-white/10" : "border-border/40"
                                )}>
                                    <span className="flex items-center gap-1.5 capitalize">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", msg.status === 'pending' ? 'bg-amber-400' : 'bg-emerald-400')} />
                                        {msg.status}
                                    </span>
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}

                        {filteredMessages.length === 0 && (
                            <div className="py-20 text-center space-y-4 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/50">
                                <Zap className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clear Skies: No pending signals</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-8 h-full">
                    <Card className="h-full border-none bg-card/40 backdrop-blur-md shadow-sm rounded-[2.5rem] overflow-hidden flex flex-col">
                        {selectedMessage ? (
                            <>
                                <div className="p-10 border-b border-border/40 flex justify-between items-start">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-primary shadow-sm">
                                                <User className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{selectedMessage.type} Identity</p>
                                                <h3 className="text-2xl font-black text-foreground tracking-tight">{selectedMessage.sender}</h3>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 pt-2">
                                            {selectedMessage.meta.email && (
                                                <div className="px-4 py-2 bg-muted/50 rounded-xl text-[11px] font-bold text-foreground border border-border/40 flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-primary" /> {selectedMessage.meta.email}
                                                </div>
                                            )}
                                            {selectedMessage.meta.rating && (
                                                <div className="px-4 py-2 bg-emerald-500/10 rounded-xl text-[11px] font-bold text-emerald-600 border border-emerald-500/20 flex items-center gap-2">
                                                    <Star className="w-3.5 h-3.5" /> Sentiment: {selectedMessage.meta.rating}/5
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button 
                                            onClick={() => handleUpdateStatus(selectedMessage, 'replied')}
                                            disabled={selectedMessage.status === 'replied'}
                                            className="h-12 bg-primary hover:bg-black text-white px-6 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20"
                                        >
                                            Mark as Replied
                                        </Button>
                                        <Button variant="outline" className="h-12 border-border/60 hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-2xl px-6 font-bold text-[11px] uppercase tracking-widest transition-all">
                                            <Archive className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 p-10 overflow-y-auto">
                                    <div className="space-y-8 max-w-3xl">
                                        <div className="space-y-2">
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Inquiry Narrative</h4>
                                            <h5 className="text-xl font-bold text-foreground">{selectedMessage.subject}</h5>
                                        </div>
                                        <div className="p-8 bg-muted/30 rounded-[2rem] border border-border/40">
                                            <p className="text-sm leading-relaxed text-foreground font-medium whitespace-pre-wrap">
                                                {selectedMessage.content}
                                            </p>
                                        </div>
                                        
                                        {selectedMessage.type === 'quote' && (
                                            <div className="grid grid-cols-2 gap-6 bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/10">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-600/60">Compliance POC</p>
                                                    <p className="text-sm font-bold text-foreground">{selectedMessage.meta.contact}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-600/60">Request Class</p>
                                                    <p className="text-sm font-bold text-foreground">Strategic Enterprise RFP</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-8 border-t border-border/40 bg-muted/10 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShieldAlert className="w-5 h-5 text-muted-foreground/40" />
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Control Signal ID: {selectedMessage.type}-{selectedMessage.id}</p>
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Received {new Date(selectedMessage.created_at).toLocaleString()}</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6">
                                <div className="w-24 h-24 rounded-[2rem] bg-card flex items-center justify-center text-muted-foreground/10 border-4 border-dashed border-border shadow-inner">
                                    <Inbox className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black italic tracking-tight text-foreground/20">Operational Silence</h3>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] max-w-[280px]">Select a communication artifact from the inbox to begin oversight flow.</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
