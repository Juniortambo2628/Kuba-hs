import ServiceDetailClient from './ServiceDetailClient';

export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/featured-services`);
        const data = await res.json();
        const services = data.data || [];
        
        // Return IDs of featured services to ensure they are pre-rendered
        return services.map((s: any) => ({
            id: s.id.toString()
        }));
    } catch (e) {
        console.error("Failed to generate static params for services", e);
        return [{ id: 'view' }];
    }
}

export const dynamic = 'force-static';

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <ServiceDetailClient params={params} />;
}
