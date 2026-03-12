import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Trash2, Eye, Inbox, History, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusBadge from '@/Components/Admin/StatusBadge';
import AdminHeader from '@/Components/Admin/AdminHeader';

export default function ContactIndex({ auth, messages }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this message?')) {
            destroy(route('admin.contact.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <AdminHeader 
                    title="Message Inbox" 
                    subtitle="Monitor inquiries and feedback from your platform visitors."
                />
            }
        >
            <Head title="Contact Inbox" />

            <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Sender</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Subject & Message</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Received</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {messages.data.map((message) => (
                                    <tr key={message.id} className={cn(
                                        "hover:bg-slate-50/50 transition-colors group",
                                        message.status === 'new' && "bg-indigo-50/10"
                                    )}>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-black italic",
                                                    message.status === 'new' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-400"
                                                )}>
                                                    {message.name[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={cn("text-sm font-bold text-slate-900", message.status === 'new' && "font-black")}>{message.name}</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{message.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <div className="flex flex-col">
                                                <span className={cn("text-sm font-bold text-slate-800 line-clamp-1", message.status === 'new' && "text-slate-900")}>
                                                    {message.subject || 'No Subject'}
                                                </span>
                                                <span className="text-xs text-slate-400 line-clamp-1 mt-1 font-medium">{message.message}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <StatusBadge status={message.status} />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-500 whitespace-nowrap italic">
                                                {new Date(message.created_at).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route('admin.contact.show', message.id)}
                                                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(message.id)}
                                                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {messages.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                    <Mail className="text-slate-300" />
                                                </div>
                                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Your inbox is clear</p>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2 italic">New messages will appear here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {messages.links.length > 3 && (
                    <div className="flex justify-center gap-2">
                        {messages.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
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
