import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Star, MessageSquare, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewsIndex({ reviews }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                        Service Reviews
                    </h1>
                    <p className="text-sm text-stone-500">
                        Reviews you've received and reviews you've left.
                    </p>
                </div>
            }
        >
            <Head title="Reviews" />

            <div className="max-w-3xl mx-auto space-y-4">
                {reviews.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-stone-100 dark:border-zinc-800 p-12 text-center">
                        <Star className="h-12 w-12 text-stone-300 dark:text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                            No reviews yet
                        </h3>
                        <p className="text-sm text-stone-500">
                            When you complete bookings and leave or receive reviews, they'll appear here.
                        </p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white dark:bg-zinc-800/50 rounded-2xl border border-stone-100 dark:border-zinc-800 p-6 shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <Star
                                                    key={n}
                                                    className={cn(
                                                        'h-4 w-4',
                                                        n <= review.rating
                                                            ? 'text-amber-500 fill-amber-500'
                                                            : 'text-stone-200 dark:text-zinc-600'
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-stone-500 dark:text-zinc-400">
                                            {review.is_from_me ? 'You left this review' : 'You received this review'}
                                        </span>
                                    </div>
                                    {review.booking?.service && (
                                        <p className="text-sm font-semibold text-stone-900 dark:text-white mb-1">
                                            {review.booking.service.name}
                                        </p>
                                    )}
                                    {review.comment && (
                                        <p className="text-sm text-stone-600 dark:text-zinc-400 mt-2 flex items-start gap-2">
                                            <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5 text-stone-400" />
                                            {review.comment}
                                        </p>
                                    )}
                                    <p className="text-xs text-stone-400 dark:text-zinc-500 mt-2">
                                        {review.is_from_me
                                            ? `You reviewed ${review.provider?.user?.first_name} ${review.provider?.user?.last_name}`
                                            : `From ${review.customer?.first_name} ${review.customer?.last_name}`}
                                        {' · '}
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link
                                    href={route('dashboard')}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                >
                                    View dashboard
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AuthenticatedLayout>
    );
}
