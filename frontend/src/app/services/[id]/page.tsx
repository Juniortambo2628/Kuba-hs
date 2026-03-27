import ServiceDetailClient from './ServiceDetailClient';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <ServiceDetailClient params={params} />;
}
