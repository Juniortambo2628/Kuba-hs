import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/Components/ui/card';
import InputError from '@/Components/InputError';
import { Check } from 'lucide-react';

export default function Register({ auth }) {
    const queryParams = new URLSearchParams(window.location.search);
    const googleData = {
        first_name: queryParams.get('first_name') || '',
        last_name: queryParams.get('last_name') || '',
        email: queryParams.get('email') || '',
        google_id: queryParams.get('google_id') || '',
    };

    const isGoogleSignup = !!googleData.google_id;

    const { data, setData, post, processing, errors, reset, clearErrors, setError } = useForm({
        first_name: googleData.first_name,
        last_name: googleData.last_name,
        email: googleData.email,
        password: '',
        password_confirmation: '',
        role: 'customer',
        google_id: googleData.google_id,
    });

    const [localErrors, setLocalErrors] = useState({});

    const validateField = (name, value) => {
        let error = '';
        if (name === 'first_name' || name === 'last_name') {
            if (!value.trim()) error = `${name === 'first_name' ? 'First' : 'Last'} name is required`;
        } else if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) error = 'Email is required';
            else if (!emailRegex.test(value)) error = 'Invalid email format';
        } else if (name === 'password') {
            if (!value) error = 'Password is required';
            else if (value.length < 8) error = 'Password must be at least 8 characters';
        } else if (name === 'password_confirmation') {
            if (value !== data.password) error = 'Passwords do not match';
        }

        setLocalErrors(prev => ({ ...prev, [name]: error }));
        if (error) {
            setError(name, error);
        } else {
            clearErrors(name);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
        validateField(name, value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <PublicLayout auth={auth}>
            <Head title="Sign Up | KUBA" />

            <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
                <Card className="w-full max-w-xl border-none shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex justify-center mb-4">
                            <img src="/assets/zogin/img/icon.png" alt="KUBA" className="h-12 w-auto" />
                        </div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                        <CardDescription>
                            Join our community of professionals and customers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        placeholder="John"
                                        value={data.first_name}
                                        onChange={handleChange}
                                        className="h-11 bg-slate-50/50"
                                        required
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        placeholder="Doe"
                                        value={data.last_name}
                                        onChange={handleChange}
                                        className="h-11 bg-slate-50/50"
                                        required
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Account Type</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        variant={data.role === 'customer' ? 'default' : 'outline'}
                                        onClick={() => setData('role', 'customer')}
                                        className="h-14 font-bold text-sm uppercase tracking-wider gap-2 shadow-sm"
                                    >
                                        {data.role === 'customer' && <Check className="h-4 w-4" />}
                                        Customer
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={data.role === 'provider' ? 'default' : 'outline'}
                                        onClick={() => setData('role', 'provider')}
                                        className="h-14 font-bold text-sm uppercase tracking-wider gap-2 shadow-sm"
                                    >
                                        {data.role === 'provider' && <Check className="h-4 w-4" />}
                                        Provider
                                    </Button>
                                </div>
                                <InputError message={errors.role} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={data.email}
                                    onChange={handleChange}
                                    className="h-11 bg-slate-50/50"
                                    disabled={isGoogleSignup}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            {!isGoogleSignup && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" title="Password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={handleChange}
                                            className="h-11 bg-slate-50/50"
                                            required
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" title="Confirm Password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={handleChange}
                                            className="h-11 bg-slate-50/50"
                                            required
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 space-y-4">
                                <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest shadow-lg shadow-primary/20" disabled={processing}>
                                    {processing ? 'Creating account...' : 'Create Account'}
                                </Button>

                                <div className="relative py-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-200" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground font-semibold">Or continue with</span>
                                    </div>
                                </div>

                                <Button variant="outline" asChild className="w-full h-11 font-semibold text-slate-700 border-slate-200 hover:bg-slate-50 transition-all">
                                    <a href="/auth/google">
                                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335" />
                                        </svg>
                                        Google
                                    </a>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-slate-50 pt-6">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link 
                                href={route('login')} 
                                className="font-bold text-primary hover:underline hover:opacity-80 transition"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </PublicLayout>
    );
}
