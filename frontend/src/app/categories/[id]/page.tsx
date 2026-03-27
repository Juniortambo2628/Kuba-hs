import CategoryDetailClient from './CategoryDetailClient';

export async function generateStaticParams() {
    return [{ id: 'explore' }];
}

export const dynamic = 'force-static';

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <CategoryDetailClient params={params} />;
}
