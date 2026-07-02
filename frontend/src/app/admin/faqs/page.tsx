"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import {
  DashboardDataCard,
  DashboardTableHead,
  DashboardTableHeaderRow,
} from "@/components/shared/DashboardTable";
import { dashboardUi } from "@/lib/dashboard-ui";

import { Suspense, useState } from "react";
import { useSearchState } from "@/hooks/useSearchState";
import { DashboardSuspenseFallback } from "@/components/shared/DashboardSuspenseFallback";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, LayoutGrid, List, MessageSquare, Tag, Eye, EyeOff, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { getMediaUrl } from "@/lib/utils";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DashboardListToolbar } from "@/components/shared/DashboardListToolbar";
import { FaqFormDialog } from "@/components/admin/FaqFormDialog";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/hooks/useData";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { toast } from "sonner";
import Image from "next/image";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  avatar?: string;
  is_active: boolean;
  order: number;
}

function FAQManagementContent() {
  const { data: faqs, isLoading, refetch: fetchFaqs, setData: setFaqs } = useData<FAQ[]>('/api/admin/faqs', { initialData: [] });
  
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { search, status: statusFilter, setStatus: setStatusFilter } = useSearchState();
  const [viewMode, setViewMode] = useState<'grid'|'list'|'order'>('list');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/admin/faqs/${id}`);
      toast.success("FAQ Registry Updated");
      fetchFaqs();
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const reorderFaqs = async (items: { id: number; order: number }[]) => {
    try {
      await axiosInstance.post("/api/admin/faqs/reorder", { items });
      toast.success("FAQ order updated");
      fetchFaqs();
    } catch {
      toast.error("Failed to reorder FAQs");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sorted = [...faqs].sort((a, b) => a.order - b.order || a.id - b.id);
    const itemsCopy = Array.from(sorted);
    const [reordered] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reordered);
    const payload = itemsCopy.map((f, i) => ({ id: f.id, order: i }));
    setFaqs(itemsCopy.map((f, i) => ({ ...f, order: i })));
    await reorderFaqs(payload);
  };

  const moveFaq = async (faqId: number, direction: "up" | "down") => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order || a.id - b.id);
    const idx = sorted.findIndex((f) => f.id === faqId);
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    [next[idx], next[target]] = [next[target], next[idx]];
    await reorderFaqs(next.map((f, i) => ({ id: f.id, order: i })));
  };

  const handleToggleActive = async (faq: FAQ) => {
    try {
      await axiosInstance.put(`/api/admin/faqs/${faq.id}`, { ...faq, is_active: !faq.is_active });
      setFaqs(faqs.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const startEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setDialogOpen(true);
  };

  // derived data
  const filteredFaqs = faqs
    .filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "" || (statusFilter === "active" ? faq.is_active : !faq.is_active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.order - b.order || a.id - b.id);

  const activeCount = faqs.filter(f => f.is_active).length;

  return (
    <DashboardPageContainer className="space-y-10">
      <DashboardPageHeader 
        title="FAQ Configuration" 
        subtitle="Manage the Frequently Asked Questions displayed on the global landing page."
      >
        <Button onClick={() => { setEditingFaq(null); setDialogOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 px-6 shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Add FAQ
        </Button>
      </DashboardPageHeader>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border group border-none">
              <CardContent className="p-4 md:p-5 flex items-center justify-between">
                  <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground">Total FAQs</p>
                      <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{faqs.length}</span>
                          <span className="text-[9px] font-bold text-muted-foreground">System total</span>
                      </div>
                  </div>
                  <div className="p-4 bg-muted rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500">
                      <MessageSquare className="w-5 h-5" />
                  </div>
              </CardContent>
          </Card>
          <Card className="border border-border group border-none">
              <CardContent className="p-4 md:p-5 flex items-center justify-between">
                  <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground">Published Active</p>
                      <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-emerald-600 transition-colors tracking-tight">{activeCount}</span>
                          <span className="text-[9px] font-bold text-muted-foreground">Visible on site</span>
                      </div>
                  </div>
                  <div className="p-4 bg-muted rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform duration-500">
                      <Eye className="w-5 h-5" />
                  </div>
              </CardContent>
          </Card>
          <Card className="border border-border group border-none">
              <CardContent className="p-4 md:p-5 flex items-center justify-between">
                  <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground">Hidden Drafts</p>
                      <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-rose-600 transition-colors tracking-tight">{faqs.length - activeCount}</span>
                          <span className="text-[9px] font-bold text-muted-foreground">Unpublished</span>
                      </div>
                  </div>
                  <div className="p-4 bg-muted rounded-2xl text-rose-600 group-hover:scale-110 transition-transform duration-500">
                      <EyeOff className="w-5 h-5" />
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant={viewMode === "order" ? "default" : "outline"}
          className="rounded-xl h-10 text-xs font-bold"
          onClick={() => setViewMode(viewMode === "order" ? "list" : "order")}
        >
          <GripVertical className="w-4 h-4 mr-1" />
          {viewMode === "order" ? "Exit reorder" : "Drag to reorder"}
        </Button>
      </div>

      {viewMode === "order" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="faqs-order">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {[...faqs]
                  .sort((a, b) => a.order - b.order || a.id - b.id)
                  .map((faq, index) => (
                    <Draggable key={faq.id} draggableId={String(faq.id)} index={index}>
                      {(dragProvided) => (
                        <Card
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          className="border border-border"
                        >
                          <CardContent className="p-4 flex items-center gap-4">
                            <div
                              {...dragProvided.dragHandleProps}
                              className="cursor-grab text-muted-foreground p-2"
                            >
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate">{faq.question}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{faq.answer}</p>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground">#{faq.order}</span>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
      <>
      {search && (
        <p className="text-xs text-muted-foreground">Results for &quot;{search}&quot;</p>
      )}

      {(viewMode === "grid" || viewMode === "list") && (
        <DashboardListToolbar
          hint="Use ⌘K Quick Jump to search FAQs"
          viewMode={viewMode}
          onViewChange={(m) => setViewMode(m as "grid" | "list")}
          filters={[
            {
              id: "status",
              label: "Visibility",
              value: statusFilter || "all",
              onChange: (val) => setStatusFilter(val === "all" ? "" : val),
              options: [
                { label: "All Items", value: "all" },
                { label: "Published Only", value: "active" },
                { label: "Hidden Only", value: "hidden" },
              ],
            },
          ]}
        />
      )}

      {viewMode === 'list' ? (
        <DashboardDataCard>
            <Table>
              <TableHeader>
                <DashboardTableHeaderRow>
                  <DashboardTableHead position="first" className="!pl-10 h-16 w-20 text-center">Order</DashboardTableHead>
                  <DashboardTableHead className="h-16 w-16">Avatar</DashboardTableHead>
                  <DashboardTableHead className="h-16 w-1/3">Core Question</DashboardTableHead>
                  <DashboardTableHead className="h-16">Answer Block</DashboardTableHead>
                  <DashboardTableHead className="h-16 text-center">Status</DashboardTableHead>
                  <DashboardTableHead position="last" className="h-16 text-right">Controls</DashboardTableHead>
                </DashboardTableHeaderRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold text-xs animate-pulse">Synchronizing Registry...</TableCell>
                  </TableRow>
                ) : filteredFaqs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-80 text-center">
                      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                         <MessageSquare className="h-16 w-16 opacity-10" />
                         <p className="text-xs font-bold text-muted-foreground">No questions matching your criteria</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFaqs.map((faq) => (
                    <TableRow key={faq.id} className="hover:bg-muted/50 transition-colors border-border group">
                      <TableCell className="pl-10 text-center py-6">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-muted-foreground text-xs">{faq.order}</span>
                          <div className="flex flex-col gap-0.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveFaq(faq.id, "up")}
                              aria-label="Move up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => moveFaq(faq.id, "down")}
                              aria-label="Move down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {faq.avatar ? (
                            <Image src={getMediaUrl(faq.avatar, "avatar")} alt="Avatar" width={40} height={40} className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground/40">N/A</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-6 font-bold text-foreground text-sm align-top leading-tight">
                        {faq.question}
                      </TableCell>
                      <TableCell className="py-6 text-xs text-muted-foreground align-top line-clamp-3 leading-relaxed">
                        {faq.answer.length > 150 ? faq.answer.substring(0, 150) + '...' : faq.answer}
                      </TableCell>
                      <TableCell className="py-6 text-center align-top">
                        <button onClick={() => handleToggleActive(faq)} className="transition-transform hover:scale-110 active:scale-95">
                          {faq.is_active ? 
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-2 rounded-md transition-colors">Published</Badge> : 
                            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none px-2 rounded-md transition-colors">Hidden</Badge>
                          }
                        </button>
                      </TableCell>
                      <TableCell className="pr-10 py-6 text-right align-top">
                        <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(faq)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => setDeleteId(faq.id)}>
                              <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </DashboardDataCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaqs.length === 0 ? (
                <div className={`col-span-full h-80 ${dashboardUi.table.emptyDashed}`}>
                    <MessageSquare className="h-16 w-16 opacity-10" />
                    <p className="text-xs font-bold text-muted-foreground">No templates matching configuration</p>
                </div>
            ) : filteredFaqs.map((faq) => (
                <Card key={faq.id} className="border border-border bg-card hover:shadow-md transition-all group overflow-hidden flex flex-col pt-2 relative">
                    <CardContent className="p-6 flex-1 flex flex-col">
                        <div className="absolute top-4 right-4">
                            <button onClick={() => handleToggleActive(faq)} className="transition-transform hover:scale-110 active:scale-95">
                                {faq.is_active ? 
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" title="Published" /> : 
                                    <div className="w-3 h-3 bg-rose-500 rounded-full" title="Hidden" />
                                }
                            </button>
                        </div>
                        <div className="flex items-start justify-between mb-4 mt-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary border border-border overflow-hidden">
                                    {faq.avatar ? (
                                        <Image src={getMediaUrl(faq.avatar, "avatar")} alt="Avatar" width={40} height={40} className="object-cover" />
                                    ) : (
                                        <Tag className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Order ID: {faq.order}</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-3 mb-2">{faq.question}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-4 flex-1 mb-4 flex flex-col leading-relaxed">
                            {faq.answer}
                        </p>

                        <div className="flex items-center justify-end border-t border-border/50 pt-4 gap-2">
                            <Button variant="outline" size="sm" onClick={() => startEdit(faq)} className="h-8 text-[10px] font-bold px-3">
                                Edit
                            </Button>
                             <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold px-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => setDeleteId(faq.id)}>
                                 Remove
                             </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
      </>
      )}

      <FaqFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingId={editingFaq?.id ?? null}
        initial={
          editingFaq
            ? {
                question: editingFaq.question,
                answer: editingFaq.answer,
                avatar: editingFaq.avatar || "",
                is_active: editingFaq.is_active,
                order: editingFaq.order,
              }
            : { order: faqs.length }
        }
        onSuccess={fetchFaqs}
      />
      <AppConfirmDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={async () => { if (deleteId !== null) { await handleDelete(deleteId); setDeleteId(null); } }}
        title="Purge FAQ Entry?"
        description="This will permanently remove this question from the platform registry. This action cannot be undone."
      />
    </DashboardPageContainer>
  );
}

export default function FAQManagement() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <FAQManagementContent />
    </Suspense>
  );
}
