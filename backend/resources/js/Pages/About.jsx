import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function About({ auth }) {
    const { settings = {} } = usePage().props;

    return (
        <PublicLayout auth={auth}>
            <Head title="About Us | KUBA" />

            {/* Breadcrumb Section */}
            <section 
                className="breadcrumb-section bg-cover bg-center py-20 relative"
                style={{ backgroundImage: `url(${settings.hero_bg || '/assets/zogin/img/breadcrumb.jpg'})` }}
            >
                <div className="absolute inset-0 bg-[#263246]/60"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4 uppercase tracking-widest">About Our Platform</h2>
                    <div className="flex items-center justify-center gap-2 text-white/80 font-bold uppercase text-xs tracking-[2px]">
                        <Link href="/" className="hover:text-[#5768AD] transition">Home</Link>
                        <span>/</span>
                        <span className="text-[#5768AD]">About Us</span>
                    </div>
                </div>
            </section>

            {/* Main About Section */}
            <section className="about-page spad bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-center">
                        <div className="w-full lg:w-6/12 mb-12 lg:mb-0">
                            <div className="about__pic flex flex-wrap gap-5">
                                <div className="w-full sm:w-[calc(60%-10px)] min-h-[450px] rounded-2xl shadow-2xl relative overflow-hidden group">
                                    <img 
                                        src={settings.about_image_1 || '/assets/zogin/img/about/about-1.jpg'} 
                                        alt="About Kuba" 
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="w-full sm:w-[calc(40%-10px)] flex flex-col gap-5">
                                    <div className="w-full h-[215px] rounded-2xl shadow-xl relative overflow-hidden group">
                                        <img 
                                            src={settings.about_image_2 || '/assets/zogin/img/about/about-2.jpg'} 
                                            alt="Kuba Service" 
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="w-full h-[215px] rounded-2xl shadow-xl relative overflow-hidden group">
                                        <img 
                                            src={settings.about_image_3 || '/assets/zogin/img/about/about-3.jpg'} 
                                            alt="Kuba Team" 
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-6/12 lg:pl-16">
                            <div className="about__text">
                                <span className="text-[#5768AD] font-black uppercase tracking-[4px] text-xs mb-4 block">Our Story</span>
                                <h2 className="text-4xl lg:text-5xl font-bold text-[#263246] mb-8 leading-tight">
                                    {settings.about_title || 'Redefining Home Services Excellence'}
                                </h2>
                                <p className="text-[#6E7580] text-lg italic mb-8 border-l-4 border-[#5768AD] pl-6 py-2">
                                    {settings.about_subtitle}
                                </p>
                                <div className="space-y-6 text-[#6E7580] leading-relaxed mb-10">
                                    <p>{settings.about_description_1}</p>
                                    <p>{settings.about_description_2}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                                    <div>
                                        <h4 className="text-4xl font-black text-[#263246] mb-1">5k+</h4>
                                        <p className="text-xs font-bold text-[#9B9EA3] uppercase tracking-widest">Active Providers</p>
                                    </div>
                                    <div>
                                        <h4 className="text-4xl font-black text-[#5768AD] mb-1">98%</h4>
                                        <p className="text-xs font-bold text-[#9B9EA3] uppercase tracking-widest">Satisfaction Rate</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section py-24 bg-[#fdfdfd]">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-[#5768AD] font-black uppercase tracking-[4px] text-xs mb-4 block">Our Values</span>
                        <h2 className="text-4xl font-bold text-[#263246]">The Principles That Drive Us</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { title: 'Quality First', desc: 'We vet every provider to ensure only the highest standards of service for your home.', icon: '🏆' },
                            { title: 'Full Transparency', desc: 'Upfront pricing and clear communication between providers and customers.', icon: '💎' },
                            { title: 'Safety Guaranteed', desc: 'Your security is paramount. Every transaction and provider is monitored for safety.', icon: '🛡️' }
                        ].map((value, i) => (
                            <div key={i} className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-100 border border-gray-50 text-center hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-5xl mb-6">{value.icon}</div>
                                <h3 className="text-xl font-bold text-[#263246] mb-4">{value.title}</h3>
                                <p className="text-[#9B9EA3] text-sm leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
