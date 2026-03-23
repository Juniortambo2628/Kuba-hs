"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { GripVertical, Trash2, Plus, Link as LinkIcon, Save } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export function NavigationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetchNavigation();

    // Fix for react-beautiful-dnd invariant failure in React 18+
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const fetchNavigation = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/settings");
      // Find the navigation setting
      const allSettings = Object.values(res.data.settings).flat() as any[];
      const navSetting = allSettings.find(s => s.key === 'navigation_menu');
      if (navSetting) {
        setSettingId(navSetting.id);
        if (navSetting.value) {
            try {
                let valueToParse = navSetting.value;
                // Basic cleanup for common malformed JSON from certain DB drivers/migrations
                if (typeof valueToParse === 'string') {
                    // Remove erroneous backslashes if they are literal in the string
                    if (valueToParse.includes('\\"')) {
                        try {
                            // If it's double encoded, this might fix it
                            const unescaped = JSON.parse(`"${valueToParse}"`);
                            if (typeof unescaped === 'string') valueToParse = unescaped;
                        } catch(e) {}
                    }
                }
                
                const parsed = typeof valueToParse === 'string' ? JSON.parse(valueToParse) : valueToParse;
                setItems(Array.isArray(parsed) ? parsed : []);
            } catch (err) {
                console.error("Failed to parse navigation menu setting:", err);
                setItems([]);
            }
        }
      }
    } catch (err) {
      toast.error("Failed to load navigation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    const newItem = {
        id: `nav_${Date.now()}`,
        label: "New Link",
        url: "/"
    };
    setItems([...items, newItem]);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
      if (!settingId) return;
      setIsSaving(true);
      try {
          const formData = new FormData();
          formData.append('settings[0][id]', settingId);
          formData.append('settings[0][value]', JSON.stringify(items));
          
          await axiosInstance.post('/api/admin/settings', formData);
          toast.success("Navigation saved successfully");
      } catch (err) {
          toast.error("Failed to save navigation");
      } finally {
          setIsSaving(false);
      }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const itemsCopy = Array.from(items);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);
    setItems(itemsCopy);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Site Navigation</h2>
          <p className="text-sm text-muted-foreground">Manage and reorder the main website navigation menu.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Link</Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                {isSaving ? <span className="animate-spin text-xl">◌</span> : <Save className="w-4 h-4" />} Save Order
            </Button>
        </div>
      </div>

      {!enabled ? null : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border/60 rounded-3xl bg-muted/30">
          <p className="text-muted-foreground font-medium mb-4">No navigation links found</p>
          <Button onClick={handleAdd} size="sm" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-none">
            Add Your First Link
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="navigation" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex gap-4 p-4 bg-white dark:bg-zinc-900 border rounded-2xl items-center"
                      >
                        <div {...provided.dragHandleProps} className="text-muted-foreground cursor-grab">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 ml-1">
                                Navigation Label
                              </label>
                              <Input 
                                  value={item.label}
                                  onChange={(e) => handleUpdate(item.id, 'label', e.target.value)}
                                  placeholder="e.g. Services"
                                  className="font-bold bg-muted/20 border-border/30 focus:bg-white dark:focus:bg-zinc-800 transition-all rounded-xl h-12"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 ml-1 flex items-center gap-1.5">
                                <LinkIcon className="w-3 h-3 text-primary/40" />
                                Destination Route
                              </label>
                              <Input 
                                  value={item.url}
                                  onChange={(e) => handleUpdate(item.id, 'url', e.target.value)}
                                  placeholder="/path"
                                  className="bg-muted/20 border-border/30 focus:bg-white dark:focus:bg-zinc-800 transition-all font-mono text-sm rounded-xl h-12"
                              />
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
