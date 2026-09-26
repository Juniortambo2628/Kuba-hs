import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-blue-600">404</p>
      <h2 className="mt-2 text-2xl font-bold text-gray-900">Page not found</h2>
      <p className="mt-2 text-gray-600">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
}
