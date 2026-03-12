import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function BlogIndex({ auth, posts }) {
    return (
        <PublicLayout auth={auth}>
            <Head title="Platform News & Tips | KUBA" />

            {/* Breadcrumb Section */}
            <section className="breadcrumb-section bg-[#263246] py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-widest text-center">Insights & Updates</h2>
                    <div className="flex items-center justify-center gap-2 text-white/60 font-bold uppercase text-xs tracking-widest text-center">
                        <Link href="/" className="hover:text-white transition">HOME</Link>
                        <span>/</span>
                        <span className="text-[#5768AD]">OUR BLOG</span>
                    </div>
                </div>
            </section>

            {/* Blog Grid Section */}
            <section className="blog-section spad py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {posts.data.map((post) => (
                            <div key={post.id} className="blog-card group">
                                <Link 
                                    href={route('blog.show', post.slug)}
                                    className="block aspect-[16/10] rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-slate-200/50"
                                >
                                    <img 
                                        src={post.image || `/assets/zogin/img/blog/blog-${(post.id % 6) + 1}.jpg`} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </Link>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-[#5768AD] bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                                            Announcement
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <Link href={route('blog.show', post.slug)}>
                                        <h3 className="text-2xl font-bold text-[#263246] hover:text-[#5768AD] transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-[#6E7580] line-clamp-3 text-sm leading-relaxed">
                                        {post.excerpt || post.content.substring(0, 150) + '...'}
                                    </p>
                                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-[#f5f6fa] flex items-center justify-center text-[#5768AD] font-black text-[10px]">
                                                {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 italic">{post.author?.name}</span>
                                        </div>
                                        <Link 
                                            href={route('blog.show', post.slug)}
                                            className="text-[10px] font-black text-[#263246] uppercase tracking-[2px] flex items-center gap-2 group/btn"
                                        >
                                            Read More 
                                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {posts.data.length === 0 && (
                        <div className="py-32 text-center text-slate-400">
                            <div className="text-6xl mb-6 opacity-20 italic font-black">Coming Soon</div>
                            <p className="uppercase font-black text-xs tracking-widest">Our editorial team is preparing amazing content.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.links.length > 3 && (
                        <div className="mt-20 flex justify-center gap-3">
                            {posts.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`h-12 min-w-[48px] px-2 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                                        link.active 
                                            ? 'bg-[#5768AD] text-white shadow-xl shadow-indigo-500/30' 
                                            : 'bg-white border-2 border-slate-50 text-slate-400 hover:border-[#5768AD] hover:text-[#5768AD]'
                                    } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
