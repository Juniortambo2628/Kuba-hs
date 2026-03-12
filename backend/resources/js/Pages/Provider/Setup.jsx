import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
    Briefcase, MapPin, Clock, DollarSign, Plus, Trash2, CheckCircle, 
    ChevronDown, ChevronUp, Sparkles, AlertCircle, Save, Info
} from 'lucide-react';
import DashboardShell from '@/Components/DashboardShell';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { toast } from "sonner";
import { 
    Accordion, 
    AccordionContent, 
    AccordionItem, 
    AccordionTrigger 
} from "@/Components/ui/accordion";

export default function Setup({ categories, provider, selectedServices: initialServices }) {
    const isEditing = !!provider;
    const { auth } = usePage().props;

    const { data, setData, post, put, processing, errors } = useForm({
        business_name: provider?.business_name || '',
        bio: provider?.bio || '',
        experience_years: provider?.experience_years || '',
        location_name: provider?.location_name || '',
        service_radius: provider?.service_radius || 25,
        services: initialServices?.length > 0 ? initialServices : [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('provider.update'), {
                onSuccess: () => toast.success("Profile updated successfully!"),
            });
        } else {
            post(route('provider.store'), {
                onSuccess: () => toast.success("Profile created! Welcome aboard."),
            });
        }
    };

    const addService = (serviceId) => {
        if (data.services.find(s => s.service_id === serviceId)) return;
        setData('services', [...data.services, {
            service_id: serviceId,
            base_price: '',
            pricing_type: 'hourly',
        }]);
    };

    const removeService = (serviceId) => {
        setData('services', data.services.filter(s => s.service_id !== serviceId));
    };

    const updateService = (serviceId, field, value) => {
        setData('services', data.services.map(s => 
            s.service_id === serviceId ? { ...s, [field]: value } : s
        ));
    };

    const getServiceName = (serviceId) => {
        for (const cat of categories) {
            const svc = cat.services?.find(s => s.id === serviceId);
            if (svc) return svc.name;
        }
        return 'Unknown Service';
    };

    const getCategoryName = (serviceId) => {
        for (const cat of categories) {
            if (cat.services?.find(s => s.id === serviceId)) return cat.name;
        }
        return '';
    };

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? 'Edit Business Profile' : 'Provider Setup'} />

            <DashboardShell
                title={isEditing ? 'Business Profile' : 'Provider Registration'}
                subtitle={isEditing 
                    ? 'Manage your professional details and service offerings.' 
                    : 'Tell us about your business to start receiving booking requests.'}
            >
                <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
                    
                    {/* Welcome Banner (only for new providers) */}
                    {!isEditing && (
                        <div className="relative overflow-hidden rounded-2xl bg-[#0D9488] p-8 text-white shadow-xl shadow-teal-500/10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Sparkles className="h-6 w-6 text-amber-300" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-teal-100">Starter Guide</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Welcome to the Provider Portal, {auth.user.first_name}!</h2>
                                <p className="text-teal-50/80 max-w-lg text-sm leading-relaxed">
                                    You're just one step away from joining our network. Complete your business profile 
                                    to specify your expertise and set your rates.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Business Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* General Information */}
                            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                                <div className="p-6 border-b bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Business Details</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">Your public identity on the platform.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="business_name">Legal Business Name *</Label>
                                        <Input
                                            id="business_name"
                                            value={data.business_name}
                                            onChange={e => setData('business_name', e.target.value)}
                                            placeholder="e.g., Kevin's Elite Cleaning"
                                            className={cn(errors.business_name && "border-destructive")}
                                        />
                                        {errors.business_name && <p className="text-xs text-destructive">{errors.business_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Professional Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={data.bio}
                                            onChange={e => setData('bio', e.target.value)}
                                            placeholder="Describe your experience, values, and what set your services apart..."
                                            rows={5}
                                            className="resize-none"
                                        />
                                        <p className="text-[10px] text-muted-foreground text-right italic font-medium">Max 1000 characters</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="experience" className="flex items-center gap-2">
                                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                                Years of Experience
                                            </Label>
                                            <Input
                                                id="experience"
                                                type="number"
                                                value={data.experience_years}
                                                onChange={e => setData('experience_years', e.target.value)}
                                                placeholder="5"
                                                min="0"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="flex items-center gap-2">
                                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                Base Location / City
                                            </Label>
                                            <Input
                                                id="location"
                                                value={data.location_name}
                                                onChange={e => setData('location_name', e.target.value)}
                                                placeholder="e.g., Nairobi, KE"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="radius">Service Coverage Radius</Label>
                                            <Badge variant="outline" className="font-mono text-primary bg-primary/5">{data.service_radius} KM</Badge>
                                        </div>
                                        <Input
                                            id="radius"
                                            type="range"
                                            min="1"
                                            max="200"
                                            step="5"
                                            value={data.service_radius}
                                            onChange={e => setData('service_radius', parseInt(e.target.value))}
                                            className="h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                            <span>1 KM</span>
                                            <span>Local Area Coverage</span>
                                            <span>200 KM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service Selection */}
                            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                                <div className="p-6 border-b bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <Plus className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Services Catalog</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">Select the specific services you provide.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {errors.services && (
                                        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
                                            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                                            <p className="text-xs text-red-800 font-medium">{errors.services}</p>
                                        </div>
                                    )}

                                    <Accordion type="single" collapsible className="space-y-3">
                                        {categories.map(category => (
                                            <AccordionItem key={category.id} value={`cat-${category.id}`} className="border rounded-lg px-2 shadow-sm bg-muted/10">
                                                <AccordionTrigger className="hover:no-underline py-4 px-3">
                                                    <div className="flex items-center gap-3 text-left">
                                                        <span className="text-sm font-bold text-foreground">{category.name}</span>
                                                        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-bold">{category.services?.length || 0}</Badge>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-4 px-3 space-y-2">
                                                    {category.services?.map(service => {
                                                        const isSelected = data.services.find(s => s.service_id === service.id);
                                                        return (
                                                            <div 
                                                                key={service.id} 
                                                                className={cn(
                                                                    "flex items-center justify-between rounded-lg px-4 py-3 transition-all border group",
                                                                    isSelected 
                                                                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                                                                        : "bg-background border-transparent hover:border-muted-foreground/20"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className={cn(
                                                                        "h-2 w-2 rounded-full",
                                                                        isSelected ? "bg-primary animate-pulse" : "bg-muted"
                                                                    )} />
                                                                    <span className="text-sm font-semibold">{service.name}</span>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant={isSelected ? "ghost" : "outline"}
                                                                    size="sm"
                                                                    className={cn(
                                                                        "h-8 text-[10px] font-bold uppercase tracking-wider",
                                                                        isSelected ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-primary hover:bg-primary/5"
                                                                    )}
                                                                    onClick={() => isSelected ? removeService(service.id) : addService(service.id)}
                                                                >
                                                                    {isSelected ? (
                                                                        <><Trash2 className="h-3 w-3 mr-1.5" /> Remove</>
                                                                    ) : (
                                                                        <><Plus className="h-3 w-3 mr-1.5" /> Add Service</>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        );
                                                    })}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Pricing & Meta */}
                        <div className="space-y-8">
                            {/* Pricing Module */}
                            <div className="bg-card rounded-xl border shadow-sm overflow-hidden sticky top-24">
                                <div className="p-6 border-b bg-muted/30">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                            <DollarSign className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Pricing Logic</h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">Configure rates for chosen services.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {data.services.length === 0 ? (
                                        <div className="text-center py-12 px-4 rounded-xl border border-dashed bg-muted/5">
                                            <Info className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                                            <p className="text-xs text-muted-foreground font-medium">No services added yet. Select from the catalog to set your pricing.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                            {data.services.map((svc) => (
                                                <div 
                                                    key={svc.service_id} 
                                                    className="p-4 bg-muted/20 border rounded-xl space-y-3 relative group"
                                                >
                                                    <div className="flex justify-between items-start pr-8">
                                                        <div>
                                                            <p className="text-xs font-bold uppercase tracking-wider text-foreground truncate max-w-[140px]">
                                                                {getServiceName(svc.service_id)}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5 italic">{getCategoryName(svc.service_id)}</p>
                                                        </div>
                                                        <Button
                                                            variant="ghost" 
                                                            size="icon"
                                                            className="h-6 w-6 absolute top-4 right-4 text-muted-foreground hover:text-red-500 rounded-full"
                                                            onClick={() => removeService(svc.service_id)}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="relative">
                                                            <span className="absolute left-2.5 top-2 text-muted-foreground font-bold text-[10px]">$</span>
                                                            <Input
                                                                type="number"
                                                                value={svc.base_price}
                                                                onChange={e => updateService(svc.service_id, 'base_price', e.target.value)}
                                                                placeholder="0.00"
                                                                className="h-8 pl-6 text-xs font-bold font-mono"
                                                            />
                                                        </div>
                                                        <select
                                                            value={svc.pricing_type}
                                                            onChange={e => updateService(svc.service_id, 'pricing_type', e.target.value)}
                                                            className="h-8 rounded-md border text-[10px] font-bold bg-background px-2 focus:ring-1 focus:ring-primary uppercase tracking-tighter"
                                                        >
                                                            <option value="hourly">HOURLY</option>
                                                            <option value="fixed">FIXED</option>
                                                            <option value="per_project">PROJECT</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t border-dashed">
                                        <Button
                                            type="submit"
                                            disabled={processing || data.services.length === 0}
                                            className="w-full h-12 shadow-md shadow-primary/10"
                                        >
                                            {processing ? (
                                                "SAVING CHANGES..."
                                            ) : (
                                                <><Save className="h-4 w-4 mr-2" /> {isEditing ? 'UPDATE PROFILE' : 'FINISH SETUP'}</>
                                            )}
                                        </Button>
                                        <p className="text-[10px] text-center text-muted-foreground font-medium mt-3 uppercase tracking-widest">
                                            Last Saved: {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
