"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Globe, 
  Mail, 
  Zap, 
  Activity, 
  Info, 
  Save, 
  Lock,
  Loader2,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    app_name: "KUBA HOME SERVICES",
    support_email: "support@kuba.com",
    force_tls: true,
    debug_mode: false,
    paystack_public_key: "",
    paystack_secret_key: "",
    paystack_payment_url: "https://api.paystack.co"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/settings");
      if (res.data.settings) {
        setSettings((prev: any) => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      toast.error("Failed to load platform settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.post("/api/admin/settings", { settings });
      toast.success("System configuration updated successfully");
    } catch (err) {
      toast.error("Failed to update system state");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-600" /></div>;
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2 text-glow-red">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                System <span className="text-sky-600">Core</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Root configuration and platform security orchestration.
            </p>
        </div>
        <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black px-10 shadow-xl shadow-gray-100 transition-all uppercase tracking-widest text-[11px] group"
        >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />}
            Save System State
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="premium-card overflow-hidden border-none shadow-premium bg-white">
            <div className="p-10 border-b border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#1E293B]">
                    <SettingsIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">Identity & Reach</h2>
                    <p className="text-[10px] font-bold text-gray-400 italic font-black uppercase tracking-widest">Global Platform Meta</p>
                </div>
            </div>
            
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Marketplace Brand</label>
                    <div className="relative group">
                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 group-focus-within:text-sky-600 transition-colors" />
                        <Input 
                            value={settings.app_name || ''} 
                            onChange={(e) => setSettings({...settings, app_name: e.target.value})}
                            className="h-16 pl-14 pr-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black text-[#1E293B] uppercase tracking-widest focus:ring-2 focus:ring-sky-100 transition-all shadow-inner" 
                        />
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">System Support Email</label>
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-200 group-focus-within:text-sky-600 transition-colors" />
                        <Input 
                            value={settings.support_email || ''} 
                            onChange={(e) => setSettings({...settings, support_email: e.target.value})}
                            className="h-16 pl-14 pr-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black text-[#1E293B] italic focus:ring-2 focus:ring-sky-100 transition-all shadow-inner" 
                        />
                    </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 space-y-6">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">Security Protocols</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                        onClick={() => setSettings({...settings, force_tls: !settings.force_tls})}
                        className="p-6 bg-[#F8FAFC] rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-emerald-50 transition-all"
                    >
                        <div className="flex items-center gap-3 text-[#1E293B] group-hover:text-emerald-700 font-black text-[10px] uppercase tracking-widest">
                            <Lock className="w-4 h-4 opacity-40" />
                            Force TLS 1.3
                        </div>
                        <div className={`w-10 h-5 ${settings.force_tls ? 'bg-emerald-500' : 'bg-gray-200'} rounded-full flex items-center ${settings.force_tls ? 'justify-end' : 'justify-start'} px-1 shadow-inner transition-all`}>
                            <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div 
                        onClick={() => setSettings({...settings, debug_mode: !settings.debug_mode})}
                        className="p-6 bg-[#F8FAFC] rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-sky-50 transition-all"
                    >
                        <div className="flex items-center gap-3 text-[#1E293B] group-hover:text-red-700 font-black text-[10px] uppercase tracking-widest">
                            <Activity className="w-4 h-4 opacity-40" />
                            Debug Mode
                        </div>
                        <div className={`w-10 h-5 ${settings.debug_mode ? 'bg-red-500' : 'bg-gray-200'} rounded-full flex items-center ${settings.debug_mode ? 'justify-end' : 'justify-start'} px-1 shadow-inner transition-all`}>
                            <div className="w-3.5 h-3.5 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card overflow-hidden border-none shadow-premium bg-white">
            <div className="p-10 border-b border-gray-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#1E293B]">
                    <CreditCard className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-[#1E293B] uppercase tracking-tight">Payment Orchestration</h2>
                    <p className="text-[10px] font-bold text-gray-400 italic font-black uppercase tracking-widest">Paystack Gateway Configuration</p>
                </div>
            </div>
            
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Public Key</label>
                    <Input 
                        value={settings.paystack_public_key || ''} 
                        onChange={(e) => setSettings({...settings, paystack_public_key: e.target.value})}
                        placeholder="pk_test_..."
                        className="h-16 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black text-[#1E293B] tracking-widest focus:ring-2 focus:ring-sky-100 transition-all shadow-inner" 
                    />
                </div>
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Secret Key</label>
                    <Input 
                        type="password"
                        value={settings.paystack_secret_key || ''} 
                        onChange={(e) => setSettings({...settings, paystack_secret_key: e.target.value})}
                        placeholder="sk_test_..."
                        className="h-16 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black text-[#1E293B] tracking-widest focus:ring-2 focus:ring-sky-100 transition-all shadow-inner" 
                    />
                </div>
              </div>
              <div className="space-y-3">
                  <label className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest ml-1 opacity-40">Payment API URL</label>
                  <Input 
                      value={settings.paystack_payment_url || ''} 
                      onChange={(e) => setSettings({...settings, paystack_payment_url: e.target.value})}
                      placeholder="https://api.paystack.co"
                      className="h-16 px-6 bg-[#F8FAFC] border-none rounded-2xl text-[11px] font-black text-[#1E293B] italic focus:ring-2 focus:ring-sky-100 transition-all shadow-inner" 
                  />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-10">
          <Card className="premium-card border-none bg-[#1E293B] text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-sky-600 opacity-0 hover:opacity-10 transition-opacity duration-700"></div>
            <CardContent className="p-10 space-y-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-sky-500" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight">System Health</h3>
                    <p className="text-[10px] font-bold text-gray-400 italic">Kubernetes Cluster Status: [ OPTIMAL ]</p>
                </div>
                <div className="space-y-4 pt-10 border-t border-white/10">
                    <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Load Factor</span>
                        <span className="text-sm font-black tabular-nums">0.14 ms</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[14%] bg-sky-600 rounded-full"></div>
                    </div>
                </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-none bg-amber-50/50">
            <CardContent className="p-10 space-y-6">
                <div className="flex items-center gap-3 text-amber-600">
                    <Info className="w-5 h-5" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Maintenance Mode</h3>
                </div>
                <p className="text-[10px] font-bold text-amber-800 leading-relaxed italic opacity-60">
                    Enabling maintenance mode will restrict marketplace access to administrators only. All active sessions will be preserved.
                </p>
                <Button variant="outline" className="w-full h-12 border-amber-200 text-amber-800 hover:bg-amber-100 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all">
                    Initialize Lockdown
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
