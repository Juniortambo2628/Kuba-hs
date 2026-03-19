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

const getAvatarUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
  return `${baseUrl}/storage/${path.replace('storage/', '')}`;
};

export default function ProfileSettings() {
 const { user, isLoading: authLoading, checkAuth } = useAuth();
 const [isLoading, setIsLoading] = useState(true);
 const [addresses, setAddresses] = useState<any[]>([]);
 const [isSaving, setIsSaving] = useState(false);
 const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ 
    name: "", 
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });
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
    setProfileForm({ 
      name: user.name || "", 
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || ""
    });
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
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
     <h1 className="text-2xl font-bold text-foreground tracking-tight">Account Identity</h1>
     <p className="text-sm text-muted-foreground mt-1">Manage your personal marketplace credentials and preferences.</p>
    </div>
   </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     {/* Profile Visualization */}
     <div className="lg:col-span-1 space-y-6">
      <Card className="border border-border overflow-hidden bg-card/50 backdrop-blur-md shadow-sm transition-all duration-300">
       <CardContent className="p-8">
        <div className="relative inline-block mb-6 group">
         <div className="w-32 h-32 rounded-2xl bg-muted/50 flex items-center justify-center text-foreground border-2 border-border shadow-sm group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
          {user?.avatar_url ? (
            <img src={getAvatarUrl(user.avatar_url) || ""} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl font-semibold">{user?.name?.[0] || 'U'}</span>
          )}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all"></div>
         </div>
         <div className="absolute -bottom-1 -right-1 p-0 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all overflow-hidden w-10 h-10 flex items-center justify-center">
          <KubaFilePond 
           modelType="user"
           modelId={user?.id?.toString() || ""}
           collection="avatars"
           onSuccess={() => {
             toast.success("Avatar updated");
             window.location.reload();
           }}
           label='<span class="text-white">...</span>'
          />
          <Camera className="w-4 h-4 absolute pointer-events-none" />
         </div>
        </div>

        <div className="space-y-2 mb-8 text-center">
         <h2 className="text-xl font-bold text-foreground uppercase tracking-tight">{user?.name}</h2>
         <div className="flex items-center justify-center gap-2">
           <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">Verified Client</span>
           <span className="text-[10px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase tracking-wide">Since 2024</span>
         </div>
        </div>

        <div className="space-y-4">
         <Button className="w-full h-12 bg-primary hover:bg-primary text-white border-none rounded-xl transition-all shadow-md font-bold text-[10px] tracking-wide uppercase">
           Sync Marketplace Data
         </Button>
         <p className="text-[10px] font-bold text-muted-foreground text-center">Protected by Kuba Guard Encryption.</p>
        </div>
       </CardContent>
      </Card>

      <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm">
       <CardContent className="p-8 space-y-6">
        <div className="flex items-center justify-between">
         <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Security Health</h3>
         <Zap className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-4">
         <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full w-[92%] bg-primary rounded-full"></div>
         </div>
         <p className="text-[10px] font-bold text-muted-foreground">Your account protection is optimal. 2FA is active.</p>
        </div>
       </CardContent>
      </Card>
     </div>

     {/* Global Settings Panel */}
     <div className="lg:col-span-2 space-y-8">
      <Card className="border border-border overflow-hidden bg-card/50 backdrop-blur-md shadow-sm">
       <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-10 border-b border-border pb-8">
         <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-foreground border border-border">
          <Activity className="w-5 h-5" />
         </div>
         <div className="space-y-0.5">
           <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Marketplace Credentials</h2>
           <p className="text-[10px] font-bold text-muted-foreground uppercase">Update your primary contact and identification vectors.</p>
         </div>
        </div>

        <form className="space-y-8" onSubmit={handleSaveProfile}>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
           <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">First Name</label>
           <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
             type="text" 
             value={profileForm.first_name}
             onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
             className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground uppercase tracking-wide outline-none shadow-sm" 
            />
           </div>
          </div>
          <div className="space-y-2">
           <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Last Name</label>
           <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
             type="text" 
             value={profileForm.last_name}
             onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
             className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground uppercase tracking-wide outline-none shadow-sm" 
            />
           </div>
          </div>
          <div className="space-y-2">
           <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Digital Address</label>
           <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
             type="email" 
             value={profileForm.email}
             onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
             className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground outline-none shadow-sm"
            />
           </div>
          </div>
          <div className="space-y-2">
           <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Phone Number</label>
           <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
             type="text" 
             value={profileForm.phone}
             onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
             className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground outline-none shadow-sm"
            />
           </div>
          </div>
         </div>

         <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary border border-border shadow-inner">
             <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
             <p className="text-[10px] font-bold text-foreground uppercase tracking-tight">Security Credentials</p>
             <p className="text-[10px] font-bold text-muted-foreground uppercase">Rotation recommended by Kuba Sec.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
           <Button 
            type="submit" 
            disabled={isSavingProfile} 
            className="h-10 flex-1 md:flex-none bg-primary hover:bg-primary text-white rounded-xl font-bold px-8 transition-all text-[10px] tracking-wide uppercase shadow-sm"
           >
            {isSavingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Profile
           </Button>
           <Button variant="outline" type="button" className="h-10 flex-1 md:flex-none border-border text-foreground hover:bg-muted rounded-xl font-bold px-8 transition-all text-[10px] tracking-wide uppercase shadow-sm">
            Rotate Password
           </Button>
          </div>
         </div>
        </form>
       </CardContent>
      </Card>

      {/* Address Management Section */}
      <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm">
       <CardContent className="p-8">
        <div className="flex items-center justify-between gap-4 mb-10 border-b border-border pb-8">
         <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-foreground border border-border">
           <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-foreground uppercase tracking-tight">Service Locations</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Manage your delivery and service endpoints.</p>
          </div>
         </div>
         {!isAddingAddress && (
          <Button 
            onClick={() => setIsAddingAddress(true)}
            className="h-10 bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl font-bold px-6 transition-all uppercase tracking-wide text-[10px] shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Location
          </Button>
         )}
        </div>

        {isAddingAddress ? (
         <form onSubmit={handleCreateAddress} className="space-y-6 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Street Address</label>
              <input 
                value={newAddress.street_address}
                onChange={(e) => setNewAddress({...newAddress, street_address: e.target.value})}
                className="w-full h-12 px-5 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Apartment / Unit</label>
              <input 
                value={newAddress.apartment}
                onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})}
                className="w-full h-12 px-5 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">City</label>
              <input 
                value={newAddress.city}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                className="w-full h-12 px-5 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Postal Code</label>
              <input 
                value={newAddress.postal_code}
                onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                className="w-full h-12 px-5 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none shadow-sm" 
                required
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving} className="h-12 flex-1 bg-primary hover:bg-primary text-white rounded-xl font-bold uppercase tracking-wide text-[10px] shadow-sm">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Location'}
            </Button>
            <Button type="button" onClick={() => setIsAddingAddress(false)} variant="outline" className="h-12 px-8 border-border rounded-xl font-bold uppercase tracking-wide text-[10px] shadow-sm">
              Cancel
            </Button>
          </div>
         </form>
        ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length > 0 ? addresses.map((addr) => (
            <div key={addr.id} className="p-6 bg-muted/30 rounded-2xl relative group border border-border hover:border-primary/50 transition-all shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-bold text-foreground uppercase tracking-wider">{addr.street_address}</p>
                  {addr.is_default && <span className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Default</span>}
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{addr.city}, {addr.postal_code}</p>
              </div>
              <button 
                onClick={() => handleDeleteAddress(addr.id)}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )) : (
            <div className="col-span-2 py-8 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-widest bg-muted/10 rounded-2xl border border-dashed border-border">
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
