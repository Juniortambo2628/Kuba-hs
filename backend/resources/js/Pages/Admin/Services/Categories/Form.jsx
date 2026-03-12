import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, ArrowLeft, FolderPlus, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CategoryForm({ auth, category = null, parentCategories = [] }) {
    const isEditing = !!category;
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        parent_category_id: category?.parent_category_id || '',
        description: category?.description || '',
        icon_url: category?.icon_url || '',
        sort_order: category?.sort_order || 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.categories.update', category.id));
        } else {
            post(route('admin.categories.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-6">
                    <Link
                        href={route('admin.categories.index')}
                        className="h-12 w-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all font-bold"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {isEditing ? 'Edit Category' : 'New Category'}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium italic">Define how services are categorized on your platform.</p>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? 'Edit Category' : 'New Category'} />

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 pb-20">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g. Home Cleaning, Repairs, etc."
                            />
                            {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-4">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Parent Category</label>
                            <select
                                value={data.parent_category_id}
                                onChange={e => setData('parent_category_id', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">None (Master Category)</option>
                                {parentCategories.map(parent => (
                                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Sort Order</label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={e => setData('sort_order', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                            <textarea
                                rows="3"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500"
                                placeholder="Describe the types of services in this category..."
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Icon URL (SVG or PNG)</label>
                            <input
                                type="text"
                                value={data.icon_url}
                                onChange={e => setData('icon_url', e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://example.com/icon.svg"
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
                            {isEditing ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </div>

                <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 flex items-start gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-sm font-bold">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-2 italic">Hierarchy Note</h4>
                        <p className="text-xs text-indigo-700/70 font-bold leading-relaxed">
                            Master categories appear prominently in the marketplace. Services should ideally be linked to child categories for better organization and searchability.
                        </p>
                    </div>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
