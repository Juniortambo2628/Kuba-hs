"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Star, 
  Quote, 
  Sparkles,
  MessageSquare,
  Pencil,
} from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DashboardGreetingBar } from "@/components/dashboard/workspace";
import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "@/hooks/useData";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { EmptyState } from "@/components/shared/ui/EmptyState";
import { AppPill } from "@/components/shared/ui/AppPill";
import Image from "next/image";
import type { Testimonial } from "@/types/admin";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { TestimonialFormDialog } from "@/components/admin/TestimonialFormDialog";
import { getMediaUrl } from "@/lib/utils";

function SortableTestimonial({
  item,
  index,
  onEdit,
  onRemove,
}: {
  item: Testimonial;
  index: number;
  onEdit: (item: Testimonial) => void;
  onRemove: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Card
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        className={`border border-border/40 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden ${
          isDragging ? "relative z-10 shadow-xl" : ""
        }`}
      >
        <CardContent className="p-0 flex items-stretch">
          <div
            {...attributes}
            {...listeners}
            className="w-12 flex items-center justify-center bg-muted/30 border-r border-border/10 cursor-grab hover:bg-primary/5 transition-colors touch-none"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground/40" />
          </div>

          <div className="flex-1 p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
            {item.image_url ? (
              <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-border shrink-0">
                <Image
                  src={getMediaUrl(item.image_url, "avatar")}
                  alt={item.client_name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-muted border border-border flex items-center justify-center shrink-0">
                <Quote className="w-6 h-6 text-muted-foreground/40" />
              </div>
            )}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{item.client_name}</p>
                  <p className="text-sm text-muted-foreground">{item.client_role || "—"}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-foreground/80 line-clamp-3 leading-relaxed">
                {item.content}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full mt-2"
                onClick={() => onEdit(item)}
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          <div className="w-20 border-l border-border/10 flex flex-col">
            <button
              className="flex-1 flex items-center justify-center text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/5 transition-all w-full h-full"
              title="Remove Endorsement"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TestimonialPage() {
  const { data: items, isLoading, refetch: fetchItems, setData: setItems } = useData<Testimonial[]>(
    "/api/admin/testimonials",
    { initialData: [] }
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInitial, setEditInitial] = useState<Partial<Testimonial> | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setEditInitial(undefined);
    setDialogOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setEditInitial({
      client_name: item.client_name,
      client_role: item.client_role,
      content: item.content,
      rating: item.rating,
      image_url: item.image_url,
    });
    setDialogOpen(true);
  };

  const handleDialogSuccess = (created?: Testimonial) => {
    if (created) {
      setItems([...items, created]);
    } else {
      fetchItems();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/admin/testimonials/${id}`);
      setItems(items.filter((f) => f.id !== id));
      toast.success("Endorsement removed");
    } catch {
      toast.error("Deletion failed");
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from < 0 || to < 0) return;

    const updatedItems = arrayMove(items, from, to).map((item, index) => ({
      ...item,
      sort_order: index,
    }));
    setItems(updatedItems);

    try {
      await axiosInstance.post("/api/admin/testimonials/reorder", { items: updatedItems });
      toast.success("Hierarchy updated");
    } catch {
      toast.error("Failed to reorder items");
    }
  };

  if (isLoading) {
    return <DashboardPageSkeleton width="xl" metrics={0} bodyHeight="h-[520px]" />;
  }

  return (
    <DashboardPageContainer width="xl" className="md:p-10 space-y-10 min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors duration-500">
      <DashboardGreetingBar 
        greeting="Social Proof & Endorsements" 
        subtitle="Curate and organize high-impact testimonials for the landing page gallery."
       className="mb-8" actions={<>
        <Button onClick={openCreate} className="rounded-xl bg-primary text-white hover:bg-black h-12 px-8 font-bold shadow-lg shadow-primary/20 transition-all gap-2">
          <Plus className="w-4 h-4" />
          Add Endorsement
        </Button>
      </>} />

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
          <AppPill variant="count">{items.length} Published</AppPill>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            <AnimatePresence>
              {items.map((item, index) => (
                <SortableTestimonial
                  key={item.id}
                  item={item}
                  index={index}
                  onEdit={openEdit}
                  onRemove={setDeleteId}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <EmptyState
          variant="dashboard"
          icon={MessageSquare}
          title="Gallery is currently empty"
          description="Start building credibility by adding verified client testimonials to your platform gallery."
        >
          <Button onClick={openCreate} variant="outline" className="rounded-xl border-2 mt-4">
            Initialize First Endorsement
          </Button>
        </EmptyState>
      )}

      <AppConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId !== null) { await handleDelete(deleteId); setDeleteId(null); } }}
        title="Remove Endorsement?"
        description="Are you sure you want to permanently delete this client testimonial?"
      />

      <TestimonialFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingId={editingId}
        initial={editInitial}
        sort_order={items.length}
        onSuccess={handleDialogSuccess}
      />
    </DashboardPageContainer>
  );
}
