"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Clock, 
  Loader2, 
  Save,
  Calendar,
  ShieldCheck,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const DAYS = [
  { id: 0, name: "Sunday" },
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
];

export default function AvailabilityManagement() {
  const [availability, setAvailability] = useState<any[]>([]);
  const [exceptions, setExceptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingExceptions, setIsSavingExceptions] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axiosInstance.get("/api/provider/availability");
      // Map existing availability or set defaults
      const mapped = DAYS.map(day => {
        const existing = (res.data.availability || []).find((a: any) => a.day_of_week === day.id);
        return existing || { 
          day_of_week: day.id, 
          start_time: "09:00", 
          end_time: "17:00", 
          is_available: false 
        };
      });
      setAvailability(mapped);
      setExceptions(res.data.exceptions || []);
    } catch (err) {
      toast.error("Failed to load availability");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (dayId: number) => {
    setAvailability(availability.map(a => 
      a.day_of_week === dayId ? { ...a, is_available: !a.is_available } : a
    ));
  };

  const handleChange = (dayId: number, field: string, value: string) => {
    setAvailability(availability.map(a => 
      a.day_of_week === dayId ? { ...a, [field]: value } : a
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.put("/api/provider/availability", { availability });
      toast.success("Standard schedule updated");
    } catch (err) {
      toast.error("Failed to update schedule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExceptions = async () => {
    setIsSavingExceptions(true);
    try {
      await axiosInstance.put("/api/provider/availability/exceptions", { exceptions });
      toast.success("Schedule exceptions updated");
    } catch (err) {
      toast.error("Failed to update exceptions");
    } finally {
      setIsSavingExceptions(false);
    }
  };

  const addException = () => {
    setExceptions([...exceptions, { 
      date: new Date().toISOString().split('T')[0], 
      is_closed: true, 
      start_time: "09:00", 
      end_time: "17:00", 
      reason: "Vacation" 
    }]);
  };

  const removeException = (index: number) => {
    setExceptions(exceptions.filter((_, i) => i !== index));
  };

  const updateException = (index: number, field: string, value: any) => {
    setExceptions(exceptions.map((e, i) => i === index ? { ...e, [field]: value } : e));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-sky-600" /></div>;
  }

  return (
    <div className="max-w-[1000px] mx-auto space-y-12 pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Operations <span className="text-sky-600">Sync</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-600" />
                Define your weekly service cycles and management exceptions.
            </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black px-10 h-16 shadow-xl shadow-sky-100 transition-all uppercase tracking-widest text-[10px] gap-3">
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Broadcast Regular Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Weekly Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-[#1E293B] uppercase tracking-widest">Weekly Cycles</h2>
          </div>

          {availability.map((day) => {
            const dayName = DAYS.find(d => d.id === day.day_of_week)?.name;
            return (
              <Card key={day.day_of_week} className={`premium-card border-none transition-all duration-500 overflow-hidden ${!day.is_available ? 'opacity-40 grayscale' : 'hover:shadow-2xl'}`}>
                <CardContent className="p-0 flex">
                  <div className={`w-1.5 ${day.is_available ? 'bg-sky-600' : 'bg-gray-200'}`}></div>
                  <div className="p-6 flex-1 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${day.is_available ? 'bg-sky-50 text-sky-600' : 'bg-gray-50 text-gray-300'}`}>
                        <span className="font-black text-sm uppercase">{dayName?.substring(0, 3)}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-tight">{dayName}</h3>
                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-0.5 italic">Recurring</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <input 
                          type="time" 
                          disabled={!day.is_available}
                          value={day.start_time}
                          onChange={(e) => handleChange(day.day_of_week, 'start_time', e.target.value)}
                          className="bg-gray-50 border-none rounded-xl px-3 py-2 text-[10px] font-black text-[#1E293B] outline-none focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
                        />
                        <span className="text-gray-200">-</span>
                        <input 
                          type="time" 
                          disabled={!day.is_available}
                          value={day.end_time}
                          onChange={(e) => handleChange(day.day_of_week, 'end_time', e.target.value)}
                          className="bg-gray-50 border-none rounded-xl px-3 py-2 text-[10px] font-black text-[#1E293B] outline-none focus:ring-2 focus:ring-sky-100 transition-all cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                        <Switch 
                          checked={day.is_available} 
                          onCheckedChange={() => handleToggle(day.day_of_week)}
                          className="data-[state=checked]:bg-sky-600 scale-75"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Schedule Exceptions */}
        <div className="space-y-6">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black text-[#1E293B] uppercase tracking-widest">Exceptions</h2>
              </div>
              <Button onClick={addException} variant="outline" size="sm" className="rounded-xl font-black text-[9px] uppercase tracking-tighter border-gray-100">
                Add Date
              </Button>
           </div>

           <div className="space-y-4">
              {exceptions.length === 0 ? (
                <div className="bg-gray-50 rounded-[2rem] p-8 text-center border-2 border-dashed border-gray-100">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No exceptions set</p>
                </div>
              ) : (
                exceptions.map((exc, idx) => (
                  <Card key={idx} className="premium-card border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <input 
                          type="date"
                          value={typeof exc.date === 'string' ? exc.date : exc.date.split('T')[0]}
                          onChange={(e) => updateException(idx, 'date', e.target.value)}
                          className="text-[11px] font-black text-sky-600 uppercase outline-none bg-transparent"
                        />
                        <Button onClick={() => removeException(idx)} variant="ghost" size="icon" className="h-6 w-6 text-red-300 hover:text-red-500">
                          <Zap className="w-3 h-3 fill-current rotate-45" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                        <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black uppercase ${exc.is_closed ? 'text-red-500' : 'text-emerald-500'}`}>
                             {exc.is_closed ? 'Closed' : 'Custom'}
                           </span>
                           <Switch 
                             checked={!exc.is_closed} 
                             onCheckedChange={(val) => updateException(idx, 'is_closed', !val)}
                             className="data-[state=checked]:bg-emerald-500 scale-75"
                           />
                        </div>
                      </div>

                      {!exc.is_closed && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                           <input 
                            type="time" 
                            value={exc.start_time}
                            onChange={(e) => updateException(idx, 'start_time', e.target.value)}
                            className="bg-gray-50 border-none rounded-lg px-2 py-1.5 text-[10px] font-black text-[#1E293B] flex-1"
                          />
                          <span className="text-gray-200">-</span>
                          <input 
                            type="time" 
                            value={exc.end_time}
                            onChange={(e) => updateException(idx, 'end_time', e.target.value)}
                            className="bg-gray-50 border-none rounded-lg px-2 py-1.5 text-[10px] font-black text-[#1E293B] flex-1"
                          />
                        </div>
                      )}

                      <input 
                        type="text"
                        placeholder="Reason (e.g. Vacation)"
                        value={exc.reason || ''}
                        onChange={(e) => updateException(idx, 'reason', e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-lg px-3 py-2 text-[10px] font-bold text-gray-500 placeholder:text-gray-300 outline-none"
                      />
                    </CardContent>
                  </Card>
                ))
              )}

              {exceptions.length > 0 && (
                <Button onClick={handleSaveExceptions} disabled={isSavingExceptions} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black h-12 uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-amber-100 mt-4">
                  {isSavingExceptions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Exceptions
                </Button>
              )}
           </div>

           <div className="bg-sky-50 rounded-[2rem] p-8 border border-sky-100 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sky-600 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-sky-800 leading-relaxed italic">
                Exceptions override your weekly cycles for specific dates. Use this for holidays or personal downtime.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
