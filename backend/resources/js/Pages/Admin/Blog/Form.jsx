import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BlogForm({ auth, post = null }) {
    const isEditing = !!post;
    const { data, setData, post: submit, put, processing, errors } = useForm({
        title: post?.title || '',
        content: post?.content || '',
        excerpt: post?.excerpt || '',
        image: post?.image || '',
        is_published: post?.is_published ?? false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.blog.update', post.id));
        } else {
            submit(route('admin.blog.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('admin.blog.index')}
                            className="h-12 w-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                {isEditing ? 'Edit Post' : 'Create Post'}
                            </h1>
                            <p className="text-sm text-slate-500 font-medium italic">Craft a compelling story for your audience.</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Blog Post' : 'New Blog Post'} />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-2 space-y-8">
                    {/* Content Section */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Post Title</label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-[1.5rem] px-8 py-5 text-lg font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Enter post title..."
                                />
                                {errors.title && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-4">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Main Content</label>
                                <textarea
                                    rows="15"
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-6 text-sm font-medium text-slate-700 leading-relaxed focus:ring-2 focus:ring-indigo-500 transition-all"
                                    placeholder="Write your story here..."
                                />
                                {errors.content && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-4">{errors.content}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Excerpt Section */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Short Excerpt (Optional)</label>
                            <textarea
                                rows="3"
                                value={data.excerpt}
                                onChange={e => setData('excerpt', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-[1.5rem] px-8 py-5 text-sm font-medium text-slate-600 leading-relaxed focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="A brief summary for the blog list page..."
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Publishing Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 italic">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Status & Visibility</h4>
                        
                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => setData('is_published', !data.is_published)}
                                className={cn(
                                    "w-full p-4 rounded-2xl flex items-center justify-between transition-all group",
                                    data.is_published 
                                        ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100" 
                                        : "bg-slate-50 text-slate-400 border-2 border-transparent"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {data.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                                    <span className="text-xs font-black uppercase tracking-widest">
                                        {data.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                                <div className={cn(
                                    "h-5 w-5 rounded-full border-4 flex items-center justify-center",
                                    data.is_published ? "border-emerald-500 bg-white" : "border-slate-200"
                                )}>
                                    {data.is_published && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                                </div>
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-[3px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                            >
                                <Save size={16} />
                                {isEditing ? 'Update Post' : 'Publish Post'}
                            </button>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Cover Image</h4>
                        <div className="space-y-4">
                            <div className="aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center overflow-hidden">
                                {data.image ? (
                                    <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageIcon className="text-slate-200" size={48} />
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No image selected</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="text"
                                value={data.image}
                                onChange={e => setData('image', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Image URL (temporary solution)"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
