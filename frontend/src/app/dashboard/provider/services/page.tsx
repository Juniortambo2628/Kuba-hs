"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
 Plus, 
 Trash2, 
 Loader2, 
 Check, 
 X,
 Briefcase,
 PenTool
} from "lucide-react";
import { toast } from "sonner";
import { KubaFilePond } from "@/components/ui/filepond";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { ProviderService, Service, Category } from "@/types";

export default function ServicesManagement() {
  const [services, setServices] = useState<ProviderService[]>([]);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ 
    service_id: "", 
    base_price: "",
    pricing_type: "fixed",
    min_hours: "1",
    travel_fee: "0",
    equipment_included: false
  });
  const [editingService, setEditingService] = useState<ProviderService | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/services");
      setServices(res.data.services);
      setAvailableServices(res.data.available_services);
    } catch (err) {
      toast.error("Failed to load services");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveService = async () => {
    if (!newService.service_id || (newService.base_price === "")) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      if (editingService) {
        await axiosInstance.put(`/api/provider/services/${editingService.id}`, {
          ...newService,
          id: editingService.id
        });
        toast.success("Service updated successfully");
      } else {
        await axiosInstance.post("/api/provider/services", newService);
        toast.success("Service added successfully");
      }
      setNewService({ 
        service_id: "", 
        base_price: "",
        pricing_type: "fixed",
        min_hours: "1",
        travel_fee: "0",
        equipment_included: false
      });
      setIsAdding(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      toast.error(editingService ? "Failed to update service" : "Failed to add service");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/provider/services/${id}`);
      toast.success("Service removed");
      fetchServices();
    } catch (err) {
      toast.error("Failed to remove service");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  const filteredServices = services.filter((s: ProviderService) =>
    s.service?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.service?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Manage Services</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your offerings and pricing.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl font-semibold px-6 transition-all shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {isAdding && (
        <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-[10px] font-semibold tracking-normal text-muted-foreground">{editingService ? "Update Service Content" : "New Service Offering"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground tracking-normal ml-1">Select Service</label>
                <select
                  className="w-full h-12 bg-muted border-none rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  value={newService.service_id}
                  onChange={(e) => setNewService({ ...newService, service_id: e.target.value })}
                >
                  <option value="">Choose a service...</option>
                  {availableServices.map((s: Service) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category?.name})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground tracking-normal ml-1">Rate Type</label>
                <select
                  className="w-full h-12 bg-muted border-none rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  value={newService.pricing_type}
                  onChange={(e) => setNewService({ ...newService, pricing_type: e.target.value })}
                >
                  <option value="fixed">Fixed Rate</option>
                  <option value="hourly">Hourly Rate</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground tracking-normal ml-1">{newService.pricing_type === 'hourly' ? 'Price per Hour (KES)' : 'Base Price (KES)'}</label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={newService.base_price || ""}
                  onChange={(e) => setNewService({ ...newService, base_price: e.target.value })}
                  className="h-12 bg-muted border-none rounded-xl px-4 font-bold"
                />
              </div>

              {newService.pricing_type === 'hourly' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-muted-foreground tracking-normal ml-1">Minimum Hours</label>
                  <Input
                    type="number"
                    min="1"
                    value={newService.min_hours}
                    onChange={(e) => setNewService({ ...newService, min_hours: e.target.value })}
                    className="h-12 bg-muted border-none rounded-xl px-4 font-bold"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-muted-foreground tracking-normal ml-1">Travel Fee (KES)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newService.travel_fee}
                  onChange={(e) => setNewService({ ...newService, travel_fee: e.target.value })}
                  className="h-12 bg-muted border-none rounded-xl px-4 font-bold"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={newService.equipment_included}
                    onChange={(e) => setNewService({ ...newService, equipment_included: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-semibold text-foreground">Equipment Included</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button variant="ghost" onClick={() => {
                setIsAdding(false);
                setEditingService(null);
                setNewService({ 
                  service_id: "", 
                  base_price: "",
                  pricing_type: "fixed",
                  min_hours: "1",
                  travel_fee: "0",
                  equipment_included: false
                });
              }} className="rounded-xl font-semibold tracking-normal text-[10px]">Cancel</Button>
              <Button onClick={handleSaveService} className="bg-primary hover:bg-black text-white rounded-xl font-semibold px-8">
                {editingService ? 'Update Service' : 'Confirm & Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <DataToolbar 
        search={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search services..."
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={[]}
      />

      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {filteredServices.length === 0 ? (
          <div className="col-span-full bg-transparent rounded-[2.5rem] p-20 flex flex-col items-center gap-4 text-muted-foreground border-2 border-dashed border-border ">
            <Briefcase className="w-12 h-12 opacity-10" />
            <p className="text-[10px] font-semibold tracking-normal">No services configured yet</p>
          </div>
        ) : filteredServices.map((s) => (
          <Card key={s.id} className="border border-border group border-none bg-card/50 backdrop-blur-md shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            <CardContent className={`p-6 flex flex-1 ${viewMode === 'list' ? 'flex-row items-center justify-between gap-8' : 'flex-col gap-6'}`}>
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-foreground group-hover:text-primary transition-colors shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="space-y-1 w-full">
                  <div className="flex items-center gap-2 text-[8px] font-semibold tracking-normal">
                    <span className="text-foreground py-1 px-2 bg-muted/50 rounded-md border border-border">{s.service?.category?.name}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">{s.service?.name}</h3>
                  
                  {/* Image Gallery */}
                  {viewMode === 'grid' && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide w-full max-w-[300px]">
                      {s.image_urls?.map((img: any) => (
                        <div key={img.id} className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-border group/img">
                          <img src={img.url} className="w-full h-full object-cover" alt="" />
                          <button 
                            onClick={async () => {
                              try {
                                await axiosInstance.delete(`/api/media/${img.id}`);
                                toast.success("Image removed");
                                fetchServices();
                              } catch (err) {
                                toast.error("Failed to remove image");
                              }
                            }}
                            className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="w-14 h-14 rounded-xl border-border flex items-center justify-center flex-shrink-0 relative bg-muted/50 overflow-hidden">
                        <KubaFilePond 
                          modelType="provider_service"
                          modelId={s.id.toString()}
                          collection="services"
                          allowMultiple={true}
                          onSuccess={() => {
                            toast.success("Image uploaded");
                            fetchServices();
                          }}
                          label='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`flex ${viewMode === 'list' ? 'items-center gap-8' : 'items-center justify-between border-t border-border pt-4 w-full mt-auto'}`}>
                <div className={viewMode === 'list' ? 'text-right' : ''}>
                  <p className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">{s.pricing_type === 'hourly' ? 'Hourly Rate' : 'Fixed Rate'}</p>
                  <p className="text-xl font-bold text-foreground -mt-1">KES {Number(s.base_price || 0).toLocaleString()}{s.pricing_type === 'hourly' && <span className="text-xs text-muted-foreground font-normal ml-1">/hr</span>}</p>
                  {s.pricing_type === 'hourly' && Number(s.min_hours) > 1 && (
                    <p className="text-[9px] text-blue-600 font-bold uppercase tracking-tight mt-1">Min {s.min_hours} Hours</p>
                  )}
                  {Number(s.travel_fee) > 0 && (
                    <p className="text-[9px] text-muted-foreground font-semibold mt-0.5">+ KES {s.travel_fee} travel fee</p>
                  )}
                  {s.equipment_included && (
                    <p className="text-[9px] text-green-600 font-bold uppercase mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Equipment Included
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => {
                      setEditingService(s);
                      setNewService({ 
                        service_id: s.service_id.toString(), 
                        base_price: s.base_price.toString(),
                        pricing_type: s.pricing_type || "fixed",
                        min_hours: (s.min_hours || "1").toString(),
                        travel_fee: (s.travel_fee || "0").toString(),
                        equipment_included: !!s.equipment_included
                      });
                      setIsAdding(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all border border-border bg-background shadow-sm"
                  >
                    <PenTool className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="p-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100 bg-white shadow-sm"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
