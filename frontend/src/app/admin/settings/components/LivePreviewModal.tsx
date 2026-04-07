"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MonitorSmartphone } from "lucide-react";
import { designSystem } from "@/lib/design-system";
import { CheckCircle2 } from "lucide-react";

interface Setting {
    id: string;
    key: string;
    value: string;
    label: string;
    type: string;
    group: string;
}

interface LivePreviewModalProps {
    sectionId: string;
    currentSettings: Setting[];
}

export function LivePreviewModal({ sectionId, currentSettings }: LivePreviewModalProps) {
    // Helper to get unsaved value
    const val = (key: string, fallback: string = "") => {
        const found = currentSettings.find(s => s.key === key);
        return found?.value || fallback;
    };

    const renderPreview = () => {
        switch (sectionId) {
            case "landing":
                return (
                    <div className="w-full flex justify-center bg-gray-100">
                        {/* Mobile/Desktop Mock Frame */}
                        <div className="w-full max-w-[400px] md:max-w-[800px] bg-white shadow-2xl overflow-hidden overflow-y-auto h-[600px] border border-border/40 scale-95 transform origin-top custom-scrollbar">
                           <div className="h-10 bg-black flex items-center px-4">
                               <div className="flex gap-1.5">
                                   <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                   <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                               </div>
                               <div className="flex-1 text-center text-[9px] font-bold text-white/50">{val('site_name', 'Kuba')} - Landing Page</div>
                           </div>
                           
                           {/* Hero Demo */}
                           <div className="relative min-h-[400px] flex items-center justify-center p-8 text-center" style={{
                               backgroundImage: val('hero_bg_image') ? `url(${val('hero_bg_image')})` : 'none',
                               backgroundSize: 'cover',
                               backgroundPosition: 'center',
                           }}>
                               <div className="absolute inset-0 bg-black/60" />
                               <div className="relative z-10 text-white space-y-4 max-w-lg">
                                   <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase">Platform Welcome</span>
                                   <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-[1.1]">{val('hero_title', 'Everything You Need. One Platform.')}</h1>
                                   <p className="text-sm md:text-base text-white/80 font-medium">{val('hero_subtitle', 'Kuba connects you with verified service providers.')}</p>
                                   <div className="pt-4">
                                       <Button className="rounded-full bg-primary font-bold">{val('hero_button_text', val('hero_cta_text', 'Get Started'))}</Button>
                                   </div>
                               </div>
                           </div>

                           {/* About Demo */}
                           <div className="py-16 px-6 bg-slate-50 text-center space-y-8">
                               <div>
                                   <h2 className={designSystem.typography.section.title}>{val('about_title')}</h2>
                                   <p className={designSystem.typography.section.subtitle}>{val('about_subtitle')}</p>
                               </div>
                               
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                   {[1,2,3].map(i => (
                                       <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-border/40">
                                            <h4 className="font-bold text-sm mb-1">{val(`step_${i}_title`, `Step ${i}`)}</h4>
                                            <p className="text-xs text-muted-foreground">{val(`step_${i}_description`, 'Description text...')}</p>
                                       </div>
                                   ))}
                               </div>
                           </div>
                        </div>
                    </div>
                );
            case "about":
            case "services":
            case "providers":
            case "commercial":
            case "cooperatives":
            case "investors":
            case "contact":
            case "blog":
                return (
                    <div className="w-full flex justify-center bg-gray-100">
                        <div className="w-full max-w-[800px] bg-white shadow-2xl overflow-hidden h-[600px] border border-border/40">
                           <div className="h-10 bg-black flex items-center px-4">
                               <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-muted/20" /><div className="w-3 h-3 rounded-full bg-muted/20" /></div>
                               <div className="flex-1 text-center text-[9px] font-bold text-white/50 capitalize">{sectionId} Detail</div>
                           </div>
                           
                           {/* Hero Demo */}
                           <div className="relative min-h-[300px] flex items-center p-12 text-left" style={{
                               backgroundImage: val(`${sectionId}_hero_image`) ? `url(${val(`${sectionId}_hero_image`)})` : 'none',
                               backgroundSize: 'cover',
                               backgroundPosition: 'center',
                           }}>
                               <div className="absolute inset-0 bg-black/60" />
                               <div className="relative z-10 text-white space-y-4 max-w-lg">
                                   <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest uppercase">{val(`${sectionId}_hero_badge`, `${sectionId} Hub`)}</span>
                                   <h1 className="text-4xl font-black tracking-tighter leading-[1.1]">{val(`${sectionId}_hero_title`, `The ${sectionId} Experience`)}</h1>
                                   <p className="text-sm text-white/80 font-medium">{val(`${sectionId}_hero_subtitle`, 'We offer a wide range of services.')}</p>
                               </div>
                           </div>

                           {/* Body Demo */}
                           {(val('categories_title') || val('value_prop_1_title') || val(`${sectionId}_content`) || val('journal_thesis_title')) && (
                                <div className="p-12 bg-white space-y-6">
                                    <h2 className="text-2xl font-bold">{val('categories_title', val('value_prop_1_title', val('journal_thesis_title', 'Section Highlight')))}</h2>
                                    <p className="text-muted-foreground text-sm">{val('categories_subtitle', val('value_prop_1_desc', val('journal_thesis_body', val(`${sectionId}_content`, 'Body text for this section.'))))}</p>
                                </div>
                           )}
                        </div>
                    </div>
                );
            default:
                return <div className="p-8 text-center text-muted-foreground">Preview not available for this segment.</div>;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-xl text-[10px] font-bold tracking-widest shadow-sm border-primary/20 hover:bg-primary/5 text-primary">
                    <MonitorSmartphone className="w-3.5 h-3.5" /> LIVE PREVIEW
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl p-0 overflow-hidden border-none bg-black/50 backdrop-blur-xl">
                <DialogHeader className="p-4 bg-zinc-950 flex flex-row items-center justify-between border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary">
                            <Eye className="w-4 h-4" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm text-left font-bold text-white uppercase tracking-widest">{sectionId} — Live Reflection</DialogTitle>
                            <p className="text-[10px] text-zinc-500 font-medium text-left">Updates simulate instantly using current field vectors.</p>
                        </div>
                    </div>
                </DialogHeader>
                <div className="bg-zinc-900/50 p-6 md:p-12 overflow-y-auto max-h-[85vh]">
                    {renderPreview()}
                </div>
            </DialogContent>
        </Dialog>
    );
}

