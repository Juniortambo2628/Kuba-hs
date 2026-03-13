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
import { Plus, FileText, Search, ShieldCheck, Zap, PenTool, Calendar, User as UserIcon, Eye, Trash2, Edit3, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
            <h1 className="text-4xl md:text-5xl font-black text-[#1E293B] tracking-tight uppercase">
                Editorial <span className="text-sky-600">Journal</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm italic flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Authored content and marketplace insights for the Kuba community.
            </p>
        </div>
        <Button 
          onClick={openCreate}
          className="h-14 bg-[#1E293B] hover:bg-sky-600 text-white rounded-2xl font-black px-10 shadow-xl shadow-gray-100 transition-all uppercase tracking-widest text-[11px] flex items-center gap-2 group"
        >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Compose New Article
        </Button>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-6 bg-white outline-none border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase text-[#1E293B]">
              {selectedPost ? "Edit Article" : "New Article"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Title</Label>
              <Input
                className="bg-gray-50 border-none rounded-xl h-14 font-bold"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Article title..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Excerpt</Label>
              <Input
                className="bg-gray-50 border-none rounded-xl h-14 font-medium"
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Brief summary..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Content</Label>
              <Textarea
                className="bg-gray-50 border-none rounded-xl min-h-[200px] font-medium"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write your article content..."
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Publish immediately</Label>
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isSubmitting || !form.title || !form.content}
              className="w-full h-14 rounded-xl bg-[#1E293B] hover:bg-black text-white font-black uppercase tracking-widest mt-4"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : selectedPost ? "Update Article" : "Publish Article"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="premium-card overflow-hidden border-none shadow-premium bg-white/50 backdrop-blur-md">
        <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
                <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-[0.2em]">Manuscript Registry</h2>
                <p className="text-xs font-bold text-gray-400 italic">Manage your platform narratives and published literature.</p>
            </div>
            
            <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-sky-600 transition-colors" />
                <Input 
                    placeholder="Search by Title or Author..." 
                    className="h-12 pl-12 pr-4 bg-[#F8FAFC] border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-100 placeholder:italic transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-gray-50">
                <TableHead className="pl-10 h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Article Identity</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Author</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Status</TableHead>
                <TableHead className="h-16 uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Publish Date</TableHead>
                <TableHead className="h-16 pr-10 text-right uppercase text-[10px] font-black tracking-[0.2em] text-gray-400">Governance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-gray-50/10 transition-colors border-gray-50 group">
                  <TableCell className="pl-10 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-[#1E293B] group-hover:bg-red-50 group-hover:text-sky-600 transition-all overflow-hidden border border-gray-50">
                            {post.image_url ? (
                                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            ) : (
                                <PenTool className="w-5 h-5 opacity-40 group-hover:opacity-100" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-[#1E293B] group-hover:text-sky-600 transition-colors tracking-tight uppercase line-clamp-1">{post.title}</p>
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic">/{post.slug}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2 text-xs font-black text-[#1E293B] opacity-60">
                        <UserIcon className="w-3.5 h-3.5" />
                        {post.author?.name || "Kuba System"}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge variant="outline" className={`rounded-full px-3 py-1 font-black text-[8px] uppercase tracking-widest border ${post.is_published ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400"}`}>
                        {post.is_published ? "Published" : "Draft Status"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-[10px] font-black text-gray-300 uppercase italic">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString('default', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </TableCell>
                  <TableCell className="pr-10 py-6 text-right space-x-2">
                    <button onClick={() => openEdit(post)} className="p-2.5 text-gray-200 hover:text-sky-600 hover:bg-red-50 rounded-xl transition-all">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2.5 text-gray-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-80 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-gray-200">
                        <FileText className="h-16 w-16 opacity-10" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">No literary assets discovered</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="p-10 bg-[#1E293B] rounded-[3rem] text-white flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Zap className="w-40 h-40" />
          </div>
          <div className="space-y-4 relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight">Editorial Metrics</h3>
              <p className="text-xs font-bold text-gray-400 italic max-w-md">Your platform content drives engagement and market SEO. Ensure your manuscript quality adheres to Kuba Elite standards.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 relative z-10">
              <div className="text-center space-y-1">
                  <span className="block text-4xl font-black tabular-nums">{posts.length}</span>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Total Assets</span>
              </div>
              <div className="text-center space-y-1">
                  <span className="block text-4xl font-black tabular-nums text-sky-500">{posts.filter(p => !p.is_published).length}</span>
                  <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Pending Drafts</span>
              </div>
          </div>
      </div>
    </div>
  );
}
