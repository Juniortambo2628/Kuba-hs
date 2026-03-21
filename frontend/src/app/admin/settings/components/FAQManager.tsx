"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { GripVertical, Trash2, Plus, Save } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export function FAQManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/faqs");
      setFaqs(res.data);
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await axiosInstance.post("/api/admin/faqs", {
        question: "New Question",
        answer: "New Answer",
        order: faqs.length,
      });
      setFaqs([...faqs, res.data]);
      toast.success("FAQ Added");
    } catch (err) {
      toast.error("Failed to add FAQ");
    }
  };

  const handleSave = async (id: number, field: string, value: string) => {
    try {
      await axiosInstance.put(`/api/admin/faqs/${id}`, { [field]: value });
      toast.success("Saved");
    } catch (err) {
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/admin/faqs/${id}`);
      setFaqs(faqs.filter((f) => f.id !== id));
      toast.success("FAQ Deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(faqs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update local state and order field
    const updatedItems = items.map((item, index) => ({ ...item, order: index }));
    setFaqs(updatedItems);

    try {
      await axiosInstance.post("/api/admin/faqs/reorder", { items: updatedItems });
      toast.success("Order saved");
    } catch (err) {
      toast.error("Failed to reorder");
    }
  };

  if (isLoading) return <div>Loading FAQs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">FAQ Management</h2>
          <p className="text-sm text-muted-foreground">Manage and reorder frequently asked questions.</p>
        </div>
        <Button onClick={handleAdd} className="gap-2"><Plus className="w-4 h-4" /> Add FAQ</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="faqs" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {faqs.map((faq, index) => (
                <Draggable key={faq.id.toString()} draggableId={faq.id.toString()} index={index}>
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
                        <Input 
                          defaultValue={faq.question}
                          onBlur={(e) => handleSave(faq.id, 'question', e.target.value)}
                          className="font-semibold"
                        />
                        <Textarea 
                          defaultValue={faq.answer}
                          onBlur={(e) => handleSave(faq.id, 'answer', e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
