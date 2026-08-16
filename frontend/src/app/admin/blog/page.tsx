"use client";

import { DashboardPageContainer } from "@/components/shared/DashboardPageContainer";
import { DashboardPageSkeleton } from "@/components/shared/DashboardPageSkeleton";
import { DashboardListView, ColumnDef } from "@/components/shared/DashboardListView";

import { useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Zap, PenTool, Calendar, User as UserIcon, Trash2, Edit3, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useSearchState } from "@/hooks/useSearchState";
import { DashboardPageHeader } from "@/components/shared/DashboardPageHeader";
import { useData } from "@/hooks/useData";
import { AppConfirmDialog } from "@/components/shared/dialog/AppConfirmDialog";
import { BlogPostFormDialog } from "@/components/admin/BlogPostFormDialog";

interface Post {
 id: string;
 title: string;
 slug: string;
 content: string;
 excerpt: string;
 is_published: boolean;
 image_url?: string;
 created_at: string;
 author?: { name: string };
}

const columns: ColumnDef<Post>[] = [
  {
    key: "identity",
    header: "Article Identity",
    position: "first",
    className: "!pl-10 py-6",
    headerClassName: "!pl-10 h-16 tracking-tight",
    render: (post) => (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center text-foreground group-hover:bg-red-50 group-hover:text-primary transition-all overflow-hidden border border-border">
          {post.image_url ? (
            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <PenTool className="w-5 h-5 opacity-40 group-hover:opacity-100" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">{post.title}</p>
          <p className="text-[10px] font-bold text-muted-foreground tracking-tight">/{post.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: "author",
    header: "Author",
    className: "py-6",
    headerClassName: "h-16 tracking-tight",
    render: (post) => (
      <div className="flex items-center gap-2 text-xs font-bold text-foreground opacity-60">
        <UserIcon className="w-3.5 h-3.5" />
        {post.author?.name || "Kuba System"}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "py-6",
    headerClassName: "h-16 tracking-tight",
    render: (post) => (
      <Badge variant="outline" className={`rounded-full px-3 py-1 font-bold text-[9px] tracking-tight border ${post.is_published ? "bg-muted text-foreground border-border" : "bg-muted text-muted-foreground"}`}>
        {post.is_published ? "Published" : "Draft Status"}
      </Badge>
    ),
  },
  {
    key: "date",
    header: "Publish Date",
    className: "py-6 text-[10px] font-bold text-muted-foreground",
    headerClassName: "h-16 tracking-tight",
    render: (post) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3" />
        {new Date(post.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' })}
      </div>
    ),
  },
];

export default function AdminBlog() {
  const { search: searchTerm } = useSearchState();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const { data: posts, isLoading, refetch: fetchPosts } = useData<Post[]>("/api/admin/blog", { initialData: [] });

  const openCreate = () => { setEditingPost(null); setIsDialogOpen(true); };
  const openEdit = (post: Post) => { setEditingPost(post); setIsDialogOpen(true); };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/admin/blog/${id}`);
      toast.success("Article deleted");
      fetchPosts();
    } catch (err: any) {
      toast.error(handleApiError(err));
    }
  };

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (isLoading) {
    return <DashboardPageSkeleton metrics={0} bodyHeight="h-[500px]" />;
  }

  return (
    <DashboardPageContainer className="space-y-10">
      <DashboardPageHeader title="Editorial Journal" subtitle="Authored content and marketplace insights for the community.">
        <Button onClick={openCreate} className="h-12 bg-primary hover:bg-black text-white rounded-2xl font-bold px-8 shadow-md transition-all flex items-center gap-2 group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Compose New Article
        </Button>
      </DashboardPageHeader>

      <BlogPostFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingId={editingPost?.id ?? null}
        initial={editingPost ? { title: editingPost.title, content: editingPost.content || "", excerpt: editingPost.excerpt || "", is_published: editingPost.is_published } : undefined}
        onSuccess={fetchPosts}
      />

      {searchTerm && <p className="text-xs text-muted-foreground">Results for &quot;{searchTerm}&quot;</p>}

      <DashboardListView
        data={filteredPosts}
        isLoading={false}
        keyExtractor={(post) => post.id}
        columns={columns}
        hint="Use ⌘K Quick Jump to search articles"
        renderGridCard={(post) => (
          <Card className="border border-border bg-card hover:shadow-md transition-all group overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-muted/50 border-b border-border overflow-hidden">
              {post.image_url ? (
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 group-hover:text-primary/10 transition-colors">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <span className="text-xs tracking-tight font-bold">No Image</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className={`rounded-full px-2.5 py-1 font-bold text-[9px] tracking-tight border shadow-sm backdrop-blur-md ${post.is_published ? "bg-black/50 text-white border-white/20" : "bg-white/50 text-black border-black/20"}`}>
                  {post.is_published ? "Published" : "Draft"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="mb-3 space-y-1">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">{post.title}</h3>
                <p className="text-[10px] font-bold text-muted-foreground tracking-tight">/{post.slug}</p>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">{post.excerpt || "No excerpt provided for this article..."}</p>
              <div className="flex items-center gap-2 text-[10px] font-bold tracking-tight text-muted-foreground border-t border-border pt-4">
                <div className="flex items-center gap-1.5 flex-1 w-0 truncate">
                  <UserIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{post.author?.name || "Kuba System"}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button onClick={() => openEdit(post)} variant="outline" size="sm" className="w-full h-9 bg-background hover:bg-muted text-xs font-bold">
                  <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="w-full h-9 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold" onClick={() => setDeleteTarget(post)}>
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        rowClassName={() => "hover:bg-muted/10 transition-colors border-border group"}
        emptyIcon={FileText}
        emptyTitle="No literary assets discovered"
      />

      <div className="p-10 bg-primary rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
          <Zap className="w-40 h-40" />
        </div>
        <div className="space-y-4 relative z-10">
          <h3 className="text-3xl font-bold tracking-tight">Editorial Metrics</h3>
          <p className="text-xs font-bold text-muted-foreground max-w-md">Your platform content drives engagement and market SEO. Ensure your manuscript quality adheres to Kuba Elite standards.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 relative z-10">
          <div className="text-center space-y-1">
            <span className="block text-4xl font-bold tabular-nums">{posts.length}</span>
            <span className="block text-[10px] font-bold tracking-tight text-muted-foreground">Total Assets</span>
          </div>
          <div className="text-center space-y-1">
            <span className="block text-4xl font-bold tabular-nums text-sky-500">{posts.filter(p => !p.is_published).length}</span>
            <span className="block text-[10px] font-bold tracking-tight text-muted-foreground">Pending Drafts</span>
          </div>
        </div>
      </div>

      <AppConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) { await handleDelete(deleteTarget.id); setDeleteTarget(null); } }}
        title="Purge Literary Asset?"
        description={<>Are you sure you want to delete <span className="font-bold text-foreground">"{deleteTarget?.title}"</span>? This article will be permanently removed from the editorial manuscript registry and platform archives.</>}
      />
    </DashboardPageContainer>
  );
}
