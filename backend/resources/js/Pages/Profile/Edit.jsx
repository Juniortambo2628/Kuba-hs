import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DashboardShell from '@/Components/DashboardShell';
import { User, Shield, AlertTriangle } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile Settings" />

            <DashboardShell
                title="Account Settings"
                subtitle="Manage your profile information, password, and account security."
            >
                <div className="space-y-8">
                    {/* Profile Information */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Profile Information</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Update your name and email address.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-2xl"
                            />
                        </div>
                    </div>

                    {/* Security / Password */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Account Security</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Change your password and secure your account.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <UpdatePasswordForm className="max-w-2xl" />
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-card rounded-xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b bg-red-50/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-red-900">Danger Zone</h3>
                                    <p className="text-xs text-red-700/70 mt-0.5">Permanently delete your account and all data.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <DeleteUserForm className="max-w-2xl" />
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
