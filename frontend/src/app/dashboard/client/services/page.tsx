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
  Map as MapIcon, 
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
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px] rounded-2xl" />
});
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  country: "Kenya",
  latitude: null as number | null,
  longitude: null as number | null,
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
   const payload = {
     ...newAddress,
     latitude: newAddress.latitude || -1.2921, // Nairobi default
     longitude: newAddress.longitude || 36.8219
   };
   await axiosInstance.post("/api/client/addresses", payload);
   toast.success("Address registered successfully");
   setIsAddingAddress(false);
   setNewAddress({
    street_address: "",
    apartment: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Kenya",
    latitude: null,
    longitude: null,
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
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
     <h1 className="text-2xl font-bold text-foreground tracking-tight">Service Points</h1>
     <p className="text-sm text-muted-foreground mt-1">Authorized locales for professional Kuba marketplace fulfillment.</p>
    </div>
    {!isAddingAddress && (
      <Button 
        onClick={() => setIsAddingAddress(true)}
        className="bg-foreground text-background hover:bg-muted hover:text-foreground rounded-xl font-semibold px-6 shadow-md transition-all gap-2"
      >
        <Plus className="w-4 h-4" /> 
        Register New Point
      </Button>
    )}
   </div>

   {isAddingAddress && (
    <Card className="border border-border overflow-hidden border-none shadow-sm bg-white animate-in fade-in slide-in-from-top-4">
      <CardContent className="p-10">
        <form onSubmit={handleCreateAddress} className="space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary">
              <MapPin className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-foreground uppercase tracking-tight">Provision New Point</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-foreground uppercase tracking-normal ml-1 opacity-40">Street Address</label>
              <input 
                value={newAddress.street_address || ""}
                onChange={(e) => setNewAddress({...newAddress, street_address: e.target.value})}
                className="w-full h-14 px-6 bg-muted/50 border-none rounded-2xl text-[11px] font-semibold focus:ring-2 focus:ring-sky-100 transition-all" 
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-foreground uppercase tracking-normal ml-1 opacity-40">Apartment / Unit</label>
              <input 
                value={newAddress.apartment || ""}
                onChange={(e) => setNewAddress({...newAddress, apartment: e.target.value})}
                className="w-full h-14 px-6 bg-muted/50 border-none rounded-2xl text-[11px] font-semibold focus:ring-2 focus:ring-sky-100 transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-foreground uppercase tracking-normal ml-1 opacity-40">City</label>
              <input 
                value={newAddress.city || ""}
                onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                className="w-full h-14 px-6 bg-muted/50 border-none rounded-2xl text-[11px] font-semibold focus:ring-2 focus:ring-sky-100 transition-all" 
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-semibold text-foreground uppercase tracking-normal ml-1 opacity-40">Postal Code</label>
              <input 
                value={newAddress.postal_code || ""}
                onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                className="w-full h-14 px-6 bg-muted/50 border-none rounded-2xl text-[11px] font-semibold focus:ring-2 focus:ring-sky-100 transition-all" 
                required
              />
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-3">
              <label className="text-[10px] font-semibold text-foreground uppercase tracking-normal ml-1 opacity-40 flex justify-between">
                Pin Exact Location
                {newAddress.latitude && (
                  <span className="text-primary lowercase font-medium">Coordinates Captured</span>
                )}
              </label>
              <div className="rounded-[2rem] overflow-hidden border border-border/50 shadow-inner">
                <LocationPicker 
                  position={newAddress.latitude && newAddress.longitude ? [newAddress.latitude, newAddress.longitude] : null}
                  onChange={(lat, lng) => setNewAddress(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving} className="h-14 flex-1 bg-primary hover:bg-primary text-white rounded-2xl font-semibold uppercase tracking-normal text-[10px]">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Dispatch Location'}
            </Button>
            <Button type="button" onClick={() => setIsAddingAddress(false)} variant="outline" className="h-14 px-10 border-border rounded-2xl font-semibold uppercase tracking-normal text-[10px]">
              Cancel Allocation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
   )}

   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {!isAddingAddress && addresses.map((address) => (
     <Card key={address.id} className="border border-border group border-none overflow-hidden relative">
      <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
        <Globe className="w-24 h-24" />
      </div>
      <CardContent className="p-10 relative z-10">
       <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl ${address.is_default ? 'bg-muted text-primary shadow-lg shadow-sky-100' : 'bg-muted/50 text-foreground'} group-hover:scale-110 transition-transform duration-700`}>
         <Home className="w-6 h-6" />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
              <Trash2 className="w-6 h-6" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Service Point?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-bold text-foreground">{address.street_address}</span>? This endpoint will be purged from your active dispatch list and historical records.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl font-bold text-xs uppercase tracking-widest text-foreground">Abort</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => handleDeleteAddress(address.id)}
                className="rounded-xl font-bold text-xs uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white"
              >
                Purge Asset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
       </div>

       <div className="space-y-8">
        <div className="space-y-2">
         <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
            {address.street_address}
          </h3>
          {address.is_default && (
           <span className="text-[8px] font-semibold bg-black text-white px-3 py-1 rounded-full uppercase tracking-normal">Master</span>
          )}
         </div>
         <div className="flex items-center gap-2 text-foreground font-semibold text-[9px] uppercase tracking-normal bg-muted inline-flex px-3 py-1 rounded-full opacity-60">
          <Navigation className="w-3 h-3 text-primary" />
          Dispatch: {address.city}
         </div>
        </div>

        <div className="p-6 bg-muted/50 rounded-2xl border border-border group-hover:bg-white group-hover:border-sky-50 transition-all duration-500">
         <p className="text-xs font-semibold text-foreground leading-relaxed uppercase ">
          {address.apartment ? `${address.apartment}, ` : ''}{address.city}, {address.postal_code}
         </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.street_address}, ${address.city}, ${address.postal_code}`)}`, '_blank')} variant="outline" className="flex-1 h-12 border-border text-foreground hover:text-primary hover:bg-white hover:border-sky-100 rounded-xl font-semibold text-[9px] tracking-normal uppercase transition-all group/btn">
            <Compass className="w-3.5 h-3.5 mr-2 opacity-30 group-hover/btn:opacity-100" />
            Locate
          </Button>
          <Button variant="outline" className="h-12 w-12 border-border text-muted-foreground hover:text-primary hover:bg-white hover:border-sky-100 rounded-xl p-0 transition-all">
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
        className="rounded-[3rem] border-2 border-dashed border-border p-10 flex flex-col items-center justify-center gap-6 text-muted-foreground hover:border-red-200 hover:bg-muted/20 transition-all duration-700 group min-h-[350px]"
      >
      <div className="w-20 h-20 rounded-[2.5rem] border-2 border-border bg-muted/50 flex items-center justify-center group-hover:border-red-200 group-hover:scale-110 group-hover:bg-white transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:shadow-sky-50">
        <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary group-hover:rotate-90 transition-all duration-700" />
      </div>
      <div className="text-center space-y-2">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground opacity-40 group-hover:opacity-100 transition-opacity">Provision New Point</span>
        <span className="block text-[9px] font-bold text-muted-foreground ">Expand your service area footprint</span>
      </div>
      </button>
    )}
   </div>

   {addresses.length === 0 && (
    <Card className="border border-border p-12 flex items-center justify-center text-center bg-muted/30 border-none">
     <div className="max-w-md space-y-6">
      <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground uppercase tracking-normal">Geolocation Deficiency</p>
        <p className="text-xs font-bold text-muted-foreground ">No authorized service points detected. Please register a residence to enable Kuba marketplace logistics.</p>
      </div>
     </div>
    </Card>
   )}
  </div>
 );
}
