import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.login'));
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-700">
            <Head title="Admin Login" />

            <div className="w-full sm:max-w-md mt-6 px-10 py-12 bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100 overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-indigo-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 bg-slate-100 rounded-full blur-3xl opacity-60" />

                <div className="relative z-10">
                    <div className="flex flex-col items-center mb-10">
                        <div className="h-16 w-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Portal</h1>
                        <p className="text-slate-500 mt-2 font-medium">Please sign in to manage KUBA</p>
                    </div>

                    {status && (
                        <div className="mb-6 font-bold text-sm text-emerald-600 bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400"
                                    placeholder="admin@kuba.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500/20 rounded-2xl text-slate-900 text-sm font-medium transition-all placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-xs font-bold text-red-500 ml-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center group cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-10 h-5 bg-slate-200 rounded-full shadow-inner transition-colors ${data.remember ? 'bg-indigo-600' : ''}`} />
                                    <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full shadow transition-transform ${data.remember ? 'translate-x-5' : ''}`} />
                                </div>
                                <span className="ml-3 text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-500/20 transform active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                        >
                            {processing ? 'Authenticating...' : 'Sign In Now'}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <Link href="/" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                            <span>←</span> Back to Public Site
                        </Link>
                    </div>
                </div>
            </div>
            
            <footer className="mt-8 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} KUBA Management
            </footer>
        </div>
    );
}
