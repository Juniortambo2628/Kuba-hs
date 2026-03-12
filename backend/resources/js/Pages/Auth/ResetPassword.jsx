import { Head, Link, useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function ResetPassword({ auth, token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Reset Password | KUBA" />

            {/* Breadcrumb Section */}
            <section className="breadcrumb-section bg-cover bg-center py-20 relative" style={{ backgroundImage: `url(/assets/zogin/img/breadcrumb.jpg)` }}>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 uppercase tracking-widest">Update Password</h2>
                        <div className="breadcrumb__text text-white/80 uppercase text-sm font-bold tracking-widest">
                            <Link href="/" className="hover:text-white transition">Home</Link>
                            <span className="mx-3 text-[#5768AD]">|</span>
                            <span>Reset Password</span>
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
                            <h2 className="text-3xl font-bold text-[#263246]">Set New Password</h2>
                            <p className="text-[#9B9EA3] mt-2">Create a secure password for your account.</p>
                        </div>

                        <form onSubmit={submit} className="appointment__form !p-0">
                            <div className="space-y-6">
                                <div>
                                    <InputLabel value="Email Address" className="!text-[#263246] !text-xs !font-bold !uppercase !tracking-widest mb-3" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="New Password" className="!text-[#263246] !text-xs !font-bold !uppercase !tracking-widest mb-3" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full"
                                        autoComplete="new-password"
                                        isFocused={true}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="Confirm Password" className="!text-[#263246] !text-xs !font-bold !uppercase !tracking-widest mb-3" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full primary-btn !bg-[#5768AD] text-white hover:!bg-[#4a5894] transition-all font-bold py-5 rounded-sm shadow-xl uppercase tracking-[2px]"
                                    >
                                        {processing ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </PublicLayout>
    );
}
