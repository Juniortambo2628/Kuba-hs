import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, Settings, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ServiceForm({ auth, service = null, categories = [] }) {
    const isEditing = !!service;
    const { data, setData, post, put, processing, errors } = useForm({
        name: service?.name || '',
        category_id: service?.category_id || '',
        description: service?.description || '',
        base_price: service?.base_price || '',
        icon_url: service?.icon_url || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.services.update', service.id));
        } else {
            post(route('admin.services.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-6">
                    <Link
                        href={route('admin.services.index')}
                        className="h-12 w-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all font-bold"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {isEditing ? 'Edit Service' : 'New Service'}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium italic">Define a specific service type for providers to offer.</p>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Service' : 'New Service'} />

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-20 italic">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Service Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. Electric Fan Repair, Basic Car Wash, etc."
                            />
                            {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-4">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category Assignment</label>
                            <select
                                value={data.category_id}
                                onChange={e => setData('category_id', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-4">{errors.category_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Base Market Price ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.base_price}
                                onChange={e => setData('base_price', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Service Description</label>
                            <textarea
                                rows="3"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Describe what this specific service entails..."
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Icon Identifier / URL</label>
                            <input
                                type="text"
                                value={data.icon_url}
                                onChange={e => setData('icon_url', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. tool-icon"
                            />
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3"
                        >
                            <Save size={18} />
                            {isEditing ? 'Update Service' : 'Create Service'}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-[2.5rem] flex items-start gap-6 shadow-2xl shadow-slate-200">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg font-bold">
                        <Settings size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Marketplace Visibility</h4>
                        <p className="text-xs text-slate-400 font-bold leading-relaxed">
                            Once created, this service will be available for providers to add to their profile. Ensure the name and description are clear for both providers and customers.
                        </p>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
