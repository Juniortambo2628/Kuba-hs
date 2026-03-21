"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GripVertical, Trash2, Plus, Star } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export function TestimonialManager() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/testimonials");
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await axiosInstance.post("/api/admin/testimonials", {
        client_name: "New Client",
        client_role: "Role",
        content: "Outstanding service and support.",
        rating: 5,
        order: items.length,
      });
      setItems([...items, res.data]);
      toast.success("Testimonial Added");
    } catch (err) {
      toast.error("Failed to add testimonial");
    }
  };

  const handleSave = async (id: number, field: string, value: string | number) => {
    try {
      await axiosInstance.put(`/api/admin/testimonials/${id}`, { [field]: value });
      toast.success("Saved");
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/admin/testimonials/${id}`);
      setItems(items.filter((f) => f.id !== id));
      toast.success("Testimonial Deleted");
    } catch (err) {
      toast.error("Failed to delete");
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
      toast.success("Order saved");
    } catch (err) {
      toast.error("Failed to reorder");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Testimonial Management</h2>
          <p className="text-sm text-muted-foreground">Manage and reorder platform reviews and endorsements.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2"><Plus className="w-4 h-4" /> Add Endorsement</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="testimonials" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {items.map((item, index) => (
                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex gap-4 p-4 bg-white dark:bg-zinc-900 border rounded-2xl items-start"
                    >
                      <div {...provided.dragHandleProps} className="mt-2 text-muted-foreground cursor-grab">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <Input 
                            defaultValue={item.client_name}
                            onBlur={(e) => handleSave(item.id, 'client_name', e.target.value)}
                            placeholder="Client Name"
                            className="font-semibold"
                          />
                          <Input 
                            defaultValue={item.client_role || ''}
                            onBlur={(e) => handleSave(item.id, 'client_role', e.target.value)}
                            placeholder="Role / Title"
                          />
                        </div>
                        <Textarea 
                          defaultValue={item.content}
                          onBlur={(e) => handleSave(item.id, 'content', e.target.value)}
                          placeholder="Endorsement content..."
                          className="min-h-[80px]"
                        />
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2">
                             <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                             <Input 
                               type="number" 
                               min="1" max="5" 
                               defaultValue={item.rating}
                               onBlur={(e) => handleSave(item.id, 'rating', parseInt(e.target.value) || 5)}
                               className="w-20 h-8"
                             />
                           </div>
                           <Input 
                               defaultValue={item.image_url || ''}
                               onBlur={(e) => handleSave(item.id, 'image_url', e.target.value)}
                               placeholder="Avatar URL (Optional)"
                               className="h-8 flex-1"
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
    </div>
  );
}
