"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Save,
  Lock,
  BellRing,
  Activity,
  MapPin,
  Plus,
  Loader2,
  ShieldCheck,
  Zap,
  Trash2
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { KubaFilePond } from "@/components/ui/filepond";

export default function ProfileSettings() {
  const { user, isLoading: authLoading, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
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
      setProfileForm({ name: user.name || "", email: user.email || "" });
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
      toast.success("Address added successfully");
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
      toast.error("Failed to add address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      await axiosInstance.delete(`/api/client/addresses/${id}`);
      toast.success("Address removed");
      fetchAddresses();
    } catch (err) {
      toast.error("Failed to remove address");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await axiosInstance.put("/api/client/profile", profileForm);
      toast.success("Profile updated successfully");
      await checkAuth(); // Refresh user data in context
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[500px] rounded-[2.5rem] lg:col-span-1" />
          <Skeleton className="h-[500px] rounded-[2.5rem] lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Account <span className="text-sky-600">Identity</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Manage your personal marketplace credentials and preferences.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Visualization */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="premium-card overflow-hidden border-none text-center grayscale hover:grayscale-0 transition-all duration-700">
            <CardContent className="p-10">
              <div className="relative inline-block mb-8 group">
                <div className="w-40 h-40 rounded-[3rem] bg-[#F8FAFC] flex items-center justify-center text-[#1E293B] border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-700 overflow-hidden relative">
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-5xl font-black">{user?.name?.[0] || 'U'}</span>
                    )}
                    <div className="absolute inset-0 bg-sky-600/0 group-hover:bg-sky-600/5 transition-all"></div>
                </div>
                <div className="absolute -bottom-2 -right-2 p-0 bg-sky-600 text-white rounded-[1.5rem] shadow-[0_10px_30px_rgba(2,132,199,0.3)] hover:bg-black transition-all overflow-hidden w-12 h-12 flex items-center justify-center">
                  <KubaFilePond 
                    modelType="user"
                    modelId={user?.id?.toString() || ""}
                    collection="avatars"
                    onSuccess={() => {
                        toast.success("Avatar updated");
                        window.location.reload(); // Simplest way to refresh all avatars including sidebar
                    }}
                    label='<span class="text-white">...</span>'
                  />
                  <Camera className="w-5 h-5 absolute pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 mb-10">
                <h2 className="text-2xl font-black text-[#1E293B] uppercase tracking-tight">{user?.name}</h2>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-[9px] font-black text-white bg-sky-600 px-3 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-sky-100">Verified Client</span>
                    <span className="text-[9px] font-black text-[#1E293B] bg-gray-50 px-3 py-0.5 rounded-full uppercase tracking-widest">Since 2024</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full h-14 bg-[#1E293B] hover:bg-sky-600 text-white border-none rounded-2xl transition-all shadow-xl shadow-gray-100 font-black text-[10px] tracking-widest uppercase">
                    Sync Marketplace Data
                </Button>
                <p className="text-[10px] font-bold text-gray-300 italic">Your data is secured by Kuba Guard Encryption.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-none bg-emerald-50/50">
            <CardContent className="p-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Security Health</h3>
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="space-y-4">
                <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
                <p className="text-[10px] font-bold text-emerald-700 italic">Your account security is exceptional. 2FA is currently active.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Settings Panel */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="premium-card overflow-hidden border-none shadow-premium bg-white/50 backdrop-blur-md">
            <CardContent className="p-10">
              <div className="flex items-center gap-4 mb-12 border-b border-gray-50 pb-10">
                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#1E293B]">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">Marketplace Credentials</h2>
                    <p className="text-[10px] font-bold text-gray-400 italic">Update your primary contact and identification vectors.</p>
                </div>
              </div>

              <form className="space-y-12" onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Primary Identifier</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-sky-600 transition-colors" />
                      <input 
                        type="text" 
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full h-16 pl-14 pr-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all text-[#1E293B] uppercase tracking-wide" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Digital Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-sky-600 transition-colors" />
                      <input 
                        type="email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full h-16 pl-14 pr-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all text-[#1E293B] italic"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-5">
                     <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl shadow-inner shadow-sky-100">
                        <Lock className="w-6 h-6" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-black text-[#1E293B] uppercase tracking-tight">Security Credentials</p>
                        <p className="text-[10px] font-bold text-gray-300 italic">Periodic rotation is recommended by Kuba Sec.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button 
                      type="submit" 
                      disabled={isSavingProfile} 
                      className="h-12 bg-sky-600 hover:bg-[#1E293B] text-white rounded-[1.25rem] font-black px-10 transition-all text-[10px] tracking-widest uppercase"
                    >
                      {isSavingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Changes
                    </Button>
                    <Button variant="outline" type="button" className="h-12 border-gray-100 text-[#1E293B] hover:text-sky-600 hover:bg-white hover:border-sky-100 rounded-[1.25rem] font-black px-10 transition-all text-[10px] tracking-widest uppercase">
                      Rotate Password
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* New: Address Management Section */}
          <Card className="premium-card overflow-hidden border-none shadow-premium bg-white/50 backdrop-blur-md">
            <CardContent className="p-10">
              <div className="flex items-center justify-between gap-4 mb-12 border-b border-gray-50 pb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#1E293B]">
                    <MapPin className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">Service Locations</h2>
                        <p className="text-[10px] font-bold text-gray-400 italic">Manage your saved addresses for quicker bookings.</p>
                    </div>
                </div>
                {!isAddingAddress && (
                    <Button 
                        onClick={() => setIsAddingAddress(true)}
                        className="h-12 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-black px-6 transition-all uppercase tracking-widest text-[10px]"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add New
                    </Button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleCreateAddress} className="space-y-8 animate-in fade-in slide-in-from-top-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Street Address</label>
                            <input 
                                value={newAddress.street_address}
                                onChange={(e) => setNewAddress({...newAddress, street_address: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Apartment / Unit</label>
                            <input 
                                value={newAddress.apartment}
                                onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">City</label>
                            <input 
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                                required
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Postal Code</label>
                            <input 
                                value={newAddress.postal_code}
                                onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                                className="w-full h-14 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-sky-100 transition-all" 
                                required
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSaving} className="h-14 flex-1 bg-sky-600 hover:bg-[#1E293B] text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Location'}
                        </Button>
                        <Button type="button" onClick={() => setIsAddingAddress(false)} variant="outline" className="h-14 px-10 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                            Cancel
                        </Button>
                    </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length > 0 ? addresses.map((addr) => (
                        <div key={addr.id} className="p-8 bg-[#F8FAFC] rounded-[2rem] relative group border border-transparent hover:border-sky-100 transition-all group">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-black text-[#1E293B] uppercase tracking-wide">{addr.street_address}</p>
                                    {addr.is_default && <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>}
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 italic">{addr.city}, {addr.postal_code}</p>
                            </div>
                            <button 
                                onClick={() => handleDeleteAddress(addr.id)}
                                className="absolute top-8 right-8 p-3 text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-2 py-10 text-center text-gray-300 italic text-[10px] font-bold uppercase tracking-widest">
                            No service locations synchronized.
                        </div>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
