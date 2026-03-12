import { Link, usePage } from '@inertiajs/react';

export default function PublicLayout({ children, auth }) {
    const { settings = {} } = usePage().props;
    return (
        <div className="zogin-template min-h-screen bg-white">
            {/* Header Section */}
            <header className="header border-b border-gray-100 sticky top-0 z-[1000] bg-white shadow-sm">
                <div className="header__top py-4 border-b border-gray-50 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                                <div className="header__logo">
                                    <Link href="/">
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-lg bg-[#5768AD] shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-bold">{settings.site_name?.[0] || 'K'}</div>
                                            <span className="text-2xl font-bold tracking-tight text-[#263246]">{settings.site_name || 'KUBA'}</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full lg:w-3/4">
                                <div className="header__top__widget flex flex-wrap items-center justify-end gap-6">
                                    <ul className="hidden md:flex items-center gap-6 text-[12px] text-[#263246] uppercase tracking-wider">
                                        <li>CALL US: {settings.contact_phone}</li>
                                        <li>WRITE US: {settings.contact_email}</li>
                                        <li>OPENING TIMES: {settings.opening_hours_short}</li>
                                    </ul>
                                    {auth?.user ? (
                                        <Link href={route('dashboard')} className="primary-btn">DASHBOARD</Link>
                                    ) : (
                                        <Link href={route('login')} className="primary-btn">JOIN US</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header__nav bg-[#5768AD] py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between">
                            <nav className="header__menu">
                                <ul className="flex items-center gap-10">
                                    <li className={route().current('welcome') ? 'active' : ''}><Link href="/" className="text-white font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity">Home</Link></li>
                                    <li className={route().current('about') ? 'active' : ''}><Link href={route('about')} className="text-white font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity">About</Link></li>
                                    <li className={route().current('services') ? 'active' : ''}><Link href={route('services')} className="text-white font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity">Services</Link></li>
                                    <li className={route().current('marketplace.search') ? 'active' : ''}><Link href={route('marketplace.search')} className="text-white font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity">Marketplace</Link></li>
                                    <li className={route().current('blog.index') ? 'active' : ''}><Link href={route('blog.index')} className="text-white font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity">Blog</Link></li>
                                    <li className={route().current('contact') ? 'active' : ''}><Link href={route('contact')} className="text-white font-bold uppercase tracking-widest text-sm hover:opacity-80 transition-opacity">Contact</Link></li>
                                </ul>
                            </nav>
                            <div className="header__social flex items-center gap-4 text-white">
                                <a href={settings.social_facebook}><i className="fa fa-facebook"></i></a>
                                <a href={settings.social_twitter}><i className="fa fa-twitter"></i></a>
                                <a href={settings.social_instagram}><i className="fa fa-instagram"></i></a>
                                <a href={settings.social_linkedin}><i className="fa fa-linkedin"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main>
                {children}
            </main>

            {/* Footer Section */}
            <footer className="footer bg-[#263246] text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div className="footer__about">
                            <Link href="/">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="h-8 w-8 rounded bg-[#5768AD] flex items-center justify-center text-white font-bold">K</div>
                                    <span className="text-2xl font-bold tracking-tight text-white">KUBA</span>
                                </div>
                            </Link>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-[#9B9EA3]"><span className="text-[#5768AD]">●</span> {settings.opening_hours_weekday}</li>
                                <li className="flex items-center gap-3 text-[#9B9EA3]"><span className="text-[#5768AD]">●</span> {settings.opening_hours_weekend}</li>
                            </ul>
                        </div>
                        <div className="footer__widget">
                            <h5 className="text-xl font-bold mb-6">Inspiration</h5>
                            <ul className="space-y-3 text-[#9B9EA3]">
                                <li><Link href="#" className="hover:text-white transition">Home Cleaning</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Electrical Work</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Plumbing Services</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Pest Control</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Landscaping</Link></li>
                            </ul>
                        </div>
                        <div className="footer__widget">
                            <h5 className="text-xl font-bold mb-6">Quick Links</h5>
                            <ul className="space-y-3 text-[#9B9EA3]">
                                <li><Link href="#" className="hover:text-white transition">Our Vision</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Our Mission</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Meet The Team</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Become a Provider</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Customer Support</Link></li>
                            </ul>
                        </div>
                        <div className="footer__widget">
                            <h5 className="text-xl font-bold mb-6">Contact Us</h5>
                            <ul className="space-y-4 text-[#9B9EA3]">
                                <li className="flex items-center gap-3"> {settings.contact_phone}</li>
                                <li className="flex items-center gap-3"> {settings.contact_email}</li>
                                <li className="flex items-center gap-3"> {settings.contact_address}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer__copyright border-t border-white/10 pt-8 flex flex-wrap justify-between items-center gap-6">
                        <p className="text-[#9B9EA3] text-sm">Copyright &copy; {new Date().getFullYear()} {settings.site_name} Platform. All rights reserved.</p>
                        <div className="footer__copyright__social flex gap-6 text-white/70">
                            <a href={settings.social_facebook} className="hover:text-white transition"><i className="fa fa-facebook"></i></a>
                            <a href={settings.social_twitter} className="hover:text-white transition"><i className="fa fa-twitter"></i></a>
                            <a href={settings.social_instagram} className="hover:text-white transition"><i className="fa fa-instagram"></i></a>
                            <a href={settings.social_linkedin} className="hover:text-white transition"><i className="fa fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
