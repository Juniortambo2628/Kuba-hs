import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';

export default function ServicesIndex({ auth, categories }) {
    return (
        <PublicLayout auth={auth}>
            <Head title="Our Services | KUBA" />

            {/* Breadcrumb Section */}
            <section className="breadcrumb-section bg-[#263246] py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-widest">Professional Home Services</h2>
                    <div className="flex items-center justify-center gap-2 text-white/60 font-bold uppercase text-xs tracking-widest">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-[#5768AD]">Our Services</span>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-page spad py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold text-[#263246] mb-6">Explore by Category</h2>
                        <p className="text-[#9B9EA3]">From emergency repairs to scheduled maintenance, find the right professional for any task.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {categories.map((category, idx) => (
                            <div key={category.id} className="category-card group">
                                <div className="category-header flex items-center gap-6 mb-8">
                                    <div className="h-20 w-20 rounded-2xl bg-[#f5f6fa] group-hover:bg-[#5768AD] transition-colors duration-500 flex items-center justify-center">
                                        <img 
                                            src={`/assets/zogin/img/services/services-${(idx % 6) + 1}.png`} 
                                            alt={category.name} 
                                            className="w-12 h-12 group-hover:brightness-0 group-hover:invert transition-all"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#263246] group-hover:text-[#5768AD] transition-colors">{category.name}</h3>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">
                                            {category.services?.length || 0} Specializations
                                        </p>
                                    </div>
                                </div>
                                <div className="category-body bg-[#fdfdfd] border border-gray-50 rounded-3xl p-8 group-hover:shadow-2xl group-hover:shadow-indigo-500/5 transition-all">
                                    <ul className="space-y-4">
                                        {category.services?.map(service => (
                                            <li key={service.id}>
                                                <Link 
                                                    href={route('marketplace.search', { category_id: category.id, service_id: service.id })}
                                                    className="flex items-center justify-between group/link"
                                                >
                                                    <span className="text-[#6E7580] font-medium group-hover/link:text-[#263246] transition-colors">{service.name}</span>
                                                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[#5768AD] opacity-0 group-hover/link:opacity-100 transition-opacity">
                                                        <span className="text-[10px] font-bold">→</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link 
                                        href={route('marketplace.search', { category_id: category.id })}
                                        className="mt-10 block w-full text-center py-4 rounded-xl bg-white border-2 border-slate-100 text-[#263246] text-xs font-black uppercase tracking-widest hover:bg-[#5768AD] hover:text-white hover:border-[#5768AD] transition-all"
                                    >
                                        Browse all {category.name}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section bg-[#5768AD] py-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-10">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-bold text-white mb-4">Don't see what you need?</h2>
                            <p className="text-white/80 text-lg">Send us a request and we'll help you find a professional tailored to your specific requirements.</p>
                        </div>
                        <Link href={route('contact')} className="bg-white text-[#5768AD] px-10 py-5 rounded-sm font-black text-sm uppercase tracking-[2px] shadow-2xl hover:bg-gray-100 transition-all">
                            Request Custom Service
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
