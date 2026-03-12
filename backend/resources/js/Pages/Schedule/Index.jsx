import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Save, Info, CheckCircle2 } from 'lucide-react';
import DashboardShell from '@/Components/DashboardShell';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { toast } from "sonner";
import { Transition } from '@headlessui/react';

const DAYS = [0, 1, 2, 3, 4, 5, 6]; // Sunday = 0

export default function ScheduleIndex({ availability, dayNames }) {
    const initialSlots = DAYS.map((day) => {
        const existing = availability?.[day];
        return {
            day_of_week: day,
            start_time: existing?.start_time ? existing.start_time.slice(0, 5) : '09:00',
            end_time: existing?.end_time ? existing.end_time.slice(0, 5) : '17:00',
        };
    });

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        slots: initialSlots,
    });

    const updateSlot = (dayIndex, field, value) => {
        setData(
            'slots',
            data.slots.map((s, i) =>
                i === dayIndex ? { ...s, [field]: value } : s
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('schedule.update'), {
            onSuccess: () => toast.success("Schedule updated successfully!"),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Service Schedule" />

            <DashboardShell
                title="Service Schedule"
                subtitle="Define your weekly availability so customers can book your services."
            >
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                            <div className="p-6 border-b bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">Weekly Operating Hours</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">Set the time window you are available to work each day.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mb-6 flex gap-3">
                                    <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        <strong>Tip:</strong> If you are unavailable on a specific day, set the start and end times to be the same (e.g., 00:00 to 00:00).
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {DAYS.map((day, idx) => (
                                        <div
                                            key={day}
                                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg bg-muted/20 border transition-colors hover:border-primary/20"
                                        >
                                            <div className="w-32 shrink-0">
                                                <Label className="text-sm font-bold text-foreground">
                                                    {dayNames[day]}
                                                </Label>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 flex-1 max-w-md">
                                                <div className="flex-1 relative">
                                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="time"
                                                        value={data.slots[idx].start_time}
                                                        onChange={(e) => updateSlot(idx, 'start_time', e.target.value)}
                                                        className="pl-9 h-10"
                                                    />
                                                </div>
                                                <span className="text-muted-foreground text-xs font-medium px-2">TO</span>
                                                <div className="flex-1 relative">
                                                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="time"
                                                        value={data.slots[idx].end_time}
                                                        onChange={(e) => updateSlot(idx, 'end_time', e.target.value)}
                                                        className="pl-9 h-10"
                                                    />
                                                </div>
                                            </div>

                                            {data.slots[idx].start_time === data.slots[idx].end_time ? (
                                                <Badge variant="outline" className="ml-auto bg-muted text-muted-foreground border-transparent">Unavailable</Badge>
                                            ) : (
                                                <Badge variant="outline" className="ml-auto bg-emerald-50 text-emerald-600 border-emerald-100 italic font-normal">Active</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t bg-muted/10 flex items-center justify-between">
                                <div className="flex-1">
                                    {errors.slots && (
                                        <p className="text-sm text-destructive font-medium">{errors.slots}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-emerald-600 flex items-center gap-1.5 font-medium">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Changes saved
                                        </p>
                                    </Transition>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Saving...' : 'Update Schedule'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
