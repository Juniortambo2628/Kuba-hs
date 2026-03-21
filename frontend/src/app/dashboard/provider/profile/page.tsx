"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Save, 
  Loader2,
  Camera,
  Map,
  Zap,
  Briefcase,
  User,
  Activity,
  Phone,
  Mail,
  Lock,
  Star
} from "lucide-react";
import { toast } from "sonner";
import { KubaFilePond } from "@/components/ui/filepond";
import dynamic from "next/dynamic";

const getAvatarUrl = (path: string | null | undefined) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';
  return `${baseUrl}/storage/${path.replace('storage/', '')}`;
};

const LocationPickerMap = dynamic(() => import("@/components/map/LocationPicker"), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-muted rounded-2xl animate-pulse"></div>
});

export default function ProviderProfile() {
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/dashboard");
      setProfile(res.data.profile || {
        business_name: "",
        bio: "",
        location_name: "",
        phone: user?.phone || "+254",
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post("/api/provider/profile", profile);
      toast.success("Merchant profile updated successfully");
      await checkAuth();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse max-w-6xl mx-auto p-4">
        <div className="h-10 w-48 bg-muted rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 h-96 bg-muted rounded-2xl"></div>
          <div className="lg:col-span-2 h-[600px] bg-muted rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Merchant Identity</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your marketplace presence and operational capacity.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary text-white rounded-xl font-bold px-8 shadow-sm transition-all h-10 text-[10px] tracking-wide">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Synchronize Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm overflow-hidden text-center">
            <CardContent className="p-8">
              <div className="relative inline-block mb-6 group w-full">
                <div className="w-32 h-32 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center text-foreground border-2 border-border shadow-sm group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                  {user?.avatar_url ? (
                    <img src={getAvatarUrl(user.avatar_url) || ""} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 opacity-20" />
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all"></div>
                </div>
                
                <div className="absolute bottom-[-10px] right-1/2 translate-x-16 p-0 bg-primary text-white rounded-xl shadow-lg hover:bg-primary/90 transition-all overflow-hidden w-10 h-10 flex items-center justify-center border-2 border-background">
                  <KubaFilePond 
                    modelType="user"
                    modelId={user?.id?.toString() || ""}
                    collection="avatars"
                    onSuccess={() => {
                      toast.success("Avatar updated");
                      checkAuth();
                    }}
                    label='<span class="text-white">...</span>'
                  />
                  <Camera className="w-4 h-4 absolute pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-2 mt-4 text-center">
                <h2 className="text-xl font-bold text-foreground tracking-tight">{profile.business_name || user?.name}</h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full tracking-wide">Elite Provider</span>
                  <span className="text-[9px] font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full tracking-wide">Verified Partner</span>
                </div>
              </div>

              <div className="space-y-4 pt-6 mt-6 border-t border-border">
                <div className="p-4 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[8px] font-bold text-muted-foreground tracking-widest">Reputation</p>
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-foreground">Elite</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full">Top 5%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full h-10 border-border text-foreground hover:bg-muted font-bold text-[9px] tracking-wide rounded-xl">
                  Public Profile View
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[9px] font-bold text-foreground tracking-wider">Security Vectors</h3>
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-4">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-primary rounded-full"></div>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground leading-relaxed text-center">Credential integrity is optimal.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-10 border-b border-border pb-8">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-foreground border border-border">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-lg font-bold text-foreground tracking-tight">Business Configuration</h2>
                  <p className="text-[10px] font-bold text-muted-foreground">Define your core service parameters and bio.</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground tracking-wider ml-1">Merchant Trading Name</label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={profile.business_name}
                        onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                        className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground outline-none shadow-sm"
                        placeholder="e.g. Acme Services Ltd"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground tracking-wider ml-1">Contact Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground outline-none shadow-sm"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground tracking-wider ml-1">Professional Biography</label>
                    <textarea 
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full min-h-[140px] p-5 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground outline-none shadow-sm block resize-none leading-relaxed"
                      placeholder="Describe your expertise, experience, and why clients should choose you..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground tracking-wider ml-1">Base City</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={profile.location_name}
                        onChange={(e) => setProfile({ ...profile, location_name: e.target.value })}
                        className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground tracking-wider ml-1">Specialized Skills / Keywords</label>
                    <div className="relative group">
                      <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        value={profile.specialized_skills ? (Array.isArray(profile.specialized_skills) ? profile.specialized_skills.join(', ') : profile.specialized_skills) : ''}
                        onChange={(e) => setProfile({ ...profile, specialized_skills: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-xl text-[11px] font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground outline-none shadow-sm"
                        placeholder="e.g. Precision Welding, Advanced Diagnostics, Solar Installation"
                      />
                    </div>
                    <p className="text-[8px] text-muted-foreground ml-1">Separate skills with commas. These help you appear in specific search results.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geospatial Section */}
          <Card className="border border-border bg-card/50 backdrop-blur-md shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between gap-4 mb-10 border-b border-border pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-foreground border border-border">
                    <Map className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-lg font-bold text-foreground tracking-tight">Geospatial Logistics</h2>
                    <p className="text-[10px] font-bold text-muted-foreground">Pinpoint your HQ on the map for automated routing.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-[8px] font-bold text-muted-foreground mb-1">Latitudinal Vector</p>
                    <p className="text-sm font-bold text-foreground">{profile.latitude?.toFixed(6) || 'N/A'}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-xl border border-border">
                    <p className="text-[8px] font-bold text-muted-foreground mb-1">Longitudinal Vector</p>
                    <p className="text-sm font-bold text-foreground">{profile.longitude?.toFixed(6) || 'N/A'}</p>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-border">
                  <LocationPickerMap 
                    position={profile.latitude && profile.longitude ? [profile.latitude, profile.longitude] : null}
                    onChange={(lat, lng) => setProfile({ ...profile, latitude: lat, longitude: lng })}
                    radius={profile.service_radius}
                  />
                </div>
                <p className="text-[10px] text-center font-bold text-muted-foreground">Service coverage is automatically calculated based on your radius from this point.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
