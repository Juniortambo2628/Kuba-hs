import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function BlogShow({ auth, post, recentPosts }) {
    return (
        <PublicLayout auth={auth}>
            <Head title={`${post.title} | KUBA Blog`} />

            {/* Post Header */}
            <section className="blog-head relative h-[60vh] min-h-[400px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={post.image || `/assets/zogin/img/blog/blog-details.jpg`} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#263246]/70"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <span className="text-[10px] font-black text-white bg-[#5768AD] px-6 py-2 rounded-full uppercase tracking-widest">
                            Official Industry News
                        </span>
                    </div>
                    <h1 className="text-4xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                        {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-8 py-8 border-y border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-black text-xs border border-white/20">
                                {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                            </div>
                            <span className="text-sm font-bold text-white tracking-widest uppercase italic">{post.author?.name}</span>
                        </div>
                        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                        <div className="text-sm font-bold text-white/70 uppercase tracking-widest">
                            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Post Content */}
            <section className="blog-content spad py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap lg:-mx-10 translate-y-[-100px]">
                        <div className="w-full lg:w-8/12 lg:px-10 mb-16 lg:mb-0">
                            <div className="bg-white p-10 lg:p-20 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-gray-50">
                                <div 
                                    className="prose prose-lg max-w-none text-[#6E7580] leading-loose space-y-8"
                                    dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
                                />

                                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Share this story:</span>
                                        <div className="flex gap-2">
                                            {['facebook', 'twitter', 'linkedin'].map(soc => (
                                                <button key={soc} className="h-10 w-10 rounded-xl bg-[#f5f6fa] text-[#263246] flex items-center justify-center hover:bg-[#5768AD] hover:text-white transition-all">
                                                    <i className={`fa fa-${soc}`}></i>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <Link 
                                        href={route('blog.index')}
                                        className="text-xs font-black text-[#5768AD] uppercase tracking-widest border-b-2 border-[#5768AD]/20 hover:border-[#5768AD] transition-all"
                                    >
                                        Return to Blog Overview
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-4/12 lg:px-10 mt-[100px] lg:mt-0">
                            <div className="space-y-12 sticky top-32">
                                <div className="bg-[#fdfdfd] p-8 rounded-[2rem] border border-gray-100">
                                    <h4 className="text-xl font-bold text-[#263246] mb-8 flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-[#5768AD]"></span>
                                        Recommended Reading
                                    </h4>
                                    <div className="space-y-8">
                                        {recentPosts.map(rp => (
                                            <Link key={rp.id} href={route('blog.show', rp.slug)} className="group block">
                                                <div className="flex gap-4">
                                                    <div className="h-20 w-20 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                                                        <img src={rp.image || `/assets/zogin/img/blog/sidebar/recent-1.jpg`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-black text-[#263246] group-hover:text-[#5768AD] transition-colors leading-snug line-clamp-2 mb-2">
                                                            {rp.title}
                                                        </h5>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                            {new Date(rp.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#5768AD] p-10 rounded-[2rem] text-center shadow-xl shadow-indigo-500/20 italic">
                                    <h4 className="text-2xl font-bold text-white mb-4">Start Your Project Today</h4>
                                    <p className="text-white/70 text-sm mb-8">Join thousands of homeowners who trust Kuba for their essential home needs.</p>
                                    <Link 
                                        href={route('register')} 
                                        className="inline-block bg-white text-[#5768AD] px-8 py-3 rounded-sm font-black text-[10px] uppercase tracking-widest hover:brightness-95 transition-all"
                                    >
                                        Get Started Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
