import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Save, X, User, Mail, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminHeader from '@/Components/Admin/AdminHeader';

export default function UserForm({ auth, user = null }) {
    const isEditing = !!user;
    
    const { data, setData, post, put, processing, errors, recentlySuccessful } = useForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.role || 'customer',
        is_active: user ? !!user.is_active : true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.users.update', user.id));
        } else {
            post(route('admin.users.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <AdminHeader 
                    title={isEditing ? 'Edit User' : 'Create New User'} 
                    subtitle={isEditing ? `Modifying profile for ${user.name}` : 'Onboard a new participant to the platform.'}
                >
                    <Link
                        href={route('admin.users.index')}
                        className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
                    >
                        <X size={16} />
                        Cancel
                    </Link>
                </AdminHeader>
            }
        >
            <Head title={isEditing ? 'Edit User' : 'Create User'} />

            <div className="max-w-4xl selection:bg-indigo-100 selection:text-indigo-700">
                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-xl shadow-slate-200/40 space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                Basic Information
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">First Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            className="w-full bg-slate-50 border-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium transition-all"
                                            placeholder="e.g. John"
                                        />
                                    </div>
                                    {errors.first_name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.first_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Last Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            className="w-full bg-slate-50 border-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium transition-all"
                                            placeholder="e.g. Doe"
                                        />
                                    </div>
                                    {errors.last_name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.last_name}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-slate-50 border-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium transition-all"
                                        placeholder="john.doe@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Security & Roles Section */}
                        <div className="space-y-6 pt-8 border-t border-slate-50">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                Security & Roles
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Account Role</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="w-full bg-slate-50 border-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold uppercase tracking-widest transition-all appearance-none"
                                        >
                                            <option value="customer">Customer</option>
                                            <option value="provider">Provider</option>
                                            <option value="admin">Administrator</option>
                                        </select>
                                    </div>
                                    {errors.role && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.role}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Account Status</label>
                                    <div className="flex items-center gap-4 h-[56px] px-6 bg-slate-50 rounded-2xl">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={e => setData('is_active', e.target.checked)}
                                            className="h-5 w-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500"
                                            id="is_active"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-bold text-slate-600 cursor-pointer">
                                            {data.is_active ? 'Active Account' : 'Suspended Account'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">
                                        {isEditing ? 'Change Password (Optional)' : 'Default Password'}
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full bg-slate-50 border-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.password}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            className="w-full bg-slate-50 border-none focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-4">
                        <div className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                            recentlySuccessful ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                        )}>
                            {recentlySuccessful ? (
                                <><CheckCircle2 size={12} /> User saved successfully</>
                            ) : (
                                "Draft changes"
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-500/20 active:scale-95 transform transition-all duration-300 flex items-center gap-3 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {processing ? 'Saving...' : isEditing ? 'Update Profile' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
