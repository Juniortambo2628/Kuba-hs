import ProviderProfileClient from './ProviderProfileClient';

export default function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
    return <ProviderProfileClient params={params} />;
}
