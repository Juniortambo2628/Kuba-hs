import BlogClient from './BlogClient';

export async function generateStaticParams() {
  return [{ slug: 'detail' }];
}

export const dynamic = 'force-static';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  return <BlogClient params={params} />;
}
