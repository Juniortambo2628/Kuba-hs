import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact({ auth }) {
    const { settings = {} } = usePage().props;
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.submit'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Contact Us | KUBA" />

            {/* Breadcrumb Section */}
            <section className="breadcrumb-section bg-[#263246] py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-widest text-center">Get in Touch</h2>
                    <div className="flex items-center justify-center gap-2 text-white/60 font-bold uppercase text-xs tracking-widest text-center">
                        <span>HOME</span>
                        <span>/</span>
                        <span className="text-[#5768AD]">CONTACT US</span>
                    </div>
                </div>
            </section>

            {/* Contact Information & Form Area */}
            <section className="contact-area spad py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap -mx-4">
                        {/* Info Column */}
                        <div className="w-full lg:w-4/12 px-4 mb-16 lg:mb-0">
                            <div className="contact__info space-y-12">
                                <div>
                                    <span className="text-[#5768AD] font-black uppercase tracking-[4px] text-xs mb-6 block">Direct Contact</span>
                                    <h3 className="text-3xl font-bold text-[#263246] mb-8">Reach out anytime</h3>
                                    <div className="space-y-8">
                                        <div className="flex items-start gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-[#f5f6fa] flex items-center justify-center text-[#5768AD] text-xl shrink-0 border border-gray-50">
                                                <i className="fa fa-phone"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                                                <h5 className="text-lg font-bold text-[#263246]">{settings.contact_phone}</h5>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-[#f5f6fa] flex items-center justify-center text-[#5768AD] text-xl shrink-0 border border-gray-50">
                                                <i className="fa fa-envelope"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                                                <h5 className="text-lg font-bold text-[#263246]">{settings.contact_email}</h5>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-[#f5f6fa] flex items-center justify-center text-[#5768AD] text-xl shrink-0 border border-gray-50">
                                                <i className="fa fa-map-marker"></i>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Office Location</p>
                                                <h5 className="text-lg font-bold text-[#263246]">{settings.contact_address}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-12 border-t border-gray-100">
                                    <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 italic">Connect Socially</h5>
                                    <div className="flex items-center gap-4">
                                        {[
                                            { icon: 'fa-facebook', link: settings.social_facebook },
                                            { icon: 'fa-twitter', link: settings.social_twitter },
                                            { icon: 'fa-instagram', link: settings.social_instagram },
                                            { icon: 'fa-linkedin', link: settings.social_linkedin }
                                        ].map((soc, i) => (
                                            <a 
                                                key={i} 
                                                href={soc.link} 
                                                className="h-12 w-12 rounded-xl bg-[#263246] text-white flex items-center justify-center hover:bg-[#5768AD] transition-colors shadow-lg shadow-slate-200"
                                            >
                                                <i className={`fa ${soc.icon}`}></i>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Column */}
                        <div className="w-full lg:w-8/12 px-4 italic">
                            <div className="contact__form bg-[#fdfdfd] p-10 lg:p-16 rounded-[3rem] border border-gray-100 shadow-2xl shadow-slate-200/50">
                                <div className="mb-10">
                                    <h3 className="text-3xl font-bold text-[#263246] mb-4">Send a Message</h3>
                                    <p className="text-[#9B9EA3] font-medium">Use the form below to send us a message and our team will get back to you within 24 hours.</p>
                                </div>

                                <form onSubmit={submit} className="space-y-8">
                                    <AnimatePresence>
                                        {recentlySuccessful && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl border border-emerald-100 text-sm font-bold flex items-center gap-3"
                                            >
                                                <span className="text-xl">✓</span>
                                                Your message has been sent successfully!
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] block px-1">Your Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full bg-white border-2 border-slate-50 focus:border-[#5768AD] focus:ring-0 rounded-2xl px-6 py-4 text-sm font-bold transition-all"
                                                placeholder="e.g. John Doe"
                                            />
                                            {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] block px-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full bg-white border-2 border-slate-50 focus:border-[#5768AD] focus:ring-0 rounded-2xl px-6 py-4 text-sm font-bold transition-all"
                                                placeholder="e.g. john@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] block px-1">Phone (Optional)</label>
                                            <input
                                                type="text"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="w-full bg-white border-2 border-slate-50 focus:border-[#5768AD] focus:ring-0 rounded-2xl px-6 py-4 text-sm font-bold transition-all"
                                                placeholder="e.g. +1 234 567 890"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] block px-1">Subject</label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={e => setData('subject', e.target.value)}
                                                className="w-full bg-white border-2 border-slate-50 focus:border-[#5768AD] focus:ring-0 rounded-2xl px-6 py-4 text-sm font-bold transition-all"
                                                placeholder="What is this regarding?"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] block px-1">Message</label>
                                        <textarea
                                            rows="5"
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            className="w-full bg-white border-2 border-slate-50 focus:border-[#5768AD] focus:ring-0 rounded-3xl px-6 py-4 text-sm font-bold transition-all resize-none"
                                            placeholder="Write your message here..."
                                        />
                                        {errors.message && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1">{errors.message}</p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-[#263246] text-white px-12 py-5 rounded-sm font-black text-xs uppercase tracking-[2px] shadow-xl hover:bg-[#5768AD] transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'SENDING MESSAGE...' : 'SEND MESSAGE NOW'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
