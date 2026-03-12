import LucideIcon from '@/Components/LucideIcon';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Wrench, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminHeader from '@/Components/Admin/AdminHeader';

export default function ServiceIndex({ auth, services }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this service? This will affect all provider listings for this service!')) {
            destroy(route('admin.services.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <AdminHeader 
                    title="Service Management" 
                    subtitle="Define and manage specific service types available on the platform."
                >
                    <Link
                        href={route('admin.services.create')}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all w-fit"
                    >
                        <Plus size={16} />
                        New Service
                    </Link>
                </AdminHeader>
            }
        >
            <Head title="Service Management" />

            <div className="space-y-6">
                {/* Secondary Nav for Services/Categories */}
                <div className="flex gap-4">
                    <Link 
                        href={route('admin.services.index')}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200"
                    >
                        Services List
                    </Link>
                    <Link 
                        href={route('admin.categories.index')}
                        className="bg-white text-slate-400 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:text-slate-900 transition-all"
                    >
                        Manage Categories
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Service Name</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Category</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Base Price</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {services.data.map((service) => (
                                    <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                    {service.icon_url && (service.icon_url.startsWith('/') || service.icon_url.includes('://')) ? (
                                                        <img src={service.icon_url} className="w-6 h-6 object-contain" />
                                                    ) : (
                                                        <LucideIcon name={service.icon_url} fallback={Wrench} size={18} />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-900">{service.name}</span>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest line-clamp-1 max-w-[200px] italic">{service.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest italic">
                                                {service.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-sm font-black text-slate-900 italic">
                                                ${(parseFloat(service.base_price) || 0).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.services.edit', service.id)}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {services.data.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center italic">
                                                <ShoppingBag className="text-slate-200 mb-4" size={48} />
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No services available</p>
                                                <Link href={route('admin.services.create')} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">Create your first service</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {services.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {services.links.map((link, i) => (
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
