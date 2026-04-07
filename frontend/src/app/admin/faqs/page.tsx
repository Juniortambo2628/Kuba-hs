"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CheckCircle, XCircle, LayoutGrid, List, MessageSquare, Tag, Eye, EyeOff } from "lucide-react";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { DataToolbar } from "@/components/shared/DataToolbar";
import { Badge } from "@/components/ui/badge";
import { useApiData } from "@/hooks/useApiData";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { toast } from "sonner";
import { DashboardImageUpload } from "@/components/shared/DashboardImageUpload";
import Image from "next/image";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  avatar?: string;
  is_active: boolean;
  order: number;
}

export default function FAQManagement() {
  const { data: faqs, isLoading, refetch: fetchFaqs, setData: setFaqs } = useApiData<FAQ[]>('/api/admin/faqs', { initialData: [] });
  
  const [isEditing, setIsEditing] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', avatar: '', is_active: true, order: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'grid'|'list'>('list');
  const [statusFilter, setStatusFilter] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axiosInstance.put(`/api/admin/faqs/${isEditing.id}`, formData);
      } else {
        await axiosInstance.post('/api/admin/faqs', formData);
      }
      setIsModalOpen(false);
      setIsEditing(null);
      setFormData({ question: '', answer: '', avatar: '', is_active: true, order: 0 });
      fetchFaqs();
    } catch (err) {
      console.error("Failed to save FAQ", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/admin/faqs/${id}`);
      toast.success("FAQ Registry Updated");
      fetchFaqs();
    } catch (err) {
      toast.error("Deletion failed");
    }
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
    setIsEditing(faq);
    setFormData({ question: faq.question, answer: faq.answer, avatar: faq.avatar || '', is_active: faq.is_active, order: faq.order });
    setIsModalOpen(true);
  };

  // derived data
  const filteredFaqs = faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(search.toLowerCase()) || faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "" || (statusFilter === "active" ? faq.is_active : !faq.is_active);
      return matchesSearch && matchesStatus;
  });

  const activeCount = faqs.filter(f => f.is_active).length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
      <DashboardPageHeader 
        title="FAQ Configuration" 
        subtitle="Manage the Frequently Asked Questions displayed on the global landing page."
      />

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-border group border-none">
              <CardContent className="p-8 flex items-center justify-between">
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
              <CardContent className="p-8 flex items-center justify-between">
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
              <CardContent className="p-8 flex items-center justify-between">
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

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
          <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">Question Registry</h2>
              <p className="text-sm font-bold text-muted-foreground mt-1">Add or modify knowledge base questions.</p>
          </div>
          <Button onClick={() => { setIsEditing(null); setFormData({ question: '', answer: '', avatar: '', is_active: true, order: faqs.length }); setIsModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add FAQ Entry
          </Button>
      </div>

      <DataToolbar 
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Locate questions or answers..."
        viewMode={viewMode}
        onViewChange={setViewMode}
        filters={[
          {
            id: 'status',
            label: 'Visibility Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'All Items', value: '' },
              { label: 'Published Only', value: 'active' },
              { label: 'Hidden Only', value: 'hidden' }
            ]
          }
        ]}
      />

      {viewMode === 'list' ? (
        <Card className="border border-border/40 overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="pl-10 h-16 text-[11px] font-bold text-muted-foreground w-20 text-center">Order</TableHead>
                  <TableHead className="h-16 text-[11px] font-bold text-muted-foreground w-16">Avatar</TableHead>
                  <TableHead className="h-16 text-[11px] font-bold text-muted-foreground w-1/3">Core Question</TableHead>
                  <TableHead className="h-16 text-[11px] font-bold text-muted-foreground">Answer Block</TableHead>
                  <TableHead className="h-16 text-[11px] font-bold text-muted-foreground text-center">Status</TableHead>
                  <TableHead className="h-16 pr-10 text-right text-[11px] font-bold text-muted-foreground">Controls</TableHead>
                </TableRow>
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
                      <TableCell className="pl-10 text-center py-6 font-bold text-muted-foreground text-xs">{faq.order}</TableCell>
                      <TableCell className="py-6">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {faq.avatar ? (
                            <Image src={faq.avatar} alt="Avatar" width={40} height={40} className="object-cover" />
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
                           <ConfirmDeleteDialog
                             trigger={
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                             }
                             title="Purge FAQ Entry?"
                             description="This will permanently remove this question from the platform registry. This action cannot be undone."
                             onConfirm={() => handleDelete(faq.id)}
                           />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaqs.length === 0 ? (
                <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4 text-muted-foreground border border-dashed border-border/60 rounded-[2.5rem] bg-muted/10">
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
                                        <Image src={faq.avatar} alt="Avatar" width={40} height={40} className="object-cover" />
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
                             <ConfirmDeleteDialog
                               trigger={
                                 <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold px-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                     Remove
                                 </Button>
                               }
                               title="Remove FAQ?"
                               description="Are you sure you want to delete this entry?"
                               onConfirm={() => handleDelete(faq.id)}
                             />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-card p-8 rounded-3xl w-full max-w-2xl shadow-2xl border border-border relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-6 text-foreground tracking-tight">{isEditing ? 'Modify FAQ Entry' : 'Create New FAQ Entry'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Question Context</label>
                <Input required value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} placeholder="e.g. How do I book a service?" className="rounded-xl h-12 border-border/60 bg-muted/30 focus:bg-white transition-colors font-semibold" />
              </div>
              <DashboardImageUpload 
                value={formData.avatar}
                onChange={(url) => setFormData({...formData, avatar: url})}
                type="avatar"
                label="Person Avatar (Optional)"
              />
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Detailed Resolution / Answer</label>
                <Textarea required value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} placeholder="Provide the resolution block..." className="rounded-xl min-h-[160px] resize-none border-border/60 bg-muted/30 focus:bg-white transition-colors" />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-muted/30 rounded-2xl border border-border/60">
                <div className="w-full sm:w-1/3">
                  <label className="text-xs font-bold text-muted-foreground mb-1.5 block">Registry Priority (Order)</label>
                  <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="rounded-xl h-11 w-full bg-white text-center font-bold" />
                </div>
                <div className="flex-1 w-full flex items-center gap-3 pt-6 sm:pt-[22px]">
                  <div className="relative inline-flex items-center cursor-pointer" onClick={() => setFormData({...formData, is_active: !formData.is_active})}>
                     <div className={`w-11 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-primary' : 'bg-border'}`}>
                         <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.is_active ? 'left-6' : 'left-1'}`} />
                     </div>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-foreground leading-tight">Published Online</span>
                     <span className="text-[10px] font-bold text-muted-foreground">Item actively visible to platform visitors</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border mt-8">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-xl font-bold h-12 px-6">Cancel Action</Button>
                <Button type="submit" className="rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20">{isEditing ? 'Commit Changes' : 'Publish Entry'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
