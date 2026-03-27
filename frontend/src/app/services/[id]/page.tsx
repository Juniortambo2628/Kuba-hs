import ServiceCategoryClient from '../_components/ServiceCategoryClient';

export async function generateStaticParams() {
    return [{ id: 'view' }];
}

export const dynamic = 'force-static';

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <ServiceCategoryClient params={params} />;
}
