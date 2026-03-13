"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Plus, 
  Home, 
  Map, 
  MoreHorizontal,
  Navigation,
  CheckCircle2,
  Trash2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe,
  Compass
} from "lucide-react";
import { toast } from "sonner";

export default function ServiceAddresses() {
  const { user, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    postal_code: "",
    country: "South Africa",
    is_default: false
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchAddresses();
    }
  }, [authLoading, user]);

  const fetchAddresses = async () => {
    try {
      const res = await axiosInstance.get("/api/client/addresses");
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosInstance.post("/api/client/addresses", newAddress);
      toast.success("Address registered successfully");
      setIsAddingAddress(false);
      setNewAddress({
        street_address: "",
        apartment: "",
        city: "",
        state: "",
        postal_code: "",
        country: "South Africa",
        is_default: false
      });
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to register address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service point?")) return;
    try {
      await axiosInstance.delete(`/api/client/addresses/${id}`);
      toast.success("Service point removed");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to remove service point");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-[2.5rem]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-glow-red">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Service <span className="text-sky-600">Points</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Authorized locales for professional Kuba marketplace fulfillment.
            </p>
        </div>
        {!isAddingAddress && (
            <button 
                onClick={() => setIsAddingAddress(true)}
                className="h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black px-10 shadow-xl shadow-gray-100 transition-all uppercase tracking-widest text-[11px] flex items-center gap-2 group"
            >
                <Plus className="w-4 h-4 transform group-hover:rotate-90 transition-transform" /> 
                Register New Point
            </button>
        )}
      </div>

      {isAddingAddress && (
        <Card className="premium-card overflow-hidden border-none shadow-premium bg-white animate-in fade-in slide-in-from-top-4">
            <CardContent className="p-10">
                <form onSubmit={handleCreateAddress} className="space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">Provision New Point</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Street Address</label>
                            <input 
                                value={newAddress.street_address || ""}
                                onChange={(e) => setNewAddress({...newAddress, street_address: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Apartment / Unit</label>
                            <input 
                                value={newAddress.apartment || ""}
                                onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">City</label>
                            <input 
                                value={newAddress.city || ""}
                                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Postal Code</label>
                            <input 
                                value={newAddress.postal_code || ""}
                                onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSaving} className="h-14 flex-1 bg-sky-600 hover:bg-[#1E293B] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Dispatch Location'}
                        </Button>
                        <Button type="button" onClick={() => setIsAddingAddress(false)} variant="outline" className="h-14 px-10 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                            Cancel Allocation
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!isAddingAddress && addresses.map((address) => (
          <Card key={address.id} className="premium-card group border-none overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <Globe className="w-24 h-24" />
            </div>
            <CardContent className="p-10 relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl ${address.is_default ? 'bg-sky-50 text-sky-600 shadow-lg shadow-sky-100' : 'bg-[#F8FAFC] text-[#1E293B]'} group-hover:scale-110 transition-transform duration-700`}>
                  <Home className="w-6 h-6" />
                </div>
                <button 
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black text-[#1E293B] uppercase tracking-tight group-hover:text-sky-600 transition-colors">
                        {address.street_address}
                    </h3>
                    {address.is_default && (
                      <span className="text-[8px] font-black bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest">Master</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[#1E293B] font-black text-[9px] uppercase tracking-widest bg-gray-50 inline-flex px-3 py-1 rounded-full opacity-60">
                    <Navigation className="w-3 h-3 text-sky-600" />
                    Dispatch: {address.city}
                  </div>
                </div>

                <div className="p-6 bg-[#F8FAFC] rounded-2xl border border-gray-50 group-hover:bg-white group-hover:border-sky-50 transition-all duration-500">
                  <p className="text-xs font-black text-[#1E293B] leading-relaxed uppercase italic">
                    {address.apartment ? `${address.apartment}, ` : ''}{address.city}, {address.postal_code}
                  </p>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 h-12 border-gray-100 text-[#1E293B] hover:text-sky-600 hover:bg-white hover:border-sky-100 rounded-xl font-black text-[9px] tracking-widest uppercase transition-all group/btn">
                        <Compass className="w-3.5 h-3.5 mr-2 opacity-30 group-hover/btn:opacity-100" />
                        Locate
                    </Button>
                    <Button variant="outline" className="h-12 w-12 border-gray-100 text-gray-300 hover:text-sky-600 hover:bg-white hover:border-sky-100 rounded-xl p-0 transition-all">
                        <Zap className="w-4 h-4" />
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!isAddingAddress && (
            <button 
                onClick={() => setIsAddingAddress(true)}
                className="rounded-[3rem] border-2 border-dashed border-gray-100 p-10 flex flex-col items-center justify-center gap-6 text-gray-300 hover:border-red-200 hover:bg-sky-50/20 transition-all duration-700 group min-h-[350px]"
            >
            <div className="w-20 h-20 rounded-[2.5rem] border-2 border-gray-50 bg-[#F8FAFC] flex items-center justify-center group-hover:border-red-200 group-hover:scale-110 group-hover:bg-white transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:shadow-sky-50">
                <Plus className="w-8 h-8 text-gray-200 group-hover:text-sky-600 group-hover:rotate-90 transition-all duration-700" />
            </div>
            <div className="text-center space-y-2">
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#1E293B] opacity-40 group-hover:opacity-100 transition-opacity">Provision New Point</span>
                <span className="block text-[9px] font-bold text-gray-300 italic">Expand your service area footprint</span>
            </div>
            </button>
        )}
      </div>

      {addresses.length === 0 && (
        <Card className="premium-card p-12 flex items-center justify-center text-center bg-amber-50/30 border-none">
          <div className="max-w-md space-y-6">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto opacity-20" />
            <div className="space-y-2">
                <p className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Geolocation Deficiency</p>
                <p className="text-xs font-bold text-gray-400 italic">No authorized service points detected. Please register a residence to enable Kuba marketplace logistics.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
