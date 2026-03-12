import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

export default function ReviewModal({ isOpen, onClose, booking }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        booking_id: booking?.id,
        rating: 5,
        comment: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reviews.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
                                                Rate your experience
                                            </Dialog.Title>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                How was your service with {booking?.provider?.business_name}?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                                className="focus:outline-none"
                                            >
                                                {star <= data.rating ? (
                                                    <StarIcon className="h-10 w-10 text-yellow-400 hover:scale-110 transition-transform" />
                                                ) : (
                                                    <StarOutlineIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 hover:text-yellow-200 transition-colors" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.rating && <p className="mt-1 text-sm text-red-600 text-center">{errors.rating}</p>}

                                    <div className="mt-6">
                                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Your Feedback (Optional)
                                        </label>
                                        <textarea
                                            id="comment"
                                            rows={4}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white sm:text-sm"
                                            placeholder="Write something about the service..."
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                        />
                                        {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment}</p>}
                                    </div>

                                    <div className="mt-8 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                                        >
                                            Submit Review
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-zinc-800 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 sm:mt-0 sm:w-auto"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
