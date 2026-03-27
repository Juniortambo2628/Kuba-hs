import AdminBookingClient from './AdminBookingClient';

export async function generateStaticParams() {
    return [{ id: 'latest' }];
}

export const dynamic = 'force-static';

export default function AdminBookingPage({ params }: { params: Promise<{ id: string }> }) {
    return <AdminBookingClient params={params} />;
}
