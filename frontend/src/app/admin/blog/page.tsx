"use client";

import { useEffect, useState } from "react";
import axiosInstance, { handleApiError } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Search, ShieldCheck, Zap, PenTool, Calendar, User as UserIcon, Eye, Trash2, Edit3, Loader2, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { DataToolbar } from "@/components/shared/DataToolbar";

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

export default function AdminBlog() {
 const [posts, setPosts] = useState<Post[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState("");
 const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

 // Dialog state
 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [selectedPost, setSelectedPost] = useState<Post | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [form, setForm] = useState({
  title: "",
  content: "",
  excerpt: "",
  is_published: false,
 });

 useEffect(() => {
  fetchPosts();
 }, []);

 const fetchPosts = async () => {
  try {
   const res = await axiosInstance.get("/api/admin/blog");
   setPosts(res.data.data || []);
  } catch (err) {
   console.error("Failed to fetch posts:", err);
  } finally {
   setIsLoading(false);
  }
 };

 const openCreate = () => {
  setSelectedPost(null);
  setForm({ title: "", content: "", excerpt: "", is_published: false });
  setIsDialogOpen(true);
 };

 const openEdit = (post: Post) => {
  setSelectedPost(post);
  setForm({
   title: post.title,
   content: post.content || "",
   excerpt: post.excerpt || "",
   is_published: post.is_published,
  });
  setIsDialogOpen(true);
 };

 const handleSave = async () => {
  setIsSubmitting(true);
  try {
   if (selectedPost) {
    await axiosInstance.put(`/api/admin/blog/${selectedPost.id}`, form);
    toast.success("Article updated successfully");
   } else {
    await axiosInstance.post("/api/admin/blog", form);
    toast.success("Article created successfully");
   }
   setIsDialogOpen(false);
   fetchPosts();
  } catch (err: any) {
   toast.error(handleApiError(err));
  } finally {
   setIsSubmitting(false);
  }
 };

 const handleDelete = async (id: string) => {
  if (!confirm("Are you sure you want to delete this article?")) return;
  try {
   await axiosInstance.delete(`/api/admin/blog/${id}`);
   toast.success("Article deleted");
   fetchPosts();
  } catch (err: any) {
   toast.error(handleApiError(err));
  }
 };

 const filteredPosts = posts.filter(p => 
  p.title.toLowerCase().includes(searchTerm.toLowerCase())
 );

 if (isLoading) {
  return (
   <div className="max-w-[1400px] mx-auto space-y-8 animate-pulse">
    <Skeleton className="h-12 w-64 rounded-2xl" />
    <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />
   </div>
  );
 }

 return (
  <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
   {/* Blog Header */}
   <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-glow-red">
    <div className="space-y-2">
      <h1 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight uppercase">
        Editorial <span className="text-primary">Journal</span>
      </h1>
      <p className="text-muted-foreground font-bold text-sm flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
        Authored content and marketplace insights for the Kuba community.
      </p>
    </div>
    <Button 
     onClick={openCreate}
     className="h-14 bg-primary hover:bg-primary text-white rounded-2xl font-semibold px-10 shadow-xl shadow-gray-100 transition-all uppercase tracking-normal text-[11px] flex items-center gap-2 group"
    >
      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
      Compose New Article
    </Button>
   </div>

   {/* Create/Edit Dialog */}
   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="sm:max-w-2xl rounded-3xl p-6 bg-white outline-none border-none shadow-2xl">
     <DialogHeader>
      <DialogTitle className="text-xl font-semibold uppercase text-foreground">
       {selectedPost ? "Edit Article" : "New Article"}
      </DialogTitle>
     </DialogHeader>
     <div className="space-y-5 py-4">
      <div className="space-y-2">
       <Label className="text-xs font-bold text-muted-foreground uppercase tracking-normal">Title</Label>
       <Input
        className="bg-muted border-none rounded-xl h-14 font-bold"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Article title..."
       />
      </div>
      <div className="space-y-2">
       <Label className="text-xs font-bold text-muted-foreground uppercase tracking-normal">Excerpt</Label>
       <Input
        className="bg-muted border-none rounded-xl h-14 font-medium"
        value={form.excerpt}
        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        placeholder="Brief summary..."
       />
      </div>
      <div className="space-y-2">
       <Label className="text-xs font-bold text-muted-foreground uppercase tracking-normal">Content</Label>
       <Textarea
        className="bg-muted border-none rounded-xl min-h-[200px] font-medium"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        placeholder="Write your article content..."
       />
      </div>
      <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
       <Label className="text-xs font-bold text-muted-foreground uppercase tracking-normal">Publish immediately</Label>
       <Switch
        checked={form.is_published}
        onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
        className="data-[state=checked]:bg-muted0"
       />
      </div>
      <Button
       onClick={handleSave}
       disabled={isSubmitting || !form.title || !form.content}
       className="w-full h-14 rounded-xl bg-primary hover:bg-black text-white font-semibold uppercase tracking-normal mt-4"
      >
       {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : selectedPost ? "Update Article" : "Publish Article"}
      </Button>
     </div>
    </DialogContent>
   </Dialog>

   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 mt-4 px-1">
    <div>
     <h2 className="text-2xl font-bold text-foreground tracking-tight">Manuscript Registry</h2>
     <p className="text-sm font-medium text-muted-foreground mt-1">Manage your platform narratives and published literature.</p>
    </div>
   </div>

   <DataToolbar 
    search={searchTerm}
    onSearchChange={setSearchTerm}
    searchPlaceholder="Search by Title or Author..."
    viewMode={viewMode}
    onViewChange={setViewMode}
   />

   {viewMode === 'list' ? (
    <Card className="border border-border overflow-hidden border-none shadow-sm bg-card/50 backdrop-blur-md">
     <CardContent className="p-0">
      <Table>
       <TableHeader>
        <TableRow className="hover:bg-transparent border-border">
         <TableHead className="pl-10 h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Article Identity</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Author</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Status</TableHead>
         <TableHead className="h-16 uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Publish Date</TableHead>
         <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-semibold tracking-wide text-muted-foreground">Governance</TableHead>
        </TableRow>
       </TableHeader>
       <TableBody>
        {filteredPosts.map((post) => (
         <TableRow key={post.id} className="hover:bg-muted/10 transition-colors border-border group">
          <TableCell className="pl-10 py-6">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-muted/50 rounded-2xl flex items-center justify-center text-foreground group-hover:bg-red-50 group-hover:text-primary transition-all overflow-hidden border border-border">
               {post.image_url ? (
                 <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
               ) : (
                 <PenTool className="w-5 h-5 opacity-40 group-hover:opacity-100" />
               )}
             </div>
             <div className="space-y-1">
               <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight uppercase line-clamp-1">{post.title}</p>
               <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-normal ">/{post.slug}</p>
             </div>
           </div>
          </TableCell>
          <TableCell className="py-6">
           <div className="flex items-center gap-2 text-xs font-semibold text-foreground opacity-60">
             <UserIcon className="w-3.5 h-3.5" />
             {post.author?.name || "Kuba System"}
           </div>
          </TableCell>
          <TableCell className="py-6">
           <Badge variant="outline" className={`rounded-full px-3 py-1 font-semibold text-[8px] uppercase tracking-normal border ${post.is_published ? "bg-muted text-foreground border-border" : "bg-muted text-muted-foreground"}`}>
             {post.is_published ? "Published" : "Draft Status"}
           </Badge>
          </TableCell>
          <TableCell className="py-6 text-[10px] font-semibold text-muted-foreground uppercase ">
           <div className="flex items-center gap-2">
             <Calendar className="w-3 h-3" />
             {new Date(post.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' })}
           </div>
          </TableCell>
          <TableCell className="pr-10 py-6 text-right space-x-2">
           <button onClick={() => openEdit(post)} className="p-2.5 text-muted-foreground hover:text-primary hover:bg-red-50 rounded-xl transition-all">
             <Edit3 className="w-4 h-4" />
           </button>
           <button onClick={() => handleDelete(post.id)} className="p-2.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
             <Trash2 className="w-4 h-4" />
           </button>
          </TableCell>
         </TableRow>
        ))}
        {filteredPosts.length === 0 && (
         <TableRow>
          <TableCell colSpan={5} className="h-80 text-center">
           <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
             <FileText className="h-16 w-16 opacity-10" />
             <p className="text-[10px] font-semibold uppercase tracking-[0.3em] ">No literary assets discovered</p>
           </div>
          </TableCell>
         </TableRow>
        )}
       </TableBody>
      </Table>
     </CardContent>
    </Card>
   ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {filteredPosts.length === 0 ? (
      <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4 text-muted-foreground border border-dashed border-border rounded-xl">
        <FileText className="h-16 w-16 opacity-10" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] ">No literary assets discovered</p>
      </div>
     ) : filteredPosts.map((post) => (
      <Card key={post.id} className="border border-border bg-card hover:shadow-md transition-all group overflow-hidden flex flex-col">
       <div className="relative h-48 w-full bg-muted/50 border-b border-border overflow-hidden">
        {post.image_url ? (
         <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
         <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 group-hover:text-primary/10 transition-colors">
          <ImageIcon className="w-12 h-12 mb-2" />
          <span className="text-xs uppercase tracking-widest font-semibold">No Image</span>
         </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
         <Badge variant="outline" className={`rounded-full px-2.5 py-1 font-semibold text-[9px] uppercase tracking-wider border shadow-sm backdrop-blur-md ${post.is_published ? "bg-black/50 text-white border-white/20" : "bg-white/50 text-black border-black/20"}`}>
          {post.is_published ? "Published" : "Draft"}
         </Badge>
        </div>
       </div>

       <CardContent className="p-5 flex-1 flex flex-col">
        <div className="mb-3 space-y-1">
         <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {post.title}
         </h3>
         <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest ">
          /{post.slug}
         </p>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 flex flex-col">
         {post.excerpt || "No excerpt provided for this article..."}
        </p>

        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground border-t border-border pt-4">
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
         <Button onClick={() => openEdit(post)} variant="outline" size="sm" className="w-full h-9 bg-background hover:bg-muted text-xs font-semibold">
          <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit
         </Button>
         <Button onClick={() => handleDelete(post.id)} variant="ghost" size="sm" className="w-full h-9 text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold">
          <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
         </Button>
        </div>
       </CardContent>
      </Card>
     ))}
    </div>
   )}
   
   <div className="p-10 bg-primary rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
     <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
       <Zap className="w-40 h-40" />
     </div>
     <div className="space-y-4 relative z-10">
       <h3 className="text-3xl font-semibold uppercase tracking-tight">Editorial Metrics</h3>
       <p className="text-xs font-bold text-muted-foreground max-w-md">Your platform content drives engagement and market SEO. Ensure your manuscript quality adheres to Kuba Elite standards.</p>
     </div>
     <div className="grid grid-cols-2 gap-10 relative z-10">
       <div className="text-center space-y-1">
         <span className="block text-4xl font-semibold tabular-nums">{posts.length}</span>
         <span className="block text-[10px] font-semibold uppercase tracking-normal text-muted-foreground">Total Assets</span>
       </div>
       <div className="text-center space-y-1">
         <span className="block text-4xl font-semibold tabular-nums text-sky-500">{posts.filter(p => !p.is_published).length}</span>
         <span className="block text-[10px] font-semibold uppercase tracking-normal text-muted-foreground">Pending Drafts</span>
       </div>
     </div>
   </div>
  </div>
 );
}
