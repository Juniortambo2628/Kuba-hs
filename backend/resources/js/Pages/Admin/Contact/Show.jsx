import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Trash2, ArrowLeft, Send, CheckCircle, Clock, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactShow({ auth, message }) {
    const { patch, delete: destroy, processing } = useForm();

    const handleStatusUpdate = (status) => {
        patch(route('admin.contact.update-status', message.id), {
            data: { status }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this message?')) {
            destroy(route('admin.contact.destroy', message.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('admin.contact.index')}
                            className="h-12 w-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Message Details</h1>
                            <p className="text-sm text-slate-500 font-medium italic">Read and manage individual visitor inquiries.</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Message from ${message.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 italic">
                {/* Main Message View */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 lg:p-16 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <div className="flex items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-50">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-indigo-100">
                                    {message.name[0]}
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-2xl font-black text-slate-900">{message.name}</h3>
                                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{message.email}</span>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Received</p>
                                <span className="text-xs font-black text-slate-900">
                                    {new Date(message.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Subject</h4>
                                <h2 className="text-2xl font-black text-slate-800 leading-tight">
                                    {message.subject || '(No Subject Provided)'}
                                </h2>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Message Content</h4>
                                <div className="bg-slate-50 p-10 rounded-[2rem] text-sm text-slate-600 leading-relaxed font-bold border border-white whitespace-pre-wrap">
                                    {message.message}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-10">
                                <a 
                                    href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                                    className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[2px] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                                    onClick={() => handleStatusUpdate('replied')}
                                >
                                    <Reply size={16} />
                                    Reply via Email
                                </a>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-50 text-red-500 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[2px] hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Delete Thread
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Metadata</h4>
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-white">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Created At</p>
                                    <p className="text-xs font-black text-slate-900">{new Date(message.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-white">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</p>
                                    <p className="text-xs font-black text-slate-900">{message.phone || 'Not Provided'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-50">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Internal Status</h4>
                            <div className="space-y-3">
                                {[
                                    { id: 'new', icon: Inbox, label: 'Unread / New' },
                                    { id: 'read', icon: CheckCircle, label: 'Read / Reviewed' },
                                    { id: 'replied', icon: Send, label: 'Replied To' }
                                ].map((stat) => (
                                    <button
                                        key={stat.id}
                                        onClick={() => handleStatusUpdate(stat.id)}
                                        disabled={processing}
                                        className={cn(
                                            "w-full p-4 rounded-2xl flex items-center justify-between transition-all group",
                                            message.status === stat.id 
                                                ? "bg-indigo-50 text-indigo-600 border-2 border-indigo-100" 
                                                : "bg-slate-50 text-slate-400 border-2 border-transparent hover:border-slate-100"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <stat.icon size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                        {message.status === stat.id && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#263246] p-10 rounded-[2.5rem] shadow-xl shadow-slate-200">
                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Safety Tip</h4>
                        <p className="text-slate-400 text-xs leading-relaxed font-bold">
                            Always verify the sender's identity before sharing sensitive platform information. Delete suspicious messages immediately.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
