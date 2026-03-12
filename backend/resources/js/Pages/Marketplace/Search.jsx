import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Search({ auth, providers, categories, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category_id || null);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery !== (filters.search || '')) {
                router.get(
                    route('marketplace.search'),
                    { search: searchQuery, category_id: selectedCategory },
                    { preserveState: true, replace: true }
                );
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleCategoryClick = (categoryId) => {
        const newCategory = selectedCategory === categoryId ? null : categoryId;
        setSelectedCategory(newCategory);
        router.get(
            route('marketplace.search'),
            { search: searchQuery, category_id: newCategory },
            { preserveState: true, replace: true }
        );
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Search Services | KUBA" />

            {/* Breadcrumb / Page Title Section */}
            <section className="breadcrumb-section bg-cover bg-center py-20 relative" style={{ backgroundImage: `url(/assets/zogin/img/breadcrumb.jpg)` }}>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 uppercase tracking-widest">Marketplace</h2>
                        <div className="breadcrumb__text text-white/80 uppercase text-sm font-bold tracking-widest">
                            <Link href="/" className="hover:text-white transition">Home</Link>
                            <span className="mx-3 text-[#5768AD]">|</span>
                            <span>Services</span>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-[#263246]/60"></div>
            </section>

            <main className="spad bg-[#fdfdfd]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap -mx-4">
                        {/* Sidebar Filters */}
                        <aside className="w-full lg:w-1/4 px-4 mb-12 lg:mb-0">
                            <div className="sidebar__widget mb-10">
                                <h4 className="text-xl font-bold text-[#263246] mb-6 relative pb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-[#5768AD]">Search</h4>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search services..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full border border-gray-200 rounded-sm py-3 px-4 focus:ring-1 focus:ring-[#5768AD] focus:border-[#5768AD] outline-none transition"
                                    />
                                    <i className="fa fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                </div>
                            </div>

                            <div className="sidebar__widget">
                                <h4 className="text-xl font-bold text-[#263246] mb-6 relative pb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-[#5768AD]">Categories</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <button
                                            onClick={() => handleCategoryClick(null)}
                                            className={`text-sm font-bold uppercase tracking-wider flex items-center justify-between w-full transition ${!selectedCategory ? 'text-[#5768AD]' : 'text-[#6E7580] hover:text-[#5768AD]'}`}
                                        >
                                            All Services
                                            <i className="fa fa-angle-right"></i>
                                        </button>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => handleCategoryClick(category.id)}
                                                className={`text-sm font-bold uppercase tracking-wider flex items-center justify-between w-full transition ${selectedCategory === category.id ? 'text-[#5768AD]' : 'text-[#6E7580] hover:text-[#5768AD]'}`}
                                            >
                                                {category.name}
                                                <i className="fa fa-angle-right"></i>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Results Area */}
                        <div className="w-full lg:w-3/4 px-4">
                            {providers.data.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid gap-8 grid-cols-1 md:grid-cols-2"
                                >
                                    <AnimatePresence>
                                        {providers.data.map((provider) => {
                                            // Stable index from UUID
                                            const getPlaceholderIndex = (id) => {
                                                if (!id) return 1;
                                                let sum = 0;
                                                for (let i = 0; i < id.length; i++) {
                                                    sum += id.charCodeAt(i);
                                                }
                                                return (sum % 12) + 1;
                                            };
                                            const imgIndex = getPlaceholderIndex(provider.id);

                                            return (
                                                <motion.div
                                                    key={provider.id}
                                                    variants={itemVariants}
                                                    layout
                                                    className="classes__item rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white hover:shadow-2xl transition-all group"
                                                >
                                                    <div className="classes__item__pic h-[240px] bg-cover bg-center overflow-hidden relative" style={{ backgroundImage: `url(/assets/zogin/img/classes/classes-${imgIndex}.jpg)` }}>
                                                        {provider.is_verified && (
                                                            <span className="bg-[#5768AD] text-white px-4 py-1 text-sm font-bold absolute top-0 left-0">VERIFIED</span>
                                                        )}
                                                    </div>
                                                    <div className="classes__item__text p-8">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div className="h-10 w-10 rounded-full bg-[#5768AD]/10 flex items-center justify-center text-[#5768AD] font-bold">
                                                                {provider.business_name?.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xl font-bold text-[#263246]">
                                                                    {provider.business_name}
                                                                </h4>
                                                                <p className="text-xs text-[#9B9EA3] uppercase font-bold tracking-widest leading-none">
                                                                    {provider.location_name} • {provider.experience_years}y Exp.
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-[#6E7580] line-clamp-2 mb-6 leading-relaxed">
                                                            {provider.bio}
                                                        </p>

                                                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                                            <div className="flex items-center gap-1 text-[#263246] font-bold">
                                                                <i className="fa fa-star text-yellow-400"></i>
                                                                {provider.rating > 0 ? provider.rating : 'New'}
                                                                <span className="text-[#9B9EA3] font-normal text-xs ml-1">({provider.review_count})</span>
                                                            </div>
                                                            <Link 
                                                                href={route('marketplace.provider', provider.id)}
                                                                className="text-xs font-bold text-[#5768AD] uppercase tracking-widest hover:opacity-70 transition"
                                                            >
                                                                View Profile <i className="fa fa-long-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
                                    <div className="mx-auto h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                        <i className="fa fa-search text-gray-300 text-3xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#263246]">No providers found</h3>
                                    <p className="text-[#9B9EA3] mt-2">Try adjusting your filters or search terms.</p>
                                    <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }} className="mt-8 text-sm font-bold text-[#5768AD] uppercase tracking-widest border-b-2 border-[#5768AD]">Clear All Filters</button>
                                </div>
                            )}

                            {/* Pagination */}
                            {providers.links && providers.links.length > 3 && (
                                <div className="mt-12 flex justify-center gap-2">
                                    {providers.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className={`px-5 py-2 rounded-sm text-sm font-bold transition uppercase tracking-widest ${
                                                    link.active
                                                        ? 'bg-[#5768AD] text-white shadow-lg'
                                                        : 'bg-white text-[#263246] hover:bg-gray-50 border border-gray-100 shadow-sm'
                                                }`}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-5 py-2 rounded-sm text-sm font-bold text-gray-300 border border-gray-50 cursor-not-allowed uppercase tracking-widest"
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
