import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function BookingForm({ provider, services, initialServiceId = '', onSuccess = () => {} }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        provider_id: provider?.id || '',
        service_id: initialServiceId,
        scheduled_date: '',
        description: '',
        // Address fields could be added here later if needed
    });

    useEffect(() => {
        if (initialServiceId) {
            setData('service_id', initialServiceId);
        }
    }, [initialServiceId]);

    const submit = (e) => {
        e.preventDefault();
        post(route('booking.store'), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className="appointment__form !p-0">
            <div className="space-y-6 text-left">
                <div>
                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Select Service</label>
                    <select
                        value={data.service_id}
                        onChange={(e) => setData('service_id', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded p-4 text-white focus:bg-white/20 transition outline-none"
                        required
                    >
                        <option value="" className="text-gray-900">Choose a service</option>
                        {services.map((s) => (
                            <option key={s.id} value={s.id} className="text-gray-900">
                                {(s.name || s.service?.name)} - ${s.price_per_hour || s.base_price || s.service?.base_price}/hr
                            </option>
                        ))}
                    </select>
                    {errors.service_id && <p className="text-red-300 text-xs mt-1">{errors.service_id}</p>}
                </div>

                <div>
                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Preferred Date & Time</label>
                    <input
                        type="datetime-local"
                        value={data.scheduled_date}
                        onChange={(e) => setData('scheduled_date', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded p-4 text-white focus:bg-white/20 transition outline-none"
                        required
                    />
                    {errors.scheduled_date && <p className="text-red-300 text-xs mt-1">{errors.scheduled_date}</p>}
                </div>

                <div>
                    <label className="block text-white text-xs font-bold uppercase tracking-widest mb-2">Notes (Optional)</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Tell the provider more about your needs..."
                        className="w-full bg-white/10 border border-white/20 rounded p-4 text-white placeholder-white/40 h-32 focus:bg-white/20 transition outline-none resize-none"
                    ></textarea>
                    {errors.description && <p className="text-red-300 text-xs mt-1">{errors.description}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full primary-btn !bg-white !text-[#5768AD] hover:!bg-opacity-90 transition-all font-bold py-4 rounded-sm shadow-xl"
                >
                    {processing ? 'PROCESSING...' : 'REQUEST BOOKING'}
                </button>
            </div>
        </form>
    );
}
