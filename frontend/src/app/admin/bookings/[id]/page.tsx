import AdminBookingClient from './AdminBookingClient';

export default function AdminBookingPage({ params }: { params: Promise<{ id: string }> }) {
    return <AdminBookingClient params={params} />;
}
