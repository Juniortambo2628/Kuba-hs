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

export default function ServicesManagement() {
  const [services, setServices] = useState<any[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState({ service_id: "", base_price: "" });
  const [editingService, setEditingService] = useState<any>(null);

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
      setNewService({ service_id: "", base_price: "" });
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
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-600" /></div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight">Manage Services</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Configure your offerings and pricing</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="bg-[#1E293B] hover:bg-sky-600 text-white rounded-xl font-black px-6">
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {isAdding && (
        <Card className="border-2 border-sky-100 shadow-xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-sky-600">New Service Offering</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Select Service</label>
                <select 
                  className="w-full h-12 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                  value={newService.service_id}
                  onChange={(e) => setNewService({ ...newService, service_id: e.target.value })}
                >
                  <option value="">Choose a service...</option>
                  {availableServices.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category?.name})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Base Price ($)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 50"
                  value={newService.base_price || ""}
                  onChange={(e) => setNewService({ ...newService, base_price: e.target.value })}
                  className="h-12 bg-gray-50 border-none rounded-xl px-4 font-bold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
              <Button variant="ghost" onClick={() => {
                setIsAdding(false);
                setEditingService(null);
                setNewService({ service_id: "", base_price: "" });
              }} className="rounded-xl font-black uppercase tracking-widest text-[10px]">Cancel</Button>
              <Button onClick={handleSaveService} className="bg-sky-600 hover:bg-black text-white rounded-xl font-black px-8">
                {editingService ? 'Update Service' : 'Confirm & Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {services.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 flex flex-col items-center gap-4 text-gray-300 border-2 border-dashed border-gray-100 italic">
            <Briefcase className="w-12 h-12 opacity-10" />
            <p className="text-[10px] font-black uppercase tracking-widest">No services configured yet</p>
          </div>
        ) : services.map((s: any) => (
          <Card key={s.id} className="premium-card group border-none">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
                    <span className="text-sky-600 py-1 px-2 bg-sky-50 rounded-full">{s.service?.category?.name}</span>
                  </div>
                  <h3 className="text-lg font-black text-[#1E293B] group-hover:text-sky-600 transition-colors uppercase tracking-tight mt-1">{s.service?.name}</h3>
                  
                  {/* Image Gallery */}
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide max-w-[400px]">
                    {s.image_urls?.map((img: any) => (
                      <div key={img.id} className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group/img">
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
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden relative hover:border-sky-200 transition-colors bg-gray-50/50">
                        <KubaFilePond 
                            modelType="provider_service"
                            modelId={s.id.toString()}
                            collection="services"
                            allowMultiple={true}
                            onSuccess={() => {
                                toast.success("Image uploaded");
                                fetchServices();
                            }}
                            label='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
                        />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Base Rate</p>
                  <p className="text-xl font-black text-[#1E293B]">${Number(s.base_price || 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setEditingService(s);
                      setNewService({ service_id: s.service_id, base_price: s.base_price });
                      setIsAdding(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-3 text-gray-300 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                  >
                    <PenTool className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
