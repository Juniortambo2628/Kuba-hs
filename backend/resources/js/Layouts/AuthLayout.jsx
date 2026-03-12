import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function AuthLayout({ children, title, subtitle, image }) {
    return (
        <div className="flex min-h-screen bg-white dark:bg-zinc-950">
            {/* Left Side - Form */}
            <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20" />
                            <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">KUBA</span>
                        </Link>
                        <h2 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden w-0 flex-1 lg:block relative">
                <div className="absolute inset-0 h-full w-full bg-indigo-900">
                     {/* Background Image / Pattern */}
                     {image ? (
                        <img
                            className="absolute inset-0 h-full w-full object-cover opacity-80"
                            src={image}
                            alt="Background"
                        />
                     ) : (
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 to-violet-600 opacity-90" />
                     )}
                     
                     {/* Overlay Content */}
                     <div className="absolute bottom-0 left-0 right-0 p-20 text-white z-10">
                        <div className="mb-8">
                            <svg className="h-10 w-10 text-indigo-200 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.017C7.91243 16 7.017 16.8954 7.017 18V21H2.017V8.99999C2.017 8.44771 2.46472 7.99999 3.017 7.99999H21.017C21.5693 7.99999 22.017 8.44771 22.017 8.99999V21H17.017V18C17.017 16.8954 16.1216 16 15.017 16H12.017C10.9124 16 10.017 16.8954 10.017 18V21H14.017ZM5.01697 10H7.01697V12H5.01697V10ZM9.01697 10H11.017V12H9.01697V10ZM13.017 10H15.017V12H13.017V10ZM17.017 10H19.017V12H17.017V10Z" />
                                <path d="M12.017 2C6.49413 2 2.01697 6.47715 2.01697 12V4.99999C2.01697 4.44771 2.46468 3.99999 3.01697 3.99999H21.017C21.5693 3.99999 22.017 4.44771 22.017 4.99999V12C22.017 6.47715 17.5398 2 12.017 2Z" />
                            </svg>
                        </div>
                        <blockquote className="text-2xl font-medium leading-relaxed">
                            "Connecting you with trusted professionals for all your home service needs. Fast, reliable, and secure."
                        </blockquote>
                        <div className="mt-8 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" />
                            <div>
                                <div className="h-4 w-32 bg-white/20 rounded mb-2" />
                                <div className="h-3 w-20 bg-white/10 rounded" />
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
