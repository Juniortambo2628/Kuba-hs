"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Star, 
  Save, 
  Quote, 
  ChevronRight,
  Sparkles,
  MessageSquare
} from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useApiData } from "@/hooks/useApiData";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

export default function TestimonialPage() {
  const { data: items, isLoading, refetch: fetchItems, setData: setItems } = useApiData<any[]>("/api/admin/testimonials", { initialData: [] });

  const handleAdd = async () => {
    try {
      const res = await axiosInstance.post("/api/admin/testimonials", {
        client_name: "New Client",
        client_role: "Role / Organization",
        content: "Share a transformative experience here...",
        rating: 5,
        order: items.length,
      });
      setItems([...items, res.data]);
      toast.success("Testimonial draft created");
    } catch (err) {
      toast.error("Cloud synchronization failed");
    }
  };

  const handleSave = async (id: number, field: string, value: string | number) => {
    try {
      await axiosInstance.put(`/api/admin/testimonials/${id}`, { [field]: value });
      toast.success("Synchronized");
    } catch (err) {
      toast.error("Failed to save changes");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/admin/testimonials/${id}`);
      setItems(items.filter((f) => f.id !== id));
      toast.success("Endorsement removed");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const itemsCopy = Array.from(items);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);
    
    const updatedItems = itemsCopy.map((item, index) => ({ ...item, order: index }));
    setItems(updatedItems);

    try {
      await axiosInstance.post("/api/admin/testimonials/reorder", { items: updatedItems });
      toast.success("Hierarchy updated");
    } catch (err) {
      toast.error("Failed to reorder items");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 w-full bg-muted rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors duration-500">
      <DashboardPageHeader 
        title="Social Proof & Endorsements" 
        subtitle="Curate and organize high-impact testimonials for the landing page gallery."
      >
        <Button onClick={handleAdd} className="rounded-xl bg-primary text-white hover:bg-black h-12 px-8 font-bold shadow-lg shadow-primary/20 transition-all gap-2">
          <Plus className="w-4 h-4" />
          Add Endorsement
        </Button>
      </DashboardPageHeader>

      <div className="bg-white/50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-dashed border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
            <Quote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-foreground">Active Testimonials</p>
            <p className="text-xs font-medium text-muted-foreground">Drag and drop to rearrange the display sequence on the platform.</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-background rounded-xl border border-border shadow-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">{items.length} Published</span>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="testimonials" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
              <AnimatePresence>
                {items.map((item, index) => (
                  <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                    {(provided) => (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="group"
                      >
                        <Card className="border border-border/40 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
                          <CardContent className="p-0 flex items-stretch">
                            <div 
                              {...provided.dragHandleProps} 
                              className="w-12 flex items-center justify-center bg-muted/30 border-r border-border/10 cursor-grab hover:bg-primary/5 transition-colors"
                            >
                              <GripVertical className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                            
                            <div className="flex-1 p-8 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Client Identity</label>
                                  <Input 
                                    defaultValue={item.client_name}
                                    onBlur={(e) => handleSave(item.id, 'client_name', e.target.value)}
                                    placeholder="Full Name"
                                    className="h-12 bg-muted/5 border-border/40 font-bold text-foreground focus:ring-2 focus:ring-primary/10 rounded-xl"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Role / Designation</label>
                                  <Input 
                                    defaultValue={item.client_role || ''}
                                    onBlur={(e) => handleSave(item.id, 'client_role', e.target.value)}
                                    placeholder="e.g. CEO, Homeowner"
                                    className="h-12 bg-muted/5 border-border/40 font-bold text-foreground focus:ring-2 focus:ring-primary/10 rounded-xl"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Narrative Content</label>
                                <Textarea 
                                  defaultValue={item.content}
                                  onBlur={(e) => handleSave(item.id, 'content', e.target.value)}
                                  placeholder="What did they say about Kuba?"
                                  className="min-h-[100px] bg-muted/5 border-border/40 font-medium text-foreground focus:ring-2 focus:ring-primary/10 rounded-2xl p-4 resize-none leading-relaxed"
                                />
                              </div>

                              <div className="flex flex-wrap items-center gap-8">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Rating</label>
                                  <div className="flex items-center gap-3 h-12 px-4 bg-muted/5 rounded-xl border border-border/40">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <input 
                                      type="number" 
                                      min="1" max="5" 
                                      defaultValue={item.rating}
                                      onBlur={(e) => handleSave(item.id, 'rating', parseInt(e.target.value) || 5)}
                                      className="w-12 bg-transparent font-bold text-center outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2 flex-1">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Avatar Resource (URL)</label>
                                  <Input 
                                      defaultValue={item.image_url || ''}
                                      onBlur={(e) => handleSave(item.id, 'image_url', e.target.value)}
                                      placeholder="https://..."
                                      className="h-12 bg-muted/5 border-border/40 font-medium text-foreground focus:ring-2 focus:ring-primary/10 rounded-xl"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="w-20 border-l border-border/10 flex flex-col">
                                <ConfirmDeleteDialog
                                  trigger={
                                    <button 
                                      className="flex-1 flex items-center justify-center text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/5 transition-all w-full h-full"
                                      title="Remove Endorsement"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </button>
                                  }
                                  title="Remove Endorsement?"
                                  description="Are you sure you want to permanently delete this client testimonial?"
                                  onConfirm={() => handleDelete(item.id)}
                                />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {items.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-muted rounded-[2.5rem] flex items-center justify-center mx-auto text-muted-foreground/20">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Gallery is currently empty</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">Start build credibility by adding verified client testimonials to your platform gallery.</p>
          <Button onClick={handleAdd} variant="outline" className="rounded-xl border-2">Initialize First Endorsement</Button>
        </div>
      )}
    </div>
  );
}
