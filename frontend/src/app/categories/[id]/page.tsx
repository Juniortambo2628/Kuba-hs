import CategoryDetailClient from './CategoryDetailClient';

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <CategoryDetailClient params={params} />;
}
