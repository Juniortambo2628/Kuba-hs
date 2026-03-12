import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Plus, Edit2, Trash2, Eye, EyeOff, Search, 
    MoreHorizontal, FileText, Calendar, User, 
    ChevronRight, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCallback } from 'react';
import DashboardShell from '@/Components/DashboardShell';
import { 
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '@/Components/ui/table';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Badge } from '@/Components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

export default function BlogIndex({ posts, filters }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to permanently delete this post?')) {
            destroy(route('admin.blog.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editorial Management" />

            <DashboardShell
                title="Editorial Management"
                subtitle="Curate platform content, manage blog articles, and reach your audience."
                action={{
                    label: "Create New Post",
                    href: route('admin.blog.create'),
                    icon: Plus,
                }}
            >
                <div className="space-y-6">
                    {/* Filters Row */}
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by title or category..." 
                                className="pl-9"
                                // Value and onChange logic would go here if filters were passed
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-widest px-3 py-1 bg-muted/30">
                                {posts.total} Total Articles
                            </Badge>
                        </div>
                    </div>

                    {/* Blog Table */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30 hover:bg-muted/30">
                                    <TableHead className="pl-6 py-3 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Article Preview</TableHead>
                                    <TableHead className="py-3 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Publication Info</TableHead>
                                    <TableHead className="py-3 uppercase text-[10px] font-black tracking-widest text-muted-foreground">Visibility</TableHead>
                                    <TableHead className="py-3 uppercase text-[10px] font-black tracking-widest text-muted-foreground text-right">Metrics</TableHead>
                                    <TableHead className="pr-6 py-3 text-right uppercase text-[10px] font-black tracking-widest text-muted-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <TableRow key={post.id} className="hover:bg-muted/30 transition-colors group">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-20 rounded-lg overflow-hidden border-2 border-background shadow-sm bg-muted shrink-0">
                                                        <img 
                                                            src={post.image || 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2674'} 
                                                            alt="" 
                                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-black text-foreground line-clamp-1 leading-tight">{post.title}</span>
                                                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter mt-1 flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            {post.author?.name || "System Office"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-foreground">
                                                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Global Release</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest",
                                                    post.is_published 
                                                        ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" 
                                                        : "bg-amber-50 text-amber-600 border-amber-100"
                                                )}>
                                                    {post.is_published ? 'Published' : 'Draft Mode'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-right">
                                                <div className="flex flex-col items-end opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-xs font-black text-foreground">1.2k</span>
                                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Reads</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('admin.blog.edit', post.id)}>
                                                                <Edit2 className="mr-2 h-4 w-4" />
                                                                Edit Content
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            View Live Page
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(post.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete Post
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                                <FileText className="h-10 w-10 mb-2" />
                                                <p className="text-sm font-bold uppercase tracking-widest">No articles found</p>
                                                <Link href={route('admin.blog.create')} className="text-xs font-bold text-primary mt-2 uppercase tracking-wide hover:underline">Draft your first article</Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {posts.links && posts.links.length > 3 && (
                            <div className="px-6 py-4 bg-muted/20 border-t flex items-center justify-between">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Displaying {posts.from}-{posts.to} of {posts.total} entries
                                </span>
                                <div className="flex gap-1">
                                    {posts.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={cn(
                                                "h-8 px-3 rounded-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter transition-all",
                                                link.active 
                                                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                                !link.url && "opacity-50 pointer-events-none"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
