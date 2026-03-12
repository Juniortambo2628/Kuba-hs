import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { 
    Save, Globe, Info, Layout, Camera, Share2, 
    Settings, CheckCircle2, CloudFog, Image as ImageIcon,
    Type, AlignLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardShell from '@/Components/DashboardShell';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { toast } from "sonner";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register plugins
registerPlugin(FilePondPluginImagePreview);

export default function CMSIndex({ settings }) {
    const [activeTab, setActiveTab] = useState('general');
    
    // Flatten settings for useForm
    const flatSettings = Object.values(settings).flat();
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        settings: flatSettings.map(s => ({ 
            id: s.id, 
            key: s.key, 
            value: s.value, 
            group: s.group, 
            label: s.label, 
            type: s.type 
        }))
    });

    const handleValueChange = (id, newValue) => {
        const updatedSettings = data.settings.map(s => 
            s.id === id ? { ...s, value: newValue } : s
        );
        setData('settings', updatedSettings);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.cms.update'), {
            onSuccess: () => toast.success("CMS configuration updated successfully!"),
        });
    };

    const tabList = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'hero', label: 'Hero Section', icon: Camera },
        { id: 'about', label: 'About Page', icon: Info },
        { id: 'sections', label: 'Core Sections', icon: Layout },
        { id: 'social', label: 'Social Media', icon: Share2 },
        { id: 'config', label: 'Configuration', icon: Settings },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Platform Configuration" />

            <DashboardShell
                title="CMS Configuration"
                subtitle="Modify public site content, branding, and platform-wide parameters from a central hub."
            >
                <div className="max-w-5xl mx-auto space-y-8 pb-32">
                    <form onSubmit={submit}>
                        <Tabs defaultValue="general" className="w-full" onValueChange={setActiveTab}>
                            <div className="flex items-center justify-between mb-8 sticky top-0 z-20 bg-background/80 backdrop-blur-md py-4 border-b">
                                <TabsList className="bg-muted/50 p-1 rounded-xl h-12">
                                    {tabList.map((tab) => (
                                        <TabsTrigger 
                                            key={tab.id} 
                                            value={tab.id}
                                            className="px-6 rounded-lg text-xs font-bold uppercase tracking-widest data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                        >
                                            <tab.icon className="h-3.5 w-3.5 mr-2 opacity-70" />
                                            {tab.label}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                <div className="flex items-center gap-4">
                                    {recentlySuccessful && (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black animate-in fade-in slide-in-from-right-2">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Live Sync Successful
                                        </Badge>
                                    )}
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="shadow-lg shadow-primary/10 px-8"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Syncing...' : 'Save Configuration'}
                                    </Button>
                                </div>
                            </div>

                            {tabList.map((tab) => (
                                <TabsContent key={tab.id} value={tab.id} className="mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0">
                                    <div className="grid grid-cols-1 gap-6">
                                        {data.settings.filter(s => s.group === tab.id).map((setting) => (
                                            <div key={setting.id} className="bg-card rounded-2xl border shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
                                                <div className="p-6 border-b bg-muted/20 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-background border flex items-center justify-center">
                                                            {setting.type === 'textarea' ? <AlignLeft className="h-4 w-4 text-primary" /> : 
                                                             setting.type === 'image' ? <ImageIcon className="h-4 w-4 text-emerald-500" /> : 
                                                             <Type className="h-4 w-4 text-blue-500" />}
                                                        </div>
                                                        <h4 className="text-sm font-bold text-foreground">{setting.label}</h4>
                                                    </div>
                                                    <code className="text-[10px] font-mono font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                        setting:: {setting.key}
                                                    </code>
                                                </div>

                                                <div className="p-8">
                                                    {setting.type === 'textarea' ? (
                                                        <Textarea
                                                            value={setting.value || ''}
                                                            onChange={(e) => handleValueChange(setting.id, e.target.value)}
                                                            className="min-h-[160px] resize-none text-base font-medium bg-muted/5 border-muted-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                            placeholder={`Update ${setting.label.toLowerCase()}...`}
                                                        />
                                                    ) : setting.type === 'image' ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                                            {setting.value && (
                                                                <div className="space-y-3">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                                        <ImageIcon className="h-3 w-3" /> Current Asset
                                                                    </p>
                                                                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-white shadow-xl group/asset">
                                                                        <img src={setting.value} alt="" className="w-full h-full object-cover transition-transform group-hover/asset:scale-105 duration-700" />
                                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/asset:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="space-y-3">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                                    <CloudFog className="h-3 w-3" /> Upload Replacement
                                                                </p>
                                                                <div className="cms-filepond-wrapper rounded-xl overflow-hidden border border-dashed hover:border-primary/50 transition-colors">
                                                                    <FilePond
                                                                        server={{
                                                                            process: {
                                                                                url: route('admin.media.upload'),
                                                                                onload: (response) => {
                                                                                    handleValueChange(setting.id, response);
                                                                                    return response;
                                                                                }
                                                                            },
                                                                            revert: route('admin.media.delete'),
                                                                        }}
                                                                        name="file"
                                                                        labelIdle='Drop replacement or <span class="filepond--label-action font-black text-primary">Browse</span>'
                                                                        className="m-0"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Input
                                                            type="text"
                                                            value={setting.value || ''}
                                                            onChange={(e) => handleValueChange(setting.id, e.target.value)}
                                                            className="text-base font-medium h-12 bg-muted/5 border-muted-foreground/10 focus:border-primary focus:ring-1 focus:ring-primary/20"
                                                            placeholder={`Enter ${setting.label.toLowerCase()}...`}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </form>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}

// Simple internal Badge component for status feedback
function Badge({ children, variant = "default", className }) {
    return (
        <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shrink-0 flex items-center",
            variant === "outline" ? "border-muted-foreground/20 text-muted-foreground" : 
            variant === "emerald" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
            "bg-primary text-white border-primary",
            className
        )}>
            {children}
        </span>
    );
}
