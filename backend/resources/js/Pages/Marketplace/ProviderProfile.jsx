import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import BookingForm from '@/Components/BookingForm';
import { toast } from 'sonner';

export default function ProviderProfile({ auth, provider }) {
    // Destructure data from Resource
    const providerData = provider.data || provider;
    const services = providerData.services || [];
    const reviews = providerData.reviews || [];

    const [activeTab, setActiveTab] = useState('services');
    const [selectedServiceId, setSelectedServiceId] = useState('');

    const handleSuccess = () => {
        toast.success('Booking request sent successfully!');
    };

    // Helper to get a stable number from a UUID string
    const getPlaceholderIndex = (id) => {
        if (!id) return 1;
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            sum += id.charCodeAt(i);
        }
        return (sum % 12) + 1;
    };

    return (
        <PublicLayout auth={auth}>
            <Head title={`${providerData.business_name} | KUBA`} />

            {/* Breadcrumb / Page Title Section */}
            <section className="breadcrumb-section bg-cover bg-center py-20 relative" style={{ backgroundImage: `url(/assets/zogin/img/breadcrumb.jpg)` }}>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 uppercase tracking-widest">{providerData.business_name}</h2>
                        <div className="breadcrumb__text text-white/80 uppercase text-sm font-bold tracking-widest">
                            <Link href="/" className="hover:text-white transition">Home</Link>
                            <span className="mx-3 text-[#5768AD]">|</span>
                            <Link href="/search" className="hover:text-white transition">Marketplace</Link>
                            <span className="mx-3 text-[#5768AD]">|</span>
                            <span>Provider Profile</span>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-[#263246]/60"></div>
            </section>

            <main className="spad bg-[#fdfdfd]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap -mx-4">
                        {/* Profile Info & Tabs */}
                        <div className="w-full lg:w-2/3 px-4 mb-12 lg:mb-0">
                            <div className="classes__item__text !p-0 !bg-transparent !shadow-none !border-none">
                                <div className="flex items-center gap-6 mb-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                    <div className="h-24 w-24 rounded-full bg-[#5768AD]/10 flex items-center justify-center text-[#5768AD] text-3xl font-bold border-4 border-white shadow-lg">
                                        {providerData.business_name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-3xl font-bold text-[#263246]">{providerData.business_name}</h3>
                                            {providerData.is_verified && (
                                                <span className="bg-[#5768AD] text-white px-3 py-1 text-[10px] font-bold rounded-sm tracking-widest uppercase">VERIFIED</span>
                                            )}
                                        </div>
                                        <p className="text-[#9B9EA3] font-bold uppercase tracking-widest text-xs flex items-center gap-4">
                                            <span><i className="fa fa-map-marker text-[#5768AD] mr-1"></i> {providerData.location_name}</span>
                                            <span><i className="fa fa-clock-o text-[#5768AD] mr-1"></i> {providerData.experience_years} Years Experience</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Tabs Navigation */}
                                <div className="flex border-b border-gray-100 mb-8">
                                    <button
                                        onClick={() => setActiveTab('services')}
                                        className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'services' ? 'text-[#5768AD] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#5768AD]' : 'text-[#6E7580] hover:text-[#5768AD]'}`}
                                    >
                                        Our Services
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === 'reviews' ? 'text-[#5768AD] after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-[#5768AD]' : 'text-[#6E7580] hover:text-[#5768AD]'}`}
                                    >
                                        Reviews ({reviews?.length || 0})
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <AnimatePresence mode="wait">
                                    {activeTab === 'services' ? (
                                        <motion.div
                                            key="services"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
                                                <h4 className="text-xl font-bold text-[#263246] mb-4">About the Provider</h4>
                                                <p className="text-[#6E7580] leading-loose">{providerData.bio}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {services.map((service) => (
                                                    <div key={service.id} className="classes__item !p-0 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white hover:shadow-md transition-all group">
                                                        <div className="classes__item__pic !h-[180px] bg-cover bg-center" style={{ backgroundImage: `url(/assets/zogin/img/classes/classes-${getPlaceholderIndex(service.id)}.jpg)` }}></div>
                                                        <div className="p-6">
                                                            <h5 className="text-lg font-bold text-[#263246] mb-2">{service.name}</h5>
                                                            <p className="text-sm text-[#9B9EA3] mb-4 line-clamp-2">{service.description}</p>
                                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                                <span className="text-[#5768AD] font-bold">${service.base_price}/hr</span>
                                                                <button 
                                                                    onClick={() => {
                                                                        setSelectedServiceId(service.id);
                                                                        document.querySelector('#booking-form')?.scrollIntoView({ behavior: 'smooth' });
                                                                    }}
                                                                    className="text-xs font-bold text-[#263246] uppercase tracking-widest hover:text-[#5768AD] transition"
                                                                >
                                                                    Select <i className="fa fa-plus-circle ml-1"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="reviews"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-6"
                                        >
                                            {reviews?.length > 0 ? (
                                                reviews.map((review) => (
                                                    <div key={review.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-[#263246] font-bold">
                                                                    {review.user?.name?.substring(0, 1).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <h5 className="font-bold text-[#263246]">{review.user?.name}</h5>
                                                                    <p className="text-xs text-[#9B9EA3]">{new Date(review.created_at).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-yellow-400">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <i key={i} className={`fa ${i < review.rating ? 'fa-star' : 'fa-star-o'}`}></i>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-[#6E7580] italic">"{review.comment}"</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
                                                    <i className="fa fa-comments-o text-gray-200 text-5xl mb-4"></i>
                                                    <h4 className="text-[#263246] font-bold">No reviews yet</h4>
                                                    <p className="text-[#9B9EA3]">Be the first to share your experience with {providerData.business_name}!</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Booking Sidebar */}
                        <div className="w-full lg:w-1/3 px-4">
                            <div id="booking-form" className="sidebar__widget appointment__text !p-8 !rounded-xl shadow-2xl">
                                <h4 className="text-xl font-bold text-white mb-8 uppercase tracking-widest relative pb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-white/30">Book Appointment</h4>
                                <BookingForm 
                                    provider={providerData} 
                                    services={services} 
                                    initialServiceId={selectedServiceId}
                                    onSuccess={handleSuccess}
                                />
                            </div>

                            <div className="sidebar__widget mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                                <h4 className="text-xl font-bold text-[#263246] mb-6 relative pb-4 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-1 after:bg-[#5768AD]">Zogin Guarantee</h4>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <i className="fa fa-shield text-[#5768AD] text-xl mt-1"></i>
                                        <div>
                                            <h6 className="font-bold text-[#263246] text-sm">Vetted Experts</h6>
                                            <p className="text-xs text-[#9B9EA3]">Every provider is background checked.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <i className="fa fa-money text-[#5768AD] text-xl mt-1"></i>
                                        <div>
                                            <h6 className="font-bold text-[#263246] text-sm">Best Value</h6>
                                            <p className="text-xs text-[#9B9EA3]">Transparent pricing with no hidden fees.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
