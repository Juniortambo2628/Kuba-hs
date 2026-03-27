import ProviderProfileClient from './ProviderProfileClient';

export async function generateStaticParams() {
    return [{ id: 'featured' }];
}

export const dynamic = 'force-static';

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
    return <ProviderProfileClient params={params} />;
}
