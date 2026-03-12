import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function VerifyEmail({ auth, status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    const verificationEmailSent = status === 'verification-link-sent';

    return (
        <PublicLayout auth={auth}>
            <Head title="Email Verification | KUBA" />

            {/* Breadcrumb Section */}
            <section className="breadcrumb-section bg-cover bg-center py-20 relative" style={{ backgroundImage: `url(/assets/zogin/img/breadcrumb.jpg)` }}>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 uppercase tracking-widest">Verify Email</h2>
                        <div className="breadcrumb__text text-white/80 uppercase text-sm font-bold tracking-widest">
                            <Link href="/" className="hover:text-white transition">Home</Link>
                            <span className="mx-3 text-[#5768AD]">|</span>
                            <span>Email Verification</span>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-[#263246]/60"></div>
            </section>

            <main className="spad bg-[#fdfdfd]">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto bg-white p-8 lg:p-12 rounded-2xl shadow-2xl border border-gray-100">
                        <div className="section-title !mb-10 text-center">
                            <img src="/assets/zogin/img/icon.png" alt="" className="mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-[#263246]">One Last Step</h2>
                            <p className="text-[#9B9EA3] mt-4 leading-relaxed">
                                Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                            </p>
                        </div>

                        {verificationEmailSent && (
                            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm font-medium">
                                A new verification link has been sent to the email address you provided during registration.
                            </div>
                        )}

                        <form onSubmit={submit} className="appointment__form !p-0">
                            <div className="flex flex-col gap-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full primary-btn !bg-[#5768AD] text-white hover:!bg-[#4a5894] transition-all font-bold py-5 rounded-sm shadow-xl uppercase tracking-[2px]"
                                >
                                    {processing ? 'Resending...' : 'Resend Verification Email'}
                                </button>

                                <div className="text-center">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="text-[#9B9EA3] text-sm font-bold uppercase tracking-widest hover:text-[#263246] transition underline"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
