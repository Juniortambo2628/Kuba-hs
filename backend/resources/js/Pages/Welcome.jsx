import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import Modal from '@/Components/Modal';
import BookingForm from '@/Components/BookingForm';

export default function Welcome({ auth, categories, featuredServices = [] }) {
    const { settings = {} } = usePage().props;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [location, setLocation] = useState('');
    const [activeHero, setActiveHero] = useState(0);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedPS, setSelectedPS] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const bookPsId = params.get('book_ps_id');
        if (bookPsId && auth.user) {
            const ps = featuredServices.find(s => s.id === bookPsId);
            if (ps) {
                setSelectedPS(ps);
                setIsBookingModalOpen(true);
            }
        }
    }, [auth.user, featuredServices]);

    const handleBookClick = (ps) => {
        if (!auth.user) {
            // Store target in URL so we can reopen after login
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('book_ps_id', ps.id);
            window.location.href = route('login') + '?redirect=' + encodeURIComponent(currentUrl.toString());
            return;
        }
        setSelectedPS(ps);
        setIsBookingModalOpen(true);
    };

    const heroSlides = [
        {
            bg: settings.hero_bg || '/assets/zogin/img/hero/hero-1.jpg',
            title: settings.hero_title || 'What hurts today makes you stronger tomorrow',
            subtitle: settings.hero_subtitle || 'Welcome to KUBA',
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveHero((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <PublicLayout auth={auth}>
            <Head title="Kuba | Home Services Marketplace" />

            {/* Hero Section */}
            <section className="hero relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeHero}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="hero__items min-h-[700px] lg:min-h-[873px] flex items-center"
                        style={{ backgroundImage: `url(${heroSlides[activeHero].bg})` }}
                    >
                        <div className="container mx-auto px-4">
                            <div className="flex flex-wrap">
                                <div className="w-full lg:w-2/3">
                                    <div className="hero__text">
                                        <motion.span
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-white font-bold uppercase tracking-[4px] mb-6 block"
                                        >
                                            {heroSlides[activeHero].subtitle}
                                        </motion.span>
                                        <motion.h2
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                            className="text-4xl lg:text-7xl text-white font-bold leading-tight mb-10"
                                        >
                                            {heroSlides[activeHero].title}
                                        </motion.h2>

                                        {/* Integrated Search for Kuba */}
                                        <motion.div
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.9 }}
                                            className="max-w-4xl"
                                        >
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                const params = {};
                                                if (searchQuery.trim()) params.search = searchQuery;
                                                if (selectedCategory) params.category_id = selectedCategory;
                                                if (location.trim()) params.location = location;
                                                window.location.href = route('marketplace.search', params);
                                            }} className="bg-white/95 p-4 rounded-xl shadow-2xl flex flex-wrap lg:flex-nowrap items-center gap-4">
                                                <div className="flex-1 min-w-[200px] relative">
                                                    <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#5768AD]"></i>
                                                    <input
                                                        type="text"
                                                        placeholder="What service do you need?"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full border-none bg-transparent py-4 pl-12 pr-4 text-gray-900 focus:ring-0 text-sm font-medium"
                                                    />
                                                </div>
                                                <div className="hidden lg:block w-px h-8 bg-gray-200"></div>
                                                <div className="flex-1 min-w-[180px] relative">
                                                    <i className="fa fa-th-large absolute left-4 top-1/2 -translate-y-1/2 text-[#5768AD]"></i>
                                                    <select 
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        className="w-full border-none bg-transparent py-4 pl-12 pr-8 text-gray-900 focus:ring-0 text-sm font-medium appearance-none cursor-pointer"
                                                    >
                                                        <option value="">All Categories</option>
                                                        {categories.map(cat => (
                                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="hidden lg:block w-px h-8 bg-gray-200"></div>
                                                <div className="flex-1 min-w-[180px] relative">
                                                    <i className="fa fa-map-marker absolute left-4 top-1/2 -translate-y-1/2 text-[#5768AD]"></i>
                                                    <input
                                                        type="text"
                                                        placeholder="Location"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        className="w-full border-none bg-transparent py-4 pl-12 pr-4 text-gray-900 focus:ring-0 text-sm font-medium"
                                                    />
                                                </div>
                                                <button type="submit" className="w-full lg:w-auto bg-[#5768AD] text-white px-8 py-4 rounded-lg hover:bg-[#4a5894] transition font-bold uppercase tracking-widest text-xs whitespace-nowrap">
                                                    Find Services
                                                </button>
                                            </form>
                                            
                                            {/* Quick Search Tags */}
                                            <div className="mt-6 flex flex-wrap gap-3 items-center">
                                                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Popular:</span>
                                                {categories.slice(0, 4).map(cat => (
                                                    <button 
                                                        key={cat.id}
                                                        onClick={() => window.location.href = route('marketplace.search', { category_id: cat.id })}
                                                        className="text-white bg-white/10 hover:bg-[#5768AD] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-white/20"
                                                    >
                                                        {cat.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* About Section */}
            <section className="home-about spad bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-7/12 mb-10 lg:mb-0">
                        <div className="home__about__pic flex flex-wrap gap-5">
                                <div className="home__about__pic__item large-item w-full sm:w-[calc(60%-10px)] min-h-[400px] rounded-lg shadow-xl" style={{ backgroundImage: `url(${settings.about_image_1 || '/assets/zogin/img/about/about-1.jpg'})` }}></div>
                                <div className="w-full sm:w-[calc(40%-10px)] flex flex-col gap-5">
                                    <div className="home__about__pic__item__inner w-full min-h-[190px] rounded-lg shadow-lg" style={{ backgroundImage: `url(${settings.about_image_2 || '/assets/zogin/img/about/about-2.jpg'})` }}></div>
                                    <div className="home__about__pic__item__inner w-full min-h-[190px] rounded-lg shadow-lg" style={{ backgroundImage: `url(${settings.about_image_3 || '/assets/zogin/img/about/about-3.jpg'})` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-5/12 lg:pl-10">
                            <div className="home__about__text">
                                <div className="section-title !text-left">
                                    <img src="/assets/zogin/img/icon.png" alt="" className="mb-4" />
                                    <h2 className="text-3xl lg:text-4xl font-bold text-[#263246]">{settings.about_title || 'Welcome to KUBA'}</h2>
                                </div>
                                <span className="text-[#5768AD] font-bold italic mb-6 block">{settings.about_subtitle}</span>
                                <p className="text-[#6E7580] leading-loose mb-6">
                                    {settings.about_description_1}
                                </p>
                                <p className="text-[#6E7580] leading-loose mb-10">
                                    {settings.about_description_2}
                                </p>
                                <Link href="#" className="primary-btn">LEARN MORE ABOUT US</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Services Section */}
            <section className="upcoming-classes spad bg-white">
                <div className="container mx-auto px-4">
                    <div className="section-title">
                        <h2 className="text-4xl font-bold text-[#263246]">{settings.featured_title || 'Featured Services'}</h2>
                        <p className="text-[#9B9EA3]">{settings.featured_subtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredServices.length > 0 ? (
                            featuredServices.map((ps) => (
                                <div key={ps.id} className="classes__item rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow group">
                                    <div className="classes__item__pic h-[240px] bg-cover bg-center overflow-hidden relative" style={{ backgroundImage: `url(/assets/zogin/img/classes/classes-${(ps.service?.id?.charCodeAt(0) % 12 || 0) + 1}.jpg)` }}>
                                        <span className="bg-[#5768AD] text-white px-4 py-1 text-sm font-bold absolute top-0 left-0">TOP RATED</span>
                                    </div>
                                    <div className="classes__item__text p-8">
                                        <p className="text-[#9B9EA3] mb-2 uppercase text-xs font-bold tracking-widest">Available Now</p>
                                        <h4 className="text-2xl font-bold mb-6 text-[#263246]">
                                            {ps.service?.name}
                                        </h4>
                                        <h6 className="text-[#263246] font-bold mb-6 flex items-center justify-between">
                                            <span>{ps.provider?.business_name}</span>
                                            <span className="text-[#5768AD] font-bold text-lg">${ps.base_price}/hr</span>
                                        </h6>
                                        <button 
                                            onClick={() => handleBookClick(ps)}
                                            className="class-btn w-full text-center border border-[#5768AD]/20 px-8 py-2 rounded-sm text-[#5768AD] font-bold hover:bg-[#5768AD] hover:text-white transition-all uppercase text-sm"
                                        >
                                            Book Service
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            [1, 2, 3].map((item) => (
                                <div key={item} className="classes__item rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow group">
                                    <div className="classes__item__pic h-[240px] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(/assets/zogin/img/classes/classes-${item}.jpg)` }}>
                                        <span className="bg-[#5768AD] text-white px-4 py-1 text-sm font-bold absolute">TOP RATED</span>
                                    </div>
                                    <div className="classes__item__text p-8">
                                        <p className="text-[#9B9EA3] mb-2 uppercase text-xs font-bold tracking-widest">Available Now</p>
                                        <h4 className="text-2xl font-bold mb-6 text-[#263246]">
                                            {item === 1 ? 'Premium Home Cleaning' : item === 2 ? 'Expert Electrical Repair' : 'Full Garden Maintenance'}
                                        </h4>
                                        <h6 className="text-[#263246] font-bold mb-6 flex items-center justify-between">
                                            <span>KUBA Certified</span>
                                            <span className="text-[#9B9EA3] font-normal text-sm">Professional Team</span>
                                        </h6>
                                        <Link href="#" className="class-btn inline-block border border-[#5768AD]/20 px-8 py-2 rounded-sm text-[#5768AD] font-bold hover:bg-[#5768AD] hover:text-white transition-all uppercase text-sm">Book Service</Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="gallery bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="section-title">
                        <h2 className="text-4xl font-bold text-[#263246]">{settings.gallery_title || 'Our Work Gallery'}</h2>
                        <p className="text-[#9B9EA3]">{settings.gallery_subtitle}</p>
                    </div>
                </div>
                <div className="container-fluid px-0">
                    <div className="flex flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div key={item} className="w-1/2 md:w-1/3 lg:w-1/4 p-0 overflow-hidden group">
                                <div className="gallery__pic relative aspect-square overflow-hidden cursor-pointer">
                                    <img src={`/assets/zogin/img/gallery/gallery-${item}.jpg`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-[#5768AD]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <i className="fa fa-search-plus text-white text-3xl"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Providers Section */}
            <section className="instructor spad bg-[#fdfdfd]">
                <div className="container mx-auto px-4">
                    <div className="section-title">
                        <h2 className="text-4xl font-bold text-[#263246]">{settings.provider_title || 'Meet Top Providers'}</h2>
                        <p className="text-[#9B9EA3]">{settings.provider_subtitle}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="instructor__item group text-center">
                                <div className="instructor__item__pic relative mb-6 overflow-hidden rounded-lg shadow-xl">
                                    <img src={`/assets/zogin/img/instructor/instructor-${item}.jpg`} alt="" className="w-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#5768AD]/20 transition-all pointer-events-none rounded-lg"></div>
                                </div>
                                <div className="instructor__item__text">
                                    <h5 className="text-xl font-bold text-[#263246] mb-1">
                                        {item === 1 ? 'Expert Electrician' : item === 2 ? 'Master Plumber' : item === 3 ? 'Professional Cleaner' : 'Garden Specialist'}
                                    </h5>
                                    <span className="text-[#9B9EA3] uppercase text-xs tracking-widest font-bold">Certified Partner</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section (Categories) */}
            <section className="services spad bg-[#fdfdfd]">
                <div className="container mx-auto px-4">
                    <div className="section-title">
                        <img src="/assets/zogin/img/icon.png" alt="" className="mx-auto mb-4" />
                        <h2 className="text-4xl font-bold text-[#263246]">Explore Our Services</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {categories?.slice(0, 6).map((category, idx) => (
                            <Link key={category.id} href={`/search?category_id=${category.id}`} className="services__item group hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex justify-center">
                                    <img src={`/assets/zogin/img/services/services-${(idx % 6) + 1}.png`} alt="" className="group-hover:scale-110 transition-transform" />
                                </div>
                                <h5 className="text-xl font-bold mt-6 mb-3 text-[#263246]">{category.name}</h5>
                                <p className="text-sm text-[#9B9EA3]">{category.services?.length || 0} Professional Services</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="chooseus spad bg-[#f5f6fa]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-6/12 mb-10 lg:mb-0">
                            <div className="chooseus__text mb-10">
                                <h2 className="text-4xl font-bold text-[#263246] mb-4">Why Choose KUBA</h2>
                                <p className="text-[#6E7580]">We are building the largest network of trusted home service providers, ensuring you have the best help, whenever you need it.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10">
                                <div className="chooseus__item flex items-center gap-6">
                                    <img src="/assets/zogin/img/chooseus/choose-1.png" alt="" />
                                    <div>
                                        <h2 className="text-4xl font-bold text-[#263246]">500+</h2>
                                        <p className="text-[#9B9EA3]">Providers</p>
                                    </div>
                                </div>
                                <div className="chooseus__item flex items-center gap-6">
                                    <img src="/assets/zogin/img/chooseus/choose-2.png" alt="" />
                                    <div>
                                        <h2 className="text-4xl font-bold text-[#263246]">10+</h2>
                                        <p className="text-[#9B9EA3]">Cities Covered</p>
                                    </div>
                                </div>
                                <div className="chooseus__item flex items-center gap-6">
                                    <img src="/assets/zogin/img/chooseus/choose-3.png" alt="" />
                                    <div>
                                        <h2 className="text-4xl font-bold text-[#263246]">24/7</h2>
                                        <p className="text-[#9B9EA3]">Support</p>
                                    </div>
                                </div>
                                <div className="chooseus__item flex items-center gap-6">
                                    <img src="/assets/zogin/img/chooseus/choose-4.png" alt="" />
                                    <div>
                                        <h2 className="text-4xl font-bold text-[#263246]">10k+</h2>
                                        <p className="text-[#9B9EA3]">Happy Customers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12">
                            <div className="chooseus__pic rounded-2xl overflow-hidden shadow-2xl">
                                <img src="/assets/zogin/img/chooseus/choose-pic.jpg" alt="" className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Appointment / Quick Request Section */}
            <section className="appointment py-20">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="appointment__text rounded-2xl shadow-2xl overflow-hidden">
                        <div className="section-title !mb-10 text-center">
                            <img src="/assets/zogin/img/icon-white.png" alt="" className="mx-auto mb-4" />
                            <h2 className="text-4xl font-bold text-white">Need a Quote?</h2>
                        </div>
                        <form className="appointment__form px-8 lg:px-20 pb-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" placeholder="Name" className="bg-white/20 border-none rounded p-4 text-white placeholder-white/70" />
                                <input type="text" placeholder="Email" className="bg-white/20 border-none rounded p-4 text-white placeholder-white/70" />
                                <input type="text" placeholder="Phone" className="bg-white/20 border-none rounded p-4 text-white placeholder-white/70" />
                                <select className="bg-white/20 border-none rounded p-4 text-white/70">
                                    <option value="">Select Service</option>
                                    {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <div className="md:col-span-2">
                                    <textarea placeholder="Tell us about your requirements" className="w-full bg-white/20 border-none rounded p-4 text-white placeholder-white/70 h-32"></textarea>
                                </div>
                                <div className="md:col-span-2 text-center mt-6">
                                    <button type="submit" className="primary-btn !bg-white !text-[#5768AD] hover:!bg-opacity-90 transition-all font-bold px-12 py-4 rounded-sm">GET FREE QUOTE</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonial spad bg-[#f5f6fa] !pt-40">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="testimonial__item">
                            <div className="testimonial__text">
                                <p className="text-2xl lg:text-3xl italic text-[#263246] mb-10 leading-relaxed">
                                    "I found an amazing electrician through KUBA within minutes. The service was professional, and the price was transparent. Highly recommended for anyone looking for reliable help!"
                                </p>
                                <div className="flex flex-col items-center">
                                    <img src="/assets/zogin/img/testimonial/testimonial-1.png" alt="" className="w-20 h-20 rounded-full border-4 border-[#5768AD] mb-4" />
                                    <h5 className="text-xl font-bold text-[#263246]">Sarah Jenkins</h5>
                                    <span className="text-[#9B9EA3]">Homeowner</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Booking Modal */}
            <Modal show={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} maxWidth="md">
                <div className="p-0 overflow-hidden rounded-lg">
                    <div className="bg-[#5768AD] p-6 text-white text-center">
                        <h3 className="text-2xl font-bold uppercase tracking-widest">Book Service</h3>
                        <p className="text-white/70 text-sm mt-2">{selectedPS?.provider?.business_name} - {selectedPS?.service?.name}</p>
                    </div>
                    <div className="p-8 bg-[#263246]">
                        {selectedPS && (
                            <BookingForm 
                                provider={selectedPS.provider}
                                services={[selectedPS]}
                                initialServiceId={selectedPS.service_id}
                                onSuccess={() => setIsBookingModalOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </PublicLayout>
    );
}
