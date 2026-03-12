import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Folder, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminHeader from '@/Components/Admin/AdminHeader';
import LucideIcon from '@/Components/LucideIcon';

export default function CategoryIndex({ auth, categories }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this category? This will affect all sub-categories and services!')) {
            destroy(route('admin.categories.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <AdminHeader 
                    title="Service Categories" 
                    subtitle="Organize your platform's services into logical groups."
                >
                    <Link
                        href={route('admin.categories.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all w-fit"
                    >
                        <Plus size={16} />
                        New Category
                    </Link>
                </AdminHeader>
            }
        >
            <Head title="Service Categories" />

            <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Category Name</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Parent</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Services</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Order</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                    {category.icon_url && (category.icon_url.startsWith('/') || category.icon_url.includes('://')) ? (
                                                        <img src={category.icon_url} className="w-6 h-6 object-contain" />
                                                    ) : (
                                                        <LucideIcon name={category.icon_url} fallback={Folder} size={18} />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{category.name}</span>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest line-clamp-1 max-w-[200px]">{category.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {category.parent ? (
                                                <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest italic">
                                                    {category.parent.name}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Master Category</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex flex-col items-center">
                                                <span className="text-lg font-black text-slate-900">{category.services_count}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Active Items</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center text-xs font-black text-slate-400 italic">
                                            #{category.sort_order}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.categories.edit', category.id)}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Layers className="text-slate-200 mb-4" size={48} />
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No categories defined</p>
                                                <Link href={route('admin.categories.create')} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Add your first category</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {categories.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {categories.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    "h-10 min-w-[40px] px-3 rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all",
                                    link.active 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20" 
                                        : "bg-white text-slate-400 hover:bg-slate-50",
                                    !link.url && "opacity-50 pointer-events-none"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
