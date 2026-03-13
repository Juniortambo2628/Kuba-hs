"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Building2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Save, 
  Loader2,
  Camera,
  Map,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { KubaFilePond } from "@/components/ui/filepond";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 rounded-2xl animate-pulse"></div>
});

export default function ProviderProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/dashboard"); // Reusing for now, should have profile info
      setProfile(res.data.profile || {
        business_name: "",
        bio: "",
        location_name: "",
        latitude: null,
        longitude: null,
        experience_years: 0,
        service_radius: 10
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const { checkAuth } = useAuth();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post("/api/provider/profile", profile);
      toast.success("Merchant profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-600" /></div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-10 pb-12">
      <div className="flex justify-between items-end px-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E293B] uppercase tracking-tight italic">Business <span className="text-sky-600">Protocol</span></h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Maintain your professional identity on the network</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#1E293B] hover:bg-sky-600 text-white rounded-xl font-black px-8 h-12 shadow-lg shadow-gray-200 transition-all uppercase tracking-widest text-[10px]">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Finalize Identity
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <Card className="premium-card border-none overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-sky-600">Core Merchant Data</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Business Identity</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <Input 
                      value={profile.business_name || ""}
                      onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                      className="h-14 pl-12 bg-gray-50 border-none rounded-2xl font-bold text-[#1E293B] outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                      placeholder="Your Business Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Legacy Experience (Years)</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <Input 
                      type="number"
                      value={profile.experience_years ?? 0}
                      onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })}
                      className="h-14 pl-12 bg-gray-50 border-none rounded-2xl font-bold text-[#1E293B] outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Merchant Biography</label>
                <div className="relative">
                  <Textarea 
                    value={profile.bio || ""}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="min-h-[150px] bg-gray-50 border-none rounded-[2rem] p-6 font-bold text-[#1E293B] outline-none focus:ring-2 focus:ring-sky-100 transition-all leading-relaxed"
                    placeholder="Tell clients about your professional expertise..."
                  />
                  <Zap className="absolute right-6 bottom-6 w-5 h-5 text-sky-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-none overflow-hidden">
             <CardContent className="p-10 space-y-8">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">Deployment Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Base of Operations</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <Input 
                          value={profile.location_name || ""}
                          onChange={(e) => setProfile({ ...profile, location_name: e.target.value })}
                          className="h-14 pl-12 bg-gray-50 border-none rounded-2xl font-bold text-[#1E293B] outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                          placeholder="Primary Location"
                        />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Operational Radius (KM)</label>
                      <div className="relative">
                        <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <Input 
                          type="number"
                          value={profile.service_radius ?? 0}
                          onChange={(e) => setProfile({ ...profile, service_radius: parseInt(e.target.value) || 0 })}
                          className="h-14 pl-12 bg-gray-50 border-none rounded-2xl font-bold text-[#1E293B] outline-none focus:ring-2 focus:ring-sky-100 transition-all"
                        />
                      </div>
                   </div>
                </div>

                {/* Location Picker */}
                <div className="space-y-2 pt-4">
                  <div className="flex items-center justify-between mb-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Geospatial Coordinates</label>
                     {profile.latitude && profile.longitude ? (
                         <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">{profile.latitude.toFixed(5)}, {profile.longitude.toFixed(5)}</span>
                     ) : (
                         <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">Not Set</span>
                     )}
                  </div>
                  <LocationPickerMap 
                      position={profile.latitude && profile.longitude ? [profile.latitude, profile.longitude] : null}
                      onChange={(lat, lng) => setProfile({ ...profile, latitude: lat, longitude: lng })}
                      radius={profile.service_radius}
                  />
                  <p className="text-[10px] text-gray-400 italic font-bold">Pinpoint your exact base. The map on the search page will use these coordinates.</p>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="premium-card border-none bg-sky-600 text-white overflow-hidden relative group p-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all duration-700"></div>
              <CardContent className="p-0 space-y-8 relative z-10 text-center">
                 <div className="relative mx-auto w-32 h-32 bg-white/20 rounded-[2.5rem] flex items-center justify-center border-4 border-white/30 group-hover:border-white transition-all duration-500 overflow-hidden">
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <Camera className="w-10 h-10 text-white" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <KubaFilePond 
                            modelType="user"
                            modelId={user?.id?.toString() || ""}
                            collection="avatars"
                            onSuccess={() => {
                                toast.success("Avatar updated");
                                checkAuth();
                            }}
                            label='<span class="text-[8px] font-black uppercase text-white">Update Avatar</span>'
                        />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase italic tracking-tight">{user?.name}</h3>
                    <p className="text-[10px] font-black text-sky-100 uppercase tracking-widest">Kuba Merchant Partner</p>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-8">
                    <div className="text-center">
                       <p className="text-sm font-black text-white">{profile?.stats?.avg_rating?.toFixed(1) || '0.0'}</p>
                       <p className="text-[8px] font-black text-sky-100 uppercase tracking-tighter">Reputation</p>
                    </div>
                    <div className="w-[1px] h-8 bg-white/10"></div>
                    <div className="text-center">
                       <p className="text-sm font-black text-white">
                        {profile?.stats?.reputation_score >= 90 ? 'Elite' : profile?.stats?.reputation_score >= 70 ? 'Pro' : 'Standard'}
                       </p>
                       <p className="text-[8px] font-black text-sky-100 uppercase tracking-tighter">Rank Status ({profile?.stats?.reputation_score || 0}%)</p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <div className="bg-[#1E293B] rounded-[2.5rem] p-10 space-y-6">
              <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Verification Status</h4>
              <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                Your credentials are currently <span className="text-emerald-400 font-black">active</span> and verified. Updating core business parameters may trigger a brief security auditing protocol.
              </p>
              <div className="flex items-center gap-4 py-2 px-4 bg-white/5 rounded-xl border border-white/5">
                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-[#F8FAFC]">System Audited — 2026</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
